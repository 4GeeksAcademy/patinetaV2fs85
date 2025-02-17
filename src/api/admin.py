  
import os
from flask_admin import Admin
from .models import db, User, City, Interest_point, Restaurant, Hotel, Favorites
from flask_admin.contrib.sqla import ModelView

class FavoritesView(ModelView):
    column_list = ("favorites_user_id","favorites_hotel_id","favorites_city_id", "favorites_interest_point_id", 'favorites_restaurant_id')
    form_columns = ("favorites_user_id","favorites_hotel_id","favorites_city_id", "favorites_interest_point_id", 'favorites_restaurant_id')

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin+
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(City, db.session))
    admin.add_view(ModelView(Restaurant, db.session))
    admin.add_view(ModelView(Interest_point, db.session))
    admin.add_view(ModelView(Hotel, db.session))
    admin.add_view(FavoritesView(Favorites, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))