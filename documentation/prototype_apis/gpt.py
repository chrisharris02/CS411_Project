import os
import openai
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("gpt_key")
openai.api_key = OPENAI_API_KEY


#initializing variables

num_songs = 5 #how many songs do you want in the playlist

vibe_of_music = 'Chill' #how would you describe the general vibe of the music?

genre_of_music = 'Indie' #What genre of music do you want the playlist to have?

another_genre = None #String

decades = '2000s'

instrumental = True #boolean 

vocal = None #boolean

artist_name_playlist = 'Tame Imapala' #String



content = f"Hello! I want a list of {num_songs} {vibe_of_music} songs from the decade {decades}. I want the songs to be instrumental and have at least one song by {artist_name_playlist}"
message = [
    {"role": "user", "content": content}
  ]

     
#print (message)
completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  temperature=.8,
  messages= message
)



print(completion.choices[0].message.content)
