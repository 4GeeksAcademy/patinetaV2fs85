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
            <div className="city-header">
                <img src={city.image} alt={city.name} className="city-image" />
                <h1>{city.name}</h1>
                <p>{city.description}</p>
            </div>
            {/* Restaurantes */}
            <h2>Restaurants</h2>
            <div className="row">
                {store.restaurants.length > 0 ? (
                    store.restaurants.map((restaurant, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{restaurant.name}</h5>
                                    <p className="card-text">{restaurant.description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading restaurants...</p>
                )}
            </div>
            {/* Hoteles */}
            <h2>Hotels</h2>
            <div className="row">
                {store.hotels.length > 0 ? (
                    store.hotels.map((hotel, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{hotel.name}</h5>
                                    <p className="card-text">{hotel.description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading hotels...</p>
                )}
            </div>
            {/* Puntos de Interés */}
            <h2>Points of Interest</h2>
            <div className="row">
                {store.interestPoints.length > 0 ? (
                    store.interestPoints.map((point, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{point.name}</h5>
                                    <p className="card-text">{point.description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading points of interest...</p>
                )}
            </div>
        </div>
    );
};