import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import {getAllUsers} from "../apiService.ts";
import useUser from "../hooks/useUser.ts";
import useLocalStorage from "../hooks/useLocalStorage.ts";
import {useAuth} from "../hooks/useAuth.tsx";
const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const {loading,error, response, login} = useAuth();

    const [errUsername, setErrUsername] = useState('');
    const [errPassword, setErrPassword] = useState('');

    const RGEX_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const RGEX_USERNAME = /^[a-zA-Z0-9_]{3,15}$/;



    function checkRegex(regex: RegExp, value: string): boolean {
        return regex.test(value);
    }

    const nameTyped = useRef(false);
    const usernameTyped = useRef(false);
    const passwordTyped = useRef(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Detect first time typing logic
        if (name === 'username' && !nameTyped.current) {
            nameTyped.current = true;
        } else if (name === 'username' && !usernameTyped.current) {
            usernameTyped.current = true;
        } else if (name === 'password' && !passwordTyped.current) {
            passwordTyped.current = true;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        console.log('Error:', errUsername);
    }, [errUsername]);

    useEffect(() => {
        if (checkRegex(RGEX_USERNAME, formData.username)) {
            setErrUsername('');
        } else {
            setErrUsername('Username must be valid');
        }
    }, [formData.username]);

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

        login({
            username: formData.username,
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
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    variant="outlined"
                    error={errUsername !== '' && usernameTyped.current}
                    helperText={errUsername && usernameTyped.current ? errUsername : ""}
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
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={errUsername !== '' || errPassword !== '' }>
                    Login
                </Button>
            </Box>
        </Box> :
            <>

            </>
    );
};

export default Login;