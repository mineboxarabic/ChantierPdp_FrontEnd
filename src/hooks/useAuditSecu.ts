import {useAxios} from "./useAxios.ts";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import {AxiosResponseState} from "../utils/AxiosResponse.ts";
import {AuditSecu} from "../utils/entities/AuditSecu.ts";


type AuditSecuResponse =  AuditSecu | AuditSecu[] | boolean | number | null;

const useAuditSecu = () => {
    const [response, setReponse] = useState<AuditSecuResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [lastId, setLastId] = useState<number | null>(null);

    const notifications = useNotifications();
    const {fetch, responseAxios, errorAxios, loadingAxios} = useAxios<AxiosResponseState<AuditSecuResponse>>();

    const [auditSecus, setAuditSecus] = useState<Map<number, AuditSecu>>(new Map<number, AuditSecu>());

    useEffect(() => {
        if (responseAxios) {
            setReponse(responseAxios.data?.data as AuditSecuResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);


    const getAuditSecu = async (id: number): Promise<AuditSecu> => {
        return fetch(`api/auditsecu/${id}`, 'GET', null, [
            {
                status: 404,
                message: 'GetAuditSecu: Error audit secu not found',
            },
            {
                status: -1,
                message: 'GetAuditSecu: Error while getting audit secu',
            }
        ]).then(r => {
            if (r != undefined) {
                setReponse(r.data?.data as AuditSecu);
                return r;
            }
        }) as Promise<AuditSecu>;
    }


    const getAllAuditSecus = async (): Promise<AuditSecu[]> => {
        return fetch(`api/auditsecu`, 'GET', null, [
            {
                status: 404,
                message: 'GetAllAuditSecus: Error audit secus not found',
            },
            {
                status: -1,
                message: 'GetAllAuditSecus: Error while getting audit secus',
            }
        ]).then(r => {
            if (r != undefined) {
                setReponse(r.data?.data as AuditSecu[]);

                (r.data?.data as AuditSecu[]).forEach(e => {
                    auditSecus.set(e?.id as number, e);
                });

                return r.data?.data as AuditSecu[];
            }
        }) as Promise<AuditSecu[]>;
    }


    const updateAuditSecu = async (auditSecu: AuditSecu, id: number): Promise<AuditSecu> => {
        return fetch(`api/auditsecu/${id}`, 'PATCH', auditSecu, [
            {
                status: 409,
                message: 'UpdateAuditSecu: Error audit secu already exists',
            },
            {
                status: 404,
                message: 'UpdateAuditSecu: Error audit secu or api link not found',
            },
            {
                status: -1,
                message: 'UpdateAuditSecu: Error while updating audit secu',
            }
        ]).then(r => {
            if (r != undefined) {
                setReponse(r.data?.data as AuditSecu);
                return r;
            }
        }) as Promise<AuditSecu>;
    }

    const deleteAuditSecu = async (id: number): Promise<boolean> => {
        return fetch(`api/auditsecu/${id}`, 'DELETE', null, [
            {
                status: 409,
                message: 'DeleteAuditSecu: Error audit secu already exists',
            },
            {
                status: 404,
                message: 'DeleteAuditSecu: Error audit secu or api link not found',
            },
            {
                status: 405,
                message: 'DeleteAuditSecu: Error audit secu not deletable',
            },
            {
                status: -1,
                message: 'DeleteAuditSecu: Error while deleting audit secu',
            }
        ]).then(r => {
            if (r != undefined) {
                setReponse(r.data?.data as boolean);
                return r.data?.data;
            }
        }) as Promise<boolean>;
    }


    const createAuditSecu = async (auditSecu: AuditSecu): Promise<AuditSecu> => {
        return fetch(`api/auditsecu`, 'POST', auditSecu, [
            {
                status: 409,
                message: 'CreateAuditSecu: Error audit secu already exists',
            },
            {
                status: 404,
                message: 'CreateAuditSecu: Error audit secu or api link not found',
            },
            {
                status: -1,
                message: 'CreateAuditSecu: Error while creating audit secu',
            }
        ]).then(r => {
            if (r != undefined) {
                setReponse(r.data?.data as AuditSecu);
                return r;
            }
        }) as Promise<AuditSecu>;
    }

    return {
        loading,
        error,
        response,
        lastId,
        getAuditSecu,
        getAllAuditSecus,
        updateAuditSecu,
        deleteAuditSecu,
        createAuditSecu,
        auditSecus
    };
}

export default useAuditSecu;