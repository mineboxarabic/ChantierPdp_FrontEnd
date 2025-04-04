//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './styles/App.scss'
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Layout from "./layout/Layout.tsx";
import Register from "./pages/Register.tsx";
import Step1 from "./pages/PDPSteps/Step1.tsx";
import Login from "./pages/Login.tsx";
import Step2 from "./pages/PDPSteps/Step2.tsx";
import Step3 from "./pages/PDPSteps/Step3.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import Step4 from "./pages/PDPSteps/Step4.tsx";
import Step5 from "./pages/PDPSteps/Step5.tsx";
import Step6 from "./pages/PDPSteps/Step6.tsx";
import Steps from "./pages/PDPSteps/Steps.tsx";
import {Font} from "@react-pdf/renderer";
import {getRouteLists} from "./Routes.tsx";
import NotFoundPage from "./pages/common/NotFoundPage.tsx";

Font.register({
    family: "Inter",
    src: "/fonts/Inter-Regular.ttf", // Ensure this path is correct
});


const { protectedRoutes, publicRoutes } = getRouteLists();



function App() {
    return (
        <Router>
            <Routes>
                {/* Protected routes with mustLogin=true */}
                <Route path="/" element={<Layout mustLogin />}>
                    {protectedRoutes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path === "/" ? "" : route.path}
                            element={route.element}
                            index={route.path === "/"}
                        />
                    ))}
                </Route>

                {/* Public routes with mustLogin=false */}
                <Route path="/" element={<Layout mustLogin={false} />}>
                    {publicRoutes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                </Route>


                {/* Fallback route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );

}

export default App;