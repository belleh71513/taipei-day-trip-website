from urllib import request
from flask import *
import json
from modules.get_mysql_data import select_attractions,check_data_count, select_att_id

attractions = Blueprint("attractions", __name__)

@attractions.route("/attractions")
def api_attractions():

  try:

    page = int(request.args.get("page"))
    keyword = request.args.get("keyword")

    # 如果欄位有輸入資料
    if keyword:
      # 檢查該keyword有幾筆資料
      search_result_count = check_data_count(keyword)
      # 先處理找不到關鍵字的情況
      if not search_result_count:
        res = {
          "error":True,
          "message":"查無相關資訊"
        }
        return jsonify(res)
      search_results = select_attractions(page=page, keyword=keyword)
      # 檢查是否有下一頁
      next_page_results = select_attractions(page=page, keyword=keyword)
      # 如果資料筆數該值==12表示還有下一頁
      if len(next_page_results) == 12:
        res = {
          "nextPage":page + 1,
          "data":search_results
        }
      # 資料筆數介數<12
      else :
        # 如果篩選下一頁為0筆，表示搜尋完畢，data null
        if not len(next_page_results):
          res = {
          "nextPage":None,
          "data":None
          }
        else:
          res = {
            "nextPage":None,
            "data":search_results
          }
      return jsonify(res)
    else:
      # 沒有輸入欄位的狀況，全部資料一頁一頁顯示
      search_results = select_attractions(page=page,keyword=None)
      next_page_results = select_attractions(page=page+1,keyword=None)
      
      if len(next_page_results) == 12:
        res = {
          "nextPage":page + 1,
          "data":search_results
        }
      else:
        if not len(next_page_results):
          res = {
          "nextPage":None,
          "data":None
          }      
        else:
          res = {
            "nextPage":None,
            "data":search_results
          }
      return jsonify(res)
  except:
    return jsonify({
      "error":True,
      "message":"伺服器發生錯誤"
    },500)

@attractions.route("/attraction/<int:attractionID>")
def api_attraction_attractionID(attractionID):
  try:
    get_att_id = select_att_id(attractionID)
    # SQL中有該id
    if get_att_id:
      res = {
        "id": get_att_id["id"],
        "name": get_att_id["name"],
        "category": get_att_id["category"],
        "description": get_att_id["description"],
        "address": get_att_id["address"],
        "transport": get_att_id["transport"],
        "mrt": get_att_id["mrt"],
        "latitude": get_att_id["latitude"],
        "longitude": get_att_id["longitude"],
        "images": [get_att_id["images"]]
      }
    else:
      res = {
        "error": True,
        "message": "景點編號不正確"
      }
    return jsonify(res)
  except:
    res = {
      "error": True,
      "message": "伺服器內部錯誤"
    }
    return jsonify(res)




















