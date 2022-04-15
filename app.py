from flask import *
from api.api_attraction import attractions
from api.api_user import user
from api.api_booking import booking
from api.api_order import orders

app=Flask(__name__,static_folder="static", static_url_path="/")
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True



app.register_blueprint(attractions, url_prefix="/api")
app.register_blueprint(user, url_prefix="/api")
app.register_blueprint(booking, url_prefix="/api")
app.register_blueprint(orders, url_prefix="/api")

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/member")
def member():
	return render_template("member.html")



if __name__ == "__main__" :
	app.run(host="0.0.0.0", port=3000)