import { AnalyseDeRisqueDTO } from "../entitiesDTO/AnalyseDeRisqueDTO";

class ObjectAnsweredEntreprises {

    id: number;
    analyseDeRisque?: AnalyseDeRisqueDTO;
    ee: boolean;
    eu: boolean;
    constructor(id:number, analiseDeRisque: AnalyseDeRisqueDTO, EE: boolean, EU: boolean){
        this.id = id;
        this.analyseDeRisque = analiseDeRisque;
        this.ee = EE;
        this.eu = EU;
    }
}

export default ObjectAnsweredEntreprises;