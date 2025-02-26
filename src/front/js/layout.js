import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { MainView } from "./pages/MainView";
import { CityView } from "./pages/CityView";
import RestaurantsView  from "./pages/RestaurantsView";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import injectContext from "./store/appContext";
import  Navbar  from "./component/navbar";
import HotelsView from "./pages/HotelsView";
import InterestPointsView from "./pages/InterestPointsView"

//create your first component
const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Demo />} path="/demo" />
            <Route element={<MainView />} path="/mainview" />
            <Route element={<CityView />} path="/city/:cityId" />
            <Route element={<RestaurantsView />} path="/restaurants" /> 
            <Route element={<InterestPointsView />} path="/points-of-interest" /> 
            <Route element={<HotelsView />} path="/hotels" /> 
            <Route element={<Single />} path="/single/:theid" />
            <Route element={<SignUp />} path="/signup" />
            <Route element={<Login />} path="/login" />
            <Route element={<h1>Not found!</h1>} path="*" />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
