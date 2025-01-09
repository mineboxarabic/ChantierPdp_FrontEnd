import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/index.scss'
import App from './App.tsx'
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews} from "./dev";
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import {LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs}>

        <DevSupport ComponentPreviews={ComponentPreviews}>
                <NotificationsProvider>
                <App/>
                </NotificationsProvider>

        </DevSupport>
        </LocalizationProvider>

    </StrictMode>,
)
