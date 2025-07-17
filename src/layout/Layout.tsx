import React, {useEffect} from 'react';
import {Box, Typography} from '@mui/material';
import {Outlet} from "react-router-dom";
import NavBar from "../components/NavBar.tsx";
import {useAuth} from "../hooks/useAuth.tsx";

type LayoutProps = {
    title?: string;
    mustLogin: boolean;
}

const Layout: React.FC<LayoutProps> = ({title= '', mustLogin=true}) => {



    useEffect(() => {
        if(mustLogin){
            if(localStorage.getItem('user') == null){
                window.location.href = '/login';
            }
        }
    }, []);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden'}}>
            <NavBar/>
            <Box component="main" sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                width: '90%',
                mx: 'auto',
                flex: 1,
            }}>
                <Outlet/>
            </Box>


            <Box component="footer" sx={{py: 3, px: 2, mt: 'auto', backgroundColor: '#f5f5f5', width: '100%'}}>
                <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © 2023 PDP Danone Application
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;