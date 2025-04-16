import {Entreprise} from "../entities/Entreprise.ts";
import HoraireDeTravaille from "../pdp/HoraireDeTravaille.ts";
import MiseEnDisposition from "../pdp/MiseEnDisposition.ts";
import ObjectAnswered from "../pdp/ObjectAnswered.ts";
import ObjectAnsweredEntreprises from "../pdp/ObjectAnsweredEntreprises.ts";

export type PdpDTO = {

    id?: number;
    chantier?: number;

    entrepriseExterieure?:number;
    entrepriseExterieureEnt?:number;

    dateInspection?: Date;
    icpdate?: Date;
    horairesDetails?: string;
    entrepriseDInspection?: number
    horaireDeTravail?: HoraireDeTravaille;
    misesEnDisposition?: MiseEnDisposition;
    risques?: ObjectAnswered[];
    dispositifs?: ObjectAnswered[];
    permits?: ObjectAnswered[];
    analyseDeRisques?: ObjectAnsweredEntreprises[];
    signatures?: number[];
    datePrevenirCSSCT?: Date;
    datePrev?: Date;



}