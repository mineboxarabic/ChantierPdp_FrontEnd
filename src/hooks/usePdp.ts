import {useAxios} from "./useAxios.ts";
import {RegisterUserData} from "../utils/user/RegisterUserData.ts";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import useLocalStorage from "./useLocalStorage.ts";
import PdpDTO, {Pdp} from "../utils/pdp/Pdp.ts";
import {AxiosResponseState} from "../utils/AxiosResponse.ts";


const apiUrl = import.meta.env.VITE_API_URL;
type PdpResponse = PdpDTO | PdpDTO[] | Pdp | Pdp[] | number | null; // Could be one Pdp, a list of Pdps, or null.
const usePdp = ()=>{
    const [response, setReponse] = useState<PdpResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [lastId, setLastId] = useState<number | null>(null);

    const notifications = useNotifications();
    const {fetch,responseAxios,errorAxios,loadingAxios} = useAxios<AxiosResponseState<PdpResponse>>();


    useEffect(() => {
        if (responseAxios) {
            setReponse(responseAxios.data?.data as PdpResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);


    const savePdp = async (pdp: Pdp, id:number) : Promise<AxiosResponseState<PdpResponse>> => {


        //const pdpD:PdpData = pdp.createObject();
        return fetch(`api/pdp/${id}`, 'PATCH', pdp, [
            {
                status: 409,
                message: 'SavePdp : Error pdp already exists',
            },
            {
                status: 404,
                message: 'SavePdp : Error pdp or api link not found',
            },
            {
                status: -1,
                message: 'SavePdp : Error while saving pdp',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as PdpDTO);
                return r;
            }
        }) as Promise<AxiosResponseState<PdpResponse>>;
    }

    const getPlanDePrevention = async (id:number):Promise<Pdp> =>{
        return fetch('api/pdp/' + id, 'GET', null,
            [{
                status: 404,
                message: 'Error pdp not found',
            },
                {
                    status: -1,
                    message: 'Error while getting pdp',
                }
            ]).then((response:AxiosResponseState<PdpResponse> | null): Pdp =>{
                setReponse(response?.data?.data as Pdp);

                return response?.data?.data as Pdp;

        }).catch(e=>{
            setError(e);
            if(e.status === 404){
                notifications.show('Error pdp not found', {severity:'error'});
            }else{

                notifications.show('Error while getting pdp', {severity: 'error'});
            }
        }) as Promise<Pdp>;



    }

    const createPdp = (pdpData:PdpDTO): Promise<void>=>{
       return fetch('api/pdp/', 'POST', pdpData,
            [{
                status: 409,
                message: 'Error pdp already exists',
            },
                {
                    status: 404,
                    message: 'Error pdp or api link not found',
                }
            ]).then(r => {}) as Promise<void>;

    }


    const getLastId = ():Promise<number> => {
        return fetch('api/pdp/last', 'GET', null,
            [{
                status: 404,
                message: 'Error pdp or api link not found',
            },
                {
                    status: -1,
                    message: 'Error while getting last pdp',
                }
            ]).then((response:AxiosResponseState<PdpResponse> | null)=>{
            if(response?.status === 200){
                //setLastId(response.data?.data as number);
                return response.data?.data;
            }
            return null;
         }
            ) as Promise<number>;


    };

    const getRecentPdps= async ():Promise<PdpDTO[]> => {

        return fetch('api/pdp/recent', 'GET', null,
            [{
                status: 404,
                message: 'Error pdp or api link not found',
            },
                {
                    status: -1,
                    message: 'Error while getting last pdps',
                }
            ]).then(response=>{
            if(response?.status === 200){
               // setLastId(response.data);
                console.log('response',response);
                return response.data?.data as PdpDTO[];
            }
            return null;
        }
        ) as Promise<PdpDTO[]>;
    }



    return {loading,error, response, lastId, getPlanDePrevention, createPdp, getLastId, getRecentPdps, savePdp};

}

export default usePdp;