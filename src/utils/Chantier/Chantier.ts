import {Entreprise} from "../entreprise/Entreprise.ts";
import User from "../user/User.ts";
import Localisation from "../Localisation/Localisation.ts";
import {BDT} from "../bdt/BDT.ts";
import {Pdp} from "../pdp/Pdp.ts";

class Chantier {
    id: number;
    nom: string;
    entrepriseExterieur: Entreprise;
    responsable: User;
    localisation: Localisation;
    bdts: BDT[];
    pdp: Pdp;
    description: string;
    dateDebut:Date;
    dateFin:Date;
    nbHeurs: number;


    constructor(id: number, nom: string, entrepriseExterieur: Entreprise, responsable: User, localisation: Localisation, bdts: BDT[], pdp: Pdp, description: string, dateDebut:Date, dateFin:Date,nbHeurs: number) {
        this.id = id;
        this.nom = nom;
        this.entrepriseExterieur = entrepriseExterieur;
        this.responsable = responsable;
        this.localisation = localisation;
        this.bdts = bdts;
        this.pdp = pdp;
        this.description = description;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.nbHeurs = nbHeurs;

    }

}

export default Chantier;