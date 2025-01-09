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


function App() {
//  const [count, setCount] = useState(0)


    return (
    <>
     <Router>
         <Routes>

             <Route path="/" element={<Layout mustLogin />}>
                 <Route index element={<Home />} />
                 <Route path="create/pdp" element={<Steps />} />
                 <Route path="create/pdp/:id" element={<Steps />} />


                 <Route path={"profile"} element={<ProfilePage/>}/>


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
