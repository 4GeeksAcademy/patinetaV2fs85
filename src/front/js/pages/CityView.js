import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "../../styles/cityview.css";
import { Context } from "../store/appContext";

export const CityView = () => {
    const { store, actions } = useContext(Context);
    const { cityId } = useParams(); 

    useEffect(() => {
        actions.fetchCity();
    }, []);

    const city = store.cities.find(city => city.id === parseInt(cityId));

    if (!city) return <p>Loading city details...</p>;

    return (
        <div className="container cityview-container">
            <div className="city-header text-center">
                <img src={city.city_image || "https://via.placeholder.com/600"} alt={city.city_name} className="city-image mb-3" />
                <h1>{city.city_name}</h1>
                <p>{city.city_description}</p>
            </div>

            <h2 className="mt-4">Restaurantes</h2>
            <div className="row">
                {city.restaurant && city.restaurant.length > 0 ? (
                    city.restaurant.map((restaurant, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{restaurant.restaurant_name}</h5>
                                    <p className="card-text">{restaurant.restaurant_description}</p>
                                    <p className="card-text"><small className="text-muted">{restaurant.address}</small></p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No restaurants found in this city.</p>
                )}
            </div>

            <h2 className="mt-4">Hoteles</h2>
            <div className="row">
                {city.hotel && city.hotel.length > 0 ? (
                    city.hotel.map((hotel, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{hotel.hotel_name}</h5>
                                    <p className="card-text">{hotel.hotel_description}</p>
                                    <p className="card-text"><small className="text-muted">{hotel.hotel_address}</small></p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hotels found in this city.</p>
                )}
            </div>

            <h2 className="mt-4">Puntos de Interés</h2>
            <div className="row">
                {city.interest_point && city.interest_point.length > 0 ? (
                    city.interest_point.map((point, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{point.int_name}</h5>
                                    <p className="card-text">{point.int_description}</p>
                                    <p className="card-text"><small className="text-muted">{point.point_address}</small></p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No points of interest found in this city.</p>
                )}
            </div>
        </div>
    );
};
