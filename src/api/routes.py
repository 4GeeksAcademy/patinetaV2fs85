"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route("/signup", methods=["POST"])
def signup():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    name = request.json.get("name", None)

    if  not email or not password:
        return jsonify({"msg": "Todos los campos son obligatorios"}), 400
    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    if user:
        return jsonify({"msg": "El usuario ya existe"}), 400
    
    new_user = User(name=name , email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Usuario creado exitosamente"}), 201

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400
    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    if user is None:
        return jsonify({"msg": "Email o Contraseña incorrectos"}), 401
    if user.password != password:
        return jsonify({"msg": "Email o Contraseña incorrectas"}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user_id": user.id}), 200

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
