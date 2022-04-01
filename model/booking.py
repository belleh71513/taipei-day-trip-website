from mysql.connector import pooling
from dotenv import load_dotenv
import mysql.connector
import os
import datetime

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

def booking_select_data(user_id):
  try:
    con = pool.get_connection()
    cursor = con.cursor(dictionary=True)
    sql = """
            SELECT a.id, a.name, a.address, a.images, b.date, b.time, b.price
            FROM attraction_table AS a JOIN booking_table AS b ON b.attraction_id = a.id
            WHERE b.user_id = %s
            """
    cursor.execute(sql, (user_id,))
    result = cursor.fetchone()
    if result:
      return result
    else:
      return None
  except:
    print("booking_select_data function error")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def booking_insert_data(*data):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    user_id = data[4]
    check_data_exist = check_data_status(user_id)
    if check_data_exist:
      new_boooking_data = update_booking_data(data)
      return new_boooking_data
    else:
      sql = "INSERT INTO booking_table (date, time, price, attraction_id, user_id) VALUES (%s, %s, %s, %s, %s)"
      cursor.execute(sql, data)
      con.commit()
      confirm_insert_success = check_data_status(user_id)
      return confirm_insert_success
  except:
    print("booking_insert_data function error")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def booking_data_delete(user_id):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    sql = "DELETE FROM booking_table WHERE user_id=%s"
    cursor.execute(sql, (user_id,))
    con.commit()
    result = check_data_status(user_id)
    if not result:
      return False
  except:
    print("delete_booking_data function error")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def check_data_status(user_id):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    sql = "SELECT * FROM booking_table WHERE user_id=%s"
    cursor.execute(sql, (user_id,))
    result = cursor.fetchone()
    if not result :
      return False
    else:
      return True
  except:
    print("check_data_status function error")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def update_booking_data(*data):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    sql = "UPDATE booking_table SET date=%s, time=%s, price=%s, attraction_id=%s WHERE user_id=%s"
    cursor.execute(sql, data[0])
    con.commit()
    check_new_booking = check_data_status(data[0][4])
    return check_new_booking
  except:
    print("update_booking_data function error")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()