from flask import Flask, request, abort, jsonify, session, url_for, redirect
from flask_bcrypt import Bcrypt
import os
import openai
from dotenv import load_dotenv
from models import db, User
from config import ApplicationConfig
from flask_session import Session
from flask_cors import CORS, cross_origin
import spotipy
from spotipy.oauth2 import SpotifyOAuth
load_dotenv()
#ENV Vars

spotify_client_id = os.environ["SPOTIFY_CLIENT_ID"]
spotify_client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]



app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)


with app.app_context():
    db.create_all()



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
    update_user = User.query.filter_by(id=user_id).first()
    update_user.spotifyToken = auth_code
    db.session.commit()
    return redirect('http://localhost:3000/ai-session')

@app.route('/spotifyLogin')
def login():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url + '&test=test')


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
    "email": user.email
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
