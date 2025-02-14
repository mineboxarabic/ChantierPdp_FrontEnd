
import Risque from "../Risque/Risque.ts";
import Dispositif from "../dispositif/Dispositif.ts";
import AnalyseDeRisque from "../AnalyseDeRisque/AnalyseDeRisque.ts";

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