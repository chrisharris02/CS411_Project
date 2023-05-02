from flask import Flask, request, abort, jsonify, session, url_for, redirect
from flask_bcrypt import Bcrypt
import os
import openai
from image_functions import compress_image
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

def get_track_id(token, track, artist):
    sp_oauth = create_spotify_oauth()
    code = token
    track_name = track
    artist_name = artist
    token_info = sp_oauth.get_access_token(code)
    spotify_object = spotipy.Spotify(auth=token_info['access_token'])
    track_query = spotify_object.search(q=f'track:{track_name} artist:{artist_name}')
    track_id = track_query['tracks']['items'][0]['uri']
    return track_id

def create_playlist(token, name):
    sp_oauth = create_spotify_oauth()
    code = token
    playlist_name = name
    token_info = sp_oauth.get_access_token(code)
    spotify_object = spotipy.Spotify(auth=token_info['access_token'])
    user_id = spotify_object.current_user()['id'] #Spotify UID of current user
    create_playlist = spotify_object.user_playlist_create(user_id,playlist_name,False,False,'An Ai Generated Playlist')
    return create_playlist['id'] #returns ID of created playlist

def update_playlist_cover(token, playlist_id, image_url):
    sp_oauth = create_spotify_oauth()
    code = token
    token_info = sp_oauth.get_access_token(code)
    spotify_object = spotipy.Spotify(auth=token_info['access_token'])
    base64_image = compress_image(image_url, 60)
    update_picture = spotify_object.playlist_upload_cover_image(playlist_id, base64_image)
    return update_picture


def add_tracks_to_playlist(token, playlist_id, track_list):#track_list is a list of song IDs
    sp_oauth = create_spotify_oauth()
    code = token
    token_info = sp_oauth.get_access_token(code)
    spotify_object = spotipy.Spotify(auth=token_info['access_token'])
    add_to_playlist = spotify_object.playlist_add_items(playlist_id,track_list)
    return add_to_playlist 

def get_dalle_image(prompt):
    openai.api_key = gpt_key
    # Define the DALL-E API endpoint
    endpoint = "https://api.openai.com/v1/images/generations"
    # Define the API request data
    data = {
        "model": "image-alpha-001",
        "prompt": prompt,
        "num_images": 1,
        "size": "512x512",
        "response_format": "url"
    }
    response = openai.Image.create(**data)
    # Parse the response to extract the image URL
    image_url = response["data"][0]["url"]
    # Download the image data from the URL
    # image_data = requests.get(image_url).content
    # # Convert the image data to a base64-encoded string
    # image_base64 = base64.b64encode(image_data).decode("utf-8")
    return image_url

@app.route('/createSpotifyPlaylist', methods=["POST"])
def createPlaylistController():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()
    json_string = user.playlistInfo
    json_object = json.loads(json_string)
    user_spotify_token = user.spotifyToken
    song_list = []
    art_url = json_object['imageUrl']
    for item in json_object:
        if item != 'imageUrl':
            try:
                song_list.append(get_track_id(user_spotify_token,item,json_object[item]))
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

def get_songs_gpt(numSongs, musicVibe, musicGenre,artistName,musicDecade, musicType):
    openai.api_key = gpt_key

    content = f"""Hello! I want a list of {numSongs} with a {musicVibe} vibe. 
    The songs should have the style from the decade {musicDecade} and be of the genre {musicGenre}.
    I want the songs to be {musicType} and have at least one song by {artistName}
    each song in the list is represented by a number followed by a period, 
    the song name in single quotes, and the artist name after the "by" keyword"""
   
    message = [
    {"role": "user", "content": content}
    ]

    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    temperature=.8,
    messages= message
    )


    gptmessage = completion.choices[0].message.content

    return parse_songs_to_dic(gptmessage)

def parse_songs_to_dic(gptmessage):
    song_dict = {}
    lines = gptmessage.split('\n')  # split the message by line
    for line in lines:
        if line[0] in '123456789': #check if line is a song line
          song_name, artist = line.split(" by ") #split line
          song_name = song_name[4:-1] #trim song name
          song_dict[song_name] = artist #assign to dict

    return song_dict



#SPOTIFY OAUTH
def create_spotify_oauth():
    return SpotifyOAuth(
        client_id = spotify_client_id,
        client_secret=spotify_client_secret,
        redirect_uri=url_for('redirectPage', _external=True),
        scope='user-library-read,user-library-modify,playlist-modify-private,ugc-image-upload'
    )
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
