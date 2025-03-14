import {useState} from "react";
import {Pdp} from "../utils/pdp/Pdp.ts";

const useCurrentPdp = ()=> {
    const [currentPdp, setCurrentPdp] = useState<Pdp | null>(null);




    return {currentPdp, setCurrentPdp};
}