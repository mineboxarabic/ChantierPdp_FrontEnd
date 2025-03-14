
import Risque from "../Risque/Risque.ts";
import {AuditSecu} from "./AuditSecu.ts";

class ComplementOuRappel {
    id?: number;
    complement?: string;
    respect?: boolean;

    constructor() {

    }
}

export class BDT {
    id?: number;
    nom?: string;
    risques?: Risque[];
    auditSecu?: AuditSecu[];
    complementOuRappels?: ComplementOuRappel[];

    constructor() {

    }

    static createEmpty():BDT {
        return new BDT();
    }
}