// useLocalisation.ts
import { useState } from "react";
import { useNotifications } from '@toolpad/core/useNotifications';
import Localisation from "../utils/entities/Localisation.ts";
import LocalisationDTO from "../utils/entitiesDTO/LocalisationDTO.ts";
import fetchApi, { ApiResponse} from "../api/fetchApi.ts";

type LocalisationResponse = LocalisationDTO | LocalisationDTO[] | Localisation | Localisation[] | boolean | number | null;

// Function to get a localisation by ID
export const getLocalisationById = async (id: number): Promise<ApiResponse<Localisation>> => {
    return fetchApi<Localisation>(
        `api/localisation/${id}`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'GetLocalisation: Localisation not found',
            },
            {
                status: -1,
                message: 'GetLocalisation: Error fetching localisation',
            }
        ]
    );
};

// Function to get all localisations
export const getAllLocalisations = async (): Promise<ApiResponse<Localisation[]>> => {
    return fetchApi<Localisation[]>(
        `api/localisation`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'GetAllLocalisations: Localisations not found',
            },
            {
                status: -1,
                message: 'GetAllLocalisations: Error fetching localisations',
            }
        ]
    );
};

// Function to update a localisation
export const updateLocalisation = async (localisation: Localisation, id: number): Promise<ApiResponse<Localisation>> => {
    return fetchApi<Localisation>(
        `api/localisation/${id}`,
        'PATCH',
        localisation,
        [
            {
                status: 409,
                message: 'UpdateLocalisation: Conflict, localisation already exists',
            },
            {
                status: 404,
                message: 'UpdateLocalisation: Localisation not found',
            },
            {
                status: -1,
                message: 'UpdateLocalisation: Error updating localisation',
            }
        ]
    );
};

// Function to delete a localisation
export const deleteLocalisation = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/localisation/${id}`,
        'DELETE',
        null,
        [
            {
                status: 404,
                message: 'DeleteLocalisation: Localisation not found',
            },
            {
                status: 405,
                message: 'DeleteLocalisation: Localisation cannot be deleted',
            },
            {
                status: -1,
                message: 'DeleteLocalisation: Error deleting localisation',
            }
        ]
    );
};

// Function to create a localisation
export const createLocalisation = async (localisation: Localisation): Promise<ApiResponse<Localisation>> => {
    return fetchApi<Localisation>(
        `api/localisation`,
        'POST',
        localisation,
        [
            {
                status: 409,
                message: 'CreateLocalisation: Conflict, localisation already exists',
            },
            {
                status: 404,
                message: 'CreateLocalisation: API endpoint not found',
            },
            {
                status: -1,
                message: 'CreateLocalisation: Error creating localisation',
            }
        ]
    );
};

// React hook that uses the API functions
const useLocalisation = () => {
    const [response, setResponse] = useState<LocalisationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [localisations, setLocalisations] = useState<Map<number, Localisation>>(new Map<number, Localisation>());

    const notifications = useNotifications();

    const getLocalisationHook = async (id: number): Promise<Localisation> => {
        setLoading(true);
        try {
            const result = await getLocalisationById(id);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to get localisation");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const getAllLocalisationsHook = async (): Promise<Localisation[]> => {
        setLoading(true);
        try {
            const result = await getAllLocalisations();
            if (result.data) {
                setResponse(result.data);

                // Update the localisations map
                const updatedMap = new Map(localisations);
                result.data.forEach(localisation => {
                    if (localisation.id !== undefined) {
                        updatedMap.set(localisation.id, localisation);
                    }
                });
                setLocalisations(updatedMap);

                return result.data;
            }
            throw new Error(result.message || "Failed to get all localisations");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const updateLocalisationHook = async (localisation: Localisation, id: number): Promise<Localisation> => {
        setLoading(true);
        try {
            const result = await updateLocalisation(localisation, id);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to update localisation");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const deleteLocalisationHook = async (id: number): Promise<boolean> => {
        setLoading(true);
        try {
            const result = await deleteLocalisation(id);
            if (result.data !== undefined) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to delete localisation");
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const createLocalisationHook = async (localisation: Localisation): Promise<Localisation> => {
        setLoading(true);
        try {
            const result = await createLocalisation(localisation);
            if (result.data) {
                setResponse(result.data);
                return result.data;
            }
            throw new Error(result.message || "Failed to create localisation");
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
        getLocalisation: getLocalisationHook,
        getAllLocalisations: getAllLocalisationsHook,
        updateLocalisation: updateLocalisationHook,
        deleteLocalisation: deleteLocalisationHook,
        createLocalisation: createLocalisationHook,
        localisations
    };
};

export default useLocalisation;