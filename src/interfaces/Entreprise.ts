export type EntrepriseDTO = {
    id?: number;
    nom?: string;
    fonction?: string;
    numTel?: string;
    referentPdp?: string;
    responsableChantier?: string;
    raisonSociale?: string;
    isUtilisatrice: boolean;
}

export class Entreprise {
    id?: number;
    nom?: string;
    fonction?: string;
    numTel?: string;
    referentPdp?: string;
    responsableChantier?: string;
    raisonSociale?: string;
    isUtilisatrice?: boolean;

    public constructor() {

    }
}