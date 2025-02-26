import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

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

    const isFavorite = (id) => store.favorites.some(fav => fav.id === id && fav.type === "restaurant");

    return (
        <div className="container mt-4">
            <h2 className="text-center">Restaurantes</h2>
            <input 
                type="text" 
                className="form-control mb-4" 
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
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">{restaurant.restaurant_name}</h5>
                                    <p className="card-text"><strong>Dirección:</strong> {restaurant.address}</p>
                                    <p className="card-text">{restaurant.restaurant_description}</p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            <strong>Ciudad:</strong> {getCityName(restaurant.id)}
                                        </small>
                                    </p>
                                    {store.auth.isAuthenticated && (
                                        <button
                                            className={`btn ${isFavorite(restaurant.id) ? "btn-danger" : "btn-outline-primary"}`}
                                            onClick={() => 
                                                isFavorite(restaurant.id)
                                                    ? actions.removeFavorite("restaurant", restaurant.id)
                                                    : actions.addFavorite("restaurant", restaurant.id)
                                            }
                                        >
                                            {isFavorite(restaurant.id) ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default RestaurantsView;
