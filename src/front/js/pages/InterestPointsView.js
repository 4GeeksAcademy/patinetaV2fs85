import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/pagestyles.css";

const InterestPointsView = () => {
    const { store, actions } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        actions.fetchInterestPoint();
        actions.fetchCity();
        if (store.auth.isAuthenticated) {
            actions.fetchFavorites();
        }
    }, [store.auth.isAuthenticated]);

    const getCityName = (pointId) => {
        for (const city of store.cities) {
            const foundPoint = city.interest_point.find(int => int.id === pointId);
            if (foundPoint) {
                return city.city_name;
            }
        }
        return "Sin ciudad asignada";
    };

    // const isFavorite = (id) => store.favorites.some(fav => fav.id === id && fav.type === "interest_point");

    return (
        <div className="container page-container">
            <h2 className="page-title">Puntos de Interés</h2>
            <input 
                type="text" 
                className="form-control mb-4 search-input" 
                placeholder="Buscar por nombre, dirección o ciudad..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="row">
                {store.interestPoints
                    .filter((point) =>
                        point.int_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        point.int_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        getCityName(point.id).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((point) => (
                        <div key={point.id} className="col-md-4">
                            <div className="general-card mb-4">
                                <div className="general-card-body">
                                    <h5 className="general-card-title">{point.int_name}</h5>
                                    <p className="general-card-text">
                                        <strong>Dirección:</strong> {point.point_address !== "-" ? point.point_address : "No disponible"}
                                    </p>
                                    <p className="general-card-text">{point.int_description}</p>
                                    <p className="general-card-text">
                                        <small className="text-muted">
                                            <strong>Ciudad:</strong> {getCityName(point.id)}
                                        </small>
                                    </p>
                                    {/* {store.auth.isAuthenticated && (
                                        <button
                                            className={`btn ${isFavorite(point.id) ? "btn-orange" : "btn-outline-primary"}`}
                                            onClick={() => 
                                                isFavorite(point.id)
                                                    ? actions.removeFavorite("interest_point", point.id)
                                                    : actions.addFavorite("interest_point", point.id)
                                            }
                                        >
                                            {isFavorite(point.id) ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
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

export default InterestPointsView;
