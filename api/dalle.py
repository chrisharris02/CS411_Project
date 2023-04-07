import openai
import os
import requests
import base64

# Set up the OpenAI API client
openai.api_key = ""

songstyle = input("Enter the your song style")

# Define the input prompt for DALL-E
userprompt = "Generate a playlist cover with songs in the style of " + songstyle

# Define the DALL-E API endpoint
endpoint = "https://api.openai.com/v1/images/generations"

# Define the API request data
data = {
    "model": "image-alpha-001",
    "prompt": userprompt,
    "num_images": 1,
    "size": "1024x1024",
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

# Print the base64-encoded image data
print(image_base64)
