  
import os
from flask_admin import Admin
from .models import db, User, City, Interest_point, Restaurant, Hotel, Favorites_city, Favorites_interest_point, Favorites_hotel, Favorites_restaurant
from flask_admin.contrib.sqla import ModelView

class RestaurantView(ModelView):
    column_list = ('restaurant_name', 'address', 'restaurant_description', "user_id","city_id")
    form_columns = ('restaurant_name', 'address', 'restaurant_description', "user_id","city_id")

class HotelView(ModelView):
    column_list = ('hotel_name', 'hotel_address', 'hotel_description', "user_id","city_id")
    form_columns = ('hotel_name', 'hotel_address', 'hotel_description', "user_id","city_id")

class Interest_pointView(ModelView):
    column_list = ('int_name', 'locality', 'point_address',"int_description", "user_id","city_id")
    form_columns = ('int_name', 'locality', 'point_address',"int_description", "user_id","city_id")

class Favorites_cityView(ModelView):
    column_list = ('favorites_user_id', 'favorites_city_id')
    form_columns = ('favorites_user_id', 'favorites_city_id')

class Favorites_restaurantView(ModelView):
    column_list = ('favorites_user_id', 'favorites_restaurant_id')
    form_columns= ('favorites_user_id', 'favorites_restaurant_id')

class Favorites_interest_pointView(ModelView):
    column_list = ('favorites_user_id', 'favorites_interest_point_id')
    form_columns= ('favorites_user_id', 'favorites_interest_point_id')

class Favorites_hotelView(ModelView):
   column_list = ('favorites_user_id', 'favorites_hotel_id')
   form_columns= ('favorites_user_id', 'favorites_hotel_id')

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin+
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(City, db.session))
    admin.add_view(RestaurantView(Restaurant, db.session))
    admin.add_view(Interest_pointView(Interest_point, db.session))
    admin.add_view(Favorites_restaurantView(Favorites_restaurant, db.session))
    admin.add_view(Favorites_interest_pointView(Favorites_interest_point, db.session))
    admin.add_view(Favorites_hotelView(Favorites_hotel, db.session))
    admin.add_view(Favorites_cityView(Favorites_city, db.session))
    admin.add_view(HotelView(Hotel, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))