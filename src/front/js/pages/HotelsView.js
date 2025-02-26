import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const HotelsView = () => {
    const { store, actions } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        actions.fetchHotel();
        actions.fetchCity();
        if (store.auth.isAuthenticated) {
            actions.fetchFavorites();
        }
    }, [store.auth.isAuthenticated]);

    const getCityName = (hotelId) => {
        for (const city of store.cities) {
            const foundHotel = city.hotel.find(h => h.id === hotelId);
            if (foundHotel) {
                return city.city_name;
            }
        }
        return "Sin ciudad asignada";
    };

    const isFavorite = (id) => store.favorites.some(fav => fav.id === id && fav.type === "hotel");

    return (
        <div className="container mt-4">
            <h2 className="text-center">Hoteles</h2>
            <input 
                type="text" 
                className="form-control mb-4" 
                placeholder="Buscar por nombre, dirección o ciudad..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="row">
                {store.hotels
                    .filter(hotel => 
                        hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        hotel.hotel_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        getCityName(hotel.id).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((hotel) => (
                        <div key={hotel.id} className="col-md-4">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">{hotel.hotel_name}</h5>
                                    <p className="card-text">{hotel.hotel_description}</p>
                                    <p className="card-text"><strong>Dirección:</strong> {hotel.hotel_address}</p>
                                    <p className="card-text">
                                        <small className="text-muted"><strong>Ciudad:</strong> {getCityName(hotel.id)}</small>
                                    </p>
                                    {store.auth.isAuthenticated && (
                                        <button
                                            className={`btn ${isFavorite(hotel.id) ? "btn-danger" : "btn-outline-primary"}`}
                                            onClick={() => 
                                                isFavorite(hotel.id)
                                                    ? actions.removeFavorite("hotel", hotel.id)
                                                    : actions.addFavorite("hotel", hotel.id)
                                            }
                                        >
                                            {isFavorite(hotel.id) ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
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

export default HotelsView;
