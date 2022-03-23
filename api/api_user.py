from flask import *
from dotenv import load_dotenv
from model.user import *
import os

load_dotenv()

user = Blueprint("user", __name__)
app.secret_key = os.urandom(24)

@user.route("/user", methods=["GET"])
def api_user_check():
  email = session.get("eamil")
  if email:
    user_data = user_check_status(email)
    if user_data:
      res = {
        "data" : {
          "id" : user_data[0],
          "name" : user_data[1],
          "email" : user_data[2]
        }
      }
      return jsonify(res), 200
  return jsonify({"data" : None})


@user.route("/user", methods=["POST"])
def api_user_register():
  try:
    register_data = request.get_json()
    name = register_data["name"]
    email = register_data["email"]
    password = register_data["password"]

    register_status = user_register(name, email, password)
    if register_status:
      res = {
          "ok" : True
        }
      return jsonify(res), 200
    else:
      res = {
          "error" : True,
          "message" : "註冊失敗 , Email已被註冊"
        }
      return jsonify(res), 400
  except:
    res = {
        "error" : True,
        "message" : "伺服器發生錯誤"
      }
    return jsonify(res), 500

@user.route("/user", methods=["PATCH"])
def api_user_login():
  try:
    login_data = request.get_json()
    email = login_data["email"]
    password = login_data["password"]
    login_status = user_login(email, password)
    if login_status:
      # session["id"] = login_status[0]
      # session["name"] = login_status[1]
      # session["email"] = login_status[2]
      # session["password"] = login_status[3]
      res = {"ok" : True}
      return jsonify(res), 200
    else:
      res = {
        "error" : True,
        "message" : "帳號或密碼輸入錯誤"
      }
      return jsonify(res), 400
  except:
    res = {
        "error" : True,
        "message" : "伺服器內部發生錯誤"
      }
    return jsonify(res), 500

@user.route("/user", methods=["DELETE"])
def api_user_logout():
  session.pop("email", None)
  return jsonify({"ok" : True}), 200
