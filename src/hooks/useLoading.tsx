import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";

// Context type
interface LoadingContextType {
    showLoading: () => void;
    hideLoading: () => void;
}

// Create context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Provider component
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}
            {/* Global Loading Modal */}
            <Modal open={loading} aria-labelledby="loading-modal">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <CircularProgress color="primary" />
                </Box>
            </Modal>
        </LoadingContext.Provider>
    );
};

// Hook to use loading
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
