
import Risque from "../entities/Risque.ts";
import Dispositif from "../entities/Dispositif.ts";
import Permit from "../entities/Permit.ts";
import { AuditSecu } from "../entities/AuditSecu.ts";

class ObjectAnswered {

    id?: number;
    risque_id?: number;
    dispositif_id?: number;
    permit_id?: number;
    auditSecu_id?: number;
    answer: boolean = false;
}


export default ObjectAnswered;