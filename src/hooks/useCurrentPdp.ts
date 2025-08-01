import {useState} from "react";
import { PdpDTO as Pdp } from "../utils/entitiesDTO/PdpDTO";

const useCurrentPdp = ()=> {
    const [currentPdp, setCurrentPdp] = useState<Pdp | null>(null);




    return {currentPdp, setCurrentPdp};
}