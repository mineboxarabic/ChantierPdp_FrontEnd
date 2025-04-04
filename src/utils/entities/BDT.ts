
import Risque from "./Risque.ts";
import {AuditSecu} from "./AuditSecu.ts";
import {EntityRef} from "../EntityRef.ts";
import ObjectAnswered from "../pdp/ObjectAnswered.ts";

class ComplementOuRappel {
    complement?: string;
    respect?: boolean;
}

export class BDT {
    id?: number;
    nom?: string;
    risques?: ObjectAnswered[];
    auditSecu?: ObjectAnswered[];
    complementOuRappels?: ComplementOuRappel[];

    signatureChargeDeTravail?: EntityRef;
    signatureDonneurDOrdre?: EntityRef;
    entrepriseExterieure?: EntityRef;
    chantier?: number;
    constructor() {

    }

    static createEmpty():BDT {
        return new BDT();
    }
}