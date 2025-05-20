// useRisque.ts
import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import Risque from "../utils/entities/Risque.ts";
import RisqueDTO from "../utils/entitiesDTO/RisqueDTO.ts";
import fetchApi, { ApiResponse } from "../api/fetchApi.ts";

type RisqueResponse = RisqueDTO | RisqueDTO[] | boolean | null;

// Function to get a risque by ID
export const getRisqueById = async (id: number): Promise<ApiResponse<RisqueDTO>> => {
    return fetchApi<RisqueDTO>(
        `api/risque/${id}`,
        "GET",
        null,
        [
            { status: 404, message: "GetRisque: Error risque not found" },
            { status: -1, message: "GetRisque: Error while getting risque" }
        ]
    );
};

// Function to get all risques
export const getAllRisques = async (): Promise<ApiResponse<RisqueDTO[]>> => {
    return fetchApi<RisqueDTO[]>(
        "api/risque",
        "GET",
        null,
        [
            { status: 404, message: "GetAllRisques: Error risques not found" },
            { status: -1, message: "GetAllRisques: Error while getting risques" }
        ]
    );
};

// Function to update a risque
export const updateRisque = async (risque: RisqueDTO, id: number): Promise<ApiResponse<RisqueDTO>> => {
    return fetchApi<RisqueDTO>(
        `api/risque/${id}`,
        "PATCH",
        risque,
        [
            { status: 409, message: "UpdateRisque: Error risque already exists" },
            { status: 404, message: "UpdateRisque: Error risque or API link not found" },
            { status: -1, message: "UpdateRisque: Error while updating risque" }
        ]
    );
};

// Function to delete a risque
export const deleteRisque = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/risque/${id}`,
        "DELETE",
        null,
        [
            { status: 409, message: "DeleteRisque: Error risque already exists" },
            { status: 404, message: "DeleteRisque: Error risque or API link not found" },
            { status: 405, message: "DeleteRisque: Error risque not deletable" },
            { status: -1, message: "DeleteRisque: Error while deleting risque" }
        ]
    );
};

// Function to create a risque
export const createRisque = async (risque: RisqueDTO): Promise<ApiResponse<RisqueDTO>> => {
    return fetchApi<RisqueDTO>(
        "api/risque",
        "POST",
        risque,
        [
            { status: 409, message: "CreateRisque: Error risque already exists" },
            { status: 404, message: "CreateRisque: Error risque or API link not found" },
            { status: -1, message: "CreateRisque: Error while creating risque" }
        ]
    );
};

// Function to create a risque
export const getRisquesByIds = async (ids:number[]): Promise<ApiResponse<RisqueDTO[]>> => {
    return fetchApi<RisqueDTO[]>(
        "api/risque/list",
        "POST",
        ids,
        [
            { status: 409, message: "CreateRisque: Error risque already exists" },
            { status: 404, message: "CreateRisque: Error risque or API link not found" },
            { status: -1, message: "CreateRisque: Error while creating risque" }
        ]
    );
};

// React hook that uses the API functions
const useRisque = () => {
    const [response, setResponse] = useState<RisqueResponse>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastId, setLastId] = useState<number | null>(null);
    const [risques, setRisques] = useState<Map<number, RisqueDTO>>(new Map<number, RisqueDTO>());

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
                setResponse(result.data as RisqueResponse);
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
    const getRisqueHook = async (id: number): Promise<RisqueDTO> => {
        return executeApiCall(
            () => getRisqueById(id),
            "Error while getting risque"
        );
    };

    const getAllRisquesHook = async (): Promise<RisqueDTO[]> => {
        return executeApiCall(
            () => getAllRisques(),
            "Error while getting all risques",
            (data: RisqueDTO[]) => {
                const updatedRisques = new Map<number, RisqueDTO>();
                data.forEach(risque => {
                    if (risque.id !== undefined) {
                        updatedRisques.set(risque.id, risque);
                    }
                });
                setRisques(updatedRisques);
            }
        );
    };

    const updateRisqueHook = async (risque: RisqueDTO, id: number): Promise<RisqueDTO> => {
        return executeApiCall(
            () => updateRisque(risque, id),
            "Error while updating risque"
        );
    };

    const deleteRisqueHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => deleteRisque(id),
            "Error while deleting risque",
            () => {
                // Remove from local state if needed
                if (risques.has(id)) {
                    const updatedRisques = new Map(risques);
                    updatedRisques.delete(id);
                    setRisques(updatedRisques);
                }
            }
        );
    };

    const createRisqueHook = async (risque: RisqueDTO): Promise<RisqueDTO> => {
        return executeApiCall(
            () => createRisque(risque),
            "Error while creating risque"
        );
    };


    const getRisquesByIdsHook = async (ids:number[]): Promise<RisqueDTO[]> => {
        return executeApiCall(
            () => getRisquesByIds(ids),
            "Error while getting all risques"/*,
            (data: RisqueDTO[]) => {
                const updatedRisques = new Map<number, RisqueDTO>();
                if(!data) return;
        
                data.forEach(risque => {
                    if (risque.id !== undefined) {
                        updatedRisques.set(risque.id, risque);
                    }
                });
                setRisques(updatedRisques);
            }*/
        );
    }

    return {
        loading,
        error,
        response,
        lastId,
        risques,
        getRisque: getRisqueHook,
        getAllRisques: getAllRisquesHook,
        updateRisque: updateRisqueHook,
        deleteRisque: deleteRisqueHook,
        createRisque: createRisqueHook,
        getRisquesByIds: getRisquesByIdsHook,
    };
};

export default useRisque;