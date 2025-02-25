const getState = ({ getStore, getActions, setStore }) => { 
    return {
        store: {
            user: null,
            auth: {
                token: localStorage.getItem("token") || null,
                isAuthenticated: !!localStorage.getItem("token")
            },
            message: null, 
            cities: [],
            hotels: [],
            restaurants: [],
            interestPoints: [],
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ]
        },
        actions: {
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getMessage: async () => {
                try {
                    const resp = await fetch(`https://jsonplaceholder.typicode.com/posts`);
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },
            // LOGIN.JS

            login: async (email, password) => {
                try {
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        localStorage.setItem("token", data.access_token);
                        localStorage.setItem("user_name", data.user_name);
                        setStore({ 
                            user: { id: data.user_id, name: data.user_name }, 
                            auth: { token: data.access_token, isAuthenticated: true } 
                        });
                        alert("Login exitoso");
                        return true;
                    } else {
                        alert(`Error: ${data.msg}`);
                        return false;
                    }
                } catch (error) {
                    console.error("Error durante el login:", error);
                    alert("Algo salió mal, por favor intenta de nuevo.");
                    return false;
                }
            },

            logout: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user_name");
                setStore({ user: null, auth: { token: null, isAuthenticated: false } });
                alert("Sesión cerrada");
            },

             // SIGNUP.JS (Registro)
             signup: async (name, email, password) => {
                try {
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/signup", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ name, email, password })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        alert("Cuenta creada exitosamente!");
                        return true;
                    } else {
                        alert(`Error: ${data.msg}`);
                        return false;
                    }
                } catch (error) {
                    console.error("Error durante el registro:", error);
                    alert(" Algo salió mal, por favor intenta de nuevo.");
                    return false;
                }
            },
            

            fetchCity: async () => {
                try {
                    console.log("Ejecutando fetchCity()");
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/city");
                    const data = await response.json();
                    
                    if (response.ok) {
                        console.log("Ciudades obtenidas:", data.results);
                        setStore({ cities: data.results });
                    }
                } catch (error) {
                    console.error("Error obteniendo ciudades:", error);
                }
            },
            

            fetchHotel: async () => {
                try {
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/hotel");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ hotels: data });
                    }
                } catch (error) {
                    console.error("Error obteniendo hoteles:", error);
                }
            },

            fetchRestaurant: async () => {
                try {
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/restaurant");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ restaurants: data });
                    }
                } catch (error) {
                    console.error("Error obteniendo restaurantes:", error);
                }
            },

            fetchInterestPoint: async () => {
                try {
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/interest_point");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ interestPoints: data });
                    }
                } catch (error) {
                    console.error("Error obteniendo puntos de interés:", error);
                }
            }
        }
    };
};

export default getState;
