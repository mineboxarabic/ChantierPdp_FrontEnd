import { useState, useEffect } from "react";
import { useAxios } from "./useAxios";
import { useNotifications } from "@toolpad/core/useNotifications";
import AnalyseDeRisque from "../utils/entities/AnalyseDeRisque.ts";
import AnalyseDeRisqueDTO from "../utils/entitiesDTO/AnalyseDeRisqueDTO.ts";
import Risque from "../utils/entities/Risque.ts";
import ObjectAnsweredEntreprises from "../utils/pdp/ObjectAnsweredEntreprises.ts";

type AnalyseResponse = AnalyseDeRisque | AnalyseDeRisque[] | boolean | number | null;

const useAnalyseRisque = () => {
    const [response, setResponse] = useState<AnalyseResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const notifications = useNotifications();
    const { fetch, responseAxios, errorAxios, loadingAxios } = useAxios();

    useEffect(() => {
        if (responseAxios) {
            setResponse(responseAxios.data?.data as AnalyseResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);

    const getAnalyseRisque = async (id: number): Promise<AnalyseDeRisque> => {
        return fetch(`api/analyseDeRisque/${id}`, "GET", null, [
            { status: 404, message: "Analyse de risque not found" },
            { status: -1, message: "Error while getting analyse de risque" },
        ]).then((r) => {
            if (r !== undefined) {
                setResponse(r.data?.data as AnalyseDeRisque);
                return r.data?.data as AnalyseDeRisque;
            }
        }) as Promise<AnalyseDeRisque>;
    };

    const getAllAnalyses = async (): Promise<AnalyseDeRisque[]> => {
        return fetch("api/analyseDeRisque", "GET", null, [
            { status: -1, message: "Error while fetching analyses" },
        ]).then((r) => {
            if (r !== undefined) {
                setResponse(r.data?.data as AnalyseDeRisque[]);
                return r.data?.data as AnalyseDeRisque[];
            }
        }) as Promise<AnalyseDeRisque[]>;
    };

    const createAnalyse = async (analyse: AnalyseDeRisque): Promise<AnalyseDeRisque> => {
        return fetch("api/analyseDeRisque", "POST", analyse, [
            { status: 400, message: "Invalid analyse data" },
            { status: -1, message: "Error while creating analyse" },
        ]).then((r) => {
            if (r !== undefined) {
                notifications.show("Analyse created", { severity: "success" });
                return r.data?.data as AnalyseDeRisque;
            }
        }) as Promise<AnalyseDeRisque>;
    };

    const updateAnalyse = async (id: number, analyse: AnalyseDeRisque): Promise<AnalyseDeRisque> => {
        return fetch(`api/analyseDeRisque/${id}`, "PATCH", analyse, [
            { status: 404, message: "Analyse not found" },
            { status: -1, message: "Error while updating analyse" },
        ]).then((r) => {
            if (r !== undefined) {
                notifications.show("Analyse updated", { severity: "success" });
                return r.data?.data as AnalyseDeRisque;
            }
        }) as Promise<AnalyseDeRisque>;
    };

    const deleteAnalyse = async (id: number): Promise<boolean> => {
        return fetch(`api/analyseDeRisque/${id}`, "DELETE", null, [
            { status: 404, message: "Analyse not found" },
            { status: -1, message: "Error while deleting analyse" },
        ]).then((r) => {
            if (r !== undefined) {
                notifications.show("Analyse deleted", { severity: "success" });
                return true;
            }
            return false;
        });
    };

    const linkRisqueToAnalyse = async (analyseId: number, risqueId: number): Promise<ObjectAnsweredEntreprises> => {

        return fetch(`api/analyseDeRisque/${analyseId}/risque/${risqueId}`, "POST", null, [
            { status: 404, message: "Analyse or Risque not found" },
            { status: -1, message: "Error while linking risque to analyse" },
        ]).then((r) => {
            if (r !== undefined) {
                notifications.show("Risque linked to analyse", { severity: "success" });
                return r.data?.data as ObjectAnsweredEntreprises;
            }
        }) as Promise<ObjectAnsweredEntreprises>;

    }

    return { response, error, loading,linkRisqueToAnalyse, getAnalyseRisque, getAllAnalyses, createAnalyse, updateAnalyse, deleteAnalyse };
};

export default useAnalyseRisque;
