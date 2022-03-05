import json
from pool import pool

con = pool.get_connection()
cursor = con.cursor(dictionary=True)

with open("taipei-attractions.json", "r", encoding="utf-8") as file:
  data = json.load(file)

attractions_list = data["result"]["results"]

for item in attractions_list:

  name = item["stitle"]
  category = item["CAT2"]
  description = item["xbody"]
  address = item["address"]
  transport = item["info"]
  mrt = item["MRT"]
  latitude = item["latitude"]
  longitude = item["longitude"]

  image_url = item["file"].split("https")
  image_list = []
  for image in image_url[1:]:
    check_type = image[-3:]
    if check_type == "jpg" or check_type == "JPG" or check_type == "png" or check_type == "PNG":
      image_list.append("https"+image)
  images = json.dumps(image_list)

  sql = """INSERT INTO attraction_table
      (name, category, description, address, transport, mrt, latitude, longitude, images)
      VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
      """
  cursor.execute(sql, (name, category, description, address, transport, mrt, latitude, longitude, images))
  con.commit()
















# "id": 10,
#       "name": "平安鐘",
#       "category": "公共藝術",
#       "description": "平安鐘祈求大家的平安，這是為了紀念 921 地震週年的設計",
#       "address": "臺北市大安區忠孝東路 4 段 1 號",
#       "transport": "公車：204、212、212直",
#       "mrt": "忠孝復興",
#       "latitude": 25.04181,
#       "longitude": 121.544814,
#       "images": [
#         "http://140.112.3.4/images/92-0.jpg"