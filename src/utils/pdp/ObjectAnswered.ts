
import Risque from "../entities/Risque.ts";
import Dispositif from "../entities/Dispositif.ts";
import Permit from "../entities/Permit.ts";
import { AuditSecu } from "../entities/AuditSecu.ts";

class ObjectAnswered {

    id: number;
    risque?: Risque;
    dispositif?: Dispositif;
    permit?: Permit;
    auditSecu?: AuditSecu;
    answer: boolean;

    constructor(id:number, risque:Risque, answer:boolean) {
        this.id = id;
        this.risque = risque;
        this.answer = answer;
    }
}

export default ObjectAnswered;