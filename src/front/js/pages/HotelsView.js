import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/pagestyles.css";

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
        if (!store.cities) return "Sin ciudad asignada"; 
        for (const city of store.cities) {
            const foundHotel = city.hotel?.find(h => h.id === hotelId);
            if (foundHotel) {
                return city.city_name;
            }
        }
        return "Sin ciudad asignada";
    };

    // const isFavorite = (id) => store.favorites.hotels.some(fav => fav.id === id && fav.type === "hotel");

    return (
        <div className="container page-container">
            <h2 className="page-title">Hoteles</h2>

            <div className="search-container">
                <input 
                    type="text" 
                    className="form-control search-input" 
                    placeholder="Buscar por nombre, dirección o ciudad..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="row">
                {store.hotels
                    .filter(hotel => 
                        hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        hotel.hotel_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        getCityName(hotel.id).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((hotel) => (
                        <div key={hotel.id} className="col-md-4">
                            <div className="general-card mb-4">
                                <div className="general-card-body">
                                    <h5 className="general-card-title">{hotel.hotel_name}</h5>
                                    <p className="general-card-text">{hotel.hotel_description}</p>
                                    <p className="general-card-text"><strong>Dirección:</strong> {hotel.hotel_address}</p>
                                    <p className="general-card-text">
                                        <small className="text-muted"><strong>Ciudad:</strong> {getCityName(hotel.id)}</small>
                                    </p>
                                    {/* {store.auth.isAuthenticated && (
                                        <button
                                            className={`btn ${isFavorite(hotel.id) ? "btn-orange" : "btn-outline-primary"}`}
                                            onClick={() => 
                                                isFavorite(hotel.id)
                                                    ? actions.removeFavorite("hotel", hotel.id)
                                                    : actions.addFavorite("hotel", hotel.id)
                                            }
                                        >
                                            {isFavorite(hotel.id) ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
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

export default HotelsView;
