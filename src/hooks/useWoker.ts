import {useAxios} from "./useAxios.ts";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import {AxiosResponseState} from "../utils/AxiosResponse.ts";
import Worker from "../utils/entities/Worker.ts";
import useWorkerSelection from "./useWorkerSelection.ts";

const apiUrl = import.meta.env.VITE_API_URL;
type WorkerResponse = Worker | Worker[] | boolean | number | null; // Could be one Worker, a list of Workers, or null.

const useWorker = () => {
    const [response, setResponse] = useState<WorkerResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [lastId, setLastId] = useState<number | null>(null);

    const notifications = useNotifications();
    const {fetch, responseAxios, errorAxios, loadingAxios} = useAxios<AxiosResponseState<WorkerResponse>>();

    const [workers, setWorkers] = useState<Map<number, Worker>>(new Map<number, Worker>);
    const [workersInChantier, setWorkersInChantier] = useState<Map<number, Worker>>(new Map<number, Worker>());

    const workerSelectionService = useWorkerSelection();
    useEffect(() => {
        if (responseAxios) {
            setResponse(responseAxios.data?.data as WorkerResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);

    const getWorker = async (id: number): Promise<Worker> => {
        return fetch(`api/worker/${id}`, 'GET', null, [
            {
                status: 404,
                message: 'GetWorker: Error worker not found',
            },
            {
                status: -1,
                message: 'GetWorker: Error while getting worker',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Worker);
                return r.data?.data;
            }
        }) as Promise<Worker>;
    }

    const getAllWorkers = async (): Promise<Worker[]> => {

        return fetch(`api/worker`, 'GET', null, [
            {
                status: 404,
                message: 'GetAllWorkers: Error workers not found',
            },
            {
                status: -1,
                message: 'GetAllWorkers: Error while getting workers',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Worker[]);
                (r.data?.data as Worker[]).forEach(e=>{
                    workers.set(e?.id as number, e);
                });
                return r.data?.data;
            }
        }).catch(e=>{
            console.log('aokfepokokkkkk');

        }) as Promise<Worker[]>;
    }

    const updateWorker = async (worker: Worker, id: number): Promise<Worker> => {
        return fetch(`api/worker/${id}`, 'PATCH', worker, [
            {
                status: 409,
                message: 'UpdateWorker: Error worker already exists',
            },
            {
                status: 404,
                message: 'UpdateWorker: Error worker or api link not found',
            },
            {
                status: -1,
                message: 'UpdateWorker: Error while updating worker',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Worker);
                return r.data?.data;
            }
        }) as Promise<Worker>;
    }

    const deleteWorker = async (id: number): Promise<boolean> => {
        return fetch(`api/worker/${id}`, 'DELETE', null, [
            {
                status: 409,
                message: 'DeleteWorker: Error worker conflict',
            },
            {
                status: 404,
                message: 'DeleteWorker: Error worker or api link not found',
            },
            {
                status: 405,
                message: 'DeleteWorker: You are not allowed to delete this worker',
            },
            {
                status: -1,
                message: 'DeleteWorker: Error while deleting worker',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as boolean);
                return r.data?.data;
            }
        }) as Promise<boolean>;
    }

    const createWorker = async (worker: Worker): Promise<Worker> => {
        return fetch(`api/worker`, 'POST', worker, [
            {
                status: 409,
                message: 'CreateWorker: Error worker already exists',
            },
            {
                status: 404,
                message: 'CreateWorker: Error worker or api link not found',
            },
            {
                status: -1,
                message: 'CreateWorker: Error while creating worker',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Worker);
                return r.data?.data;
            }
        }) as Promise<Worker>;
    }

    const getWorkersByEntreprise = async (entrepriseId: number): Promise<Worker[]> => {
        return fetch(`api/entreprise/${entrepriseId}/workers`, 'GET', null, [
            {
                status: 404,
                message: 'GetWorkersByEntreprise: Error workers or entreprise not found',
            },
            {
                status: -1,
                message: 'GetWorkersByEntreprise: Error while getting workers by entreprise',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Worker[]);
                return r.data?.data;
            }
        }) as Promise<Worker[]>;
    }

    const getWorkersByPdp = async (pdpId: number): Promise<Worker[]> => {
        return fetch(`api/pdp/${pdpId}/workers`, 'GET', null, [
            {
                status: 404,
                message: 'GetWorkersByPdp: Error workers or pdps not found',
            },
            {
                status: -1,
                message: 'GetWorkersByPdp: Error while getting workers by pdps',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Worker[]);
                return r.data?.data;
            }
        }) as Promise<Worker[]>;
    }

    const getWorkersByChantier = async (chantierId: number): Promise<Worker[]> => {
        return fetch(`api/chantier/${chantierId}/workers`, 'GET', null, [
            {
                status: 404,
                message: 'GetWorkersByChantier: Error workers or chantier not found',
            },
            {
                status: -1,
                message: 'GetWorkersByChantier: Error while getting workers by chantier',
            }
        ]).then(r => {
            if (r != undefined) {
                setResponse(r.data?.data as Worker[]);
                return r.data?.data;
            }
        }) as Promise<Worker[]>;
    }


    const selectWorkerForChantier = async (
        workerId: number,
        chantierId: number,
        note?: string
    ) => {
        return await workerSelectionService.selectWorkerForChantier(workerId, chantierId, note);
    }


    const deselectWorkerFromChantier = async (
        workerId: number,
        chantierId: number
    ) => {
        return await workerSelectionService.deselectWorkerFromChantier(workerId, chantierId);
    }


    const getSelectedWorkersForChantier = async (chantierId: number): Promise<Worker[]> => {
        const workers: Worker[] =  await workerSelectionService.getWorkersForChantier(chantierId);

        workers.forEach(w => {
            workersInChantier.set(w.id as number, w);
        }
        );
        return workers;
    }


    const updateChantierWorkers = async (chantierId: number, workerIds: number[]): Promise<boolean> => {
        try {
            // 1. Récupérer les travailleurs actuels
            const currentWorkers = await workerSelectionService.getWorkersForChantier(chantierId);
            const currentWorkerIds = currentWorkers.map(w => w.id);

            // 2. Déterminer qui doit être enlevé
            const workersToRemove = currentWorkerIds.filter(id => !workerIds.includes(id as number));

            // 3. Déterminer qui doit être ajouté
            const workersToAdd = workerIds.filter(id => !currentWorkerIds.includes(id));

            // 4. Enlever les travailleurs
            for (const workerId of workersToRemove) {
                await workerSelectionService.deselectWorkerFromChantier(workerId as number, chantierId);
            }

            // 5. Ajouter les nouveaux travailleurs
            for (const workerId of workersToAdd) {
                await workerSelectionService.selectWorkerForChantier(workerId, chantierId);
            }

            return true;
        } catch (error) {
            console.error("Erreur lors de la mise à jour des travailleurs:", error);
            return false;
        }
    }


    return {
        loading,
        error,
        response,
        lastId,
        getWorker,
        getAllWorkers,
        updateWorker,
        deleteWorker,
        createWorker,
        getWorkersByEntreprise,
        getWorkersByPdp,
        getWorkersByChantier,
        selectWorkerForChantier,
        deselectWorkerFromChantier,
        getSelectedWorkersForChantier,
        updateChantierWorkers,
        workers,
        workersInChantier
    };
}

export default useWorker;