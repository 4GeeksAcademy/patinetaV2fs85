import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/mainview.css";
import { Context } from "../store/appContext";

export const MainView = () => {
    const { store, actions } = useContext(Context);
    const [search, setSearch] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        actions.fetchCity();
        if (store.auth.isAuthenticated) {
            actions.fetchFavorites();
        }
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
        if (query.trim() === "") {
            setFilteredResults([]);
        } else {
            const results = store?.cities?.filter((city) =>
                city.city_name.toLowerCase().includes(query)
            );
            setFilteredResults(results);
        }
    };

    const handleCityClick = (cityId) => {
        navigate(`/city/${cityId}`);
        setSearch("");
        setFilteredResults([]);
    };

    const isFavorite = (cityId) => {
        return store.favorites?.cities?.some((fav) => fav.city_id === cityId);
    };

    const handleFavoriteToggle = (cityId) => {
        if (isFavorite(cityId)) {
            actions.removeFavorite("city", cityId);
        } else {
            actions.addFavorite("city", cityId);
        }
    };

    return (
        <div className="container-fluid mainview-container">
            {/* 🔍 Contenedor de la barra de búsqueda */}
            <div className="search-container">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="🔍 Buscar ciudades..."
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            {/* 📝 Lista desplegable de búsqueda */}
            {filteredResults.length > 0 && (
                <ul className="list-group search-dropdown">
                    {filteredResults.map((city) => (
                        <li
                            key={city.id}
                            className="list-group-item search-item"
                            onClick={() => handleCityClick(city.id)}
                        >
                            {city.city_name}
                        </li>
                    ))}
                </ul>
            )}

            <h2 className="text-center mb-4 mainview-title">🌍 Cities</h2>

            {/* 🏙️ Lista de ciudades */}
            <div className="row justify-content-center">
                {store?.cities?.length > 0 ? (
                    store.cities
                        .filter((city) => city.city_name.toLowerCase().includes(search))
                        .map((city) => (
                            <div key={city.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                <div className="card city-card">
                                    <img
                                        src={city.city_image || "https://via.placeholder.com/400"}
                                        className="card-img-top city-image"
                                        alt={city.city_name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{city.city_name}</h5>
                                        <p className="card-text">{city.city_description}</p>
                                        <div className="d-flex justify-content-between">
                                            <button
                                                className="btn btn-orange"
                                                onClick={() => handleCityClick(city.id)}
                                            >
                                                More Information
                                            </button>
                                            {store.auth.isAuthenticated && (
                                                <button
                                                    className={`btn ${
                                                        isFavorite(city.id)
                                                            ? "btn-success"
                                                            : "btn-outline-danger"
                                                    }`}
                                                    onClick={() => handleFavoriteToggle(city.id)}
                                                >
                                                    {isFavorite(city.id) ? "❤️ Favorito" : "🤍 Agregar"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <p className="text-center">⏳ Loading cities...</p>
                )}
            </div>
        </div>
    );
};
