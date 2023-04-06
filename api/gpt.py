import os
import openai
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("openai_api_key")
openai.api_key = OPENAI_API_KEY


message = [
    {"role": "user", "content": "Hello! I want a list of  5 songs I want the songs to be in the style of"}
  ]

     
songstyle = input("Enter the style of songs you want : ")

if songstyle :
    message.append(
            {"role": "user", "content": songstyle},
        )
else:
     message.append(
            {"role": "user", "content": '90s'},
        )
     
print (message)
completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  temperature=.8,
  messages= message
)

print(completion.choices[0].message.content)
