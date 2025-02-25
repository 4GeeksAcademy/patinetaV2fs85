import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import Logo from "../../img/PatinetaTravelLogo.png";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const isAuthenticated = store.auth?.isAuthenticated || false;
  const userName = store.user?.name || localStorage.getItem("user_name");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* 🔹 Logo */}
        <Link className="navbar-brand" to="/">
          <img src={Logo} alt="Patineta Travel" style={{ height: "50px" }} />
        </Link>

        {/* 🔹 Botón para colapsar menú en móvil */}
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

        {/* 🔹 Menú principal centrado */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav mx-auto"> {/* 🔥 Esto mantiene el menú siempre centrado */}
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/mainview" className="nav-link">Cities</Link>
            </li>
            <li className="nav-item">
              <Link to="/hotels" className="nav-link">Hotels</Link>
            </li>
            <li className="nav-item">
              <Link to="/restaurants" className="nav-link">Restaurants</Link>
            </li>
            <li className="nav-item">
              <Link to="/points-of-interest" className="nav-link">Points of Interest</Link>
            </li>
          </ul>
        </div>

        {/* 🔹 Sección de Logout alineada a la derecha sin afectar el menú */}
        {isAuthenticated && (
          <div className="d-flex align-items-center">
            <span className="nav-link">
              <i className="fa fa-user-circle"></i> {userName}
            </span>
            <button className="btn btn-outline-danger ms-3" onClick={actions.logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
