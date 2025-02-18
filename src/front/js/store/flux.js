const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {

            user: null,

            auth: {
                token: localStorage.getItem("token") || null,
                isAuthenticated: !!localStorage.getItem("token")
            },
            message: null, 
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
            // Use getActions to call a function within a function
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getMessage: async () => {
                try {
                    // fetching data from the backend
                    const resp = await fetch(`https://silver-adventure-jj46p6xr744rfq5jw-3001.app.github.dev/api/hello`);
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            },

            // LOGIN.JS

            login: async (email, password) => {
                try {
                    const response = await fetch("https://silver-adventure-jj46p6xr744rfq5jw-3001.app.github.dev/api/login", {
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
                    const response = await fetch("https://silver-adventure-jj46p6xr744rfq5jw-3001.app.github.dev/api/signup", {  
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
            }
        }
    };
};

export default getState;
