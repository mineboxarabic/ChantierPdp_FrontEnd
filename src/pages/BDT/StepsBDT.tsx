import { useEffect, useRef, useState } from "react";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Step2 from "./Step2.tsx";
import Step3 from "./Step3.tsx";

import Typography from "@mui/material/Typography";
import { useNotifications } from "@toolpad/core/useNotifications";
import {Box, Button, Modal} from "@mui/material";
import {PdpDTO} from "../../utils/pdp/PdpDTO.ts";

import {useParams} from "react-router-dom";
import useLocalisation from "../../hooks/useLocalisation.ts";
import CircularProgress from "@mui/material/CircularProgress";
import useBdt from "../../hooks/useBdt.ts";
import {BDT} from "../../utils/bdt/BDT.ts";

const StepsBDT = () => {
    const {loading, getBDT, saveBDT} = useBdt();

    const [currentId, setCurrentId] = useState<number | null>(null);
    const [currentBDT, setCurrentBDT] = useState<BDT | null>(null);
    const notifications = useNotifications();

    const [isChanged, setIsChanged] = useState(false);

    const {bdtId, pageNumber} = useParams();
    const [currentStep, setCurrentStep] = useState(pageNumber ? Number(pageNumber) : 1);

    const [isParamsValid, setIsParamsValid] = useState(false);
    const [pageError, setPageError] = useState<string | null>(null);

    const maxPageNumber = 3;


    const save = async (bdt: BDT) => {
        const notif = notifications.show("Saving PDP...");
        try {
            const response = await saveBDT(bdt, currentId as number);
            console.log("Response from saveBDT", response);
            setCurrentBDT(response as BDT);
        } catch (error) {
            console.error("Error saving BDT", error);
        } finally {
            notifications.close(notif);
        }
    };

    function saveChanges() {
        if (save && currentBDT) {
            save(currentBDT);
            console.log("Changes saved", currentBDT);
            setIsChanged(false);
        }
    }


    const errorCheck = async () => {
        if(!bdtId) {
            setPageError("Invalid Id of PDP");
            setIsParamsValid(false);
            return;
        }
        if(!pageNumber) {
            setPageError("Invalid page number, make sure to provide a page number between 1 and " + maxPageNumber);
            setIsParamsValid(false);
            return;
        }

        if(isNaN(Number(bdtId))) {
            setPageError("Invalid Id of PDP");
            setIsParamsValid(false);
            return;
        }

        if(isNaN(Number(pageNumber))) {
            setPageError("Invalid page number, make sure to provide a page number between 1 and " + maxPageNumber);
            setIsParamsValid(false);
            return;
        }

        const foundBDT:BDT = await getBDT(Number(bdtId));

        console.log("Found PDP", foundBDT);
        if(!foundBDT) {
            setPageError("PDP not found");
            setIsParamsValid(false);
            return;
        }
        setCurrentBDT(foundBDT);
        setCurrentId(Number(bdtId));
        setIsParamsValid(true);
    }

    useEffect(() => {
        if(!currentBDT) return;

        window.history.replaceState(null, "", `/create/bdt/${currentBDT?.id}/${currentStep}`);
    }, [currentStep,currentBDT?.id]);

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
                        <Typography variant={"h4"}>Error</Typography>
                        <Typography variant={"h6"}>{pageError}</Typography>
                    </> :
                    <>
                        <Typography variant={"h4"}>Bon de travaille - {currentId || "Loading..."}</Typography>

                        {currentStep === 1 && <Step1 save={save} currentBDT={currentBDT} saveCurrentBDT={setCurrentBDT} setIsChanged={setIsChanged} />}
{/*                        {currentStep === 2 && <Step2 save={save} currentPdp={currentBDT} saveCurrentPdp={setCurrentBDT} setIsChanged={setIsChanged} />}
                        {currentStep === 3 && <Step3 save={save} currentPdp={currentBDT} saveCurrentPdp={setCurrentBDT} setIsChanged={setIsChanged} />}*/}

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

export default StepsBDT;
