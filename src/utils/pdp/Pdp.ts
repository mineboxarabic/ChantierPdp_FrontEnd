import {Entreprise} from "../entreprise/Entreprise.ts";
import { PdpDTO } from "./PdpDTO.ts";

export class Pdp  {
    id?: number;
    operation?: string;
    lieuintervention?: string;
    datedebuttravaux?: Date;
    datefintravaux?: Date;
    effectifmaxisurchantier?: number;
    nombreinterimaires?: number;
    horairedetravail?: string;
    horairesdetail?: string;
    icpdate?: Date;
    entrepriseexterieure?: Entreprise[];
    entrepriseutilisatrice?: Entreprise;
    medecintravaileu?: string;
    medecintravailee?: string;
    dateprevenircssct?: Date;
    dateprev?: Date;
    location?: string;

    //Make create object function



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

    //Make create object

}