import {useAxios} from "./useAxios.ts";
import {RegisterUserData} from "../utils/user/RegisterUserData.ts";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import {AxiosResponseState} from "../utils/AxiosResponse.ts";
import RisqueDTO from "../utils/Risque/RisqueDTO.ts";
import Risque from "../utils/Risque/Risque.ts";

type EntrepriseResponse = RisqueDTO |RisqueDTO[] |Risque | Risque[] |boolean| number | null; // Could be one Pdp, a list of Pdps, or null.
const useRisque = ()=>{
    const [response, setReponse] = useState<EntrepriseResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [lastId, setLastId] = useState<number | null>(null);

    const notifications = useNotifications();
    const {fetch,responseAxios,errorAxios,loadingAxios} = useAxios<AxiosResponseState<EntrepriseResponse>>();


    useEffect(() => {
        if (responseAxios) {
            setReponse(responseAxios.data?.data as EntrepriseResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);


    const getRisque = async (id:number) : Promise<Risque> => {

        return fetch(`api/risque/${id}`, 'GET', null, [
            {
                status: 404,
                message: 'GetRisque : Error risque not found',
            },
            {
                status: -1,
                message: 'GetRisque : Error while getting risque',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as Risque);
                return r;
            }
        }) as Promise<Risque>;
    }


    const getAllRisques = async () : Promise<Risque[]> => {

        return fetch(`api/risque`, 'GET', null, [
            {
                status: 404,
                message: 'GetAllRisques : Error risque not found',
            },
            {
                status: -1,
                message: 'GetAllRisques : Error while getting risque',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as Risque[]);
                return r.data?.data;
            }
        }) as Promise<Risque[]>;
    }


    const updateRisque = async (risque: Risque, id:number) : Promise<Risque> => {

        return fetch(`api/risque/${id}`, 'PATCH', risque, [
            {
                status: 409,
                message: 'UpdateRisque : Error risque already exists',
            },
            {
                status: 404,
                message: 'UpdateRisque : Error risque or api link not found',
            },
            {
                status: -1,
                message: 'UpdateRisque : Error while updating risque',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as Risque);
                return r;
            }
        }) as Promise<Risque>;
    }

    const deleteRisque = async (id:number) : Promise<boolean> => {

        return fetch(`api/risque/${id}`, 'DELETE', null, [
            {
                status: 409,
                message: 'DeleteRisque : Error risque already exists',
            },
            {
                status: 404,
                message: 'DeleteRisque : Error risque or api link not found',
            },
            {
                status: 405,
                message: 'DeleteRisque : Error risque not deletable',
            },
            {
                status: -1,
                message: 'DeleteRisque : Error while deleting risque',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as boolean);
                return r.data?.data;
            }
        }) as Promise<boolean>;

    }


    const createRisque = async (risque: Risque) : Promise<Risque> => {

        return fetch(`api/risque`, 'POST', risque, [
            {
                status: 409,
                message: 'CreateRisque : Error risque already exists',
            },
            {
                status: 404,
                message: 'CreateRisque : Error risque or api link not found',
            },
            {
                status: -1,
                message: 'CreateRisque : Error while creating risque',
            }
        ]).then(r => {

            if(r != undefined){
                setReponse(r.data?.data as Risque);
                return r;
            }
        }) as Promise<Risque>;
    }

    return {loading,error, response, lastId, getRisque, getAllRisques, updateRisque, deleteRisque, createRisque};


}

export default useRisque;