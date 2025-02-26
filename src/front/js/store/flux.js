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
            favorites: [],
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
                        headers: { "Content-Type": "application/json" },
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
                        getActions().fetchFavorites(); 
                        return { success: true }; 
                    } else {
                        return { success: false, msg: data.msg };
                    }
                } catch (error) {
                    console.error("Error durante el login:", error);
                    return { success: false, msg: "Error de conexión con el servidor" };
                }
            },

            fetchFavorites: async () => {
                try {
                    const store = getStore();
                    if (!store.auth.isAuthenticated) return;

                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/favorites", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${store.auth.token}`,
                            "Content-Type": "application/json"
                        }
                    });
                    
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ favorites: data.results });
                    }
                } catch (error) {
                    console.error("Error obteniendo favoritos:", error);
                }
            },

            addFavorite: async (type, id) => {
                try {
                    const store = getStore();
                    if (!store.auth.isAuthenticated) return;

                    const response = await fetch(`https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/favorite/${type}/${id}`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${store.auth.token}`,
                            "Content-Type": "application/json"
                        }
                    });                     

                    if (response.ok) {
                        getActions().fetchFavorites();
                    }
                } catch (error) {
                    console.error("Error agregando a favoritos:", error);
                }
            },

            removeFavorite: async (type, id) => {
                try {
                    const store = getStore();
                    if (!store.auth.isAuthenticated) return;

                    const response = await fetch(`https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/favorite/${type}/${id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${store.auth.token}` }
                    });

                    if (response.ok) {
                        getActions().fetchFavorites(); 
                    }
                } catch (error) {
                    console.error("Error eliminando de favoritos:", error);
                }
            },


            logout: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user_name");
                setStore({ user: null, auth: { token: null, isAuthenticated: false } });
            },

             // SIGNUP.JS (Registro)
             signup: async (name, email, password) => {
                try {
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email, password })
                    });
            
                    const data = await response.json();
            
                    if (response.ok) {
                        return true;
                    } else {
                        return data.msg; 
                    }
                } catch (error) {
                    console.error("Error durante el registro:", error);
                    return "Error de conexión con el servidor"; 
                }
            },            
            

            fetchCity: async () => {
                try {
                    console.log("Ejecutando fetchCity()");
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/city"); // Verifica que coincida con la API
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
                    console.log("Ejecutando fetchHotel()");
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/Hotel");
                    const data = await response.json();
                    if (response.ok) {
                        console.log("Hoteles obtenidos:", data.results);
                        setStore({ hotels: data.results });
                    }
                } catch (error) {
                    console.error("Error obteniendo hoteles:", error);
                }
            },

            fetchRestaurant: async () => {
                try {
                    console.log("Ejecutando fetchRestaurant()");
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/Restaurant");
                    const data = await response.json();
                    if (response.ok) {
                        console.log("Restaurantes obtenidos:", data.results);
                        setStore({ restaurants: data.results });
                    }
                } catch (error) {
                    console.error("Error obteniendo restaurantes:", error);
                }
            },

            fetchInterestPoint: async () => {
                try {
                    console.log("Ejecutando fetchInterestPoint()");
                    const response = await fetch("https://cautious-succotash-4jg4p4xqvwx6cvww-3001.app.github.dev/api/Interest_point");
                    const data = await response.json();
                    if (response.ok) {
                        console.log("Puntos de interés obtenidos:", data.results);
                        setStore({ interestPoints: data.results });
                    }
                } catch (error) {
                    console.error("Error obteniendo puntos de interés:", error);
                }
            }
        }
    };
};

export default getState;
