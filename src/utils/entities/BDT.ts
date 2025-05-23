
import Risque from "./Risque.ts";
import {AuditSecu} from "./AuditSecu.ts";
import {EntityRef} from "../EntityRef.ts";
import ObjectAnsweredDTO from "../pdp/ObjectAnswered.ts";

class ComplementOuRappel {
    complement?: string;
    respect?: boolean;
}

export class BDT {
    id?: number;
    nom?: string;
    risques?: ObjectAnsweredDTO[];
    auditSecu?: ObjectAnsweredDTO[];
    complementOuRappels?: ComplementOuRappel[];

    signatureChargeDeTravail?: EntityRef;
    signatureDonneurDOrdre?: EntityRef;
    entrepriseExterieure?: EntityRef;
    chantier?: EntityRef;
    constructor() {

    }

    static createEmpty():BDT {
        return new BDT();
    }
}