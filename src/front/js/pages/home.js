import React, { useContext } from "react";
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
    
    const isAuthenticated = store.auth?.isAuthenticated || false;

    const handleNavigation = (type) => {
        switch (type) {
            case "cities":
                actions.fetchCity();
                navigate("/mainview");
                break;
            case "restaurants":
                actions.fetchRestaurant();
                navigate("/restaurants");
                break;
            case "hotels":
                actions.fetchHotel();
                navigate("/hotels");
                break;
            case "interestPoints":
                actions.fetchInterestPoint();
                navigate("/points-of-interest");
                break;
            default:
                break;
        }
    };

    return (
        <div className="container-fluid text-center home-container">

            {!isAuthenticated && (
                <div className="d-flex justify-content-center my-4">
                    <Button className="mx-2 login-btn" onClick={() => navigate("/login")}>
                        <img src={LoginLogo} alt="Log In" style={{ width: "120px", height: "120px" }} />
                        Log In
                    </Button>
                    <Button className="mx-2 signin-btn" onClick={() => navigate("/signup")}>
                        <img src={SignInLogo} alt="Sign In" style={{ width: "120px", height: "120px" }} />
                        Sign In
                    </Button>
                </div>
            )}

            <Carousel interval={3000} controls={false} indicators={false} pause="hover">
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

            <div className="categories">
                <button className="category-button" onClick={() => handleNavigation("cities")}>
                    <img src={CitiesLogo} alt="Cities" className="icon" />
                    <p>Cities</p>
                </button>
                <button className="category-button" onClick={() => handleNavigation("restaurants")}>
                    <img src={RestaurantsLogo} alt="Restaurants" className="icon" />
                    <p>Restaurants</p>
                </button>
                <button className="category-button" onClick={() => handleNavigation("hotels")}>
                    <img src={HotelLogo} alt="Hotels" className="icon" />
                    <p>Hotels</p>
                </button>
                <button className="category-button" onClick={() => handleNavigation("interestPoints")}>
                    <img src={InterestPointLogo} alt="Interest Points" className="icon" />
                    <p>Interest Points</p>
                </button>
            </div>
        </div>
    );
};
