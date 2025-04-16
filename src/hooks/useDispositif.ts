// useDispositif.ts
import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import Dispositif from "../utils/entities/Dispositif.ts";
import DispositifDTO from "../utils/entitiesDTO/DispositifDTO.ts";
import fetchApi, { ApiResponse } from "../api/fetchApi.ts";

type DispositifResponse =  DispositifDTO | DispositifDTO[] | boolean | null;

// Function to get a dispositif by ID
export const getDispositifById = async (id: number): Promise<ApiResponse<DispositifDTO>> => {
    return fetchApi<DispositifDTO>(
        `api/dispositif/${id}`,
        "GET",
        null,
        [
            { status: 404, message: "GetDispositif: Error dispositif not found" },
            { status: -1, message: "GetDispositif: Error while getting dispositif" }
        ]
    );
};

// Function to get all dispositifs
export const getAllDispositifs = async (): Promise<ApiResponse<DispositifDTO[]>> => {
    return fetchApi<DispositifDTO[]>(
        "api/dispositif",
        "GET",
        null,
        [
            { status: 404, message: "GetAllDispositifs: Error dispositif not found" },
            { status: -1, message: "GetAllDispositifs: Error while getting dispositif" }
        ]
    );
};

// Function to update a dispositif
export const updateDispositif = async (dispositif: DispositifDTO, id: number): Promise<ApiResponse<DispositifDTO>> => {
    return fetchApi<DispositifDTO>(
        `api/dispositif/${id}`,
        "PATCH",
        dispositif,
        [
            { status: 409, message: "UpdateDispositif: Error dispositif already exists" },
            { status: 404, message: "UpdateDispositif: Error dispositif or API link not found" },
            { status: -1, message: "UpdateDispositif: Error while updating dispositif" }
        ]
    );
};

// Function to delete a dispositif
export const deleteDispositif = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/dispositif/${id}`,
        "DELETE",
        null,
        [
            { status: 409, message: "DeleteDispositif: Error dispositif already exists" },
            { status: 404, message: "DeleteDispositif: Error dispositif or API link not found" },
            { status: 405, message: "DeleteDispositif: Error dispositif not deletable" },
            { status: -1, message: "DeleteDispositif: Error while deleting dispositif" }
        ]
    );
};

// Function to create a dispositif
export const createDispositif = async (dispositif: DispositifDTO): Promise<ApiResponse<DispositifDTO>> => {
    return fetchApi<DispositifDTO>(
        "api/dispositif",
        "POST",
        dispositif,
        [
            { status: 409, message: "CreateDispositif: Error dispositif already exists" },
            { status: 404, message: "CreateDispositif: Error dispositif or API link not found" },
            { status: -1, message: "CreateDispositif: Error while creating dispositif" }
        ]
    );
};

// Function to create a dispositif
export const getDispositifsByIds = async (ids:number[]): Promise<ApiResponse<DispositifDTO[]>> => {
    return fetchApi<DispositifDTO[]>(
        "api/dispositif/list",
        "POST",
        ids,
        [
            { status: 409, message: "Create Dispositif: Error dispositif already exists" },
            { status: 404, message: "Create Dispositif: Error dispositif or API link not found" },
            { status: -1, message: "Create Dispositif: Error while creating dispositif" }
        ]
    );
};


// React hook that uses the API functions
const useDispositif = () => {
    const [response, setResponse] = useState<DispositifResponse>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastId, setLastId] = useState<number | null>(null);
    const [dispositifs, setDispositifs] = useState<Map<number, DispositifDTO>>(new Map<number, DispositifDTO>());

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
                setResponse(result.data as DispositifResponse);
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
    const getDispositifHook = async (id: number): Promise<DispositifDTO> => {
        return executeApiCall(
            () => getDispositifById(id),
            "Error while getting dispositif"
        );
    };

    const getAllDispositifsHook = async (): Promise<DispositifDTO[]> => {
        return executeApiCall(
            () => getAllDispositifs(),
            "Error while getting all dispositifs",
            (data: Dispositif[]) => {
                const updatedDispositifs = new Map<number, DispositifDTO>();
                data.forEach(dispositif => {
                    if (dispositif.id !== undefined) {
                        updatedDispositifs.set(dispositif.id, dispositif);
                    }
                });
                setDispositifs(updatedDispositifs);
            }
        );
    };

    const updateDispositifHook = async (dispositif: DispositifDTO, id: number): Promise<DispositifDTO> => {
        return executeApiCall(
            () => updateDispositif(dispositif, id),
            "Error while updating dispositif"
        );
    };

    const deleteDispositifHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => deleteDispositif(id),
            "Error while deleting dispositif",
            () => {
                // Remove from local state if needed
                if (dispositifs.has(id)) {
                    const updatedDispositifs = new Map(dispositifs);
                    updatedDispositifs.delete(id);
                    setDispositifs(updatedDispositifs);
                }
            }
        );
    };

    const createDispositifHook = async (dispositif: Dispositif): Promise<Dispositif> => {
        return executeApiCall(
            () => createDispositif(dispositif),
            "Error while creating dispositif"
        );
    };

    const getDispositifsByIdsHook = async (ids: number[]): Promise<DispositifDTO[]> => {
        return executeApiCall(
            () => getDispositifsByIds(ids),
            "Error while getting dispositifs by IDs",
            (data: Dispositif[]) => {
                const updatedDispositifs = new Map<number, DispositifDTO>();
                data.forEach(dispositif => {
                    if (dispositif.id !== undefined) {
                        updatedDispositifs.set(dispositif.id, dispositif);
                    }
                });
                setDispositifs(updatedDispositifs);
            }
        );
    }

    return {
        loading,
        error,
        response,
        lastId,
        dispositifs,
        getDispositif: getDispositifHook,
        getAllDispositifs: getAllDispositifsHook,
        updateDispositif: updateDispositifHook,
        deleteDispositif: deleteDispositifHook,
        createDispositif: createDispositifHook,
        getDispositifsByIds: getDispositifsByIdsHook
    };
};

export default useDispositif;