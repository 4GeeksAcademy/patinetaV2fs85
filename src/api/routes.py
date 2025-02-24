"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Favorites_city, Favorites_hotel, Favorites_interest_point, Favorites_restaurant 
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/favorites-city/<int:id>', methods=['GET'])
def traer_ciudad_favorita(id):
    City = db.session.execute(select(Favorites_city).filter_by(id=id)).scalar_one()
    response_body = {
        "msg": "Hello, this is your favorito ",
        "result":City.serialize()
    }
    return jsonify(response_body), 200
@api.route('/favorites-hotel/<int:id>', methods=['GET'])
def traer_hotel_favorito(id):
    Hotel = db.session.execute(select(Favorites_hotel).filter_by(id=id)).scalar_one()
    response_body = {
        "msg": "Hello, this is your favorito ",
        "result":Hotel.serialize()
    }
    return jsonify(response_body), 200
@api.route('/favorites-restaurant/<int:id>', methods=['GET'])
def traer_restaurant_favorito(id):
    Restaurant = db.session.execute(select(Favorites_restaurant).filter_by(id=id)).scalar_one()
    response_body = {
        "msg": "Hello, this is your favorito ",
        "result":Restaurant.serialize()
    }
    return jsonify(response_body), 200
@api.route('/favorites-interest-point/<int:id>', methods=['GET'])
def traer_interest_favorito(id):
    Interest_point = db.session.execute(select(Favorites_interest_point).filter_by(id=id)).scalar_one()
    response_body = {
        "msg": "Hello, this is your favorito ",
        "result":Interest_point.serialize()
    }
    return jsonify(response_body), 200