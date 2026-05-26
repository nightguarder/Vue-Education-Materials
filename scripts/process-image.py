import json
import sys
from PIL import Image

source_path = sys.argv[1]
dest_path = sys.argv[2]

img = Image.open(source_path)
width, height = img.size

aspect = height / width
new_width = 400
new_height = round(400 * aspect)

img_resized = img.resize((new_width, new_height), Image.LANCZOS)
img_resized.save(dest_path, 'WEBP', quality=80)

if width > height * 1.2:
    orientation = 'landscape'
elif height > width * 1.2:
    orientation = 'portrait'
else:
    orientation = 'square'

print(json.dumps({'width': new_width, 'height': new_height, 'orientation': orientation}))
