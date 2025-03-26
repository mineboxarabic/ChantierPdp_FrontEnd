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
import EditCreatePdp from "./pages/PDP/EditCreatePdp.tsx";
import Home from "./pages/Home.tsx";
import Steps from "./pages/PDPSteps/Steps.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";


//Standard naming
/*
 /user/login
 /create/pdp

* */

// Route definitions
export const ROUTES = {
    // Home route
    HOME: {
        path: "/",
        element: <Home />
    },

    // PDP routes
    EDIT_PDP_STEPS: {
        path: "/create/pdp/:pdpId/:pageNumber",
        element: <Steps />
    },
    EDIT_PDP: {
        path: "/edit/pdp/:id",
        element: <EditCreatePdp />
    },
    CREATE_PDP: {
        path: "/create/pdp/:chantierId",
        element: <EditCreatePdp />
    },

    // BDT routes
    BDT_STEPS: {
        path: "/create/bdt/:bdtId/:pageNumber",
        element: <StepsBDT />
    },

    // Chantier routes
    CREATE_CHANTIER: {
        path: "/create/chantier",
        element: <CreateChantier />
    },
    VIEW_CHANTIER: {
        path: "/view/chantier/:id",
        element: <ViewChantier />
    },
    EDIT_CHANTIER: {
        path: "/edit/chantier/:id",
        element: <EditCreateChantier />
    },

    // Profile route
    PROFILE: {
        path: "/profile",
        element: <ProfilePage />
    },

    // View routes
    VIEW_ENTREPRISES: {
        path: "/view/entreprises",
        element: <ViewAllEntreprises />
    },
    VIEW_USERS: {
        path: "/view/users",
        element: <ViewAllUser />
    },
    VIEW_RISQUES: {
        path: "/view/risques",
        element: <ViewAllRisques />
    },
    VIEW_LOCALISATIONS: {
        path: "/view/localisations",
        element: <ViewAllLocalisations />
    },
    VIEW_PERMITS: {
        path: "/view/permits",
        element: <ViewAllPermits />
    },
    VIEW_PDPS: {
        path: "/view/pdps",
        element: <ViewAllPdps />
    },

    // PDF Preview route
    PREVIEW_PDF: {
        path: "/preview/pdf",
        element: <LivePDFPreview />
    },

    // Auth routes
    LOGIN: {
        path: "/login",
        element: <Login />
    },
    REGISTER: {
        path: "/register",
        element: <Register />
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
        path = path.replace(`:${key}`, value);
    });

    return path;
};

// Get route lists for the app
export const getRouteLists = () => {
    // Protected routes that require login
    const protectedRoutes = [
        ROUTES.HOME,
        ROUTES.EDIT_PDP_STEPS,
        ROUTES.EDIT_PDP,
        ROUTES.CREATE_PDP,
        ROUTES.BDT_STEPS,
        ROUTES.CREATE_CHANTIER,
        ROUTES.VIEW_CHANTIER,
        ROUTES.EDIT_CHANTIER,
        ROUTES.PROFILE,
        ROUTES.VIEW_ENTREPRISES,
        ROUTES.VIEW_USERS,
        ROUTES.VIEW_RISQUES,
        ROUTES.VIEW_LOCALISATIONS,
        ROUTES.VIEW_PERMITS,
        ROUTES.VIEW_PDPS,
        ROUTES.PREVIEW_PDF
    ];

    // Public routes (no login required)
    const publicRoutes = [
        ROUTES.LOGIN,
        ROUTES.REGISTER
    ];

    return { protectedRoutes, publicRoutes };
};