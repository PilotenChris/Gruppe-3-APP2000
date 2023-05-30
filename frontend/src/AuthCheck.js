import React, { createContext, useState } from "react";

const AuthCheck = createContext();

const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);

    return (
        <AuthCheck.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthCheck.Provider>
    );
};

export { AuthCheck, AuthProvider };