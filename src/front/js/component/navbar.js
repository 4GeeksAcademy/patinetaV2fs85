import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Dropdown, Modal, Button, Navbar as BootstrapNavbar, Nav } from "react-bootstrap";
import Logo from "../../img/PatinetaTravelLogo.png";
import "../../styles/Navbar.css";

const Navbar = () => {
    const { store, actions } = useContext(Context);
    const isAuthenticated = store.auth?.isAuthenticated || false;
    const userName = store.user?.name || localStorage.getItem("user_name");
    const navigate = useNavigate();
    
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState("");

 
    useEffect(() => {
        if(isAuthenticated){
            actions.fetchFavorites();
        }
    }, [isAuthenticated]);


    const handleLogout = () => {
        actions.logout();
        setLogoutMessage("Sesión cerrada correctamente.");
        setTimeout(() => {
            setShowLogoutModal(false);
            navigate("/");
        }, 2000);
    };

    const totalFavorites = (
        (store.favorites.cities?.length || 0) +
        (store.favorites.hotels?.length || 0) +
        (store.favorites.restaurants?.length || 0) +
        (store.favorites.interest_points?.length || 0)
    );

    return (
        <>
            <BootstrapNavbar expand="lg" className="custom-navbar">
                <div className="container">
                    <BootstrapNavbar.Brand as={Link} to="/">
                        <img src={Logo} alt="Patineta Travel" style={{ height: "50px" }} />
                    </BootstrapNavbar.Brand>

                    <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

                    <BootstrapNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/mainview">Cities</Nav.Link>
                            <Nav.Link as={Link} to="/restaurants">Restaurants</Nav.Link>
                            <Nav.Link as={Link} to="/hotels">Hotels</Nav.Link>
                            <Nav.Link as={Link} to="/points-of-interest">Interest Points</Nav.Link>
                        </Nav>

                        {isAuthenticated && (
                            <div className="d-flex align-items-center">
                                <Dropdown>
                                    <Dropdown.Toggle variant="warning">
                                        Favoritos ({totalFavorites})
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                    {store.favorites && Object.keys(store.favorites).length ? (
                                            <>
                                                {/* Ciudades */}
                                                {store.favorites.cities.length>0?store.favorites.cities?.map((fav) => (
                                                    <Dropdown.Item key={`city-${fav.id}`} className="d-flex justify-content-between align-items-center">
                                                        <span>{fav.city_id} {fav.city_name}</span>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => actions.removeFavorite("city", fav.id)}
                                                        >
                                                            ❌
                                                        </button>
                                                    </Dropdown.Item>
                                                )):null}
                                                {/* Hoteles */}
                                                {store.favorites.hotels.length>0?store.favorites.hotels?.map((fav) => (
                                                    <Dropdown.Item key={`hotel-${fav.id}`} className="d-flex justify-content-between align-items-center">
                                                        <span>{fav.favorites_hotel_id} {fav.hotel_name}</span>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => actions.removeFavorite("hotel", fav.id)}
                                                        >
                                                            ❌
                                                        </button>
                                                    </Dropdown.Item>
                                                )):null}
                                                {/* Restaurantes */}
                                                {store.favorites.restaurants.length>0?store.favorites.restaurants?.map((fav) => (
                                                    <Dropdown.Item key={`restaurant-${fav.id}`} className="d-flex justify-content-between align-items-center">
                                                        <span>{fav.restaurant_id} {fav.restaurant_name}</span>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => actions.removeFavorite("restaurant", fav.id)}
                                                        >
                                                            ❌
                                                        </button>
                                                    </Dropdown.Item>
                                                )):null}
                                                {/* Puntos de Interés */}
                                                {store.favorites.interest_points.length>0?store.favorites.interest_points?.map((fav) => (
                                                    <Dropdown.Item key={`interest-${fav.id}`} className="d-flex justify-content-between align-items-center">
                                                        <span>{fav.interest_point_id} {fav.interest_point_name}</span>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => actions.removeFavorite("interest_point", fav.id)}
                                                        >
                                                            ❌
                                                        </button>
                                                    </Dropdown.Item>
                                                )):null}
                                            </>
                                        ) : (
                                            <Dropdown.Item className="text-muted">No hay favoritos</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <span className="nav-link ms-3"><i className="fa fa-user-circle"></i> {userName}</span>
                                <button className="btn btn-outline-danger ms-3" onClick={() => setShowLogoutModal(true)}>Logout</button>
                            </div>
                        )}
                    </BootstrapNavbar.Collapse>
                </div>
            </BootstrapNavbar>

            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{logoutMessage ? "Sesión Cerrada" : "¿Cerrar Sesión?"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {logoutMessage ? (
                        <p className="text-success">{logoutMessage}</p>
                    ) : (
                        <p>¿Estás seguro de que deseas cerrar sesión?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {!logoutMessage ? (
                        <>
                            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>Cancelar</Button>
                            <Button variant="danger" onClick={handleLogout}>Cerrar Sesión</Button>
                        </>
                    ) : (
                        <Button variant="primary" onClick={() => setShowLogoutModal(false)}>OK</Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Navbar;