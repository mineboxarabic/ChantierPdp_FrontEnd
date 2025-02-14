import { useEffect, useRef, useState } from "react";
import Step1 from "./Step1.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Step2 from "./Step2.tsx";
import Step3 from "./Step3.tsx";
import Step4 from "./Step4.tsx";
import Step5 from "./Step5.tsx";
import Step6 from "./Step6.tsx";
import Typography from "@mui/material/Typography";
import { Pdp } from "../../utils/pdp/Pdp.ts";
import usePdp from "../../hooks/usePdp.ts";
import { useNotifications } from "@toolpad/core/useNotifications";
import { Box, Button } from "@mui/material";
import {PdpDTO} from "../../utils/pdp/PdpDTO.ts";

const Steps = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const { lastId, createPdp, getLastId, getPlanDePrevention, savePdp } = usePdp();
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [currentPdp, setCurrentPdp] = useState<Pdp | null>(null);
    const notifications = useNotifications();
    const initialized = useRef(false);
    const [isChanged, setIsChanged] = useState(false);

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

    useEffect(() => {
        if (lastId && lastId !== null && lastId !== undefined) {
            window.location.href = `/create/pdp/${lastId}`;
        }
    }, [lastId]);

    useEffect(() => {
        if (currentId) {
            window.history.pushState({}, "", `/create/pdp/${currentId}/${currentStep}`);
        }
    }, [currentStep, currentId]);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            return;
        }

        const url_list: string[] = window.location.pathname.split("/");
        const number = url_list[url_list.length - 2];
        const pageNumber = url_list[url_list.length - 1];

        console.log("number", number);
        console.log("pageNumber", pageNumber);

        if (pageNumber) {
            setCurrentStep(parseInt(pageNumber));
        }

        if (number && !isNaN(parseInt(number))) {
            const parsedNumber = parseInt(number);
            setCurrentId(parsedNumber);
            getPlanDePrevention(parsedNumber).then((response: Pdp) => {
                setCurrentPdp(response);
            });
        } else {
            const pdpDataEmpty: Pdp = Pdp.createEmpty();
            createPdp(pdpDataEmpty as PdpDTO).then(() => {
                getLastId().then((response: number) => {
                    if (response && !isNaN(response)) {
                        setCurrentId(response);
                        window.location.href = `/create/pdp/${response}`;
                    } else {
                        console.error("Failed to get a valid lastId.");
                    }
                });
            });
        }

        return () => {
            console.log("Cleanup on unmount");
        };
    }, []);

    return (
        <>
            <Typography variant={"h4"}>Plan de prevention - {currentId || "Loading..."}</Typography>

            {currentStep === 1 && <Step1 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}
            {currentStep === 2 && <Step2 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}
            {currentStep === 3 && <Step3 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}
            {currentStep === 4 && <Step4 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}
            {currentStep === 5 && <Step5 />}
            {currentStep === 6 && <Step6 save={save} currentPdp={currentPdp} saveCurrentPdp={setCurrentPdp} setIsChanged={setIsChanged} />}

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

            <BottomToolBar pageNumber={currentStep} setPageNumber={setCurrentStep} maxNumber={6} />
        </>
    );
};

export default Steps;
