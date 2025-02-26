import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const InterestPointsView = () => {
    const { store, actions } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        actions.fetchInterestPoint();
        actions.fetchCity();
    }, []);

    const getCityName = (pointId) => {
        for (const city of store.cities) {
            const foundPoint = city.interest_point.find(int => int.id === pointId);
            if (foundPoint) {
                return city.city_name;
            }
        }
        return "Sin ciudad asignada";
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Puntos de Interés</h2>
            <input 
                type="text" 
                className="form-control mb-4" 
                placeholder="Buscar por nombre, dirección o ciudad..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="row">
                {store.interestPoints
                    .filter((point) =>
                        point.int_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        point.int_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        getCityName(point.id).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((point) => (
                        <div key={point.id} className="col-md-4">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">{point.int_name}</h5>
                                    <p className="card-text">{point.point_address !== "-" ? point.point_address : ""}</p>
                                    <p className="card-text">{point.int_description}</p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            <strong>Ciudad:</strong> {getCityName(point.id)}
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default InterestPointsView;
