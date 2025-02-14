import { useAxios } from "./useAxios.ts";
import { useEffect, useState } from "react";
import { useNotifications } from '@toolpad/core/useNotifications';
import { AxiosResponseState } from "../utils/AxiosResponse.ts";
import Localisation from "../utils/Localisation/Localisation.ts";
import LocalisationDTO from "../utils/Localisation/LocalisationDTO.ts";

type LocalisationResponse = LocalisationDTO | LocalisationDTO[] | Localisation | Localisation[] | boolean | number | null;

const useLocalisation = () => {
    const [response, setResponse] = useState<LocalisationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const notifications = useNotifications();
    const { fetch, responseAxios, errorAxios, loadingAxios } = useAxios<AxiosResponseState<LocalisationResponse>>();

    useEffect(() => {
        if (responseAxios) {
            setResponse(responseAxios.data?.data as LocalisationResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);

    const getLocalisation = async (id: number): Promise<Localisation> => {
        return fetch(`api/localisation/${id}`, 'GET', null, [
            {
                status: 404,
                message: 'GetLocalisation: Localisation not found',
            },
            {
                status: -1,
                message: 'GetLocalisation: Error fetching localisation',
            }
        ]).then(r => {
            if (r !== undefined && r) {
                setResponse(r.data?.data as Localisation);
                return r.data?.data;
            }
        }) as Promise<Localisation>;
    };

    const getAllLocalisations = async (): Promise<Localisation[]> => {
        return fetch(`api/localisation`, 'GET', null, [
            {
                status: 404,
                message: 'GetAllLocalisations: Localisations not found',
            },
            {
                status: -1,
                message: 'GetAllLocalisations: Error fetching localisations',
            }
        ]).then(r => {
            if (r !== undefined  && r) {
                setResponse(r.data?.data as Localisation[]);
                return r.data?.data;
            }
        }) as Promise<Localisation[]>;
    };

    const updateLocalisation = async (localisation: Localisation, id: number): Promise<Localisation> => {
        return fetch(`api/localisation/${id}`, 'PATCH', localisation, [
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
        ]).then(r => {
            if (r !== undefined && r) {
                setResponse(r.data?.data as Localisation);
                return r.data?.data;
            }
        }) as Promise<Localisation>;
    };

    const deleteLocalisation = async (id: number): Promise<boolean> => {
        return fetch(`api/localisation/${id}`, 'DELETE', null, [
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
        ]).then(r => {
            if (r !== undefined && r) {
                setResponse(r.data?.data as boolean);
                return r.data?.data;
            }
        }) as Promise<boolean>;
    };

    const createLocalisation = async (localisation: Localisation): Promise<Localisation> => {
        return fetch(`api/localisation`, 'POST', localisation, [
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
        ]).then(r => {
            if (r !== undefined && r) {
                setResponse(r.data?.data as Localisation);
                return r.data?.data;
            }
        }) as Promise<Localisation>;
    };

    return { loading, error, response, getLocalisation, getAllLocalisations, updateLocalisation, deleteLocalisation, createLocalisation };
};

export default useLocalisation;
