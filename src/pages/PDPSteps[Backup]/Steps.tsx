import { useEffect, useRef, useState } from "react";
import Step1 from "./Step1.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Step2 from "./Step2.tsx";
import Step3 from "./Step3.tsx";
import Step4 from "./Step4.tsx";
import Step5 from "./Step5.tsx";
import Step6 from "./Step6.tsx";
import Typography from "@mui/material/Typography";
import { Pdp } from "../../utils/entities/Pdp.ts";
import usePdp from "../../hooks/usePdp.ts";
import { useNotifications } from "@toolpad/core/useNotifications";
import {Box, Button, Modal} from "@mui/material";
import {PdpDTO} from "../../utils/entitiesDTO/PdpDTO.ts";
import Step7 from "./Step7.tsx";
import {useParams} from "react-router-dom";
import useLocalisation from "../../hooks/useLocalisation.ts";
import CircularProgress from "@mui/material/CircularProgress";

const Steps = () => {
    const {loading, getPlanDePrevention, savePdp} = usePdp();
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [currentPdp, setCurrentPdp] = useState<Pdp | null>(null);
    const notifications = useNotifications();

    const [isChanged, setIsChanged] = useState(false);

    const {pdpId, pageNumber} = useParams();
    const [currentStep, setCurrentStep] = useState(pageNumber ? Number(pageNumber) : 1);

    const [isParamsValid, setIsParamsValid] = useState(false);
    const [pageError, setPageError] = useState<string | null>(null);

    const maxPageNumber = 7;


    const save = async (pdp: Pdp) => {
        const notif = notifications.show("Saving PDP...");
        try {
            const response = await savePdp(pdp, currentId as number);
            console.log("Response from savePdp", response);
            setCurrentPdp(response.data?.data as Pdp);
        } catch (error) {
            console.error("Error saving PDP", error);
        } finally {
            notifications.close(notif);
        }
    };

    function saveChanges() {
        if (save && currentPdp) {
            save(currentPdp);
            console.log("Changes saved", currentPdp);
            setIsChanged(false);
        }
    }


    const errorCheck = async () => {
        if(!pdpId) {
            setPageError("Invalid Id of PDP");
            setIsParamsValid(false);
            return;
        }
        if(!pageNumber) {
            setPageError("Invalid page number, make sure to provide a page number between 1 and " + maxPageNumber);
            setIsParamsValid(false);
            return;
        }

        if(isNaN(Number(pdpId))) {
            setPageError("Invalid Id of PDP");
            setIsParamsValid(false);
            return;
        }

        if(isNaN(Number(pageNumber))) {
            setPageError("Invalid page number, make sure to provide a page number between 1 and " + maxPageNumber);
            setIsParamsValid(false);
            return;
        }

        const foundPdp:Pdp = await getPlanDePrevention(Number(pdpId));

        console.log("Found PDP", foundPdp);
        if(!foundPdp) {
            setPageError("PDP not found");
            setIsParamsValid(false);
            return;
        }
        setCurrentPdp(foundPdp);
        setCurrentId(Number(pdpId));
        setIsParamsValid(true);
    }

    useEffect(() => {
        if(!currentPdp) return;

        window.history.replaceState(null, "", `/create/pdp/${currentPdp?.id}/${currentStep}`);
    }, [currentStep,currentPdp?.id]);

    useEffect(() => {

        errorCheck();


        return () => {
            console.log("Cleanup on unmount");
        };
    }, []);

    return (
        <>

            {
                loading ? <Modal open={true} sx={{backgroundColor:"transparent"}}>
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                        <CircularProgress />
                    </Box>
                </Modal> : null
            }

            {
                !isParamsValid ?
                    <>
                        {/*Make beatifull error message*/ }

                        <Typography variant={"h4"}>Error</Typography>
                        <Typography variant={"h6"}>{pageError}</Typography>
                    </> :
           <>
                <Typography variant={"h4"}>Plan de prevention - {currentId || "Loading..."}</Typography>

                {currentStep === 1 && <Step1 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}
                {currentStep === 2 && <Step2 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}
                {currentStep === 3 && <Step3 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}
                {currentStep === 4 && <Step4 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}
                {currentStep === 5 && <Step5 />}
                {currentStep === 6 && <Step6 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}
                {currentStep === 7 && <Step7 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}

                {isChanged && (
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: "20px",
                            right: "20px",
                            zIndex: 1000,
                        }}
                    >
                        <Button variant="contained" color="success" onClick={saveChanges}>
                            Save Changes
                        </Button>
                    </Box>
                )}

                <BottomToolBar pageNumber={currentStep} setPageNumber={setCurrentStep} maxNumber={maxPageNumber} />
           </>
            }
        </>

    );
};

export default Steps;
