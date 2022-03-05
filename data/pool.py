import mysql.connector.pooling

dbconfig = {
  "host":"localhost",
  "user":"root",
  "password":"password",
  "database":"taipei_website",
}

pool = mysql.connector.pooling.MySQLConnectionPool(
  pool_name = "my_pool",
  pool_size = 5,
  **dbconfig
)