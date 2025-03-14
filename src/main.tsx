import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/index.scss'
import App from './App.tsx'
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews} from "./dev";
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import {LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {ThemeProvider} from "@mui/material";
import theme from "./Theme.tsx";
import {AuthProvider} from "./hooks/useAuth.tsx";
import {LoadingProvider} from "./hooks/useLoading.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
            <NotificationsProvider>
                    <LoadingProvider>

        <AuthProvider >
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>

        <DevSupport ComponentPreviews={ComponentPreviews}>
                <App/>

        </DevSupport>
        </LocalizationProvider>
        </ThemeProvider>
        </AuthProvider>
                    </LoadingProvider>
            </NotificationsProvider>

    </StrictMode>,
)
