"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, create_access_token
from flask_mail import Mail, Message  
from sqlalchemy import select
import datetime, bcrypt



app = Flask(__name__)
# app.config['SECRET_KEY'] = 'tu_clave_secreta'  # Cambia esta clave
# app.config['MAIL_SERVER'] = 'live.smtp.mailtrap.io'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USERNAME'] = 'smtp@mailtrap.io'  # Cambia con tu correo
# app.config['MAIL_PASSWORD'] = 'ff054b06b93309063fbe6b8be541d115'  # Cambia con tu contraseña

# app.config['MAIL_SERVER']='live.smtp.mailtrap.io'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USERNAME'] = 'api'
# app.config['MAIL_PASSWORD'] = 'ff054b06b93309063fbe6b8be541d115'
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = False

# Looking to send emails in production? Check out our Email API/SMTP product!
app.config['MAIL_SERVER']='sandbox.smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USERNAME'] = '8bc211444ac688'
app.config['MAIL_PASSWORD'] = '770604203c54af'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail()
mail.init_app(app)






# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')

app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config["JWT_SECRET_KEY"] = "xxx" 
jwt = JWTManager(app)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

app.config["JWT_SECRET_KEY"] = ""  # Change this!
jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# # Endpoint para solicitar la recuperación de la contraseña
@app.route('/request-password-recovery', methods=['POST'])
def request_password_recovery():
    email = request.json.get('email')
    # Verificar si el usuario existe
    print(email)
    user = db.session.execute(select(User).filter_by(email=email)).scalar_one_or_none()
    print(user)
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 400
    
    access_token = create_access_token(identity=user.email)
    
    msg = Message('Recuperación de Contraseña',
                  sender='noreply@demo.com',
                  recipients=[email])
    reset_url = f'http://localhost:5000/reset-password?token={access_token}'
    msg.body = f'Haz clic en el siguiente enlace para restablecer tu contraseña: {reset_url}'
    mail.send(msg)
    # send_password_reset_email(email, access_token)
    return jsonify({"message": "Se ha enviado un enlace de recuperación a tu correo"}), 200




# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
