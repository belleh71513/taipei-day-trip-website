from flask import *
from dotenv import load_dotenv
from model.booking import booking_select_data, booking_insert_data, booking_data_delete
from datetime import datetime
import os
import jwt

load_dotenv()
booking = Blueprint("booking", __name__)
secret_key = os.getenv("secret_key")

@booking.route("/booking", methods=["GET"])
def api_booking_get():
  token = request.cookies.get("jwt")
  if not token:
    res = {
      "error" : True,
      "message" : "未登入系統，拒絕存取"
    }
    return jsonify(res), 403
  else:
    jwt_data = jwt.decode(token, secret_key, algorithms="HS256")
    user_id = jwt_data["id"]
    get_booking_data = booking_select_data(user_id)
    if get_booking_data:
      res = {
        "data" : {
          "attraction" : {
            "id" :get_booking_data["id"],
            "name" :get_booking_data["name"],
            "address" :get_booking_data["address"],
            "image" :json.loads(get_booking_data["images"])[0]
          },
          "date" :get_booking_data["date"],
          "time" :get_booking_data["time"],
          "price" :get_booking_data["price"]
        }
      }

    else:
      res = {"data" : None}
    return jsonify(res), 200

@booking.route("/booking", methods=["POST"])
def api_booking_post():
  try:
    token = request.cookies.get("jwt")
    if not token:
      res = {
        "error" : True,
        "message" : "未登入系統，拒絕存取"
      }
      return jsonify(res), 403
    else:
      jwt_data = jwt.decode(token, secret_key, algorithms="HS256")
      booking_data = request.get_json()
      user_id = jwt_data["id"]
      attraction_id = booking_data["attractionId"]
      date = booking_data["date"]
      time = booking_data["time"]
      price = booking_data["price"]
      insert_data = booking_insert_data(date, time, price, attraction_id, user_id)
      if not (date or time or price or attraction_id or user_id):
        res = {
          "error" : True,
          "message" : "建立失敗，輸入不正確或其他原因"
        }
      # 預定日期不得小於當下日期
      elif date < datetime.now().strftime("%Y-%m-%d"):
        res = {
          "error" : True,
          "message" : "日期選擇不正確，請重新選擇"
        }
      if insert_data:
        res = {"ok" : True}
      return jsonify(res), 200
  except:
    res = {
      "error" : True,
      "message" : "伺服器內部錯誤"
    }
    return jsonify(res), 500

@booking.route("/booking", methods=["DELETE"])
def delete_booking_data():
  try:
    token = request.cookies.get("jwt")
    if not token:
      res = {
        "error" : True,
        "message" : "未登入系統，拒絕存取"
      }
      return jsonify(res), 403
    else:
      jwt_data = jwt.decode(token, secret_key, algorithms="HS256")
      user_id = int(jwt_data["id"])
      check_delete_data = booking_data_delete(user_id)
      if check_delete_data is None:
        res = {"ok" : True}
        return jsonify(res), 200
  except:
    res = {
      "error" : True,
      "message" : "伺服器發生錯誤"
    }
    return jsonify(res), 500