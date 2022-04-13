from mysql.connector import pooling
from dotenv import load_dotenv
import mysql.connector
import re
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

def user_check_status(email):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    sql = "SELECT id, name, email FROM user_table WHERE email=%s"
    cursor.execute(sql, (email,))
    result = cursor.fetchone()
    if result :
      return result
  except mysql.connector.Error as err:
    print(f"user.py user_check_status function {err}")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()


def user_register(*data):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    email = data[1]
    result = confirm_register_successful(email)
    if not result:
      sql = "INSERT INTO user_table (name, email, password) VALUES (%s, %s, %s)"
      cursor.execute(sql, data)
      con.commit()
      check_register = confirm_register_successful(email)
      if check_register:
        return True
    else:
      return False
  except mysql.connector.Error as err:
    print(f"user.py user_register function {err}")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def user_login(*data):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    sql = "SELECT * FROM user_table WHERE email=%s AND password=%s"
    cursor.execute(sql, data)
    result = cursor.fetchone()
    return result
  except mysql.connector.Error as err:
    print(f"user.py order_login function {err}")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def confirm_register_successful(email):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    sql = "SELECT COUNT(*) FROM user_table WHERE email=%s"
    cursor.execute(sql, (email,))
    result = cursor.fetchone()[0]
    return result
  except mysql.connector.Error as err:
    print(f"user.py confirm_register_successful function {err}")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()

def email_regex_check(email):
  rex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
  result = re.match(rex, email)
  return result

def password_regex_check(password):
  rex = r"^(?=.*\d)(?=.*[a-z]).{6,20}$"
  result = re.match(rex, password)
  return result




