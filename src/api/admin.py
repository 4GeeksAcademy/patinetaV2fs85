  
import os
from flask_admin import Admin
from .models import db, User, City, Interest_point, Restaurant, Hotel, Favorites_city, Favorites_interest_point, Favorites_hotel, Favorites_restaurant
from flask_admin.contrib.sqla import ModelView



def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin+
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(City, db.session))
    admin.add_view(ModelView(Restaurant, db.session))
    admin.add_view(ModelView(Interest_point, db.session))
    admin.add_view(ModelView(Favorites_restaurant, db.session))
    admin.add_view(ModelView(Favorites_interest_point, db.session))
    admin.add_view(ModelView(Favorites_hotel, db.session))
    admin.add_view(ModelView(Favorites_city, db.session))
    admin.add_view(ModelView(Hotel, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))