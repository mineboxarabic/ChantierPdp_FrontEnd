// TODO: import type { ObjectAnsweredObjects } from '???'; // UNKNOWN IMPORT PATH FOR THIS BAD BOY

import ObjectAnsweredObjects from "../ObjectAnsweredObjects";


export interface ObjectAnsweredDTO 
{
    id?: number;
    pdp?: number;
    objectType?: ObjectAnsweredObjects;
    objectId: number;
    answer: boolean | null;
    ee?: boolean;
    eu?: boolean;

}
