from mysql.connector import pooling
from dotenv import load_dotenv
import mysql.connector
import json
import os

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

def member_data_get(user_id):
  try:
    con = pool.get_connection()
    cursor = con.cursor(dictionary=True)
    sql = """
          SELECT o.order_number, o.price, a.name AS attraction_name, a.address AS attraction_address, a.images AS attraction_images, o.date, o.time, o.name ,o.phone FROM order_table AS o JOIN attraction_table AS a
          ON o.attraction_id = a.id WHERE o.user_id = %s
    """
    cursor.execute(sql, (user_id,))
    result = cursor.fetchall()
    return result
  except mysql.connector.Error as err:
    print(f"member.py member_data_get function {err}")
    con.rollback()
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

