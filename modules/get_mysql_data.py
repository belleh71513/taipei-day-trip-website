import mysql.connector
from mysql.connector import pooling

dbconfig = {
  "host":"localhost",
  "user":"root",
  "password":"password",
  "database":"taipei_website"
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
    keyword = kwargs["keyword"]
    if not keyword:
      sql = f"SELECT * FROM attraction_table LIMIT {page},12"
      cursor.execute(sql)
      results = cursor.fetchall()
      data = get_per_col(results)
      return data
    else:
      sql = f"SELECT * FROM attraction_table WHERE name LIKE '%{keyword}%' LIMIT {page},12"
      cursor.execute(sql)
      results = cursor.fetchall()
      data = get_per_col(results)
      return data
  except :
    print("Can not select")

  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def check_data_count(keyword):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    sql_count = f" SELECT COUNT(*) FROM attraction_table WHERE name LIKE '%{keyword}%' "
    cursor.execute(sql_count)
    count = cursor.fetchone()[0]
    return count
  except:
    print("Can not check")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

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
      "images": [result["images"]]
    }
    data_list.append(data)
  return data_list









