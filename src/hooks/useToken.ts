import {useEffect, useState} from "react";

const useToken = () =>{
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if(token){
            localStorage.setItem("token", token);
        }

        if(!token){
            const localToken = localStorage.getItem("token");
            if(localToken){
                setToken(localToken);
            }
        }

    }, [token]);




    return {token, setToken};
}

export default useToken;