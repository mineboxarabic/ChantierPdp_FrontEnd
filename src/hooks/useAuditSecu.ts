// useAuditSecu.ts
import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { AuditSecuDTO } from "../utils/entitiesDTO/AuditSecuDTO.ts";
import fetchApi, { ApiResponse } from "../api/fetchApi.ts";

type AuditSecuResponse = AuditSecuDTO | AuditSecuDTO[] | boolean | null;

// Function to get an audit secu by ID
export const getAuditSecuById = async (id: number): Promise<ApiResponse<AuditSecuDTO>> => {
    return fetchApi<AuditSecuDTO>(
        `api/auditsecu/${id}`,
        "GET",
        null,
        [
            { status: 404, message: "GetAuditSecu: Error audit secu not found" },
            { status: -1, message: "GetAuditSecu: Error while getting audit secu" }
        ]
    );
};

// Function to get all audit secus
export const getAllAuditSecus = async (): Promise<ApiResponse<AuditSecuDTO[]>> => {
    return fetchApi<AuditSecuDTO[]>(
        "api/auditsecu",
        "GET",
        null,
        [
            { status: 404, message: "GetAllAuditSecus: Error audit secus not found" },
            { status: -1, message: "GetAllAuditSecus: Error while getting audit secus" }
        ]
    );
};

// Function to get audit secus by type
export const getAuditSecusByType = async (typeOfAudit: string): Promise<ApiResponse<AuditSecuDTO[]>> => {
    return fetchApi<AuditSecuDTO[]>(
        `api/auditsecu/type/${typeOfAudit}`,
        "GET",
        null,
        [
            { status: 404, message: "GetAuditSecusByType: Error audit secus not found" },
            { status: -1, message: "GetAuditSecusByType: Error while getting audit secus by type" }
        ]
    );
};

// Function to update an audit secu
export const updateAuditSecu = async (auditSecu: AuditSecuDTO, id: number): Promise<ApiResponse<AuditSecuDTO>> => {
    return fetchApi<AuditSecuDTO>(
        `api/auditsecu/${id}`,
        "PATCH",
        auditSecu,
        [
            { status: 409, message: "UpdateAuditSecu: Error audit secu already exists" },
            { status: 404, message: "UpdateAuditSecu: Error audit secu or api link not found" },
            { status: -1, message: "UpdateAuditSecu: Error while updating audit secu" }
        ]
    );
};

// Function to delete an audit secu
export const deleteAuditSecu = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/auditsecu/${id}`,
        "DELETE",
        null,
        [
            { status: 409, message: "DeleteAuditSecu: Error audit secu already exists" },
            { status: 404, message: "DeleteAuditSecu: Error audit secu or api link not found" },
            { status: 405, message: "DeleteAuditSecu: Error audit secu not deletable" },
            { status: -1, message: "DeleteAuditSecu: Error while deleting audit secu" }
        ]
    );
};

// Function to create an audit secu
export const createAuditSecu = async (auditSecu: AuditSecuDTO): Promise<ApiResponse<AuditSecuDTO>> => {
    return fetchApi<AuditSecuDTO>(
        "api/auditsecu",
        "POST",
        auditSecu,
        [
            { status: 409, message: "CreateAuditSecu: Error audit secu already exists" },
            { status: 404, message: "CreateAuditSecu: Error audit secu or api link not found" },
            { status: -1, message: "CreateAuditSecu: Error while creating audit secu" }
        ]
    );
};

// React hook that uses the API functions
const useAuditSecu = () => {
    const [response, setResponse] = useState<AuditSecuResponse>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [auditSecus, setAuditSecus] = useState<Map<number, AuditSecuDTO>>(new Map<number, AuditSecuDTO>());

    const notifications = useNotifications();

    // Helper function for handling API calls
    const executeApiCall = async <T>(
        apiCall: () => Promise<ApiResponse<T>>,
        errorMessage: string,
        successAction?: (data: T) => void
    ): Promise<T> => {
        setLoading(true);
        try {
            const result = await apiCall();
            if (result.data !== undefined) {
                setResponse(result.data as AuditSecuResponse);
                if (successAction) {
                    successAction(result.data);
                }
                return result.data;
            }
            throw new Error(result.message || errorMessage);
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    // Hook methods that wrap the API functions
    const getAuditSecuHook = async (id: number): Promise<AuditSecuDTO> => {
        return executeApiCall(
            () => getAuditSecuById(id),
            "Error while getting audit secu"
        );
    };

    const getAllAuditSecusHook = async (): Promise<AuditSecuDTO[]> => {
        return executeApiCall(
            () => getAllAuditSecus(),
            "Error while getting all audit secus",
            (data: AuditSecuDTO[]) => {
                const updatedAuditSecus = new Map<number, AuditSecuDTO>();
                data.forEach(auditSecu => {
                    if (auditSecu.id !== undefined) {
                        updatedAuditSecus.set(auditSecu.id, auditSecu);
                    }
                });
                setAuditSecus(updatedAuditSecus);
            }
        );
    };

    const getAuditSecusByTypeHook = async (typeOfAudit: string): Promise<AuditSecuDTO[]> => {
        return executeApiCall(
            () => getAuditSecusByType(typeOfAudit),
            "Error while getting audit secus by type"
        );
    };

    const updateAuditSecuHook = async (auditSecu: AuditSecuDTO, id: number): Promise<AuditSecuDTO> => {
        return executeApiCall(
            () => updateAuditSecu(auditSecu, id),
            "Error while updating audit secu"
        );
    };

    const deleteAuditSecuHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => deleteAuditSecu(id),
            "Error while deleting audit secu",
            () => {
                // Remove from local state if needed
                if (auditSecus.has(id)) {
                    const updatedAuditSecus = new Map(auditSecus);
                    updatedAuditSecus.delete(id);
                    setAuditSecus(updatedAuditSecus);
                }
            }
        );
    };

    const createAuditSecuHook = async (auditSecu: AuditSecuDTO): Promise<AuditSecuDTO> => {
        return executeApiCall(
            () => createAuditSecu(auditSecu),
            "Error while creating audit secu"
        );
    };

    return {
        loading,
        error,
        response,
        auditSecus,
        getAuditSecu: getAuditSecuHook,
        getAllAuditSecus: getAllAuditSecusHook,
        getAuditSecusByType: getAuditSecusByTypeHook,
        updateAuditSecu: updateAuditSecuHook,
        deleteAuditSecu: deleteAuditSecuHook,
        createAuditSecu: createAuditSecuHook
    };
};

export default useAuditSecu;