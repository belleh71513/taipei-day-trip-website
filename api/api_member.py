from flask import *
from dotenv import load_dotenv
from model.member import member_data_get
import jwt
import os

load_dotenv()
secret_key = os.getenv("secret_key")
member = Blueprint("member", __name__)

@member.route("/member", methods=["GET"])
def api_member():

  token = request.cookies.get("jwt")
  if not token:
    res = {
      "error" : True,
      "message" : "未登入系統，拒絕存取"
    }
    return jsonify(res), 403
  else:
    jwt_data = jwt.decode(token, secret_key, algorithms=["HS256"])
    user_id = jwt_data["id"]
    member_data = member_data_get(user_id)
    if member_data:
      member_list = []
      for item in member_data:
        data = {
            "number" : item["order_number"],
            "price" : item["price"],
            "trip" : {
              "attraction" : {
                "name" : item["attraction_name"],
                "address" : item["attraction_address"],
                "image" : json.loads(item["attraction_images"])[0]
              },
              "date" : item["date"],
              "time" : item["time"]
            },
            "contact" : {
              "name" : item["name"],
              "phone" : item["phone"]
            }
          }
        member_list.append(data)
      print(member_list)

      return jsonify({"data":member_list}), 200
    else:
      data = {
        "data" : None,
        "message" : "您目前沒有任何購買紀錄"
      }
      return jsonify(data), 200
  # except:
  #   res = {
  #     "error" : True,
  #     "message" : "伺服器內部錯誤"
  #   }
  #   return jsonify(res), 500



