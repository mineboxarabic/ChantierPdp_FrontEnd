import {useEffect, useRef, useState} from "react";
import Step1 from "./Step1.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Step2 from "./Step2.tsx";
import Step3 from "./Step3.tsx";
import Step4 from "./Step4.tsx";
import Step5 from "./Step5.tsx";
import Step6 from "./Step6.tsx";
import Typography from "@mui/material/Typography";
import PdpDTO, {Pdp} from "../../interfaces/Pdp.ts";
import usePdp from "../../hooks/usePdp.ts";
import {useNotifications} from "@toolpad/core/useNotifications";
import { AxiosResponseState } from "../../interfaces/AxiosResponse.ts";
const Steps = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const {lastId, loading,createPdp, getLastId, getPlanDePrevention, response, savePdp} = usePdp();
    const [currentId , setCurrentId] = useState<number | null>(null);
    const [currentPdp, setCurrentPdp] = useState<Pdp | null>(null);
    const notifications = useNotifications();
    const initialized = useRef(false);



    const save = async (pdp: Pdp) => {
        const notif = notifications.show("Saving PDP...");
        try {
            const response = await savePdp(pdp, currentId as number);
            setCurrentPdp(response.data?.data as PdpDTO);
        } catch (error) {
            console.error("Error saving PdDP", error);
        } finally {
            notifications.close(notif);
        }
    };


    useEffect(() => {
        //window.location.href = `/create/pdp/${lastId}`;
    }, [lastId]);

    ///On land the page
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            return;
        }
     const number = window.location.pathname.split('/').pop();
        if(number && !isNaN(parseInt(number))){
            console.log('number',number);
            setCurrentId(parseInt(number));
            getPlanDePrevention(parseInt(number)).then((response:Pdp) => {
                console.log('response',response);

                setCurrentPdp(response);
            })
        }
        else{
            const pdpDataEmpty: PdpDTO = Pdp.createEmpty();
            createPdp(pdpDataEmpty);
            getLastId().then((response: number):void => {


                setCurrentId(response as number);
                window.location.href = `/create/pdp/${response}`;
            } );



            //setCurrentId(lastId);
            //setCurrentId(lastId);
        }


        return () => {
            console.log('Cleanup on unmount');
        };
    }, []);


    return (
        <>

            {/*When the page number is 1 we load Step1 and so on*/}
            <Typography variant={"h4"}>Plan de prevention - {lastId}</Typography>

            {currentStep === 1 && <Step1 save={save} currentPdp={currentPdp}/>}
            {currentStep === 2 && <Step2/>}
            {currentStep === 3 && <Step3/>}
            {currentStep === 4 && <Step4/>}
            {currentStep === 5 && <Step5/>}
            {currentStep === 6 && <Step6/>}


            <BottomToolBar pageNumber={currentStep}  setPageNumber={setCurrentStep} maxNumber={6}/>

        </>
    )
}
export default Steps;