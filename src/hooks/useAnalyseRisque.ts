// useAnalyseRisque.ts
import { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import AnalyseDeRisque from "../utils/entities/AnalyseDeRisque.ts";
import AnalyseDeRisqueDTO from "../utils/entitiesDTO/AnalyseDeRisqueDTO.ts";
import ObjectAnsweredEntreprises from "../utils/pdp/ObjectAnsweredEntreprises.ts";
import fetchApi, { ApiResponse } from "../api/fetchApi.ts";

type AnalyseResponse = AnalyseDeRisque | AnalyseDeRisque[] | boolean | null;

// Function to get an analyse de risque by ID
export const getAnalyseRisqueById = async (id: number): Promise<ApiResponse<AnalyseDeRisque>> => {
    return fetchApi<AnalyseDeRisque>(
        `api/analyseDeRisque/${id}`,
        "GET",
        null,
        [
            { status: 404, message: "Analyse de risque not found" },
            { status: -1, message: "Error while getting analyse de risque" }
        ]
    );
};

// Function to get all analyses
export const getAllAnalyses = async (): Promise<ApiResponse<AnalyseDeRisque[]>> => {
    return fetchApi<AnalyseDeRisque[]>(
        "api/analyseDeRisque",
        "GET",
        null,
        [
            { status: -1, message: "Error while fetching analyses" }
        ]
    );
};

// Function to create an analyse
export const createAnalyse = async (analyse: AnalyseDeRisque): Promise<ApiResponse<AnalyseDeRisque>> => {
    return fetchApi<AnalyseDeRisque>(
        "api/analyseDeRisque",
        "POST",
        analyse,
        [
            { status: 400, message: "Invalid analyse data" },
            { status: -1, message: "Error while creating analyse" }
        ]
    );
};

// Function to update an analyse
export const updateAnalyse = async (id: number, analyse: AnalyseDeRisque): Promise<ApiResponse<AnalyseDeRisque>> => {
    return fetchApi<AnalyseDeRisque>(
        `api/analyseDeRisque/${id}`,
        "PATCH",
        analyse,
        [
            { status: 404, message: "Analyse not found" },
            { status: -1, message: "Error while updating analyse" }
        ]
    );
};

// Function to delete an analyse
export const deleteAnalyse = async (id: number): Promise<ApiResponse<boolean>> => {
    return fetchApi<boolean>(
        `api/analyseDeRisque/${id}`,
        "DELETE",
        null,
        [
            { status: 404, message: "Analyse not found" },
            { status: -1, message: "Error while deleting analyse" }
        ]
    );
};

// Function to link a risque to an analyse
export const linkRisqueToAnalyse = async (analyseId: number, risqueId: number): Promise<ApiResponse<ObjectAnsweredEntreprises>> => {
    return fetchApi<ObjectAnsweredEntreprises>(
        `api/analyseDeRisque/${analyseId}/risque/${risqueId}`,
        "POST",
        null,
        [
            { status: 404, message: "Analyse or Risque not found" },
            { status: -1, message: "Error while linking risque to analyse" }
        ]
    );
};

// React hook that uses the API functions
const useAnalyseRisque = () => {
    const [response, setResponse] = useState<AnalyseResponse>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [analyses, setAnalyses] = useState<Map<number, AnalyseDeRisque>>(new Map<number, AnalyseDeRisque>());

    const notifications = useNotifications();

    // Helper function for handling API calls
    const executeApiCall = async <T>(
        apiCall: () => Promise<ApiResponse<T>>,
        errorMessage: string,
        successMessage?: string,
        successAction?: (data: T) => void
    ): Promise<T> => {
        setLoading(true);
        try {
            const result = await apiCall();
            if (result.data !== undefined) {
                setResponse(result.data as AnalyseResponse);
                if (successAction) {
                    successAction(result.data);
                }
                if (successMessage) {
                    notifications.show(successMessage, { severity: "success" });
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
    const getAnalyseRisqueHook = async (id: number): Promise<AnalyseDeRisque> => {
        return executeApiCall(
            () => getAnalyseRisqueById(id),
            "Error while getting analyse de risque"
        );
    };

    const getAllAnalysesHook = async (): Promise<AnalyseDeRisque[]> => {
        return executeApiCall(
            () => getAllAnalyses(),
            "Error while getting all analyses",
            undefined,
            (data: AnalyseDeRisque[]) => {
                const updatedAnalyses = new Map<number, AnalyseDeRisque>();
                data.forEach(analyse => {
                    if (analyse.id !== undefined) {
                        updatedAnalyses.set(analyse.id, analyse);
                    }
                });
                setAnalyses(updatedAnalyses);
            }
        );
    };

    const createAnalyseHook = async (analyse: AnalyseDeRisque): Promise<AnalyseDeRisque> => {
        return executeApiCall(
            () => createAnalyse(analyse),
            "Error while creating analyse",
            "Analyse created"
        );
    };

    const updateAnalyseHook = async (id: number, analyse: AnalyseDeRisque): Promise<AnalyseDeRisque> => {
        return executeApiCall(
            () => updateAnalyse(id, analyse),
            "Error while updating analyse",
            "Analyse updated"
        );
    };

    const deleteAnalyseHook = async (id: number): Promise<boolean> => {
        return executeApiCall(
            () => deleteAnalyse(id),
            "Error while deleting analyse",
            "Analyse deleted",
            () => {
                // Remove from local state if needed
                if (analyses.has(id)) {
                    const updatedAnalyses = new Map(analyses);
                    updatedAnalyses.delete(id);
                    setAnalyses(updatedAnalyses);
                }
                return true;
            }
        );
    };

    const linkRisqueToAnalyseHook = async (analyseId: number, risqueId: number): Promise<ObjectAnsweredEntreprises> => {
        return executeApiCall(
            () => linkRisqueToAnalyse(analyseId, risqueId),
            "Error while linking risque to analyse",
            "Risque linked to analyse"
        );
    };

    return {
        response,
        error,
        loading,
        analyses,
        getAnalyseRisque: getAnalyseRisqueHook,
        getAllAnalyses: getAllAnalysesHook,
        createAnalyse: createAnalyseHook,
        updateAnalyse: updateAnalyseHook,
        deleteAnalyse: deleteAnalyseHook,
        linkRisqueToAnalyse: linkRisqueToAnalyseHook
    };
};

export default useAnalyseRisque;