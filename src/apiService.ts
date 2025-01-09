import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;


interface RegisterUserData {
    email: string;
    password: string;
    name: string;
}

export const getAllUsers = ()=>{
    console.log('getAllUsers ', apiUrl);
}


export const registerUser = (data:RegisterUserData)=>{
    axios.post(apiUrl+'api/user/register',data)
        .then(response=>{
        console.log(response);
    });
}