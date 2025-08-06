import type { ChantierStatus } from '../enums/ChantierStatus.ts'; // CHECK THIS FUCKING PATH


export interface ChantierDTO 
{

  id?: number;
  nom?: string;
  operation?: string;
  dateDebut?: Date;
  dateFin?: Date;
  nbHeurs?: number;
  isAnnuelle?: boolean;
  effectifMaxiSurChantier?: number;
  nombreInterimaires?: number;
  entrepriseExterieurs?: number[];
  entrepriseUtilisatrice?: number;
  localisation?: number;
  
  donneurDOrdre?: number;

  bdts?: number[];
  pdps?: number[];
  workerSelections?: number[];
  status?: ChantierStatus;
  travauxDangereux?: boolean;

}
