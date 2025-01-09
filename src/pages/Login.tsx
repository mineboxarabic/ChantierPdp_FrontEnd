import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import {getAllUsers} from "../apiService.ts";
import useUser from "../hooks/useUser.ts";
import useLocalStorage from "../hooks/useLocalStorage.ts";
const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const {loading,error, response, loginUser} = useUser();

    const [errEmail, setErrEmail] = useState('');
    const [errPassword, setErrPassword] = useState('');

    const RGEX_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const RGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;



    function checkRegex(regex: RegExp, value: string): boolean {
        return regex.test(value);
    }

    const nameTyped = useRef(false);
    const emailTyped = useRef(false);
    const passwordTyped = useRef(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Detect first time typing logic
        if (name === 'name' && !nameTyped.current) {
            nameTyped.current = true;
        } else if (name === 'email' && !emailTyped.current) {
            emailTyped.current = true;
        } else if (name === 'password' && !passwordTyped.current) {
            passwordTyped.current = true;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        if (checkRegex(RGEX_EMAIL, formData.email)) {
            setErrEmail('');
        } else {
            setErrEmail('Email must be valid');
        }
    }, [formData.email]);

    useEffect(() => {
        if (checkRegex(RGEX_PASSWORD, formData.password)) {
            setErrPassword('');
        } else {
            setErrPassword(
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'
            );
        }
    }, [formData.password]);

    useEffect(()=>{
        if(localStorage.getItem('user')){
            window.location.href = '/';
        }
    })

    useEffect(() => {
        if(response){
          //  window.location.reload();
        }
    }, [loading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //  console.log('Form Data:', formData);

        loginUser({
            name: formData.name,
            email:formData.email,
            password:formData.password,
        });
    };

    return (
        localStorage.getItem('user') == null ?
        <Box
            sx={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '16px',
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    width: '100%',
                    maxWidth: '400px',
                }}
            >
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    error={errEmail !== '' && emailTyped.current}
                    helperText={errEmail && emailTyped.current ? errEmail : ""}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    error= {errPassword !== '' && passwordTyped.current}
                    helperText={errPassword && passwordTyped.current ? errPassword : ""}
                    value={formData.password}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={errEmail !== '' || errPassword !== '' }>
                    Login
                </Button>
            </Box>
        </Box> :
            <>

            </>
    );
};

export default Login;