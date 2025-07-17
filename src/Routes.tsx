// src/routes/routes.js
import ViewAllEntreprises from "./pages/Entreprise/ViewAllEntreprises.tsx";
import ViewAllUser from "./pages/User/ViewAllUser.tsx";
import ViewAllRisques from "./pages/Risque/ViewAllRsiques.tsx";
import ViewAllLocalisations from "./pages/Localisation/ViewAllLocalisations.tsx";
import ViewAllPermits from "./pages/Permit/ViewAllPermits.tsx";
import LivePDFPreview from "./PDF/LivePDFPreview.tsx";

import { Font } from "@react-pdf/renderer";
import ViewAllPdps from "./pages/PDP/ViewAllPdps.tsx";
import StepsBDT from "./pages/BDT/StepsBDT.tsx";
import CreateChantier from "./pages/Chantier/createChantier.tsx";
import ViewChantier from "./pages/Chantier/ViewChantier.tsx";
import EditCreateChantier from "./pages/Chantier/EditCreateChantier.tsx";
import Home from "./pages/Home.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ViewPdp from "./pages/PDP/ViewPdp.tsx";
import CRUDRisque from "./pages/Risque/CRUDRisque.tsx";
import RisqueManager from "./pages/Risque/RisqueManager.tsx";
import UserManager from "./pages/User/UserManager.tsx";
import PermitManager from "./pages/Permit/PermiManager.tsx";
import EntrepriseManager from "./pages/Entreprise/EntrepriseManager.tsx";
import LocalisationManager from "./pages/Localisation/LocalisationManager.tsx";
import PdpManager from "./components/Pdp/PdpManager.tsx";
import WorkerManager from "./pages/Worker/WorkerManager.tsx";
import EditCreateBdt from "./pages/BDT/EditCreateBDT.tsx";
import ErrorBoundary from "./pages/ErrorBoundary.tsx";
import AuditSecuManager from "./pages/AudiSecu/AudiSecuManager.tsx";
import ViewBdt from "./pages/BDT/ViewBdt.tsx";
import Dashboard from "./pages/Home/Dashboard.tsx";
import CreateChantierPage from "./pages/Chantier/CreateChantierPage.tsx";
import EditChantierPage from "./pages/Chantier/EditChantierPage.tsx";
import ViewChantierPage from "./pages/Chantier/ViewChantierPage.tsx";
import CreatePdpPage from "./pages/PDP/CreatePdpPage.tsx";
import EditCreatePdp from "./pages/PDP/EditCreatePdp.tsx";
import ExampleUsage from "./components/CustomViewComponent.example.tsx";
import ExampleCustomViewPage from "./components/CustomViewPage.example.tsx";


//Standard naming
/*
 /user/login
 /create/pdps

* */

// Route definitions
export const ROUTES = {
    // Home route
    HOME: {
        path: "/",
        element: <Dashboard />
    },


    EDIT_PDP: {
        path: "/edit/pdps/:id",
        element: <EditCreatePdp />
    },
    CREATE_PDP: {
        path: "/create/pdps/:chantierId",
        element: <CreatePdpPage />
    },
    VIEW_PDP:{
        path:"/view/pdps/:id",
        element:<ViewPdp />
    }
,
PDP_LIST:{
    path:"/list/pdps",
    element: <h1>List Pdps MAKE IT </h1>
}
,
    // BDT routes
    BDT_STEPS: {
        path: "/create/bdt/:bdtId/:pageNumber",
        element: <StepsBDT />
    },
    CREATE_BDT:{
        path:"/create/bdt/:chantierId",
        element:<ErrorBoundary><EditCreateBdt /> </ErrorBoundary>
    },
    VIEW_BDT:{
        path:"/view/bdt/:id",
        element:<ErrorBoundary><ViewBdt/> </ErrorBoundary>
    },
    EDIT_BDT:{
        path:"/edit/bdt/:id",
        element:<ErrorBoundary><EditCreateBdt /> </ErrorBoundary>
    }
,
    // Chantier routes
    CREATE_CHANTIER: {
        path: "/create/chantier",
        element: <CreateChantierPage />
    },
    VIEW_CHANTIER: {
        path: "/view/chantier/:id",
        element: <ViewChantierPage />
    },
    EDIT_CHANTIER: {
        path: "/edit/chantier/:id",
        element: <EditChantierPage />
    },
    CHANTIER_LIST: {
        path: "/list/chantier",
        element: <h1>Chantier List MAKE IT </h1>
    }
,
    // Profile route
    PROFILE: {
        path: "/profile",
        element: <ProfilePage />
    },

    // View routes
    VIEW_ENTREPRISES: {
        path: "/view/entreprises",
        element: <EntrepriseManager />
    },
    VIEW_USERS: {
        path: "/view/users",
        element: <UserManager />
    },
    //Risques
    VIEW_RISQUES: {
        path: "/view/risques",
        element: <RisqueManager />
    },
    CRUD_RISQUES:{
      path: "/crud/risques",
        element: <CRUDRisque />
    },
    VIEW_LOCALISATIONS: {
        path: "/view/localisations",
        element: <LocalisationManager />
    },
    VIEW_PERMITS: {
        path: "/view/permits",
        element: <PermitManager />
    },
    VIEW_PDPS: {
        path: "/view/pdps",
        element: <PdpManager />
    },
    VIEW_WORKERS:
        {
        path: "/view/workers",
        element: <WorkerManager />
    },
    // PDF Preview route
    PREVIEW_PDF: {
        path: "/preview/pdf",
        element: <LivePDFPreview />
    },

    //Audit
    CRUD_AUDISECU:{
        path:"/view/auditsecus",
        element:<ErrorBoundary><AuditSecuManager /></ErrorBoundary>
    },

    // Auth routes
    LOGIN: {
        path: "/login",
        element: <Login />
    },
    REGISTER: {
        path: "/register",
        element: <Register />
    },

    EXEMPLE:{
        path: "/exemple",
        element: <ExampleCustomViewPage/>
    }
};
export type NameOfRoute = keyof typeof ROUTES
// Helper function to get a route with parameters
export const getRoute = (routeName:NameOfRoute, params = {}) => {
    const route = ROUTES[routeName];
    if (!route) return '/';

    let path = route.path;

    // Replace params in the path
    Object.entries(params).forEach(([key, value]) => {

            path = path.replace(`:${key}`, value as string);

    });

    return path;
};

// Get route lists for the app
export const getRouteLists = () => {
    // Protected routes that require login
    const protectedRoutes = [
        ROUTES.HOME,
        ROUTES.EDIT_PDP,
        ROUTES.CREATE_PDP,
        ROUTES.BDT_STEPS,
        ROUTES.VIEW_PDP,
        ROUTES.CREATE_CHANTIER,
        ROUTES.VIEW_CHANTIER,
        ROUTES.EDIT_CHANTIER,
        ROUTES.PROFILE,
        ROUTES.VIEW_ENTREPRISES,
        ROUTES.VIEW_USERS,
        ROUTES.VIEW_RISQUES,
        ROUTES.CRUD_RISQUES,
        ROUTES.VIEW_LOCALISATIONS,
        ROUTES.VIEW_PERMITS,
        ROUTES.VIEW_PDPS,
        ROUTES.PREVIEW_PDF,
        ROUTES.VIEW_WORKERS,
        ROUTES.CREATE_BDT,
        ROUTES.CRUD_AUDISECU,
        ROUTES.VIEW_BDT,
        ROUTES.EDIT_BDT,
        ROUTES.EXEMPLE,
    ];

    // Public routes (no login required)
    const publicRoutes = [
        ROUTES.LOGIN,
        ROUTES.REGISTER
    ];

    return { protectedRoutes, publicRoutes };
};