import User from "../user/User.ts";
import {ImageModel} from "../image/ImageModel.ts";

export class Entreprise {
    id?: number;
    nom?: string;
    fonction?: string;
    numTel?: string;
    referentPdp?: User;
    responsableChantier?: User;
    raisonSociale?: string;
    isUtilisatrice?: boolean;
    image?: ImageModel;

    public constructor() {
        this.nom = "";
        this.fonction = "";
        this.numTel = "";
        this.referentPdp = new User();
        this.responsableChantier = new User();
        this.raisonSociale = "";
        this.isUtilisatrice = false;
        this.image = {imageData: "", mimeType: ""};
    }
}