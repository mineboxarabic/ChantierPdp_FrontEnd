// TODO: import type { Risque } from '???'; // UNKNOWN IMPORT PATH FOR THIS BAD BOY

import Risque from "../entities/Risque";
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
