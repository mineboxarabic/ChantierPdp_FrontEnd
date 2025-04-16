import {useCallback, useEffect, useState} from "react";
import axios, {Method, AxiosRequestHeaders, AxiosHeaders, AxiosError} from "axios";
import {useNotifications} from "@toolpad/core/useNotifications";
import useToken from "./useToken.ts";
import {useLoading} from "./useLoading.tsx";
const apiUrl =  import.meta.env.VITE_API_URL;

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
    const { showLoading, hideLoading } = useLoading();


    useEffect(() => {
        if (loadingAxios) {
            showLoading();
        } else {
            hideLoading();
        }
    }, [loadingAxios]);



    const getHeaders = useCallback((): Record<string, string> => {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
           // "Access-Control-Allow-Origin": "*",
           // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }, []);



    const fetch = async (
        url: string,
        method: Method = "GET",
        data: any = null,
        errorMapper: ErrorMapper[] = [],
        headers: AxiosHeaders = new AxiosHeaders(getHeaders())

    ): Promise<T | null> => {
        setLoadingAxios(true);
        const urlApi = apiUrl + url;
        const result = await axios({ url: urlApi, method, headers, data }).then((response) => {
            setMessage(response.data.message);
            return response;
        })
            .catch((err: AxiosError) => {
                console.error(err);
                // Check for token expiration (status 401 Unauthorized)
                if (err.response?.status === 401) {
                    const tokenExpiredMessage = "Your session has expired. Please log in again.";
                    setErrorAxios(tokenExpiredMessage);
                    notifications.show(tokenExpiredMessage, { severity: "error" });
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    // You could also trigger a logout action here if needed
                    return null;
                }

                if(err.response?.status === 403){
                    const forbiddenMessage = "You are not allowed to perform this action.";
                    setErrorAxios(forbiddenMessage);
                    notifications.show(forbiddenMessage, { severity: "error" });
                    return null;
                }

                if (!err.response) {
                    // Handle no internet connection
                    const noConnectionMessage = "No connection to the server. Please check your internet connection.";
                    setErrorAxios(noConnectionMessage);
                    notifications.show(noConnectionMessage, { severity: "error" });
                    return null;
                }
                if (errorMapper.length > 0) {
                    const statusExistsInMapper = errorMapper.some((error) => error.status === err.response?.status);
                    for (let i = 0; i < errorMapper.length; i++) {
                        if (errorMapper[i].status === err.response?.status) {
                            notifications.show(errorMapper[i].message, { severity: "error" });
                            setErrorAxios(errorMapper[i].message)
                        }
                        else if(errorMapper[i].status === -1 && !statusExistsInMapper){
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



    return {  responseAxios, errorAxios, loadingAxios, fetch};
};