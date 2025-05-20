// TODO: import type { Entreprise } from '???'; // UNKNOWN IMPORT PATH FOR THIS BAD BOY
import type { HoraireDeTravaille } from '../pdp/HoraireDeTravaille'; // CHECK THIS FUCKING PATH
import type { MedecinDuTravailleEE } from '../pdp/MedecinDuTravailleEE'; // CHECK THIS FUCKING PATH
import type { MisesEnDisposition } from '../pdp/MisesEnDisposition'; // CHECK THIS FUCKING PATH


export interface PdpUpdateDTO 
{

  operation?: string;
  lieuintervention?: string;
  datedebuttravaux?: Date;
  datefintravaux?: Date;
  effectifmaxisurchantier?: number;
  nombreinterimaires?: number;
  horaireDeTravail?: HoraireDeTravaille;
  horairesdetail?: string;
  icpdate?: Date;
  medecinDuTravailleEE?: MedecinDuTravailleEE;
  dateInspection?: Date;
  entrepriseDInspection?: Entreprise;
  entrepriseexterieure?: Entreprise[];
  entrepriseetutilisatrise?: Entreprise;
  misesEnDisposition?: MisesEnDisposition;
  medecintravaileu?: string;
  medecintravailee?: string;
  dateprevenircssct?: Date;
  dateprev?: Date;
  location?: string;

}
