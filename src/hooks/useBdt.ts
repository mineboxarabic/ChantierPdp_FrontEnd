import { useAxios } from "./useAxios.ts";
import { useEffect, useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { AxiosResponseState } from "../utils/AxiosResponse.ts";
import { BDT } from "../utils/bdt/BDT.ts";
import Risque from "../utils/Risque/Risque.ts";
import { AuditSecu } from "../utils/bdt/AuditSecu.ts";
import ObjectAnswered from "../utils/pdp/ObjectAnswered.ts";

const useBdt = () => {
    const [response, setResponse] = useState<BDT | BDT[] |boolean|null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const notifications = useNotifications();
    const { fetch, responseAxios, errorAxios, loadingAxios } = useAxios<AxiosResponseState<BDT | BDT[] | boolean>>();

    useEffect(() => {
        if (responseAxios) {
            setResponse(responseAxios.data?.data as BDT | BDT[]);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);

    const getAllBDTs = async (): Promise<BDT[]> => {
        return fetch("api/bdt/all", "GET", null, [
            { status: 404, message: "Error BDTs not found" },
            { status: -1, message: "Error while getting BDTs" }
        ]).then((response) => response?.data?.data as BDT[]);
    };

    const saveBDT = async (bdt: BDT, id:number): Promise<BDT> => {
        return fetch("api/bdt/"+id, "PATCH", bdt, [
            { status: 409, message: "Error BDT already exists" },
            { status: 404, message: "Error BDT or API link not found" }
        ]).then((response) =>{
            setResponse(response?.data?.data as BDT);
            return response?.data?.data as BDT;
        } );
    }

    const getBDT = async (id: number): Promise<BDT> => {
        return fetch(`api/bdt/${id}`, "GET", null, [
            { status: 404, message: "Error BDT not found" },
            { status: -1, message: "Error while getting BDT" }
        ]).then((response) => response?.data?.data as BDT);
    };

    const createBDT = (bdtData: BDT): Promise<BDT> => {
        return fetch("api/bdt/", "POST", bdtData, [
            { status: 409, message: "Error BDT already exists" },
            { status: 404, message: "Error BDT or API link not found" }
        ]).then((response)=>{
            setResponse(response?.data?.data as BDT);
            return response?.data?.data as BDT;
        }) as Promise<BDT>;
    };

    const deleteBDT = (id: number): Promise<boolean> => {
        return fetch(`api/bdt/${id}`, "DELETE", null, [
            { status: 404, message: "Error BDT not found" }
        ]).then(()=>{
            //notifications.addNotification({ message: "BDT deleted", type: "success" });
            return true;
        }) as Promise<boolean>;
    };

    const linkRisqueToBDT = async (bdtId: number, risqueId: number): Promise<ObjectAnswered> => {
        return fetch(`api/bdt/${bdtId}/risque/${risqueId}`, "POST", null, [
            { status: 404, message: "Error BDT or risque not found" }
        ]).then((r) => r?.data?.data as ObjectAnswered);
    };

    const linkAuditToBDT = async (bdtId: number, auditId: number): Promise<ObjectAnswered> => {
        return fetch(`api/bdt/${bdtId}/audit/${auditId}`, "POST", null, [
            { status: 404, message: "Error BDT or audit not found" }
        ]).then((r) => r?.data?.data as ObjectAnswered);
    };
    const unlinkRisqueToBDT = async (bdtId: number, risqueId: number): Promise<ObjectAnswered> => {
        return fetch(`api/bdt/${bdtId}/risque/${risqueId}`, "DELETE", null, [
            { status: 404, message: "Error BDT or risque not found" }
        ]).then((r) => r?.data?.data as ObjectAnswered);
    };

    const unlinkAuditToBDT = async (bdtId: number, auditId: number): Promise<ObjectAnswered> => {
        return fetch(`api/bdt/${bdtId}/audit/${auditId}`, "DELETE", null, [
            { status: 404, message: "Error BDT or audit not found" }
        ]).then((r) => r?.data?.data as ObjectAnswered);
    };
    return { loading, error, response, saveBDT,getAllBDTs,unlinkRisqueToBDT, unlinkAuditToBDT, getBDT, createBDT, deleteBDT, linkRisqueToBDT, linkAuditToBDT };
};

export default useBdt;