import { ActionType } from "../enums/ActionType";
import { DocumentStatus } from "../enums/DocumentStatus";
import { ObjectAnsweredDTO } from "./ObjectAnsweredDTO";

export interface DocumentDTO 
{

  id?: number;
  chantier?: number;
  entrepriseExterieure?: number;
  status?: DocumentStatus;
  actionType?: ActionType;
  date?: Date;
  signatures?: number[];
  relations?: ObjectAnsweredDTO[];
  creationDate?: Date; // Track when it was created/became valid


}
