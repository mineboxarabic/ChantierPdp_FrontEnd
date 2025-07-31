// TODO: import type { ComplementOuRappel } from '???'; // UNKNOWN IMPORT PATH FOR THIS BAD BOY
import type { DocumentDTO } from './DocumentDTO'; // CHECK THIS FUCKING PATH
import type { ComplementOuRappel } from './ComplementOuRappel';


export interface BdtDTO 
extends DocumentDTO 
{

  id?: number;
  nom?: string;
  complementOuRappels?: ComplementOuRappel[];
  date?: Date;
  personnelDansZone?: boolean;     // Personnel in zone (true/false)
  horaireDeTravaille?: string;     // Work schedule text
  tachesAuthoriser?: string;       // Authorized tasks text

}
 