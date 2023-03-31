import requests
import json
import os
import spotipy
import sys
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

load_dotenv()

AUTH_URL = 'https://accounts.spotify.com/api/token'
TOP_ARTISTS = 'https://api.spotify.com/v1/me/top/artists/'

CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')


# POST
auth_response = requests.post(AUTH_URL, {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
})

# convert the response to JSON
auth_response_data = auth_response.json()

# save the access token
access_token = auth_response_data['access_token']

headers = {
    'Authorization': 'Bearer {token}'.format(token=access_token)
}

top_response = requests.get(TOP_ARTISTS, headers=headers)



print(top_response.json())