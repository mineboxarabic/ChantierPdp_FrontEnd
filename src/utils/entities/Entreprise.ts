import User from "./User.ts";
import {ImageModel} from "../image/ImageModel.ts";
import Chantier from "./Chantier.ts";
import {MedecinDuTravailleEE} from "../pdp/MedecinDuTravailleEE.ts";
import {Pdp} from "./Pdp.ts";
import {EntityRef} from "../EntityRef.ts";

enum EntrepriseType {
    EE= "EE", // ✅ Defines if it's EU or
    EU = "EU"
}
export class Entreprise {
    id?: number;
    type?: EntrepriseType = EntrepriseType.EE;
    nom?: string;
    description?: string;
    numTel?: string;
   /* chantiers?: Chantier[];*/
    raisonSociale?: string;
    image?: ImageModel;
    medecinDuTravailleEE?: MedecinDuTravailleEE;
    pdps?: EntityRef[];
    workers?: EntityRef[];
    constructor(id:number, type:EntrepriseType, nom:string, description:string, numTel:string, chantiers:Chantier[], raisonSociale:string, image:ImageModel, medecinDuTravailleEE:MedecinDuTravailleEE, pdps:EntityRef[], workers:EntityRef[]) {
        this.id = id;
        this.type = type;
        this.nom = nom;
        this.description = description;
        this.numTel = numTel;
      /*  this.chantiers = chantiers;*/
        this.raisonSociale = raisonSociale;
        this.image = image;
        this.medecinDuTravailleEE = medecinDuTravailleEE;
        this.pdps = pdps;
        this.workers = workers;
    }
}