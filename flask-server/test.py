from PIL import Image
import urllib.request
import os

urllib.request.urlretrieve(
  'https://media.geeksforgeeks.org/wp-content/uploads/20210318103632/gfg-300x300.png',
   "gfg.png")
  
img = Image.open("gfg.png")

def compress(image_file):
    

    image = Image.open(image_file)

    image.save("image-file-compressed", 
                 "JPEG", 
                 optimize = True, 
                 quality = 5)
    return

compress(img)