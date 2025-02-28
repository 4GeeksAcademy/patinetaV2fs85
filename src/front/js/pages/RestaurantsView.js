import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/pagestyles.css";

const RestaurantsView = () => {
    const { store, actions } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        actions.fetchRestaurant();
        actions.fetchCity();
        if (store.auth.isAuthenticated) {
            actions.fetchFavorites();
        }
    }, [store.auth.isAuthenticated]);

    const getCityName = (restaurantId) => {
        for (const city of store.cities) {
            const foundRestaurant = city.restaurant.find(rest => rest.id === restaurantId);
            if (foundRestaurant) {
                return city.city_name;
            }
        }
        return "Sin ciudad asignada";
    };

    // const isFavorite = (id) => store.favorites.some(fav => fav.id === id && fav.type === "restaurant");

    return (
        <div className="container page-container">
            <h2 className="page-title">Restaurantes</h2>
            <input 
                type="text" 
                className="form-control mb-4 search-input"
                placeholder="Buscar por nombre, dirección o ciudad..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="row">
                {store.restaurants
                    .filter((restaurant) =>
                        restaurant.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        getCityName(restaurant.id).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((restaurant) => (
                        <div key={restaurant.id} className="col-md-4">
                            <div className="general-card mb-4">
                                <div className="general-card-body">
                                    <h5 className="general-card-title">{restaurant.restaurant_name}</h5>
                                    <p className="general-card-text"><strong>Dirección:</strong> {restaurant.address}</p>
                                    <p className="general-card-text">{restaurant.restaurant_description}</p>
                                    <p className="general-card-text">
                                        <small className="text-muted">
                                            <strong>Ciudad:</strong> {getCityName(restaurant.id)}
                                        </small>
                                    </p>
                                    {/* {store.auth.isAuthenticated && (
                                        <button
                                            className={`btn ${isFavorite(restaurant.id) ? "btn-orange" : "btn-outline-primary"}`}
                                            onClick={() => 
                                                isFavorite(restaurant.id)
                                                    ? actions.removeFavorite("restaurant", restaurant.id)
                                                    : actions.addFavorite("restaurant", restaurant.id)
                                            }
                                        >
                                            {isFavorite(restaurant.id) ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
                                        </button>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default RestaurantsView;
