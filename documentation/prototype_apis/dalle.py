import openai
import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()

# Set up the OpenAI API client
openai.api_key = os.getenv("gpt_key")



# Define the input prompt for DALL-E
userprompt = "Rustic old garage with yellowish stains with an old car parked in front of it with eggs" 

# Define the DALL-E API endpoint
endpoint = "https://api.openai.com/v1/images/generations"

# Define the API request data
data = {
    "model": "image-alpha-001",
    "prompt": userprompt,
    "num_images": 1,
    "size": "512x512",
    "response_format": "url"
}

# Send the API request to generate the playlist cover
response = openai.Image.create(**data)

# Parse the response to extract the image URL
image_url = response["data"][0]["url"]

# Download the image data from the URL
image_data = requests.get(image_url).content

# Convert the image data to a base64-encoded string
image_base64 = base64.b64encode(image_data).decode("utf-8")

# # Print the base64-encoded image data
#image_resp = openai.Image.create(prompt="Generate an artistic album cover with songs like Midnight City By M83, Solitude is Bliss By Tame Impala, and Inro by the xx and without text", n=1, size="512x512")

models = openai.Model.list()
print(image_url)
