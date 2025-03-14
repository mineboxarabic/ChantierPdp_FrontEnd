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
Font.register({
    family: "Inter",
    src: "/fonts/Inter-Regular.ttf", // Ensure this path is correct
});



function App() {
//  const [count, setCount] = useState(0)

    return (
    <>
     <Router>
         <Routes>

             <Route path="/" element={<Layout mustLogin />}>
                 <Route index element={<Home />} />
                 <Route path="create/pdp" element={<Steps />} />
                 <Route path="create/pdp/:pdpId/:pageNumber" element={<Steps />} />

                 <Route path="create/bdt/:bdtId/:pageNumber" element={<StepsBDT />} />

                 <Route path={"create/chantier"} element={<CreateChantier/>}/>

                 <Route path={"profile"} element={<ProfilePage/>}/>
                 <Route path={"view/entreprises"} element={<ViewAllEntreprises/>}/>
                    <Route path={"view/users"} element={<ViewAllUser/>}/>
                 <Route path={"view/risques"} element={<ViewAllRisques/>}/>
                 <Route path={"view/localisations"} element={<ViewAllLocalisations/>}/>
                 <Route path={"view/permits"} element={<ViewAllPermits/>}/>
                 <Route path={"view/pdps"} element={<ViewAllPdps/>}/>
                 <Route path="preview/pdf" element={<LivePDFPreview />} />


             </Route>


             <Route path="/" element={<Layout mustLogin={false} />}>
                 <Route path="/login" element={<Login />} />
                 <Route path="register" element={<Register />} />
             </Route>
         </Routes>
     </Router>
    </>
  )
}

export default App
