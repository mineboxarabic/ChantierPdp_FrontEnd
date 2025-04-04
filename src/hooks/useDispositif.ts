import {useAxios} from "./useAxios.ts";
import {RegisterUserData} from "../utils/user/RegisterUserData.ts";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import {AxiosResponseState} from "../utils/AxiosResponse.ts";
import DispositifDTO from "../utils/entitiesDTO/DispositifDTO.ts";
import Dispositif from "../utils/entities/Dispositif.ts";

type EntrepriseResponse = DispositifDTO |DispositifDTO[] |Dispositif | Dispositif[] |boolean| number | null; // Could be one Pdp, a list of Pdps, or null.
const useDispositif = ()=>{
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


    const getDispositif = async (id:number) : Promise<DispositifDTO> => {

        return fetch(`api/dispositif/${id}`, 'GET', null, [
            {
                status: 404,
                message: 'GetDispositif : Error dispositif not found',
            },
            {
                status: -1,
                message: 'GetDispositif : Error while getting dispositif',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as DispositifDTO);
                return r;
            }
        }) as Promise<DispositifDTO>;
    }


    const getAllDispositifs = async () : Promise<Dispositif[]> => {

        return fetch(`api/dispositif`, 'GET', null, [
            {
                status: 404,
                message: 'GetAllDispositifs : Error dispositif not found',
            },
            {
                status: -1,
                message: 'GetAllDispositifs : Error while getting dispositif',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as Dispositif[]);
                return r.data?.data;
            }
        }) as Promise<Dispositif[]>;
    }


    const updateDispositif = async (dispositif: Dispositif, id:number) : Promise<Dispositif> => {

        return fetch(`api/dispositif/${id}`, 'PATCH', dispositif, [
            {
                status: 409,
                message: 'UpdateDispositif : Error dispositif already exists',
            },
            {
                status: 404,
                message: 'UpdateDispositif : Error dispositif or api link not found',
            },
            {
                status: -1,
                message: 'UpdateDispositif : Error while updating dispositif',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as Dispositif);
                return r;
            }
        }) as Promise<Dispositif>;
    }

    const deleteDispositif = async (id:number) : Promise<boolean> => {

        return fetch(`api/dispositif/${id}`, 'DELETE', null, [
            {
                status: 409,
                message: 'DeleteDispositif : Error dispositif already exists',
            },
            {
                status: 404,
                message: 'DeleteDispositif : Error dispositif or api link not found',
            },
            {
                status: 405,
                message: 'DeleteDispositif : Error dispositif not deletable',
            },
            {
                status: -1,
                message: 'DeleteDispositif : Error while deleting dispositif',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as boolean);
                return r.data?.data;
            }
        }) as Promise<boolean>;

    }


    const createDispositif = async (dispositif: Dispositif) : Promise<Dispositif> => {

        return fetch(`api/dispositif`, 'POST', dispositif, [
            {
                status: 409,
                message: 'CreateDispositif : Error dispositif already exists',
            },
            {
                status: 404,
                message: 'CreateDispositif : Error dispositif or api link not found',
            },
            {
                status: -1,
                message: 'CreateDispositif : Error while creating dispositif',
            }
        ]).then(r => {

            if(r != undefined){
                setReponse(r.data?.data as Dispositif);
                return r;
            }
        }) as Promise<Dispositif>;
    }

    return {loading,error, response, lastId, getDispositif, getAllDispositifs, updateDispositif, deleteDispositif, createDispositif};


}

export default useDispositif;