import { useAxios } from "./useAxios.ts";
import { AxiosResponseState } from "../utils/AxiosResponse.ts";
import PermitDTO from "../utils/entitiesDTO/PermitDTO.ts";
import Permit from "../utils/entities/Permit.ts";
import { useEffect, useState } from "react";
import { useNotifications } from '@toolpad/core/useNotifications';

type PermitResponse = PermitDTO | PermitDTO[] | Permit | Permit[] | boolean | number | null;

const usePermit = () => {
    const [response, setResponse] = useState<PermitResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const notifications = useNotifications();
    const { fetch, responseAxios, errorAxios, loadingAxios } = useAxios<AxiosResponseState<PermitResponse>>();

    useEffect(() => {
        if (responseAxios) {
            setResponse(responseAxios.data?.data as PermitResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);

    const getPermit = async (id: number): Promise<PermitDTO> => {
        return fetch(`api/permit/${id}`, 'GET', null, [
            {
                status: 404,
                message: 'GetPermit : Error permit not found',
            },
            {
                status: -1,
                message: 'GetPermit : Error while getting permit',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as PermitDTO);
                return r;
            }
        }) as Promise<PermitDTO>;
    }

    const getAllPermits = async (): Promise<Permit[]> => {
        return fetch(`api/permit`, 'GET', null, [
            {
                status: 404,
                message: 'GetAllPermits : Error permits not found',
            },
            {
                status: -1,
                message: 'GetAllPermits : Error while getting permits',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Permit[]);
                return r.data?.data;
            }
        }) as Promise<Permit[]>;
    }

    const updatePermit = async (permit: Permit, id: number): Promise<Permit> => {
        return fetch(`api/permit/${id}`, 'PATCH', permit, [
            {
                status: 409,
                message: 'UpdatePermit : Error permit already exists',
            },
            {
                status: 404,
                message: 'UpdatePermit : Error permit or API link not found',
            },
            {
                status: -1,
                message: 'UpdatePermit : Error while updating permit',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Permit);
                return r;
            }
        }) as Promise<Permit>;
    }

    const deletePermit = async (id: number): Promise<boolean> => {
        console.log('dejadfj')
        return fetch(`api/permit/${id}`, 'DELETE', null, [
            {
                status: 409,
                message: 'DeletePermit : Error permit already exists',
            },
            {
                status: 404,
                message: 'DeletePermit : Error permit or API link not found',
            },
            {
                status: 405,
                message: 'DeletePermit : Error permit not deletable',
            },
            {
                status: -1,
                message: 'DeletePermit : Error while deleting permit',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as boolean);
                return r.data?.data;
            }
        }) as Promise<boolean>;
    }

    const createPermit = async (permit: Permit): Promise<Permit> => {
        return fetch(`api/permit`, 'POST', permit, [
            {
                status: 409,
                message: 'CreatePermit : Error permit already exists',
            },
            {
                status: 404,
                message: 'CreatePermit : Error permit or API link not found',
            },
            {
                status: -1,
                message: 'CreatePermit : Error while creating permit',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Permit);
                return r;
            }
        }) as Promise<Permit>;
    }

    return { loading, error, response, getPermit, getAllPermits, updatePermit, deletePermit, createPermit };
}

export default usePermit;
