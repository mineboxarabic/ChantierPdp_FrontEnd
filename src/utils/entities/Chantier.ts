import {Entreprise} from "./Entreprise.ts";
import User from "./User.ts";
import Localisation from "./Localisation.ts";
import {BDT} from "./BDT.ts";
import {Pdp} from "./Pdp.ts";
import Worker from "./Worker.ts";
import {EntityRef} from "../EntityRef.ts";
import WorkerChantierSelection from "./WorkerChantierSelection.ts";

class Chantier {
    id?: number;
    nom?: string;
    operation?: string;
    dateDebut?: Date;
    dateFin?: Date;
    nbHeurs?: number;
    effectifMaxiSurChantier?: number;
    nombreInterimaires?: number;
    entrepriseExterieurs?: Entreprise[];
    entrepriseUtilisatrice?: Entreprise;
    localisation?: Localisation;
    donneurDOrdre?: User;
    bdts?: BDT[];
    pdps?: Pdp[];
    workers?: Worker[];
    isAnnuelle?:boolean;
    workerSelections?: WorkerChantierSelection[];

    entrepriseExterieurEnts?: Entreprise[];
    entrepriseUtilisatriceEnt?: Entreprise;
    localisationEnt?: Localisation;
    workerEnts?: Worker[];
}

export default Chantier;