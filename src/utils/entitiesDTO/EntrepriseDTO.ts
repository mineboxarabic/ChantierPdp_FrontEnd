import {ImageModel} from "../image/ImageModel.ts";
import {MedecinDuTravailleEE} from "../pdp/MedecinDuTravailleEE.ts";
import {EntityRef} from "../EntityRef.ts";

enum EntrepriseType {
    EE= "EE", // ✅ Defines if it's EU or
    EU = "EU"
}
export class EntrepriseDTO {
    id?: number;
    type?: EntrepriseType = EntrepriseType.EE;
    nom?: string;
    description?: string;
    numTel?: string;
   /* chantiers?: Chantier[];*/
    raisonSociale?: string;
    image?: ImageModel;
    medecinDuTravailleEE?: MedecinDuTravailleEE;
    pdps?: number[];
    workers?: number[];
}