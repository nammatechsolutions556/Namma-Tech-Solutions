import { createContext } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    // Determine the base URL depending on the environment
    const getBaseUrl = () => {
        if (import.meta.env.VITE_API_URL) {
            return import.meta.env.VITE_API_URL;
        }
        // Dynamic fallback
        if (window.location.hostname === "localhost") {
            return "http://localhost:5000";
        }
        return "https://namma-tech-solutions.onrender.com";
    };

    const rawUrl = getBaseUrl();
    const url = rawUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

    const contextValue = {
        url
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
