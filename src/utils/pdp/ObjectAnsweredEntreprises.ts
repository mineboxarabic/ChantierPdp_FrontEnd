
import Risque from "../entities/Risque.ts";
import Dispositif from "../entities/Dispositif.ts";
import AnalyseDeRisque from "../entities/AnalyseDeRisque.ts";

class ObjectAnsweredEntreprises {

    id: number;
    analyseDeRisque?: AnalyseDeRisque;
    ee: boolean;
    eu: boolean;
    constructor(id:number, analiseDeRisque: AnalyseDeRisque, EE: boolean, EU: boolean){
        this.id = id;
        this.analyseDeRisque = analiseDeRisque;
        this.ee = EE;
        this.eu = EU;
    }
}

export default ObjectAnsweredEntreprises;