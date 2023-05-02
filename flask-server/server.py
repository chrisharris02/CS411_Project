from flask import Flask, request, abort, jsonify, session, url_for, redirect
from flask_bcrypt import Bcrypt
import os
import openai
from image_functions import compress_image, get_dalle_image
from dotenv import load_dotenv
from models import db, User
from config import ApplicationConfig
from flask_session import Session
from flask_cors import CORS, cross_origin
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import base64
import requests
import json
from spotify_methods import create_spotify_oauth, parse_songs_to_dic, get_songs_gpt, get_track_id,create_playlist,update_playlist_cover,add_tracks_to_playlist
load_dotenv()
#ENV Vars

spotify_client_id = os.environ["SPOTIFY_CLIENT_ID"]
spotify_client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]
gpt_key = os.environ["gpt_key"]



app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)


with app.app_context():
    db.create_all()

#Main App Functionality
#**********************#


@app.route('/createSpotifyPlaylist', methods=["POST"])
def createPlaylistController():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()
    json_string = user.playlistInfo
    json_object = json.loads(json_string)
    user_spotify_token = user.spotifyToken
    song_list = []
    art_url = json_object['imageUrl']
    for songName in json_object:
        if songName != 'imageUrl':
            try:
                song_list.append(get_track_id(user_spotify_token,songName,json_object[songName])) #value of jsonObject is artist name
            except:
                print('Exception with getting track id')
    playlist_id = create_playlist(user_spotify_token, 'Ai Generated Playlist')
    add_tracks_to_playlist(user_spotify_token,playlist_id,song_list)
    update_playlist_cover(user_spotify_token,playlist_id,art_url)

    return 'Complete'




@app.route('/sendUserPreferences', methods=["POST"])
def getPlaylistInfo():
    numSongs = request.json["numSongs"]
    musicVibe = request.json["musicVibe"]
    musicGenre = request.json["musicGenre"]
    artistName = request.json["artistName"]
    musicDecade = request.json["musicDecade"]
    musicType = request.json["musicType"]
    user_id = request.json['u_id']

    
    song_dictionary = get_songs_gpt(numSongs, musicVibe, musicGenre, artistName, musicDecade, musicType)
    image_url = get_dalle_image(f"Modern, futuristic Album cover of music with {musicVibe} vibes and {musicGenre} genre from the {musicDecade} without any text")

    song_dictionary['imageUrl'] = image_url
    json_object = json.dumps(song_dictionary)
    update_user = User.query.filter_by(id=user_id).first()
    update_user.playlistInfo = json_object
    db.session.commit()
    return 'Complete'


@app.route('/spotifyRedirect')
def redirectPage():
    sp_oauth = create_spotify_oauth()
    user_id = session.get("user_id")
    auth_code = request.args.get('code') #takes the code parameter from the re-direct url returned by Spotify
    temp_token_info = sp_oauth.get_access_token(auth_code)
    access_token = temp_token_info['access_token']
    token_expiration = temp_token_info['expires_at']
    refresh_token = temp_token_info['refresh_token']
    update_user = User.query.filter_by(id=user_id).first()
    update_user.spotifyToken = access_token
    update_user.spotifyExpiration = token_expiration
    update_user.spotifyRefresh = refresh_token
    db.session.commit()
    return redirect('http://localhost:3000/ai-session')

@app.route('/spotifyTest', methods=["POST"])
def test_spotify():
    code = request.json['code']
    # track_name = request.json['track']
    art_url = request.json['art']
    playlist_id = request.json['playlistId']
    # new_playlist = create_playlist(code,'Test 2')
    # dalle_image = get_dalle_image("prompt")
    # update_cover = update_playlist_cover(code,'32cGgv7CavPPa07Zj0cCzJ',dalle_image)
    return update_playlist_cover(code, playlist_id, art_url) #returns ID of created playlist

@app.route('/spotifyLogin')
def login():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)


#User Registration

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    firstName = request.json["firstName"]
    lastName = request.json["lastName"]
    spotifyToken = ""
    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}),409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password = hashed_password, firstName=firstName, lastName=lastName,spotifyToken=spotifyToken)
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id #Auto login user after registration

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "firstName": new_user.firstName,
        "lastName": new_user.lastName,
        "spotify_token" : new_user.spotifyToken,
    })


@app.route("/@me") #return info about current logged in user
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}),401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
    "id": user.id,
    "firstName": user.firstName,
    "lastName": user.lastName,
    "spotify_token" : user.spotifyToken,
    "email": user.email,
    "spotify_refresh": user.spotifyRefresh,
    "playlistInfo": user.playlistInfo
})

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}),401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}),401
    
    session["user_id"] = user.id

    return jsonify({
    "id": user.id,
    "firstName": user.firstName,
    "lastName": user.lastName,
    "spotify_token" : user.spotifyToken,
    "email": user.email

})


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

if __name__ == "__main__":
    app.run(port=4500,debug=True)
