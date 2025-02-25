import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/mainview.css";
import { Context } from "../store/appContext";

export const MainView = () => {
    const { store, actions } = useContext(Context);
    const [search, setSearch] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        actions.fetchCity();
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

    const handleFavorite = (city) => {
        setFavorites((prevFavorites) =>
            prevFavorites.some((fav) => fav.id === city.id)
                ? prevFavorites.filter((fav) => fav.id !== city.id)
                : [...prevFavorites, city]
        );
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="container mainview-container">
            {/* 🔎 Barra de búsqueda */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="position-relative w-50">
                    <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        placeholder="Buscar ciudades..."
                        value={search}
                        onChange={handleSearch}
                    />
                    {filteredResults.length > 0 && (
                        <ul
                            className="list-group position-absolute w-100 mt-1"
                            style={{
                                zIndex: 1000,
                                maxHeight: "200px",
                                overflowY: "auto",
                                backgroundColor: "#fff",
                            }}
                        >
                            {filteredResults.map((city) => (
                                <li
                                    key={city.id}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleCityClick(city.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {city.city_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Favoritos */}
                <div className="dropdown ml-3">
                    <button
                        className="btn btn-warning dropdown-toggle"
                        type="button"
                        onClick={toggleDropdown}
                        aria-expanded={isDropdownOpen}
                    >
                        Favoritos ({favorites.length})
                    </button>

                    {isDropdownOpen && (
                        <ul
                            className="dropdown-menu dropdown-menu-end show mt-2"
                            style={{ right: 0, left: "auto" }}
                        >
                            {favorites.length > 0 ? (
                                favorites.map((city) => (
                                    <li
                                        key={city.id}
                                        className="dropdown-item d-flex justify-content-between align-items-center"
                                    >
                                        <span
                                            onClick={() => handleCityClick(city.id)}
                                            style={{ cursor: "pointer", color: "blue" }}
                                        >
                                            {city.city_name}
                                        </span>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleFavorite(city)}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="dropdown-item text-muted">No hay favoritos aún</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>

            <h2 className="text-center mb-4 mainview-title">Cities</h2>

            {/* 🌍 Lista de ciudades */}
            <div className="row">
                {store?.cities?.length > 0 ? (
                    store.cities
                        .filter((city) => city.city_name.toLowerCase().includes(search))
                        .map((city) => (
                            <div key={city.id} className="col-md-4 mb-4">
                                <div className="card city-card">
                                    <img
                                        src={city.city_image || "https://via.placeholder.com/300"}
                                        className="card-img-top city-image"
                                        alt={city.city_name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{city.city_name}</h5>
                                        <p className="card-text">{city.city_description}</p>
                                        <div className="d-flex justify-content-between">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleCityClick(city.id)}
                                            >
                                                More Information
                                            </button>
                                            <button
                                                className={`btn ${
                                                    favorites.some((fav) => fav.id === city.id)
                                                        ? "btn-success"
                                                        : "btn-outline-danger"
                                                }`}
                                                onClick={() => handleFavorite(city)}
                                            >
                                                {favorites.some((fav) => fav.id === city.id)
                                                    ? "❤️ Favorito"
                                                    : "🤍 Agregar"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <p>Loading cities...</p>
                )}
            </div>
        </div>
    );
};
