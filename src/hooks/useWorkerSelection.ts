// useWorkerSelection.ts
import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { ChantierDTO as Chantier } from "../utils/entitiesDTO/ChantierDTO";
import fetchApi, { ApiResponse } from "../api/fetchApi.ts";
import {WorkerDTO} from "../utils/entitiesDTO/WorkerDTO.ts";
import { WorkerChantierSelectionDTO } from "../utils/entitiesDTO/WorkerChantierSelectionDTO.ts";

type WorkerSelectionResponse = WorkerChantierSelectionDTO | WorkerChantierSelectionDTO[] | WorkerDTO[] | Chantier[] | boolean | null;

// Function to select a worker for a chantier
export const selectWorkerForChantier = async (
  selection: WorkerChantierSelectionDTO
): Promise<ApiResponse<WorkerChantierSelectionDTO>> => {
    return fetchApi<WorkerChantierSelectionDTO>(
        "api/worker-selection/select",
        "POST",
        selection,
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
   selection: WorkerChantierSelectionDTO
): Promise<ApiResponse<boolean>> => {

    return fetchApi<boolean>(
        "api/worker-selection/deselect",
        "POST",
        selection,
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
export const getWorkersForChantier = async (chantierId: number): Promise<ApiResponse<WorkerDTO[]>> => {
    return fetchApi<WorkerDTO[]>(
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
export const getSelectionsForChantier = async (chantierId: number): Promise<ApiResponse<WorkerChantierSelectionDTO[]>> => {
    return fetchApi<WorkerChantierSelectionDTO[]>(
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
            console.error("API call failed:", e);
            notifications.show(e.message, { severity: "error" });
            throw e;
        } finally {
            setLoading(false);
        }
    };

    // Hook methods that wrap the API functions
    const selectWorkerForChantierHook = async (
selection: WorkerChantierSelectionDTO,
    ): Promise<WorkerChantierSelectionDTO> => {
        return executeApiCall(
            () => selectWorkerForChantier(selection),
            "Erreur lors de la sélection du travailleur"
        );
    };

    const deselectWorkerFromChantierHook = async (
        selection: WorkerChantierSelectionDTO,

    ): Promise<boolean> => {
        try {
            await executeApiCall(
                () => deselectWorkerFromChantier(selection),
                "Erreur lors de la désélection du travailleurxxx"
            );
            return true;
        } catch (e) {
            return false;
        }
    };

    const getWorkersForChantierHook = async (chantierId: number): Promise<WorkerDTO[]> => {
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

    const getSelectionsForChantierHook = async (chantierId: number): Promise<WorkerChantierSelectionDTO[]> => {
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