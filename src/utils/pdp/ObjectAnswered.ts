
import Risque from "../entities/Risque.ts";
import Dispositif from "../entities/Dispositif.ts";
import Permit from "../entities/Permit.ts";
import { AuditSecu } from "../entities/AuditSecu.ts";
import ObjectAnsweredObjects from "../ObjectAnsweredObjects.ts";

class ObjectAnsweredDTO {
    id?: number;
    pdp?: number;
    objectType?: ObjectAnsweredObjects;
    objectId: number = -1;
    answer: boolean | null = null;
    ee?: boolean;
    eu?: boolean;
}


export default ObjectAnsweredDTO;