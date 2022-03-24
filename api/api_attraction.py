from urllib import request
from flask import *
import json
from model.attraction import select_attractions, select_att_id

attractions = Blueprint("attractions", __name__)

@attractions.route("/attractions")
def api_attractions():
  try:
    page = int(request.args.get("page")) # 字串轉 INT
    # 先判斷page，page值從0開始
    if page >= 0:
      keyword = request.args.get("keyword") # 未輸入keyword，該值為None
      search_results = select_attractions(page=page, keyword=keyword)
      # 檢查是否有下一頁
      next_page_results = select_attractions(page=page+1, keyword=keyword)
      # 如果資料筆數該值存在，表示還有下一頁
      if next_page_results:
        res = {
          "nextPage":page + 1,
          "data":search_results
        }
        return jsonify(res)
      # nextpage無資料
      else :
        # 如果該頁存在，回傳該page資料
        if search_results:
          res = {
          "nextPage":None,
          "data":search_results
          }
          return jsonify(res)
        # nextpage不存在且該頁也沒資料
        res = {
          "nextPage":None,
          "data":None
        }
        return jsonify(res)
  except:
    return jsonify({
      "error":True,
      "message":"伺服器發生錯誤"
    }), 500

@attractions.route("/attraction/<int:attractionID>")
def api_attraction_attractionID(attractionID):
  try:
    res = select_att_id(attractionID)
    # SQL中有該id
    return jsonify(res)
  except:
    res = {
      "error": True,
      "message": "伺服器內部錯誤"
    }
    return jsonify(res), 500




















