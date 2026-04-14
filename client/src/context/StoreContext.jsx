import { createContext } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    // Determine the base URL depending on the environment
    const rawUrl = import.meta.env.VITE_API_URL || "https://namma-tech-solutions.onrender.com";
    // Ensure it ends with /api if not already present, then ensure a trailing slash
    // However, the client calls manually append /api, so we just want the base host here.
    // To be safe and consistent with current client code, we ensure NO trailing slash and NO /api here,
    // as components expect `${url}/api/...`
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
