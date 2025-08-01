import RisqueDTO from "./RisqueDTO";


export class AnalyseDeRisqueDTO 
{

  id?: number;
  deroulementDesTaches?: string;
  moyensUtilises?: string;
  risque?: RisqueDTO;
  mesuresDePrevention?: string;

  constructor(
    deroulementDesTaches?: string,
    moyensUtilises?: string,
    risque?: RisqueDTO,
    mesuresDePrevention?: string
  ) {
    this.deroulementDesTaches = deroulementDesTaches;
    this.moyensUtilises = moyensUtilises;
    this.risque = risque;
    this.mesuresDePrevention = mesuresDePrevention;
  }

}
