from flask import *
from dotenv import load_dotenv
from datetime import datetime
from model.order import order_get, order_insert, order_update, tappay
import os
import jwt

load_dotenv()

orders = Blueprint("orders", __name__)
secret_key = os.getenv("secret_key")

@orders.route("/orders", methods="[POST]")
def api_order_post():
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
      user_id = jwt_data["id"]
      data = request.get_json()
      prime = data["prime"]
      price = data["order"]["price"]
      attraction_id = data["order"]["attraction"]["id"]
      date = data["trip"]["date"]
      time = data["trip"]["time"]
      contact_name = data["contact"]["name"]
      contact_email = data["contact"]["email"]
      contact_phone = data["contact"]["phone"]
      order_number = datetime.now().strftime("%Y%m%d%H%M%S")
      if not (contact_name or contact_email or contact_phone):
        res = {
          "error" : True,
          "message" : "訂單建立失敗，輸入不正確或其他原因"
        }
        return jsonify(res), 400

      order_result = order_insert(order_number, price, attraction_id, date, time, contact_name, contact_email, contact_phone)
      tappay_result = tappay(data)
      if tappay_result:
        update_order_table = order_update(user_id, order_number)
        res = {
          "data" : {
            "number" : order_number,
            "payment" :{
              "status" : 0,
              "message" : "付款成功"
            }
          }
        }
        return jsonify(res), 200
  except:
    res = {
      "error" : True,
      "message" : "伺服器內部錯誤"
    }
    return jsonify(res), 500

@orders.route("/order/<int:orderNumber>", methods="[GET]")
def api_order_get(orderNumber):
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
      user_id = jwt_data["id"]
      get_order_data = order_get(orderNumber, user_id)
      if get_order_data:
        res = {
          "data" : {
            "number" : get_order_data["order_number"],
            "price" : get_order_data["price"],
            "trip" : {
              "attraction" : {
                "id" : get_order_data["attraction_id"],
                "name" : get_order_data["attraction_name"],
                "address" : get_order_data["attraction_address"],
                "image" : get_order_data["attraction_image"]
              },
              "date" : get_order_data["date"],
              "time" : get_order_data["time"],
            },
            "contact" : {
              "name"  : get_order_data["name"],
              "email" : get_order_data["email"],
              "phone" : get_order_data["phone"]
            },
            "status" : get_order_data["payment_status"]
          }
        }
        return jsonify(res), 200
  except:
    res = {
      "error" : True,
      "message" : "伺服器內部錯誤"
    }
    return jsonify(res), 500


