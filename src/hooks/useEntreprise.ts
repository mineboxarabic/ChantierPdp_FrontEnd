import {useAxios} from "./useAxios.ts";
import {RegisterUserData} from "../utils/user/RegisterUserData.ts";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import {AxiosResponseState} from "../utils/AxiosResponse.ts";
import {Entreprise} from "../utils/entities/Entreprise.ts";
import {EntrepriseDTO} from "../utils/entitiesDTO/EntrepriseDTO.ts";
import MapEntity from "./MapEntity.ts";


const apiUrl = import.meta.env.VITE_API_URL;


type EntrepriseResponse = EntrepriseDTO |EntrepriseDTO[] |Entreprise | Entreprise[] |boolean| number | null; // Could be one Pdp, a list of Pdps, or null.



const useEntreprise = ()=>{
    const [response, setReponse] = useState<EntrepriseResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [lastId, setLastId] = useState<number | null>(null);

    const notifications = useNotifications();
    const {fetch,responseAxios,errorAxios,loadingAxios} = useAxios<AxiosResponseState<EntrepriseResponse>>();
    const [entreprises, setEntreprises] = useState<Map<number, Entreprise>>(new Map<number, Entreprise>);


    useEffect(() => {
        if (responseAxios) {
            setReponse(responseAxios.data?.data as EntrepriseResponse);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);


    const getEntreprise = async (id:number) : Promise<Entreprise> => {

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
                setReponse(r.data?.data as Entreprise);
                return r;
            }
        }) as Promise<Entreprise>;
    }


    const getAllEntreprises = async () : Promise<Entreprise[]> => {

            return fetch(`api/entreprise`, 'GET', null, [
                {
                    status: 404,
                    message: 'GetAllEntreprises : Error entreprises not found',
                },
                {
                    status: -1,
                    message: 'GetAllEntreprises : Error while getting entreprises',
                }
            ]).then(r => {
                if(r != undefined){
                    setReponse(r.data?.data as Entreprise[]);

                    (r.data?.data as Entreprise[])?.map((entreprise) => {
                        if(entreprises != undefined){
                            entreprises.set(entreprise?.id as number, entreprise);
                        }
                        else{
                            setEntreprises(new Map<number, Entreprise>().set(entreprise?.id as number, entreprise));
                        }
                    }
                    );


                    return r.data?.data;
                }
            }) as Promise<Entreprise[]>;
    }


    const updateEntreprise = async (entreprise: Entreprise, id:number) : Promise<Entreprise> => {

            return fetch(`api/entreprise/${id}`, 'PATCH', entreprise, [
                {
                    status: 409,
                    message: 'UpdateEntreprise : Error entreprise already exists',
                },
                {
                    status: 404,
                    message: 'UpdateEntreprise : Error entreprise or api link not found',
                },
                {
                    status: -1,
                    message: 'UpdateEntreprise : Error while updating entreprise',
                }
            ]).then(r => {
                if(r != undefined){
                    setReponse(r.data?.data as Entreprise);
                    return r;
                }
            }) as Promise<Entreprise>;
    }

    const deleteEntreprise = async (id:number) : Promise<boolean> => {

                return fetch(`api/entreprise/${id}`, 'DELETE', null, [
                    {
                        status: 409,
                        message: 'DeleteEntreprise : Error entreprise already exists',
                    },
                    {
                        status: 404,
                        message: 'DeleteEntreprise : Error entreprise or api link not found',
                    },
                    {
                        status: 405,
                        message: 'DeleteEntreprise : You are not allowed to delete this entreprise',
                    },
                    {
                        status: -1,
                        message: 'DeleteEntreprise : Error while deleting entreprise',
                    }
                ]).then(r => {
                    if(r != undefined){
                        setReponse(r.data?.data as boolean);
                        return r.data?.data;
                    }
                }) as Promise<boolean>;

    }


    const createEntreprise = async (entreprise: Entreprise) : Promise<Entreprise> => {

                return fetch(`api/entreprise`, 'POST', entreprise, [
                    {
                        status: 409,
                        message: 'CreateEntreprise : Error entreprise already exists',
                    },
                    {
                        status: 404,
                        message: 'CreateEntreprise : Error entreprise or api link not found',
                    },
                    {
                        status: -1,
                        message: 'CreateEntreprise : Error while creating entreprise',
                    }
                ]).then(r => {

                    if(r != undefined){
                        setReponse(r.data?.data as Entreprise);
                        return r;
                    }
                }) as Promise<Entreprise>;
    }

    return {loading,error, response, lastId, getEntreprise, getAllEntreprises, updateEntreprise, deleteEntreprise, createEntreprise, entreprises};


}

export default useEntreprise;