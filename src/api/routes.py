"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
import jwt  # Para generar tokens
import datetime, bcrypt # Para la expiración del token
from api.models import db, User, Favorites_city, Favorites_hotel, Favorites_interest_point, Favorites_restaurant, City, Restaurant, Interest_point, Hotel
from api.utils import generate_sitemap, APIException, send_password_reset_email
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select
from flask_mail import  Message


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
    if user is None or user.password != password:
        return jsonify({"msg": "Email o Contraseña incorrectos"}), 401

    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "access_token": access_token, 
        "user_id": user.id,
        "user_name": user.name 
    }), 200


@api.route('/User', methods=['GET'])
def todos_los_usuarios():

    data = db.session.scalars(select(User)).all()
    results = list(map(lambda User: User.serialize(),data))
   
    response_body = {
        "msg": "Hola, aqui tienes la lista de todos los usuarios: ",
        "results":results
    }

    return jsonify(response_body), 200


@api.route('/User/<int:id>', methods=['GET'])
def solo_un_usuario(id):
   
 try:
    usuario = db.session.execute(select(User).filter_by(id=id)).scalar_one()
   
    response_body = {
        "msg": "Hola, aqui esta el usuario que buscabas ",
        "results":usuario.serialize()
    }

    return jsonify(response_body), 200
 except:
    return jsonify({"msg":"user not exist"}), 404
 


# Gets Ciudades________

@api.route('/city', methods=['GET'])
def todas_las_ciudades():


    data = db.session.scalars(select(City)).all()
    results = list(map(lambda City: City.serialize(),data))
   
    response_body = {
        "msg": "Hola, aqui tienes la lista de todas las ciudades: ",
        "results":results
    }


    return jsonify(response_body), 200

@api.route('/City/<int:id>', methods=['GET'])
def solo_una_ciudad(id):
   
 try:

    ciudad = db.session.execute(select(City).filter_by(id=id)).scalar_one()
   
    response_body = {
        "msg": "Hola, aqui esta la ciudad que buscas ",
        "results":ciudad.serialize()
    }

    return jsonify(response_body), 200

 except:

    return jsonify({"msg":"City not exist"}), 404
 

# # Gets Restaurant_________

@api.route('/Restaurant', methods=['GET'])
def todas_loss_restaurantes():


    data = db.session.scalars(select(Restaurant)).all()
    results = list(map(lambda Restaurant: Restaurant.serialize(),data))
   
    response_body = {
        "msg": "Hola, aqui tienes la lista de todas los Restaurantes: ",
        "results":results
    }


    return jsonify(response_body), 200

@api.route('/Restaurant/<int:id>', methods=['GET'])
def solo_un_restaurante(id):
   
 try:

    restaurante = db.session.execute(select(Restaurant).filter_by(id=id)).scalar_one()
   
    response_body = {
        "msg": "Hola, aqui esta la ciudad que buscas ",
        "results":restaurante.serialize()
    }

    return jsonify(response_body), 200

 except:

    return jsonify({"msg":"Restaurant not exist"}), 404
 
  
# # Gets Interest_point _________

@api.route('/Interest_point', methods=['GET'])
def all_interest_point():
    data = db.session.scalars(select(Interest_point)).all()
    results = list(map(lambda Interest_point: Interest_point.serialize(),data))
   
    response_body = {
        "msg": "Hola, aqui tienes la lista de todos los puntos de interes: ",
        "results":results
    }


    return jsonify(response_body), 200


@api.route('/Interest_point/<int:id>', methods=['GET'])
def one_interest_point(id):
   
 try:
    interest_point = db.session.execute(select(Interest_point).filter_by(id=id)).scalar_one()
   
    response_body = {
        "msg": "Hola, aqui esta el punto de interes que buscas ",
        "results":interest_point.serialize()
    }


    return jsonify(response_body), 200

 except:

    return jsonify({"msg":"Interest point not exist"}), 404


# # _________# Gets Hotel _________

@api.route('/Hotel', methods=['GET'])
def todos_los_hoteles():

    data = db.session.scalars(select(Hotel)).all()
    results = list(map(lambda Hotel: Hotel.serialize(),data))
   
    response_body = {
        "msg": "Hola, aqui tienes la lista de todos los hoteles: ",
        "results":results
    }

    return jsonify(response_body), 200

@api.route('/Hotel/<int:id>', methods=['GET'])
def solo_un_hotel(id):
   
 try:

    hotel = db.session.execute(select(Hotel).filter_by(id=id)).scalar_one()
   
    response_body = {
        "msg": "Hola, aqui esta el hotel  que buscas ",
        "results":hotel.serialize()
    }

    return jsonify(response_body), 200

 except:

    return jsonify({"msg":"Hotel not exist"}), 404
 

# Gets de favoritos 
 
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



# #  Metodos post______


# # # CITY

@api.route('/favorites/city/<int:city_id>', methods=['POST'])
def agregar_ciudad_favorita(city_id):
    # Obtener el user_id desde el request (se recomienda que venga en el JSON)
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"msg": "User ID is required"}), 400
    
    # Verificar que el usuario existe
    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Crear el favorito y asignar la ciudad
    new_favorito = Favorites_city(favorites_user_id=user.id, favorites_city_id=city_id)
    db.session.add(new_favorito)
    db.session.commit()

    return jsonify({"msg": "Ciudad favorita agregada"}), 201


# # # Restaurant

@api.route('/favorite/restaurant/<int:restaurant_id>', methods=['POST'])
def agregar_restaurant_favorito(restaurant_id):
    # Obtener el user_id desde el request (se recomienda que venga en el JSON)
    data = request.get_json()
    user_id = data.get('user_id')


    if not user_id:
        return jsonify({"msg": "User ID is required"}), 400


    # Verificar que el usuario existe
    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    if not user:
        return jsonify({"msg": "User not found"}), 404


    # Crear el favorito y asignar la ciudad
    new_favorito = Favorites_restaurant(favorites_user_id=user.id, favorites_restaurant_id=restaurant_id)
    db.session.add(new_favorito)
    db.session.commit()


    return jsonify({"msg": "Restaurante favorita agregado"}), 201


# # # Interest_point
@api.route('/favorite/Interest_point/<int:interest_point_id>', methods=['POST'])
def agregar_interest_point_favorito(interest_point_id):
    # Obtener el user_id desde el request (se recomienda que venga en el JSON)
    data = request.get_json()
    user_id = data.get('user_id')


    if not user_id:
        return jsonify({"msg": "User ID is required"}), 400


    # Verificar que el usuario existe
    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    if not user:
        return jsonify({"msg": "User not found"}), 404


    # Crear el favorito y asignar la ciudad
    new_favorito = Favorites_interest_point(favorites_user_id=user.id, favorites_interest_point_id=interest_point_id)
    db.session.add(new_favorito)
    db.session.commit()


    return jsonify({"msg": "Ciudad favorita agregada"}), 201


# # # # Hotel
@api.route('/favorite/hotel/<int:hotel_id>', methods=['POST'])
def agregar_hotel_favorito(hotel_id):
    # Obtener el user_id desde el request (se recomienda que venga en el JSON)
    data = request.get_json()
    user_id = data.get('user_id')


    if not user_id:
        return jsonify({"msg": "User ID is required"}), 400


    # Verificar que el usuario existe
    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    if not user:
        return jsonify({"msg": "User not found"}), 404


    # Crear el favorito y asignar el hotel
    new_favorito = Favorites_hotel(favorites_user_id=user.id, favorites_hotel_id=hotel_id)
    db.session.add(new_favorito)
    db.session.commit()


    return jsonify({"msg": "Hotel favorita agregado"}), 201


# # DELETE


# #City


@api.route('/favorite/city/<int:city_id>', methods=['DELETE'])
def delete_city(city_id):

    data = request.get_json()
    print(data)
    print(city_id)
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"msg": "No User send "}), 404

    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    # # hacer filtrado
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    buscar_city_borrar = db.session.execute(db.select(Favorites_city).filter_by(favorites_user_id=user_id,favorites_city_id=city_id)).scalar()
    print(buscar_city_borrar)

    if buscar_city_borrar is None:
        return jsonify({"msg": "Favorito no existe"}), 404
    
    
    db.session.delete(buscar_city_borrar)
    db.session.commit()

    response_body = {
        "msg":"Ciudad favorita del usuario borrada"
    }
    return jsonify(response_body), 200

# # Restaurant

@api.route('/favorite/restaurant/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):

    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
      return jsonify({"msg": "No User send "}), 404



    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    # hacer filtrado
    if user is None:
        return jsonify({"msg": "User not found"}), 404


    buscar_restaurant_favorito_borrar = db.session.execute(db.select(Favorites_restaurant).filter_by(favorites_user_id=user_id,favorites_restaurant_id=restaurant_id)).scalar_one()
    print( buscar_restaurant_favorito_borrar)

    if buscar_restaurant_favorito_borrar is None:
        return jsonify({"msg": "Restaurante Favorito no existe"}), 404
    
    db.session.delete(buscar_restaurant_favorito_borrar)
    db.session.commit()


    response_body = {
        "msg":"Restaurant favorita del usuario BORRADO"
    }


    return jsonify(response_body), 200



# # Interest_point
@api.route('/favorite/interest_point/<int:interest_point_id>', methods=['DELETE'])
def delete_interest_point(interest_point_id):

    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
      return jsonify({"msg": "No User send "}), 404


    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    # hacer filtrado
    if not user:
        return jsonify({"msg": "User not found"}), 404


    buscar_interest_pointfavorito_borrar = db.session.execute(db.select(Favorites_interest_point).filter_by(favorites_user_id=user_id,favorites_interest_point_id=interest_point_id)).scalar()
    
    if buscar_interest_pointfavorito_borrar is None:
        return jsonify({"msg": "El punto de interes Favorito no existe"}), 404
    
    db.session.delete(buscar_interest_pointfavorito_borrar)
    db.session.commit()


    response_body = {
        "msg":"Punto de Interes del usuario borrado "
    }


    return jsonify(response_body), 200



# #Hotel

@api.route('/favorite/hotel/<int:hotel_id>', methods=['DELETE'])
def delete_hotel(hotel_id):

    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
      return jsonify({"msg": "No User send "}), 404


    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one()
    # hacer filtrado
    if not user:
        return jsonify({"msg": "User not found"}), 404


    buscar_hotel_borrar = db.session.execute(db.select(Favorites_hotel).filter_by(favorites_user_id=user_id,favorites_hotel_id=hotel_id)).scalar()
    
    if buscar_hotel_borrar is None:
        return jsonify({"msg": "El hotel Favorito no existe"}), 404
    
    db.session.delete(buscar_hotel_borrar)
    db.session.commit()


    response_body = {
        "msg":"Hotel favorita del usuario borrado"
    }


    return jsonify(response_body), 200





users_db = {

    
}



# # Endpoint para solicitar la recuperación de la contraseña
# @api.route('/request-password-recovery', methods=['POST'])
# def request_password_recovery():
#     email = request.json.get('email')
#     # Verificar si el usuario existe
#     print(email)
#     user = db.session.execute(select(User).filter_by(email=email)).scalar_one_or_none()
#     print(user)
#     if not user:
#         return jsonify({"message": "Usuario no encontrado"}), 400
    
#     # Generar el token JWT
#     # expiration_time = 15  # El token expira en 15 minutos
#     access_token = create_access_token(identity=user.email)
#     # token = jwt.encode({
#     #     'user_email': email,
#     #     'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=access_token)
#     # }, api.config['SECRET_KEY'], algorithm='HS256')
#     # Enviar el correo de recuperación
#     msg = Message('Recuperación de Contraseña',
#                   sender='noreply@demo.com',
#                   recipients=[email])
#     reset_url = f'http://localhost:5000/reset-password?token={access_token}'
#     msg.body = f'Haz clic en el siguiente enlace para restablecer tu contraseña: {reset_url}'
#     mail.send(msg)
#     # send_password_reset_email(email, access_token)
#     return jsonify({"message": "Se ha enviado un enlace de recuperación a tu correo"}), 200





# Endpoint para restablecer la contraseña

@api.route('/reset-password', methods=['POST'])
@jwt_required()
def reset_password():
    token = request.json.get('token')
    new_password = request.json.get('new_password')
    if not token or not new_password:
        return jsonify({"message": "Token y nueva contraseña son necesarios"}), 400
    try:
        current_user = get_jwt_identity()
        print("current_user",current_user)
        user = db.session.execute(select(User).filter_by(email=current_user)).scalar_one_or_none()

        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 400
       
        # Actualizar la contraseña del usuario
        user.password = new_password
        db.session.commit()
        return jsonify({"message": "Contraseña restablecida correctamente"}), 200
        
        # Verificar el token
        # decoded_token = jwt.decode(token, api.config['SECRET_KEY'], algorithms=['HS256'])
        # user_email = decoded_token['user_email']
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "El token ha expirado"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token inválido"}), 400
    # Buscar al usuario en la "base de datos"
    












    













