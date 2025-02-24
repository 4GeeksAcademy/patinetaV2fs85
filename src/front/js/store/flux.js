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

            fetchCity: async () => {
                try {
                    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ cities: data });
                    }
                } catch (error) {
                    console.error("Error obteniendo ciudades:", error);
                }
            },

            fetchHotel: async () => {
                try {
                    const response = await fetch("https://jsonplaceholder.typicode.com/users");
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
                    const response = await fetch("https://jsonplaceholder.typicode.com/users");
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
                    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
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
