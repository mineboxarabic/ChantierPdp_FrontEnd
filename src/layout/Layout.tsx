import React, {useEffect} from 'react';
import {Box, Container, Typography} from '@mui/material';
import {Outlet} from "react-router-dom";
import NavBar from "../components/NavBar.tsx";

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
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <NavBar/>
            <Container component="main" sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Outlet/>
            </Container>


            <Box component="footer" sx={{py: 3, px: 2, mt: 'auto', backgroundColor: '#f5f5f5'}}>
                <Container>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © 2023 PDP Danone Application
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout;