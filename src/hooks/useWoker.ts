// useWorker.ts
import { useState } from "react";
import { useNotifications } from '@toolpad/core/useNotifications';
import { WorkerDTO } from "../utils/entitiesDTO/WorkerDTO.ts";
import { WorkerChantierSelectionDTO } from "../utils/entitiesDTO/WorkerChantierSelectionDTO.ts";
import fetchApi, { ApiResponse } from "../api/fetchApi.ts";
import useWorkerSelection from "./useWorkerSelection.ts";

type WorkerResponse = WorkerDTO | WorkerDTO[] | boolean | number | null;

// Function to get a worker by ID
export const getWorkerById = async (id: number): Promise<ApiResponse<WorkerDTO>> => {
    return fetchApi<WorkerDTO>(
        `api/worker/${id}`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'GetWorker: Error worker not found',
            },
            {
                status: -1,
                message: 'GetWorker: Error while getting worker',
            }
        ]
    );
};

// Function to get all workers
export const getAllWorkers = async (): Promise<ApiResponse<WorkerDTO[]>> => {
    return fetchApi<WorkerDTO[]>(
        `api/worker`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'GetAllWorkers: Error workers not found',
            },
            {
                status: -1,
                message: 'GetAllWorkers: Error while getting workers',
            }
        ]
    );
};

// Function to update a worker
export const updateWorker = async (worker: WorkerDTO, id: number): Promise<ApiResponse<WorkerDTO>> => {
    return fetchApi<WorkerDTO>(
        `api/worker/${id}`,
        'PATCH',
        worker,
        [
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
        ]
    );
};

// Function to delete a worker
export const deleteWorker = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/worker/${id}`,
        'DELETE',
        null,
        [
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
        ]
    );
};

// Function to create a worker
export const createWorker = async (worker: WorkerDTO): Promise<ApiResponse<WorkerDTO>> => {
    return fetchApi<WorkerDTO>(
        `api/worker/`,
        'POST',
        worker,
        [
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
        ]
    );
};

// Function to get workers by enterprise ID
export const getWorkersByEntreprise = async (entrepriseId: number): Promise<ApiResponse<WorkerDTO[]>> => {
    return fetchApi<WorkerDTO[]>(
        `api/entreprise/${entrepriseId}/workers`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'GetWorkersByEntreprise: Error workers or entreprise not found',
            },
            {
                status: -1,
                message: 'GetWorkersByEntreprise: Error while getting workers by entreprise',
            }
        ]
    );
};

// Function to get workers by PDP ID
export const getWorkersByPdp = async (pdpId: number): Promise<ApiResponse<WorkerDTO[]>> => {
    return fetchApi<WorkerDTO[]>(
        `api/pdp/${pdpId}/workers`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'GetWorkersByPdp: Error workers or pdps not found',
            },
            {
                status: -1,
                message: 'GetWorkersByPdp: Error while getting workers by pdps',
            }
        ]
    );
};

// Function to get workers by chantier ID
export const getWorkersByChantier = async (chantierId: number): Promise<ApiResponse<WorkerDTO[]>> => {
    return fetchApi<WorkerDTO[]>(
        `api/chantier/${chantierId}/workers`,
        'GET',
        null,
        [
            {
                status: 404,
                message: 'GetWorkersByChantier: Error workers or chantier not found',
            },
            {
                status: -1,
                message: 'GetWorkersByChantier: Error while getting workers by chantier',
            }
        ]
    );
};

// React hook that uses the API functions
const useWorker = () => {
    const [response, setResponse] = useState<WorkerResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastId, setLastId] = useState<number | null>(null);
    const [workers, setWorkers] = useState<Map<number, WorkerDTO>>(new Map<number, WorkerDTO>());
    const [workersInChantier, setWorkersInChantier] = useState<Map<number, WorkerDTO>>(new Map<number, WorkerDTO>());

    const notifications = useNotifications();
    const workerSelectionService = useWorkerSelection();

    // Helper function to handle API calls with common error handling
    const executeApiCall = async <T>(
        apiCall: () => Promise<ApiResponse<T>>,
        errorMessage: string,
        successAction?: (data: T) => void
    ): Promise<T> => {
        setLoading(true);
        try {
            const result = await apiCall();
            if (result.data !== undefined) {
                setResponse(result.data as WorkerResponse);
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
    const getWorkerHook = async (id: number): Promise<WorkerDTO> => {
        return executeApiCall(
            () => getWorkerById(id),
            "Error while getting worker"
        );
    };

    const getAllWorkersHook = async (): Promise<WorkerDTO[]> => {
        return executeApiCall(
            () => getAllWorkers(),
            "Error while getting all workers",
            (data: WorkerDTO[]) => {
                const updatedWorkers = new Map<number, WorkerDTO>();
                data.forEach(worker => {
                    if (worker.id !== undefined) {
                        updatedWorkers.set(worker.id, worker);
                    }
                });
                setWorkers(updatedWorkers);
            }
        );
    };

    const updateWorkerHook = async (worker: WorkerDTO, id: number): Promise<WorkerDTO> => {
        return executeApiCall(
            () => updateWorker(worker, id),
            "Error while updating worker"
        );
    };

    const deleteWorkerHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => deleteWorker(id),
            "Error while deleting worker"
        );
    };

    const createWorkerHook = async (worker: WorkerDTO): Promise<WorkerDTO> => {
        return executeApiCall(
            () => createWorker(worker),
            "Error while creating worker"
        );
    };

    const getWorkersByEntrepriseHook = async (entrepriseId: number): Promise<WorkerDTO[]> => {
        return executeApiCall(
            () => getWorkersByEntreprise(entrepriseId),
            "Error while getting workers by entreprise"
        );
    };

    const getWorkersByPdpHook = async (pdpId: number): Promise<WorkerDTO[]> => {
        return executeApiCall(
            () => getWorkersByPdp(pdpId),
            "Error while getting workers by PDP"
        );
    };

    const getWorkersByChantierHook = async (chantierId: number): Promise<WorkerDTO[]> => {
        return executeApiCall(
            () => getWorkersByChantier(chantierId),
            "Error while getting workers by chantier"
        );
    };

    // WorkerDTO selection functions - these use the selection service directly
    const selectWorkerForChantierHook = async (
        selection: WorkerChantierSelectionDTO,
    ): Promise<any> => {
        setLoading(true);
        try {
            const result = await workerSelectionService.selectWorkerForChantier(selection);
            return result;
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const deselectWorkerFromChantierHook = async (
  selection: WorkerChantierSelectionDTO,
    ): Promise<any> => {
        setLoading(true);
        try {
            const result = await workerSelectionService.deselectWorkerFromChantier(selection);
            return result;
        } catch (e: any) {
            setError(e.message);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const getSelectedWorkersForChantierHook = async (chantierId: number): Promise<WorkerDTO[]> => {
        setLoading(true);
        try {
            const result = await workerSelectionService.getWorkersForChantier(chantierId);

            // Update workersInChantier map
            const updatedWorkersInChantier = new Map<number, WorkerDTO>();
            result.forEach(worker => {
                if (worker.id !== undefined) {
                    updatedWorkersInChantier.set(worker.id, worker);
                }
            });
            setWorkersInChantier(updatedWorkersInChantier);

            return result;
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
        getWorker: getWorkerHook,
        getAllWorkers: getAllWorkersHook,
        updateWorker: updateWorkerHook,
        deleteWorker: deleteWorkerHook,
        createWorker: createWorkerHook,
        getWorkersByEntreprise: getWorkersByEntrepriseHook,
        getWorkersByPdp: getWorkersByPdpHook,
        getWorkersByChantier: getWorkersByChantierHook,
        selectWorkerForChantier: selectWorkerForChantierHook,
        deselectWorkerFromChantier: deselectWorkerFromChantierHook,
        getSelectedWorkersForChantier: getSelectedWorkersForChantierHook,
        workers,
        workersInChantier
    };
};

export default useWorker;