//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './styles/App.scss'
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Layout from "./layout/Layout.tsx";
import Register from "./pages/Register.tsx";
import {Font} from "@react-pdf/renderer";
import {getRouteLists} from "./Routes.tsx";
import NotFoundPage from "./pages/common/NotFoundPage.tsx";
import {QueryClient, QueryClientProvider} from "react-query";

Font.register({
    family: "Inter",
    src: "/fonts/Inter-Regular.ttf", // Ensure this path is correct
});


const { protectedRoutes, publicRoutes } = getRouteLists();



function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                staleTime: 5000,
            }
        }
    });
    return (

        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
    );

}

export default App;