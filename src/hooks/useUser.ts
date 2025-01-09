import {useAxios} from "./useAxios.ts";
import {RegisterUserData} from "../interfaces/RegisterUserData.ts";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import useLocalStorage from "./useLocalStorage.ts";


const apiUrl = import.meta.env.VITE_API_URL;

const useUser = ()=>{
    const [response, setReponse] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const notifications = useNotifications();

    const { fetch, responseAxios, errorAxios, loadingAxios } = useAxios();


    useEffect(() => {
        if (responseAxios) {
            setReponse(responseAxios);
        }
        if (errorAxios) {
            setError(errorAxios);
        }
        setLoading(loadingAxios);
    }, [responseAxios, errorAxios, loadingAxios]);


    const registerUser = (registerData:RegisterUserData)=>{

        fetch('api/user/register', 'POST', registerData,[{
            status: 409,
            message: 'Error user already exists',
        },{
            status: 500,
            message: 'Error while registering user register'
        },{
            status: -1,
            message: 'Error while registering user register -1'
        }])
    }

    const loginUser = (loginData:RegisterUserData)=>{
        if(localStorage.getItem("user")){
            //User already logged in
            notifications.show("user already logged in")
            return;
        }


        fetch('api/user/login', 'POST', loginData, [{
            status: 409,
            message: 'Error logining user login (Worng password)',
        },{
            status: 404,
            message: 'Error logining user login (User not found)'
        },{
            status: 500,
            message: 'Error logining user login'
        },{
            status: -1,
            message: 'Error logining user login -1'
        }]).then(response=>{
            if(response.status === 200){
                //Logged in with success
                localStorage.setItem("user", JSON.stringify(response.data));
                notifications.show('Successfully logged in', {severity:'success'});
            }
        });
    }

    const createUser = () =>{

    }

    const getCurrentUser = ()=>{
        return localStorage.getItem("user");
    }

    return {response, error, loading, registerUser, createUser, loginUser, getCurrentUser}
}

export default useUser;