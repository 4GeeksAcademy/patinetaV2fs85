import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Modal, Button } from "react-bootstrap";
import Logo from "../../img/PatinetaTravelLogo.png";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const isAuthenticated = store.auth?.isAuthenticated || false;
  const userName = store.user?.name || localStorage.getItem("user_name");
  const navigate = useNavigate();

  // Estado para manejar el modal de logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

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

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav mx-auto">
            <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/mainview" className="nav-link">Cities</Link>
              </li>
              <li className="nav-item">
                <Link to="/restaurants" className="nav-link">Restaurant</Link>
              </li>
              <li className="nav-item">
                <Link to="/hotels" className="nav-link">Hotel</Link>
              </li>
              <li className="nav-item">
                <Link to="/points-of-interest" className="nav-link">Interest Point</Link>
              </li>
            </ul>
          </div>

          {isAuthenticated && (
            <div className="d-flex align-items-center">
              <span className="nav-link">
                <i className="fa fa-user-circle"></i> {userName}
              </span>
              <button className="btn btn-outline-danger ms-3" onClick={() => setShowLogoutModal(true)}>
                Logout
              </button>
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
