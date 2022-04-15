from flask import *
from dotenv import load_dotenv
from model.user import *
from datetime import datetime, timedelta
import jwt
import time
import os

load_dotenv()
user = Blueprint("user", __name__)
secret_key = os.getenv("secret_key")

@user.route("/user", methods=["GET"])
def api_user_check():
  jwt_cookie = request.cookies.get("jwt")
  if jwt_cookie:
    jwt_decode = jwt.decode(jwt_cookie, key=secret_key, algorithms="HS256")
    # jwt_decode.pop("exp")
    res = {
        "data" : jwt_decode
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
    email_check = email_regex_check(email)
    password_check = password_regex_check(password)
    if not email_check:
      res = {
          "error" : True,
          "message" : "註冊失敗 , Email格式錯誤"
        }
      return jsonify(res), 400
    elif not password_check:
      res = {
          "error" : True,
          "message" : "註冊失敗 , 密碼格式錯誤"
        }
      return jsonify(res), 400

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
      payload = {
        "id" : login_status[0],
        "name" : login_status[1],
        "email" : login_status[2],
        "exp" : datetime.utcnow() + timedelta(minutes=30)
      }
      token = jwt.encode(
        payload,
        secret_key,
        algorithm = "HS256"
      )
      res = make_response({"ok" : True}, 200)
      res.set_cookie(key="jwt", value=token, expires=time.time()+3*60)
      return res
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
  res = make_response({"ok" : True}, 200)
  res.set_cookie(key="jwt", value="", expires=0)
  return res

@user.route("/user", methods=["PUT"])
def api_user_update():
  try:
    update_data = request.get_json()
    email = update_data["email"]
    old_password = update_data["old_password"]
    new_password = update_data["new_password"]
    change_password = update_user_password(email, old_password, new_password)
    if change_password:
      res = {"ok" : True}
      return jsonify(res), 200
    else:
      res = {
        "error": True,
        "message": "使用者密碼變更失敗，格式不符或其他原因"
      }
      return jsonify(res), 400
  except:
    res = {
        "error" : True,
        "message" : "伺服器內部發生錯誤"
      }
    return jsonify(res), 500