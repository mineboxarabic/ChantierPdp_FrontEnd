import Risque from "./Risque.ts";

class AnalyseDeRisque {
    id: number;
    deroulementDesTaches: string;
    moyensUtilises: string;
    risque: Risque; // Assuming you have a Risque class
    mesuresDePrevention: string;


    constructor(
        id: number,
        deroulementDesTaches: string,
        moyensUtilises: string,
        risque: Risque,
        mesuresDePrevention: string,
        entrepriseExterieure: boolean,
        entrepriseUtilisatrice: boolean
    ) {
        this.id = id;
        this.deroulementDesTaches = deroulementDesTaches;
        this.moyensUtilises = moyensUtilises;
        this.risque = risque;
        this.mesuresDePrevention = mesuresDePrevention;
    }
}

export default AnalyseDeRisque;