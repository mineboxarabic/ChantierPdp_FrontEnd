import {useEffect, useState} from "react";
import axios, {Method, AxiosRequestHeaders, AxiosHeaders, AxiosError} from "axios";
import {useNotifications} from "@toolpad/core/useNotifications";
const apiUrl = import.meta.env.VITE_API_URL;


export interface ErrorMapper{
    status?: number;
    message: string | null;
}

export const useAxios  =<T = any> () => {
    const [responseAxios, setResponseAxios] = useState<T | null>(null);
    const [errorAxios, setErrorAxios] = useState<string | null>(null);
    const [loadingAxios, setLoadingAxios] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const notifications = useNotifications();

    const fetch = async (
        url: string,
        method: Method = "GET",
        data: any = null,
        errorMapper: ErrorMapper[] = [],
        headers: AxiosHeaders = new AxiosHeaders({ "Content-Type": "application/json","Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS" }),

    ): Promise<T | null> => {
        setLoadingAxios(true);
        const urlApi = apiUrl + url;
        const result = await axios({ url: urlApi, method, headers, data }).then((response) => {
            setMessage(response.data.message);
            return response;
        })
            .catch((err: AxiosError) => {
            setMessage(err?.message);
                if (!err.response) {
                    // Handle no internet connection
                    const noConnectionMessage = "No connection to the server. Please check your internet connection.";
                    setErrorAxios(noConnectionMessage);
                    notifications.show(noConnectionMessage, { severity: "error" });
                    return null;
                }
                if (errorMapper.length > 0) {
                    for (let i = 0; i < errorMapper.length; i++) {

                        if (errorMapper[i].status === err.response?.status) {
                            notifications.show(errorMapper[i].message, { severity: "error" });
                       setErrorAxios(errorMapper[i].message)
                        }
                        else if(errorMapper[i].status === -1){
                            notifications.show(errorMapper[i].message, { severity: "error" });
                           setErrorAxios(errorMapper[i].message)
                        }
                    }
                }else{
                    setErrorAxios(err?.message || "An error occurred");
                    notifications.show(err?.message || "An error occurred", { severity: "error" });
                }
                return null;



        }).finally(()=>{setLoadingAxios(false)});

        if(result){
            setResponseAxios(result as T);
            return result as T;
        }

        return null;
    };



    return {  responseAxios, errorAxios, loadingAxios, fetch };
};
