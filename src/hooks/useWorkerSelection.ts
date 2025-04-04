import { useAxios } from "./useAxios";
import { useEffect, useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { AxiosResponseState } from "../utils/AxiosResponse";
import Worker from "../utils/entities/Worker";
import Chantier from "../utils/entities/Chantier";
import WorkerChantierSelection from "../utils/entities/WorkerChantierSelection";

type WorkerSelectionResponse = WorkerChantierSelection | WorkerChantierSelection[] | Worker[] | Chantier[] | boolean | null;

const useWorkerSelection = () => {
    const [response, setResponse] = useState<WorkerSelectionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const notifications = useNotifications();
    const { fetch, responseAxios, errorAxios, loadingAxios } = useAxios<AxiosResponseState<WorkerSelectionResponse>>();

    useEffect(() => {
        if (responseAxios) {
            setResponse(responseAxios.data?.data as WorkerSelectionResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);

    /**
     * Sélectionne un travailleur pour un chantier
     */
    const selectWorkerForChantier = async (
        workerId: number,
        chantierId: number,
        note?: string
    ): Promise<WorkerChantierSelection> => {
        return fetch("api/worker-selection/select", "POST", {
            workerId,
            chantierId,
            note
        }, [
            {
                status: 404,
                message: "Erreur: travailleur ou chantier non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la sélection du travailleur",
            },
        ]).then((r) => {
            if (r != undefined) {
                setResponse(r.data?.data as WorkerChantierSelection);
                return r.data?.data as WorkerChantierSelection;
            }
        }) as Promise<WorkerChantierSelection>;
    };

    /**
     * Désélectionne un travailleur d'un chantier
     */
    const deselectWorkerFromChantier = async (
        workerId: number,
        chantierId: number
    ): Promise<boolean> => {
        return fetch("api/worker-selection/deselect", "POST", {
            workerId,
            chantierId
        }, [
            {
                status: 404,
                message: "Erreur: travailleur ou chantier non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la désélection du travailleur",
            },
        ]).then((_) => {
            return true;
        }).catch((_) => {
            return false;
        });
    };

    /**
     * Récupère tous les travailleurs sélectionnés pour un chantier
     */
    const getWorkersForChantier = async (chantierId: number): Promise<Worker[]> => {
        return fetch(`api/worker-selection/chantier/${chantierId}/workers`, "GET", null, [
            {
                status: 404,
                message: "Erreur: chantier non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la récupération des travailleurs du chantier",
            },
        ]).then((r) => {
            if (r != undefined) {
                setResponse(r.data?.data as Worker[]);
                return r.data?.data as Worker[];
            }
        }) as Promise<Worker[]>;
    };

    /**
     * Récupère tous les chantiers pour lesquels un travailleur est sélectionné
     */
    const getChantiersForWorker = async (workerId: number): Promise<Chantier[]> => {
        return fetch(`api/worker-selection/worker/${workerId}/chantiers`, "GET", null, [
            {
                status: 404,
                message: "Erreur: travailleur non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la récupération des chantiers du travailleur",
            },
        ]).then((r) => {
            if (r != undefined) {
                setResponse(r.data?.data as Chantier[]);
                return r.data?.data as Chantier[];
            }
        }) as Promise<Chantier[]>;
    };

    /**
     * Récupère toutes les sélections (avec détails) pour un chantier
     */
    const getSelectionsForChantier = async (chantierId: number): Promise<WorkerChantierSelection[]> => {
        return fetch(`api/worker-selection/chantier/${chantierId}/selections`, "GET", null, [
            {
                status: 404,
                message: "Erreur: chantier non trouvé",
            },
            {
                status: -1,
                message: "Erreur lors de la récupération des sélections du chantier",
            },
        ]).then((r) => {
            if (r != undefined) {
                setResponse(r.data?.data as WorkerChantierSelection[]);
                return r.data?.data as WorkerChantierSelection[];
            }
        }) as Promise<WorkerChantierSelection[]>;
    };

    return {
        loading,
        error,
        response,
        selectWorkerForChantier,
        deselectWorkerFromChantier,
        getWorkersForChantier,
        getChantiersForWorker,
        getSelectionsForChantier
    };
};

export default useWorkerSelection;