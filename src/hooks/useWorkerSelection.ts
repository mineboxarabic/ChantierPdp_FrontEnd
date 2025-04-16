// useWorkerSelection.ts
import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import Worker from "../utils/entities/Worker.ts";
import Chantier from "../utils/entities/Chantier.ts";
import WorkerChantierSelection from "../utils/entities/WorkerChantierSelection.ts";
import fetchApi, { ApiResponse } from "../api/fetchApi.ts";

type WorkerSelectionResponse = WorkerChantierSelection | WorkerChantierSelection[] | Worker[] | Chantier[] | boolean | null;

// Function to select a worker for a chantier
export const selectWorkerForChantier = async (
    workerId: number,
    chantierId: number,
    note?: string
): Promise<ApiResponse<WorkerChantierSelection>> => {
    return fetchApi<WorkerChantierSelection>(
        "api/worker-selection/select",
        "POST",
        {
            workerId,
            chantierId,
            note
        },
        [
            {
                status: 404,
                message: "Erreur: travailleur ou chantier non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la sélection du travailleur",
            },
        ]
    );
};

// Function to deselect a worker from a chantier
export const deselectWorkerFromChantier = async (
    workerId: number,
    chantierId: number
): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        "api/worker-selection/deselect",
        "POST",
        {
            workerId,
            chantierId
        },
        [
            {
                status: 404,
                message: "Erreur: travailleur ou chantier non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la désélection du travailleur",
            },
        ]
    );
};

// Function to get all workers selected for a chantier
export const getWorkersForChantier = async (chantierId: number): Promise<ApiResponse<Worker[]>> => {
    return fetchApi<Worker[]>(
        `api/worker-selection/chantier/${chantierId}/workers`,
        "GET",
        null,
        [
            {
                status: 404,
                message: "Erreur: chantier non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la récupération des travailleurs du chantier",
            },
        ]
    );
};

// Function to get all chantiers where a worker is selected
export const getChantiersForWorker = async (workerId: number): Promise<ApiResponse<Chantier[]>> => {
    return fetchApi<Chantier[]>(
        `api/worker-selection/worker/${workerId}/chantiers`,
        "GET",
        null,
        [
            {
                status: 404,
                message: "Erreur: travailleur non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la récupération des chantiers du travailleur",
            },
        ]
    );
};

// Function to get all selections (with details) for a chantier
export const getSelectionsForChantier = async (chantierId: number): Promise<ApiResponse<WorkerChantierSelection[]>> => {
    return fetchApi<WorkerChantierSelection[]>(
        `api/worker-selection/chantier/${chantierId}/selections`,
        "GET",
        null,
        [
            {
                status: 404,
                message: "Erreur: chantier non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la récupération des sélections du chantier",
            },
        ]
    );
};

// React hook that uses the API functions
const useWorkerSelection = () => {
    const [response, setResponse] = useState<WorkerSelectionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const notifications = useNotifications();

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
                setResponse(result.data as WorkerSelectionResponse);
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
    const selectWorkerForChantierHook = async (
        workerId: number,
        chantierId: number,
        note?: string
    ): Promise<WorkerChantierSelection> => {
        return executeApiCall(
            () => selectWorkerForChantier(workerId, chantierId, note),
            "Erreur lors de la sélection du travailleur"
        );
    };

    const deselectWorkerFromChantierHook = async (
        workerId: number,
        chantierId: number
    ): Promise<boolean> => {
        try {
            await executeApiCall(
                () => deselectWorkerFromChantier(workerId, chantierId),
                "Erreur lors de la désélection du travailleur"
            );
            return true;
        } catch (e) {
            return false;
        }
    };

    const getWorkersForChantierHook = async (chantierId: number): Promise<Worker[]> => {
        return executeApiCall(
            () => getWorkersForChantier(chantierId),
            "Erreur lors de la récupération des travailleurs du chantier"
        );
    };

    const getChantiersForWorkerHook = async (workerId: number): Promise<Chantier[]> => {
        return executeApiCall(
            () => getChantiersForWorker(workerId),
            "Erreur lors de la récupération des chantiers du travailleur"
        );
    };

    const getSelectionsForChantierHook = async (chantierId: number): Promise<WorkerChantierSelection[]> => {
        return executeApiCall(
            () => getSelectionsForChantier(chantierId),
            "Erreur lors de la récupération des sélections du chantier"
        );
    };

    return {
        loading,
        error,
        response,
        selectWorkerForChantier: selectWorkerForChantierHook,
        deselectWorkerFromChantier: deselectWorkerFromChantierHook,
        getWorkersForChantier: getWorkersForChantierHook,
        getChantiersForWorker: getChantiersForWorkerHook,
        getSelectionsForChantier: getSelectionsForChantierHook
    };
};

export default useWorkerSelection;