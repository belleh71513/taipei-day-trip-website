from dotenv import load_dotenv
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

def user_check_status(email):
  try:
    con = pool.get_connection()
    cursor = con.cursor()
    sql = "SELECT id, name, email FROM user_table WHERE email=%s"
    cursor.execute(sql, (email,))
    result = cursor.fetchone()
    if result :
      return result
  except:
    print("check_status function error")
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
  except:
    print("register function error")
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
  except:
    print("login function error")
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
  except:
    print("confirm_register_successful function error")
  finally:
    if con.in_transaction:
      con.rollback()
    con.close()
