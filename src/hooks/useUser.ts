import {useAxios} from "./useAxios.ts";
import {RegisterUserData} from "../utils/user/RegisterUserData.ts";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";

import { useNotifications } from '@toolpad/core/useNotifications';
import {UserDTO} from "../utils/user/UserDTO.ts";
import User from "../utils/user/User.ts";


const apiUrl = import.meta.env.VITE_API_URL;

type UserResponse = UserDTO | User[] | UserDTO[] | User | number | null; // Could be one Pdp, a list of Pdps, or null.
const useUser = ()=>{
    const [response, setReponse] = useState<UserResponse | null>(null);
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

    const createUser = (user:User): Promise<User> =>{
        return fetch('api/user','POST', user, [
            {
                status: 500,
                message: 'Error while creating user',
            },
            {
                status: -1,
                message: 'Error while creating user -1',
            }
        ]).then((response: User) => {
            setReponse(response as User);
            return response as User;
        }) as Promise<User>;
    }

    const getCurrentUser = ()=>{
        return localStorage.getItem("user");
    }


    const getUsers = async () : Promise<User[]> => {

            return fetch(`api/user`, 'GET', null, [
                {
                    status: 404,
                    message: 'Error users not found',
                },
                {
                    status: -1,
                    message: 'Error while getting users',
                }
            ]).then(r => {

                    setReponse(r.data?.data);
                    return r.data?.data;

            }) as Promise<User[]>;
    }

    const getUser = async (id:number):Promise<User> =>{
        return fetch('api/user/' + id, 'GET', null,
            [{
                status: 404,
                message: 'Error user not found',
            },
                {
                    status: -1,
                    message: 'Error while getting user',
                }
            ]).then((response:User): User =>{
                setReponse(response as User);

                return response as User;

        }).catch(e=>{
            setError(e);
            if(e.status === 404){
                notifications.show('Error user not found', {severity:'error'});
            }else{

                notifications.show('Error while getting user', {severity: 'error'});
            }
        }) as Promise<User>;
    }


    const updateUser = (user:User):Promise<User> =>{
       return fetch('api/user/' + user.id, 'PUT', user, [
            {
                status: 404,
                message: 'Error user not found',
            },
            {
                status: 500,
                message: 'Error while updating user',
            },
            {
                status: -1,
                message: 'Error while updating user -1',
            }
        ]).then((response: User)=>{
            setReponse(response as User);
            return response as User;
        }) as Promise<User>;
    }


    const deleteUser = (id:number):Promise<void> =>{
        return fetch('api/user/' + id, 'DELETE', null, [
            {
                status: 404,
                message: 'Error user not found',
            },
            {
                status: 500,
                message: 'Error while deleting user',
            },
            {
                status: -1,
                message: 'Error while deleting user -1',
            }
        ]).then(()=>{
            setReponse(null);
        }) as Promise<void>;
    }
    return {response, error, loading, registerUser, createUser, loginUser, deleteUser ,getCurrentUser, getUsers, getUser, updateUser}
}

export default useUser;