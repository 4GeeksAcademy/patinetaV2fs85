from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from typing import List

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(120),  nullable=False)
    email = db.Column(String(120),  nullable=False)
    password = db.Column(String(80), nullable=False)
    is_active = db.Column(Boolean(),  nullable=False)
    favorites_hotel=db.relationship("Favorites_hotel", backref="user")
    favorites_city=db.relationship("Favorites_city", backref="user")
    favorites_interest_point=db.relationship("Favorites_interest_point", backref="user")
    favorites_restaurant=db.relationship("Favorites_restaurant", backref="user")
    city=db.relationship("City", backref="user")
    restaurant=db.relationship("Restaurant", backref="user")
    hotel=db.relationship("Hotel", backref="user")
    interest_point=db.relationship("Interest_point", backref="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            
        }

class City(db.Model):
    __tablename__ = "city"
    id = db.Column(Integer, primary_key=True)
    city_name = db.Column(String(30), nullable=False)
    country_name = db.Column(String(30),nullable=False)
    city_description = db.Column(String(300),nullable=False)
    city_image= db.Column(String(200), nullable=False)
    user_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    favorites_city =db.relationship("Favorites_city", backref="city")
    restaurant=db.relationship("Restaurant", backref="city.id")
    hotel=db.relationship("Hotel", backref="city.id")
    interest_point=db.relationship("Interest_point", backref="city.id")

    def serialize(self):
        return {
            "id": self.id,
            "city_name": self.city_name,
            "country_name": self.country_name,
            "city_description": self.city_description,
            "city_image":self.city_image
            # do not serialize the password, its a security breach
        }

class Restaurant(db.Model):
    __tablename__ = "restaurant"
    id = db.Column(Integer, primary_key=True)
    restaurant_name = db.Column(String(30), nullable=False)
    address = db.Column(String(100), nullable=False)
    restaurant_description = db.Column(String(300),nullable=False)
    user_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    city_id= db.Column(db.Integer, db.ForeignKey("city.id"))
    favorites_restaurant =db.relationship("Favorites_restaurant", backref="restaurant")

    def serialize(self):
        return {
            "id": self.id,
            "restaurant_name": self.restaurant_name,
            "address": self.address,
            "restaurant_description": self.restaurant_description
            # do not serialize the password, its a security breach
        }

class Interest_point(db.Model):
    __tablename__ = "interest_point"
    id = db.Column(Integer, primary_key=True)
    int_name = db.Column(String(100), nullable=False)
    locality = db.Column(String(100), nullable=False)
    point_address = db.Column(String(100), nullable=False)
    int_description = db.Column(String(300),nullable=False)
    user_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    city_id= db.Column(db.Integer, db.ForeignKey("city.id"))
    favorites_interest_point =db.relationship("Favorites_interest_point", backref="interest_point")

    def serialize(self):
        return {
            "id": self.id,
            "int_name": self.int_name,
            "point_address": self.point_address,
            "int_description":self.int_description
            
            # do not serialize the password, its a security breach
        }

class Hotel(db.Model):
    __tablename__ = "hotel"
    id = db.Column(Integer, primary_key=True)
    hotel_name = db.Column(String(50), nullable=False)
    hotel_address = db.Column(String(100), nullable=False)
    hotel_description = db.Column(String(300),nullable=False)
    user_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    city_id= db.Column(db.Integer, db.ForeignKey("city.id"))
    favorites_hotel =db.relationship("Favorites_hotel", backref="hotel")

    def serialize(self):
        return {
            "id": self.id,
            "hotel_name": self.hotel_name,
            "hotel_address": self.hotel_address,
            "hotel_description" :self.hotel_description,
            
            # do not serialize the password, its a security breach
        }
    
class Favorites_city (db.Model):
    __tablename__ = "favorites_city"
    id = db.Column(Integer, primary_key=True)
    favorites_user_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    favorites_city_id= db.Column(db.Integer, db.ForeignKey("city.id"))

    def serialize(self):
        return {
            "id": self.id,
            "city_id": self.favorites_city_id            
            

            # do not serialize the password, its a security breach
        }

class Favorites_hotel (db.Model):
    __tablename__ = "favorites_hotel"
    id = db.Column(Integer, primary_key=True)
    favorites_user_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    favorites_hotel_id= db.Column(db.Integer, db.ForeignKey("hotel.id"))

    def serialize(self):
        return {
            "id": self.id,
            "hotel_id": self.favorites_hotel_id
                   
            

            # do not serialize the password, its a security breach
        }

class Favorites_restaurant (db.Model):
    __tablename__ = "favorites_restaurant"
    id = db.Column(Integer, primary_key=True)
    favorites_user_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    favorites_restaurant_id= db.Column(db.Integer, db.ForeignKey("restaurant.id"))

    def serialize(self):
        return {
            "id": self.id,
            "hotel_id": self.favorites_restaurant_id
                   
            

            # do not serialize the password, its a security breach
        }

class Favorites_interest_point (db.Model):
    __tablename__ = "favorites_interest_point"
    id = db.Column(Integer, primary_key=True)
    favorites_user_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    favorites_interest_point_id= db.Column(db.Integer, db.ForeignKey("interest_point.id"))

    def serialize(self):
        return {
            "id": self.id,
            "hotel_id": self.favorites_interest_point_id
                   
            

            # do not serialize the password, its a security breach
        }

