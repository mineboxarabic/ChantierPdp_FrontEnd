import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import {getAllUsers} from "../apiService.ts";
import useUser from "../hooks/useUser.ts";
import {useAuth} from "../hooks/useAuth.tsx";
const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const {loading,error, response, register} = useAuth();
    const [errName, setErrName] = useState('');
    const [errEmail, setErrEmail] = useState('');
    const [errPassword, setErrPassword] = useState('');

    const RGEX_USERNAME = /^[a-zA-Z0-9_]{3,15}$/;
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
        if (checkRegex(RGEX_USERNAME, formData.name)) {
            setErrName('');
        } else {
            setErrName(
                'Username must be between 3 and 15 characters long and contain only letters, numbers and underscores'
            );
        }
    }, [formData.name]);

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
       // getAllUsers();
        console.log(error);
    },[])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
      //  console.log('Form Data:', formData);

        register({
            username: formData.name,
            email:formData.email,
            password:formData.password,
        }).then((response) => {
            window.location.href = '/login';
        });
    };

    return (

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
                Register
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
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    error={errName !== '' && nameTyped.current}
                    helperText={nameTyped.current ? errName : ""}
                    fullWidth
                    required
                />
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
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={errName !== '' || errEmail !== '' || errPassword !== '' }>
                    Register
                </Button>
            </Box>
        </Box>
    );
};

export default Register;