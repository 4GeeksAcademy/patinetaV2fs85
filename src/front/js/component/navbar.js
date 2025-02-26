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
        if (isAuthenticated) actions.fetchFavorites();
    }, [isAuthenticated]);

    const handleLogout = () => {
        actions.logout();
        setLogoutMessage("Sesión cerrada correctamente.");
        setTimeout(() => {
            setShowLogoutModal(false);
            navigate("/");
        }, 2000);
    };

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
                                        Favoritos ({store.favorites.length})
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {store.favorites.length > 0 ? (
                                            store.favorites.map((fav, index) => (
                                                <Dropdown.Item key={index} className="d-flex justify-content-between align-items-center">
                                                    <span>{fav.name}</span>
                                                    <button className="btn btn-danger btn-sm" onClick={() => actions.removeFavorite(fav.type, fav.id)}>❌</button>
                                                </Dropdown.Item>
                                            ))
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
