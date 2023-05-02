import requests
from PIL import Image
from io import BytesIO
import base64


def compress_image(url, quality=75):
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    img_format = img.format.lower()
    if img_format == 'jpeg':
        # Already a JPEG, just compress with specified quality level
        img = img.convert('RGB')
        img_bytes = BytesIO()
        img.save(img_bytes, format='JPEG', quality=quality)
        img_bytes = img_bytes.getvalue()
    elif img_format in ['bmp', 'png', 'webp']:
        # Convert to JPEG and compress with specified quality level
        img = img.convert('RGB')
        img_bytes = BytesIO()
        img.save(img_bytes, format='JPEG', quality=quality)
        img_bytes = img_bytes.getvalue()
    else:
        # Unsupported image format
        raise ValueError(f"Unsupported image format: {img_format}")
        
    # Convert the image bytes to base64-encoded string
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')
    return img_base64

