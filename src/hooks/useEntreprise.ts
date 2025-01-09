import {useAxios} from "./useAxios.ts";
import {RegisterUserData} from "../interfaces/RegisterUserData.ts";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import useLocalStorage from "./useLocalStorage.ts";
import PdpDTO, {Pdp} from "../interfaces/Pdp.ts";
import {AxiosResponseState} from "../interfaces/AxiosResponse.ts";
import {EntrepriseDTO} from "../interfaces/Entreprise.ts";


const apiUrl = import.meta.env.VITE_API_URL;
type EntrepriseResponse = EntrepriseDTO | EntrepriseDTO[] | number | null; // Could be one Pdp, a list of Pdps, or null.
const useEntreprise = ()=>{
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


    const getEntreprise = async (id:number) : Promise<EntrepriseDTO> => {

        return fetch(`api/entreprise/${id}`, 'GET', null, [
            {
                status: 404,
                message: 'GetEntreprise : Error entreprise not found',
            },
            {
                status: -1,
                message: 'GetEntreprise : Error while getting entreprise',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as EntrepriseDTO);
                return r;
            }
        }) as Promise<EntrepriseDTO>;
    }




    return {loading,error, response, lastId, getEntreprise};

}

export default useEntreprise;