import {Entreprise} from "../entities/Entreprise.ts";

export type PdpDTO = {
    id?: number;
    operation?: string;
    lieuintervention?: string;
    datedebuttravaux?: Date;
    datefintravaux?: Date;
    effectifmaxisurchantier?: number;
    nombreinterimaires?: number;
    horairedetravail: string;
    horairesdetail?: string;
    icpdate?: Date;
    entrepriseexterieureIds?: number[];
    entrepriseUtilisatriseId?:number;
    medecintravaileu?: string;
    medecintravailee?: string;
    dateprevenircssct?: Date;
    dateprev?: Date;
    location?: string;
    dateInspection?: Date;
    entrepriseDInspection?: Entreprise;

}