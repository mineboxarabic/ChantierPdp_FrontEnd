import Risque from "../entities/Risque.ts";

class AnalyseDeRisqueDTO {
    deroulementDesTaches: string;
    moyensUtilises: string;
    risque: Risque; // Assuming you have a Risque class
    mesuresDePrevention: string;


    constructor(
        deroulementDesTaches: string,
        moyensUtilises: string,
        risque: Risque,
        mesuresDePrevention: string,
        entrepriseExterieure: boolean,
        entrepriseUtilisatrice: boolean
    ) {
        this.deroulementDesTaches = deroulementDesTaches;
        this.moyensUtilises = moyensUtilises;
        this.risque = risque;
        this.mesuresDePrevention = mesuresDePrevention;
    }
}

export default AnalyseDeRisqueDTO;