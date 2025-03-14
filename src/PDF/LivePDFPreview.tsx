import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PDP_Page from "./PDP_Page.tsx";
import {Pdp} from "../utils/pdp/Pdp.ts";
import usePdp from "../hooks/usePdp.ts";


const LivePDFPreview = () => {

    const [currentPdp, setCurrentPdp] = React.useState<Pdp | null>(null);
    const {getPlanDePrevention} = usePdp();

    React.useEffect(() => {
        getPlanDePrevention(1).then((response) => {
            setCurrentPdp(response);
        });
    }, []);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
        <PDFViewer width="100%" height="100%">
         <PDP_Page currentPdp={currentPdp as Pdp} />
        </PDFViewer>
    </div>
);
};

export default LivePDFPreview;
