import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Dropdown, Modal, Button } from "react-bootstrap";
import Logo from "../../img/PatinetaTravelLogo.png";

export const Navbar = () => {
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
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src={Logo} alt="Patineta Travel" style={{ height: "50px" }} />
                    </Link>
                    <div className="collapse navbar-collapse justify-content-center">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
                            <li className="nav-item"><Link to="/mainview" className="nav-link">Cities</Link></li>
                            <li className="nav-item"><Link to="/restaurants" className="nav-link">Restaurant</Link></li>
                            <li className="nav-item"><Link to="/hotels" className="nav-link">Hotel</Link></li>
                            <li className="nav-item"><Link to="/points-of-interest" className="nav-link">Interest Point</Link></li>
                        </ul>
                    </div>

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
                </div>
            </nav>

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
