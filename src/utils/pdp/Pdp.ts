import {Entreprise} from "../entreprise/Entreprise.ts";
import { PdpDTO } from "./PdpDTO.ts";
import HoraireDeTravaille from "./HoraireDeTravaille.ts";
import MiseEnDisposition from "./MiseEnDisposition.ts";
import {MedecinDuTravailleEE} from "./MedecinDuTravailleEE.ts";
import ObjectAnswered from "./ObjectAnswered.ts";
import Dispositif from "../dispositif/Dispositif.ts";
import ObjectAnsweredEntreprises from "./ObjectAnsweredEntreprises.ts";
import Localisation from "../Localisation/Localisation.ts";
import Permit from "../permit/Permit.ts";

export class Pdp  {
    id?: number;
    operation?: string;
    lieuintervention?: string;
    datedebuttravaux?: Date;
    datefintravaux?: Date;
    effectifmaxisurchantier?: number;
    nombreinterimaires?: number;
    horaireDeTravail?: HoraireDeTravaille;
    horairesdetail?: string;
    icpdate?: Date;
    entrepriseexterieure?: Entreprise[];
    entrepriseutilisatrice?: Entreprise;
    misesEnDisposition?: MiseEnDisposition;
    medecintravaileu?: string;
    medecinDuTravailleEE?: MedecinDuTravailleEE;
    datePrevenirCSSCT?: Date;
    datePrev?: Date;
    location?: string;
    risques?: ObjectAnswered[];
    dispositifs?: ObjectAnswered[];
    analyseDeRisques?: ObjectAnsweredEntreprises[];
    sousTraitants?: Entreprise[];

    dateInspection?: Date;
    entrepriseDInspection?: Entreprise;

    localisation?: Localisation;

    permits?: ObjectAnswered[];

    constructor() {

    }

    //Make create empty object

    static createEmpty(): PdpDTO {
        return {
            operation: "",
            lieuintervention: "",
            datedebuttravaux: new Date(),
            datefintravaux: new Date(),
            effectifmaxisurchantier: 0,
            nombreinterimaires: 0,
            horairedetravail: "",
            horairesdetail: "",
            icpdate: new Date(),
            entrepriseexterieureIds: [],
            entrepriseUtilisatriseId: 0,
            medecintravaileu: "",
            medecintravailee: "",
            dateprevenircssct: new Date(),
            dateprev: new Date(),
            location: ""
        }
    }


}