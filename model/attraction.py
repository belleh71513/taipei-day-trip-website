from distutils.command.config import config
from flask import jsonify
import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv
import os
import json

load_dotenv()

dbconfig = {
  "host":os.getenv("db_host"),
  "user":os.getenv("db_user"),
  "password":os.getenv("db_password"),
  "database":os.getenv("db_database")
}

pool = mysql.connector.pooling.MySQLConnectionPool(
  pool_name = "my_pool",
  pool_size = 5,
  pool_reset_session = True,
  **dbconfig
)


def select_attractions(**kwargs):
  try:
    con = pool.get_connection()
    cursor = con.cursor(dictionary=True)
    page = kwargs["page"] * 12
    # 如果沒有keyword，顯示所有資料，但每頁最多顯示12筆
    # 注意因為cursor有dic=True回傳資料type為dict
    keyword = kwargs["keyword"]
    if not keyword:
      sql = f"SELECT * FROM attraction_table LIMIT {page},12"
      cursor.execute(sql)
      results = cursor.fetchall()
      data = get_per_col(results)
      return data
    # 有keyword，將keyword代入
    else:
      sql = f"SELECT * FROM attraction_table WHERE name LIKE '%{keyword}%' LIMIT {page},12"
      cursor.execute(sql)
      results = cursor.fetchall()
      data = get_per_col(results)
      return data
  except :
    print("select_attractions error")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

# 檢查keyword在SQL中有幾筆，dic模式不是True所以回傳的是tuple
# def check_data_count(keyword):
#   try:
#     con = pool.get_connection()
#     cursor = con.cursor()
#     sql_count = f" SELECT COUNT(*) FROM attraction_table WHERE name LIKE '%{keyword}%' "
#     cursor.execute(sql_count)
#     count = cursor.fetchone()[0]
#     return count
#   except:
#     print("Can not check")
#   finally:
#     if con.in_transaction:
#       con.rollback()
#     con.close()

# 將篩選出的資料(type:dic)整理並放入list中
def get_per_col(results):
  data_list = []
  for result in results:
    data={
      "id": result["id"],
      "name": result["name"],
      "category": result["category"],
      "description": result["description"],
      "address": result["address"],
      "transport": result["transport"],
      "mrt": result["mrt"],
      "latitude": result["latitude"],
      "longitude": result["longitude"],
      "images": json.loads(result["images"])
    }
    data_list.append(data)
  return data_list

# api/attraction/<att_id>，利用id進行篩選，並把資料以dic傳回
def select_att_id(att_id):
  try:
    con = pool.get_connection()
    cursor = con.cursor(dictionary=True)
    sql = f"SELECT * FROM attraction_table WHERE id={att_id}"
    cursor.execute(sql)
    result = cursor.fetchone()
    if result :
      res = {
          "data":{
          "id": result["id"],
          "name": result["name"],
          "category": result["category"],
          "description": result["description"],
          "address": result["address"],
          "transport": result["transport"],
          "mrt": result["mrt"],
          "latitude": result["latitude"],
          "longitude": result["longitude"],
          "images": json.loads(result["images"])
        }
      }
      return res
    else:
      res = {
        "error": True,
        "message": "景點編號不正確"
      }
      return res
  except :
    print("select_att_id fucntion error")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()









