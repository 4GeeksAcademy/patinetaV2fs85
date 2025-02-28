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
            favorites: {
                cities: [],
                hotels: [],
                restaurants: [],
                interest_points: []
            },
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
                    const response = await fetch(process.env.BACKEND_URL+"/api/login", {
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

            logout: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user_name");
                setStore({ user: null, auth: { token: null, isAuthenticated: false } });
            },

             // SIGNUP.JS (Registro)
             signup: async (name, email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL+"/api/signup", {
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
                    const response = await fetch(process.env.BACKEND_URL+"/api/city");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ cities: data.results });
                    }
                } catch (error) {
                    console.error("Error obteniendo ciudades:", error);
                }
            },

            fetchHotel: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL+"/api/Hotel");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ hotels: data.results });
                    }
                } catch (error) {
                    console.error("Error obteniendo hoteles:", error);
                }
            },

            fetchRestaurant: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL+"/api/Restaurant");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ restaurants: data.results });
                    }
                } catch (error) {
                    console.error("Error obteniendo restaurantes:", error);
                }
            },

            fetchInterestPoint: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL+"/api/Interest_point");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ interestPoints: data.results });
                    }
                } catch (error) {
                    console.error("Error obteniendo puntos de interés:", error);
                }
            },

            fetchFavorites: async () => {
                console.log("Probando");
                
                try {
                    const store = getStore();
                    // if (!store.auth.isAuthenticated || !store.user || !store.user.id) {
                    //     console.warn("Usuario no autenticado o sin ID.");
                    //     return;
                    // }
            
                    const response = await fetch(
                        `${process.env.BACKEND_URL}/api/favorites`,
                        {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${store.auth.token}`,
                                "Content-Type": "application/json"
                            }
                        }
                    );
            
                    const data = await response.json();
                    console.log(data);
                    if (response.ok) {
            
                        
                        setStore({ favorites: data.favorites || { cities: [], hotels: [], restaurants: [], interest_points: [] } });
                    } else {
                        console.error("Error en la respuesta:", data.msg || "Sin mensaje de error");
                        setStore({ message: data.msg || "Error al cargar favoritos" });
                    }
                } catch (error) {
                    console.error("Error obteniendo favoritos:", error);
                    setStore({ message: "Error de conexión con el servidor" });
                }
            },

            addFavorite: async (category, itemId) => {
                try {
                    const store = getStore();
                    if (!store.auth.isAuthenticated || !store.user) return;

                    const categoryMap = {
                        city: "city",
                        hotel: "hotel",
                        restaurant: "restaurant",
                        interest_point: "Interest_point"
                    };

                    const url = `${process.env.BACKEND_URL}/api/favorite/${categoryMap[category]}/${itemId}`;
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${store.auth.token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ user_id: store.user.id })
                    });

                    if (response.ok) {
                        getActions().fetchFavorites(); // Actualiza la lista de favoritos
                    } else {
                        console.error("Error al agregar favorito:", await response.json());
                    }
                } catch (error) {
                    console.error("Error agregando favorito:", error);
                }
            },

            removeFavorite: async (category, itemId) => {
                try {
                    const store = getStore();
                    if (!store.auth.isAuthenticated || !store.user) return;

                    const categoryMap = {
                        city: "city",
                        hotel: "hotel",
                        restaurant: "restaurant",
                        interest_point: "interest_point"
                    };

                    const url = `${process.env.BACKEND_URL}/api/favorite/${categoryMap[category]}/${itemId}`;
                    const response = await fetch(url, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${store.auth.token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ user_id: store.user.id })
                    });

                    if (response.ok) {
                        getActions().fetchFavorites(); // Actualiza la lista de favoritos
                    } else {
                        console.error("Error al eliminar favorito:", await response.json());
                    }
                } catch (error) {
                    console.error("Error eliminando favorito:", error);
                }
            }
        }
    };
};

export default getState;
