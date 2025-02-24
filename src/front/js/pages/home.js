import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Carousel } from "react-bootstrap";

// Importación de imágenes
import PatinetaTravelImag1 from "../../img/1.jpg";
import PatinetaTravelImag2 from "../../img/2.jpg";
import PatinetaTravelImag3 from "../../img/3.jpg";
import PatinetaTravelImag4 from "../../img/4.jpg";
import PatinetaTravelImag5 from "../../img/5.jpg";

// Importación de iconos
import LoginLogo from "../../img/Login.jpg";
import SignInLogo from "../../img/SignIn.jpg";
import CitiesLogo from "../../img/cities.jpg";
import HotelLogo from "../../img/hotel.jpg";
import RestaurantsLogo from "../../img/restaurants.jpg";
import InterestPointLogo from "../../img/InterestPoint.jpg";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(null);

    const handleLoadData = async (type) => {
        if (view === type) {
            setView(null);
            return;
        }
        setLoading(true);
        setView(type);
        if (type === "cities") await actions.fetchCity();
        if (type === "hotels") await actions.fetchHotel();
        if (type === "restaurants") await actions.fetchRestaurant();
        if (type === "interestPoints") await actions.fetchInterestPoint();
        setLoading(false);
    };

    return (
        <div className="container-fluid text-center home-container">
            <Carousel interval={4000} controls={false} indicators={false} pause="hover">
                <Carousel.Item>
                    <img className="d-block w-100 home-image" src={PatinetaTravelImag1} alt="Slide 1" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100 home-image" src={PatinetaTravelImag2} alt="Slide 2" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100 home-image" src={PatinetaTravelImag3} alt="Slide 3" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100 home-image" src={PatinetaTravelImag4} alt="Slide 4" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100 home-image" src={PatinetaTravelImag5} alt="Slide 5" />
                </Carousel.Item>
            </Carousel>

            <p className="lead">Search, find and enjoy...</p>

            {/* Botones de Log In y Sign In */}
            <div className="d-flex justify-content-center my-4">
                <Button style={{ backgroundColor: "#4db6ac", color: "black", border: "2px solid black" }} className="mx-2 login-btn" onClick={() => navigate("/login")}>
                    <img src={LoginLogo} alt="Log In" style={{ width: "120px", height: "120px", marginRight: "8px" }} />
                    Log In
                </Button>
                <Button style={{ backgroundColor: "#ff8a80", color: "black", border: "2px solid black" }} className="mx-2 signin-btn" onClick={() => navigate("/signup")}>
                    <img src={SignInLogo} alt="Sign In" style={{ width: "120px", height: "120px", marginRight: "8px" }} />
                    Sign In
                </Button>
            </div>

            {/* Sección de categorías con carga dinámica */}
            <div className="categories">
                <button className="category-button" onClick={() => handleLoadData("cities")}> 
                    <img src={CitiesLogo} alt="Cities" className="icon" />
                    <p>Cities</p>
                </button>
                <button className="category-button" onClick={() => handleLoadData("restaurants")}> 
                    <img src={RestaurantsLogo} alt="Restaurants" className="icon" />
                    <p>Restaurant</p>
                </button>
                <button className="category-button" onClick={() => handleLoadData("hotels")}> 
                    <img src={HotelLogo} alt="Hotel" className="icon" />
                    <p>Hotel</p>
                </button>
                <button className="category-button" onClick={() => handleLoadData("interestPoints")}> 
                    <img src={InterestPointLogo} alt="Interest Point" className="icon" />
                    <p>Interest Point</p>
                </button>
            </div>

            {/* Mostrar información al hacer clic */}
            <div className="data-container">
                {loading && <p>Cargando datos...</p>}
                {view === "cities" && store.cities && store.cities.length > 0 && store.cities.map((city, index) => (
                    <div key={index} className="data-item">
                        <h5>{city.title}</h5>
                        <p>{city.body}</p>
                    </div>
                ))}
                {view === "restaurants" && store.restaurants && store.restaurants.length > 0 && store.restaurants.map((restaurant, index) => (
                    <div key={index} className="data-item">
                        <h5>{restaurant.name}</h5>
                        <p>{restaurant.description}</p>
                    </div>
                ))}
                {view === "hotels" && store.hotels && store.hotels.length > 0 && store.hotels.map((hotel, index) => (
                    <div key={index} className="data-item">
                        <h5>{hotel.name}</h5>
                        <p>{hotel.email}</p>
                    </div>
                ))}
                {view === "interestPoints" && store.interestPoints && store.interestPoints.length > 0 && store.interestPoints.map((point, index) => (
                    <div key={index} className="data-item">
                        <h5>{point.title}</h5>
                        <p>{point.completed ? "Completado" : "Pendiente"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
