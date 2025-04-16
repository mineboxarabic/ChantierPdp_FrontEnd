// useEntreprise.ts
import { useEffect, useState } from "react";
import { useNotifications } from '@toolpad/core/useNotifications';
import { Entreprise } from "../utils/entities/Entreprise.ts";
import { EntrepriseDTO } from "../utils/entitiesDTO/EntrepriseDTO.ts";
import fetchApi, { ApiResponse} from "../api/fetchApi.ts";

type EntrepriseResponse = EntrepriseDTO | EntrepriseDTO[] | boolean | number | null;

// Function to get an entreprise by ID
export const getEntrepriseById = async (id: number): Promise<ApiResponse<EntrepriseDTO>> => {



    return fetchApi<EntrepriseDTO>(
        `api/entreprise/${id}`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'GetEntreprise : Error entreprise not found',
            },
            {
                status: -1,
                message: 'GetEntreprise : Error while getting entreprise',
            }
        ]
    );
};

// Function to get all entreprises
export const getAllEntreprises = async (): Promise<ApiResponse<EntrepriseDTO[]>> => {
    return fetchApi<EntrepriseDTO[]>(
        `api/entreprise`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'GetAllEntreprises : Error entreprises not found',
            },
            {
                status: -1,
                message: 'GetAllEntreprises : Error while getting entreprises',
            }
        ]
    );
};

// Function to update an entreprise
export const updateEntreprise = async (entreprise: EntrepriseDTO, id: number): Promise<ApiResponse<EntrepriseDTO>> => {
    return fetchApi<EntrepriseDTO>(
        `api/entreprise/${id}`,
        'PATCH',
        entreprise,
        [
            {
                status: 409,
                message: 'UpdateEntreprise : Error entreprise already exists',
            },
            {
                status: 404,
                message: 'UpdateEntreprise : Error entreprise or api link not found',
            },
            {
                status: -1,
                message: 'UpdateEntreprise : Error while updating entreprise',
            }
        ]
    );
};

// Function to delete an entreprise
export const deleteEntreprise = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/entreprise/${id}`,
        'DELETE',
        null,
        [
            {
                status: 409,
                message: 'DeleteEntreprise : Error entreprise already exists',
            },
            {
                status: 404,
                message: 'DeleteEntreprise : Error entreprise or api link not found',
            },
            {
                status: 405,
                message: 'DeleteEntreprise : You are not allowed to delete this entreprise',
            },
            {
                status: -1,
                message: 'DeleteEntreprise : Error while deleting entreprise',
            }
        ]
    );
};

// Function to create an entreprise
export const createEntreprise = async (entreprise: EntrepriseDTO): Promise<ApiResponse<EntrepriseDTO>> => {
    return fetchApi<EntrepriseDTO>(
        `api/entreprise`,
        'POST',
        entreprise,
        [
            {
                status: 409,
                message: 'CreateEntreprise : Error entreprise already exists',
            },
            {
                status: 404,
                message: 'CreateEntreprise : Error entreprise or api link not found',
            },
            {
                status: -1,
                message: 'CreateEntreprise : Error while creating entreprise',
            }
        ]
    );
};

// React hook that uses the API functions
const useEntreprise = () => {
    const [response, setResponse] = useState<EntrepriseResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastId, setLastId] = useState<number | null>(null);
    const [entreprises, setEntreprises] = useState<Map<number, EntrepriseDTO>>(new Map<number, EntrepriseDTO>());

    const notifications = useNotifications();

    const getEntrepriseHook = async (id: number): Promise<EntrepriseDTO> => {
        setLoading(true);
        try {
            const result = await getEntrepriseById(id);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to get entreprise");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const getAllEntreprisesHook = async (): Promise<EntrepriseDTO[]> => {
        setLoading(true);
        try {
            const result = await getAllEntreprises();
            if (result.data) {
                setResponse(result.data);

                // Update the entreprises map
                const newEntreprises = new Map<number, EntrepriseDTO>();
                result.data.forEach(entreprise => {
                    if (entreprise.id !== undefined) {
                        newEntreprises.set(entreprise.id, entreprise);
                    }
                });
                setEntreprises(newEntreprises);

                return result.data;
            }
            throw new Error(result.message || "Failed to get all entreprises");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const updateEntrepriseHook = async (entreprise: EntrepriseDTO, id: number): Promise<EntrepriseDTO> => {
        setLoading(true);
        try {
            const result = await updateEntreprise(entreprise, id);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to update entreprise");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const deleteEntrepriseHook = async (id: number): Promise<boolean> => {
        setLoading(true);
        try {
            const result = await deleteEntreprise(id);
            if (result.data !== undefined) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to delete entreprise");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const createEntrepriseHook = async (entreprise: EntrepriseDTO): Promise<EntrepriseDTO> => {
        setLoading(true);
        try {
            const result = await createEntreprise(entreprise);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to create entreprise");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        response,
        lastId,
        getEntreprise: getEntrepriseHook,
        getAllEntreprises: getAllEntreprisesHook,
        updateEntreprise: updateEntrepriseHook,
        deleteEntreprise: deleteEntrepriseHook,
        createEntreprise: createEntrepriseHook,
        entreprises
    };
};

export default useEntreprise;