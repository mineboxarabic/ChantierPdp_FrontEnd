// useChantier.ts
import { useCallback, useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import fetchApi, { ApiResponse} from "../api/fetchApi.ts";
import {ChantierDTO} from "../utils/entitiesDTO/ChantierDTO.ts";
import {
    mapChantierDTOToChantier,
    mapChantierToChantierDTO
} from "../utils/mappers/ChantierMapper.ts";

type ChantierResponse = ChantierDTO | ChantierDTO[] | number | boolean | null;

// Function to save/update a chantier
export const saveChantier = async (chantierDTO: ChantierDTO, id: number): Promise<ApiResponse<ChantierDTO>> => {
    return await fetchApi<ChantierDTO>(
        `api/chantier/${id}`,
        "PATCH",
        chantierDTO,
        [
            {
                status: 409,
                message: "SaveChantier: Error chantier already exists",
            },
            {
                status: 404,
                message: "SaveChantier: Error chantier or API link not found",
            },
            {
                status: -1,
                message: "SaveChantier: Error while saving chantier",
            },
        ]
    );
};

// Function to get a chantier by ID
export const getChantier = async (id: number): Promise<ApiResponse<ChantierDTO>> => {
    return fetchApi<ChantierDTO>(
        `api/chantier/${id}`,
        "GET",
        null,
        [
            {
                status: 404,
                message: "Error chantier not found",
            },
            {
                status: -1,
                message: "Error while getting chantier",
            },
        ]
    );
};

// Function to get all chantiers
export const getAllChantiers = async (): Promise<ApiResponse<ChantierDTO[]>> => {
    return fetchApi<ChantierDTO[]>(
        "api/chantier/all",
        "GET",
        null,
        [
            {
                status: 404,
                message: "Error chantier not found",
            },
            {
                status: -1,
                message: "Error while getting chantier",
            },
        ]
    );
};

// Function to create a new chantier
export const createChantier = async (chantierDTO: ChantierDTO): Promise<ApiResponse<ChantierDTO>> => {
    return fetchApi<ChantierDTO>(
        "api/chantier/",
        "POST",
        chantierDTO,
        [
            {
                status: 409,
                message: "Error chantier already exists",
            },
            {
                status: 404,
                message: "Error chantier or API link not found",
            },
        ]
    );
};

// Function to delete a chantier
export const deleteChantier = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<void>(
        `api/chantier/${id}`,
        "DELETE",
        null,
        [
            {
                status: 409,
                message: "Error chantier already exists",
            },
            {
                status: 404,
                message: "Error chantier or API link not found",
            },
        ]
    ).then(() => {
        return { data: true, message: "Chantier deleted successfully" };
    }
    ).catch((error) => {
        return { data: false, message: error.message || "Error while deleting chantier" };
    });
};

// Function to get the last chantier ID
export const getLastId = async (): Promise<ApiResponse<number>> => {
    return fetchApi<number>(
        "api/chantier/last",
        "GET",
        null,
        [
            {
                status: 404,
                message: "Error chantier or API link not found",
            },
            {
                status: -1,
                message: "Error while getting last chantier",
            },
        ]
    );
};

// Function to get recent chantiers
export const getRecentChantiers = async (): Promise<ApiResponse<ChantierDTO[]>> => {
    return fetchApi<ChantierDTO[]>(
        "api/chantier/recent",
        "GET",
        null,
        [
            {
                status: 404,
                message: "Error chantier or API link not found",
            },
            {
                status: -1,
                message: "Error while getting recent chantiers",
            },
        ]
    );
};

// Function to check if a chantier exists
export const existChantier = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/chantier/exist/${id}`,
        "GET",
        null,
        [
            {
                status: 404,
                message: "Error chantier not found",
            },
            {
                status: -1,
                message: "Error while getting chantier",
            },
        ]
    );
};

// React hook that uses the API functions
const useChantier = () => {
    const [response, setResponse] = useState<ChantierResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [chantiers, setChantiers] = useState<Map<number, ChantierDTO>>(new Map<number, ChantierDTO>());

    const notifications = useNotifications();

    const saveChantierHook = useCallback(async (chantierDTO: ChantierDTO, id: number): Promise<ChantierDTO> => {
        setLoading(true);
        try {
            const result = await saveChantier(chantierDTO, id);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to save chantier");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    } , []);

    const getChantierHook = useCallback(async (id: number): Promise<ChantierDTO> => {
        setLoading(true);
        try {
            const result = await getChantier(id);
            if (result.data) {
                setResponse(result.data);
                console.log("Chantier getChantier", result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to get chantier");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllChantiersHook = useCallback( async (): Promise<ChantierDTO[]> => {
        setLoading(true);
        try {
            const result = await getAllChantiers();
            if (result.data) {
                setResponse(result.data);
                setChantiers(
                    new Map<number, ChantierDTO>(
                        result.data
                            .filter((chantier) => chantier.id !== undefined)
                            .map((chantier) => [chantier.id as number, chantier])
                    )
                );
                return result.data;
            }
            throw new Error(result.message || "Failed to get all chantiers");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const createChantierHook = useCallback( async (chantierDTO: ChantierDTO): Promise<ChantierDTO> => {
        setLoading(true);
        try {
            // Convert Chantier to ChantierDTO
            const result = await createChantier(chantierDTO);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to create chantier");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    // Alternative function that accepts ChantierDTO directly
    const createChantierDTOHook = useCallback( async (chantierDTO: ChantierDTO): Promise<ChantierDTO> => {
        setLoading(true);
        try {
            const result = await createChantier(chantierDTO);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to create chantier");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteChantierHook = useCallback( async (id: number): Promise<void> => {
        setLoading(true);
        try {
            await deleteChantier(id);
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const getLastIdHook = useCallback( async (): Promise<number> => {
        setLoading(true);
        try {
            const result = await getLastId();
            if (result.data !== undefined) {
                return result.data;
            }
            throw new Error(result.message || "Failed to get last ID");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentChantiersHook = useCallback( async (): Promise<ChantierDTO[]> => {
        setLoading(true);
        try {
            const result = await getRecentChantiers();
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }

                throw new Error(result.message || "Failed to get recent chantiers");


         //   throw new Error(result.message || "Failed to get recent chantiers");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const existChantierHook = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        try {
            const result = await existChantier(id);
            if (result.data !== undefined) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to check if chantier exists");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    // Helper functions for converting between DTO and entity
    const toChantier = async (chantierDTO: ChantierDTO): Promise<ChantierDTO> => {
        return await mapChantierDTOToChantier(chantierDTO);
    };

    const toChantierMulti = async (chantierDTOs: ChantierDTO[]): Promise<ChantierDTO[]> => {
        const chantiers: ChantierDTO[] = [];
        for (const chantierDTO of chantierDTOs) {
            const chantier = await mapChantierDTOToChantier(chantierDTO);
            chantiers.push(chantier);
        }
        return chantiers;
    }

    const toChantierDTO = async (chantier: ChantierDTO): Promise<ChantierDTO> => {
        return await mapChantierToChantierDTO(chantier);
    };

    return {
        loading,
        error,
        response,
        saveChantier: saveChantierHook,
        getChantier: getChantierHook,
        getAllChantiers: getAllChantiersHook,
        createChantier: createChantierHook,
        createChantierDTO: createChantierDTOHook, // New function that accepts DTO directly
        deleteChantier: deleteChantierHook,
        getLastId: getLastIdHook,
        getRecentChantiers: getRecentChantiersHook,
        existChantier: existChantierHook,
        chantiers,
        toChantier, // Helper for converting from DTO to entity
        toChantierDTO // Helper for converting from entity to DTO
    };
};

export default useChantier;