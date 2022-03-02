from flask import *
from modules.get_mysql_data import select_attractions,check_data_count

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
      if not search_result_count:
        res = {
          "error":True,
          "message":"查無相關資訊"
        }
        return jsonify(res)
      search_results = select_attractions(page=page, keyword=keyword)
      check_next_page = search_result_count // 12
    # 如果資料筆數>=12
      if check_next_page > page:
        res = {
          "nextPage":page + 1,
          "data":search_results
        }
      # 資料比數介於0~12
      else :
        res = {
          "nextPage":None,
          "data":search_results
        }
      return jsonify(res)
    else:
      search_results = select_attractions(page=page,keyword=None)
      if len(search_results) == 12:
        res = {
          "nextPage":page + 1,
          "data":search_results
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
    })

# @attractions.route("/attraction/<int:attractionID>")
# def api_attraction_attractionID(attractionID):














