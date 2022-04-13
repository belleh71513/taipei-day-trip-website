from mysql.connector import pooling
from dotenv import load_dotenv
import requests
import json
import mysql.connector
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

def order_get(orderNumber, user_id):
  try:
    con = pool.get_connection()
    cursor = con.cursor(dictionary=True)
    sql = """
          SELECT o.order_number, o.price, o.attraction_id, a.name AS attraction_name,
          a.address AS attraction_address, a.images AS attraction_images, o.date, o.time,
          o.name, o.email, o.phone , o.payment_status FROM order_table AS o JOIN attraction_table AS a
          ON o.attraction_id = a.id WHERE o.order_number = %s AND o.user_id = %s
        """
    cursor.execute(sql, (orderNumber, user_id))
    result = cursor.fetchone()
    return result
  except mysql.connector.Error as err:
    print(f"order.py order_get function{err}")
    return False
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def order_insert(*data):
  try:
    con = pool.get_connection()
    cursor = con.cursor()


    sql = """
          INSERT INTO order_table (order_number, price, attraction_id, date, time, name, email, phone, user_id)
          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
          """
    cursor.execute(sql, data)
    con.commit()
    return True
  except mysql.connector.Error as err:
    print(f"order.py order_insert function {err}")
    return False
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def order_update(user_id, order_number):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    sql = "UPDATE order_table SET payment_status=0 WHERE user_id=%s AND order_number=%s"
    cursor.execute(sql, (user_id, order_number))
    con.commit()
    return True
  except mysql.connector.Error as err:
    print(f"order.py order_update function {err}")
    return False
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def connect_tappay(**data):
  prime = data["prime"]
  price = data["price"]
  phone_number = data["phone"]
  name = data["name"]
  email = data["email"]

  tappay_url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
  tappay_headers = {
    "Content-Type": "application/json",
    "x-api-key": os.getenv("tappay_partner_key")
  }
  tappay_request_body = json.dumps({
    "prime": prime,
    "partner_key": os.getenv("tappay_partner_key"),
    "merchant_id": os.getenv("tappay_merchant_id"),
    "details":"Taipei_Website",
    "amount": price,
    "cardholder": {
        "phone_number": phone_number,
        "name": name,
        "email": email
    },
    "remember": False
  })
  req = requests.post(tappay_url, data=tappay_request_body, headers=tappay_headers)
  res = req.json()
  status = res["status"]
  if status == 0:
    return True
  else:
    return False











