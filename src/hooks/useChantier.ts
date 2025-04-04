import { useAxios } from "./useAxios.ts";
import { useEffect, useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import Chantier from "../utils/entities/Chantier.ts";
import { AxiosResponseState } from "../utils/AxiosResponse.ts";
import usePdp from "./usePdp.ts";
import {Pdp} from "../utils/entities/Pdp.ts";
import {Entreprise} from "../utils/entities/Entreprise.ts";
import useEntreprise from "./useEntreprise.ts";

type ChantierResponse = Chantier | Chantier[] | number | boolean | null;

const useChantier = () => {
    const [response, setResponse] = useState<ChantierResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const notifications = useNotifications();
    const { fetch, responseAxios, errorAxios, loadingAxios } = useAxios<AxiosResponseState<ChantierResponse>>();

    useEffect(() => {
        if (responseAxios) {
            setResponse(responseAxios.data?.data as ChantierResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);

    const saveChantier = async (chantier: Chantier, id: number): Promise<AxiosResponseState<ChantierResponse>> => {
        console.log("Chantier saveChantier", chantier);
        return fetch(`api/chantier/${id}`, "PATCH", chantier, [
            {
                status: 409,
                message: "SaveChantier: Error chantier already exists",
            },
            {
                status: 404,
                message: "SaveChantier: Error chantier or API link not found",
            },
            {
                status: -1,
                message: "SaveChantier: Error while saving chantier",
            },
        ]).then((r) => {
            if (r != undefined) {
                setResponse(r.data?.data as Chantier);
                return r;
            }
        }) as Promise<AxiosResponseState<ChantierResponse>>;
    };

    const getChantier = async (id: number): Promise<Chantier> => {
        const chantier:Chantier =  await fetch(`api/chantier/${id}`, "GET", null, [
            {
                status: 404,
                message: "Error chantier not found",
            },
            {
                status: -1,
                message: "Error while getting chantier",
            },
        ])
            .then((response: AxiosResponseState<ChantierResponse> | null): Chantier => {
                setResponse(response?.data?.data as Chantier);
                console.log("Chantier getChantier", response?.data);
                return response?.data?.data as Chantier;
            })
            .catch((e) => {
                setError(e);
                notifications.show("Error while getting chantier", { severity: "error" });
            }) as Chantier;


        return chantier;
    };

    const getAllChantiers = async (): Promise<Chantier[]> => {
        return fetch("api/chantier/all", "GET", null, [
            {
                status: 404,
                message: "Error chantier not found",
            },
            {
                status: -1,
                message: "Error while getting chantier",
            },
        ])
            .then((response: AxiosResponseState<ChantierResponse> | null): Chantier[] => {
                setResponse(response?.data?.data as Chantier[]);
                return response?.data?.data as Chantier[];
            })
            .catch((e) => {
                setError(e);
                notifications.show("Error while getting chantiers", { severity: "error" });
            }) as Promise<Chantier[]>;
    };

    const createChantier = (chantier: Chantier): Promise<Chantier> => {
        return fetch("api/chantier/", "POST", chantier, [
            {
                status: 409,
                message: "Error chantier already exists",
            },
            {
                status: 404,
                message: "Error chantier or API link not found",
            },
        ]).then((r) => {
            if (r != undefined) {
                setResponse(r.data?.data as Chantier);
                return r.data?.data as Chantier;
            }
        }) as Promise<Chantier>;
    };

    const deleteChantier = (id: number): Promise<void> => {
        return fetch(`api/chantier/${id}`, "DELETE", null, [
            {
                status: 409,
                message: "Error chantier already exists",
            },
            {
                status: 404,
                message: "Error chantier or API link not found",
            },
        ]).then(response=>{


        }) as Promise<void>;
    };

    const getLastId = (): Promise<number> => {
        return fetch("api/chantier/last", "GET", null, [
            {
                status: 404,
                message: "Error chantier or API link not found",
            },
            {
                status: -1,
                message: "Error while getting last chantier",
            },
        ]).then((response: AxiosResponseState<ChantierResponse> | null) => {
            if (response?.status === 200) {
                return response.data?.data;
            }
            return null;
        }) as Promise<number>;
    };

    const getRecentChantiers = async (): Promise<Chantier[]> => {
        return fetch("api/chantier/recent", "GET", null, [
            {
                status: 404,
                message: "Error chantier or API link not found",
            },
            {
                status: -1,
                message: "Error while getting recent chantiers",
            },
        ]).then((response) => {
            if (response?.status === 200) {
                return response.data?.data as Chantier[];
            }
            return null;
        }) as Promise<Chantier[]>;
    };

    const existChantier = async (id: number): Promise<boolean> => {
        return fetch(`api/chantier/exist/${id}`, "GET", null, [
            {
                status: 404,
                message: "Error chantier not found",
            },
            {
                status: -1,
                message: "Error while getting chantier",
            },
        ])
            .then((response: AxiosResponseState<ChantierResponse> | null): boolean => {
                setResponse(response?.data?.data as boolean);
                return response?.data?.data as boolean;
            })
            .catch((e) => {
                setError(e);
                notifications.show("Error while checking chantier existence", { severity: "error" });
            }) as Promise<boolean>;
    };

    return {
        loading,
        error,
        response,
        existChantier,
        getAllChantiers,
        deleteChantier,
        getChantier,
        createChantier,
        getLastId,
        getRecentChantiers,
        saveChantier,
    };
};

export default useChantier;
