import urllib.parse
import urllib.request
import urllib.error
from pathlib import Path
import json
import base64

BASE_PLANT_ID_URL = "https://plant.id/api/v3"
HEADER = {'Api-Key: SOmxl60bwbjppkGGbHlwzPlkNFpX2tkOvzfxZiwmtfXN6WrsdO'}

class PlantAPI:
    
    def _build_plant_id_url(self):
    
    def _encode_plant_image(self, image: Path):
        with open(image) as image_file:
            return base64.b64encode(image_file.read())
    
    

        

