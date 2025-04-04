import {useAxios} from "./useAxios.ts";
import {RegisterUserData} from "../utils/user/RegisterUserData.ts";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import useLocalStorage from "./useLocalStorage.ts";
import {Pdp} from "../utils/entities/Pdp.ts";
import {AxiosResponseState} from "../utils/AxiosResponse.ts";
import {PdpDTO} from "../utils/entitiesDTO/PdpDTO.ts";
import ObjectAnswered from "../utils/pdp/ObjectAnswered.ts";
import ObjectAnsweredEntreprises from "../utils/pdp/ObjectAnsweredEntreprises.ts";
import ObjectAnsweredObjects from "../utils/ObjectAnsweredObjects.ts";
import useEntreprise from "./useEntreprise.ts";
import {Entreprise} from "../utils/entities/Entreprise.ts";


const apiUrl = import.meta.env.VITE_API_URL;
type PdpResponse = PdpDTO | PdpDTO[] | Pdp | Pdp[] | number | boolean | null; // Could be one Pdp, a list of Pdps, or null.
const usePdp = ()=>{
    const [response, setReponse] = useState<PdpResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [lastId, setLastId] = useState<number | null>(null);

    const notifications = useNotifications();
    const {fetch,responseAxios,errorAxios,loadingAxios} = useAxios<AxiosResponseState<PdpResponse>>();

    const [pdps, setPdps] = useState<Map<number, Pdp>>(new Map<number, Pdp>);


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


        //const pdpD:PdpData = pdps.createObject();
        return fetch(`api/pdp/${id}`, 'PATCH', pdp, [
            {
                status: 409,
                message: 'SavePdp : Error pdps already exists',
            },
            {
                status: 404,
                message: 'SavePdp : Error pdps or api link not found',
            },
            {
                status: -1,
                message: 'SavePdp : Error while saving pdps',
            }
        ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as PdpDTO);


                return r;
            }
        }) as Promise<AxiosResponseState<PdpResponse>>;
    }

    const getPlanDePrevention = async (id:number):Promise<Pdp> =>{
        const pdp:Pdp = await fetch('api/pdp/' + id, 'GET', null,
            [{
                status: 404,
                message: 'Error pdps not found',
            },
                {
                    status: -1,
                    message: 'Error while getting pdps',
                }
            ]).then((response:AxiosResponseState<PdpResponse> | null): Pdp =>{
                setReponse(response?.data?.data as Pdp);
                return response?.data?.data as Pdp;

        }).catch(e=>{
            setError(e);
            if(e.status === 404){
                notifications.show('Error pdps not found', {severity:'error'});
            }else{

                notifications.show('Error while getting pdps', {severity: 'error'});
            }
        }) as Pdp;


        return pdp;
    }

    const getAllPDPs = async ():Promise<Pdp[]> => {
        return fetch('api/pdp/all', 'GET', null,
            [{
                status: 404,
                message: 'Error pdps not found',
            },
                {
                    status: -1,
                    message: 'Error while getting pdps',
                }
            ]).then((response:AxiosResponseState<PdpResponse> | null): Pdp[] =>{
            setReponse(response?.data?.data as Pdp[]);
            (response?.data?.data as Pdp[]).forEach(pdp => {

                if(pdp.id){
                    pdps.set(pdp.id, pdp);
                }

            });

            return response?.data?.data as Pdp[];

        }).catch(e=>{
            setError(e);
            if(e.status === 404){
                notifications.show('Error pdps not found', {severity:'error'});
            }else{

                notifications.show('Error while getting pdps', {severity: 'error'});
            }
        }) as Promise<Pdp[]>;
    }

    const createPdp = (pdpData:Pdp): Promise<Pdp>=>{
       return fetch('api/pdp/', 'POST', pdpData,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as Pdp);
                return r.data?.data as Pdp;
            }
       }) as Promise<Pdp>;

    }

    const deletePdp = (id:number): Promise<void>=>{
        return fetch('api/pdp/' + id, 'DELETE', null,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {}) as Promise<void>;
    }

    const getLastId = ():Promise<number> => {
        return fetch('api/pdp/last', 'GET', null,
            [{
                status: 404,
                message: 'Error pdps or api link not found',
            },
                {
                    status: -1,
                    message: 'Error while getting last pdps',
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

    const getRecentPdps= async ():Promise<Pdp[]> => {

        return fetch('api/pdp/recent', 'GET', null,
            [{
                status: 404,
                message: 'Error pdps or api link not found',
            },
                {
                    status: -1,
                    message: 'Error while getting last pdps',
                }
            ]).then(response=>{
            if(response?.status === 200){
               // setLastId(response.data);
                console.log('response',response);
                return response.data?.data as Pdp[];
            }
            return null;
        }
        ) as Promise<Pdp[]>;
    }


    const linkRisqueToPdp = async (risqueId:number, pdpId:number):Promise<ObjectAnswered> => {
        return fetch('api/pdp/' + pdpId + '/risque/' + risqueId, 'POST', null,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as ObjectAnswered);
                return r.data?.data as ObjectAnswered;
            }
        }) as Promise<ObjectAnswered>;
    }

    const linkDispositifToPdp = async (dispositifId:number, pdpId:number):Promise<ObjectAnswered> => {
        return fetch('api/pdp/' + pdpId + '/dispositif/' + dispositifId, 'POST', null,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as ObjectAnswered);
                return r.data?.data as ObjectAnswered;
            }
        }) as Promise<ObjectAnswered>;
    }

    const linkAnalyseToPdp = async (analyseId:number, pdpId:number):Promise<ObjectAnsweredEntreprises> => {
        return fetch('api/pdp/' + pdpId + '/analyse/' + analyseId, 'POST', null,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as ObjectAnsweredEntreprises);
                return r.data?.data as ObjectAnsweredEntreprises;
            }
        }) as Promise<ObjectAnsweredEntreprises>;
    }


    const linkPermitToPdp = async (permitId:number, pdpId:number):Promise<ObjectAnswered> => {
        return fetch('api/pdp/' + pdpId + '/permit/' + permitId, 'POST', null,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as ObjectAnswered);
                return r.data?.data as ObjectAnswered;
            }
        }) as Promise<ObjectAnswered>;
    }

    const unlinkPermitFromPdp = async (permitId:number, pdpId:number):Promise<ObjectAnswered> => {
        return fetch('api/pdp/' + pdpId + '/permit/' + permitId, 'DELETE', null,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as ObjectAnswered);
                return r.data?.data as ObjectAnswered;
            }
        }) as Promise<ObjectAnswered>;
    }

    const unlinkObjectFromPdp = async (objectId:number, pdpId:number, type:ObjectAnsweredObjects):Promise<ObjectAnswered> => {
       console.log('unlinkObjectFromPdp',objectId,pdpId,type);
        return fetch('api/pdp/' + pdpId + '/object/' + objectId + '/type/' + type.toString(), 'DELETE', null,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                },
                {
                    status: 400,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as ObjectAnswered);
                return r.data?.data as ObjectAnswered;
            }
        }) as Promise<ObjectAnswered>;

    }

    const linkObjectToPdp = async (objectId:number, pdpId:number, type:ObjectAnsweredObjects):Promise<ObjectAnswered> => {
        return fetch('api/pdp/' + pdpId + '/object/' + objectId + '/type/' + type.toString(), 'POST', null,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as ObjectAnswered);
                return r.data?.data as ObjectAnswered;
            }
        }) as Promise<ObjectAnswered>;
    }


    const existPdp = async (id:number):Promise<boolean> => {
        return fetch('api/pdp/' +  '/exist' + id, 'GET', null,
            [{
                status: 404,
                message: 'Error pdps not found',
            },
                {
                    status: -1,
                    message: 'Error while getting pdps',
                }
            ]).then((response:AxiosResponseState<PdpResponse> | null): boolean =>{
            setReponse(response?.data?.data as boolean);
            return response?.data?.data as boolean;
        }).catch(e=>{
            setError(e);
            if(e.status === 404){
                notifications.show('Error pdps not found', {severity:'error'});
            }else{

                notifications.show('Error while getting pdps', {severity: 'error'});
            }
        }) as Promise<boolean>;
    }


    const unlinkAnalyseToPdp = async (analyseId:number, pdpId:number):Promise<ObjectAnsweredEntreprises> => {
        return fetch('api/pdp/' + pdpId + '/analyse/' + analyseId, 'DELETE', null,
            [{
                status: 409,
                message: 'Error pdps already exists',
            },
                {
                    status: 404,
                    message: 'Error pdps or api link not found',
                }
            ]).then(r => {
            if(r != undefined){
                setReponse(r.data?.data as ObjectAnsweredEntreprises);
                return r.data?.data as ObjectAnsweredEntreprises;
            }
        }) as Promise<ObjectAnsweredEntreprises>;
    }

    return {loading,error, response, existPdp,lastId,getAllPDPs,deletePdp,linkAnalyseToPdp,unlinkAnalyseToPdp,unlinkPermitFromPdp,unlinkObjectFromPdp, linkObjectToPdp, linkPermitToPdp, getPlanDePrevention, createPdp, getLastId, linkDispositifToPdp,getRecentPdps, savePdp,linkRisqueToPdp, pdps};

}

export default usePdp;