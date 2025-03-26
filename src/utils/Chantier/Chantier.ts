import {Entreprise} from "../entreprise/Entreprise.ts";
import User from "../user/User.ts";
import Localisation from "../Localisation/Localisation.ts";
import {BDT} from "../bdt/BDT.ts";
import {Pdp} from "../pdp/Pdp.ts";
import Worker from "../Worker.ts";
import {EntityRef} from "../EntityRef.ts";

class Chantier {
    id?: number;
    nom?: string;
    operation?: string;
    dateDebut?: Date;
    dateFin?: Date;
    nbHeurs?: number;
    effectifMaxiSurChantier?: number;
    nombreInterimaires?: number;
    entrepriseExterieurs?: EntityRef[];
    entrepriseUtilisatrice?: EntityRef;
    localisation?: EntityRef;
    donneurDOrdre?: EntityRef;
    bdts?: EntityRef[];
    pdp?: EntityRef[];
    pdpEnts: Pdp[] = [];
    workers?: EntityRef[];
    isAnnuelle:boolean;
    constructor(id:number, nom:string, operation:string, dateDebut:Date, dateFin:Date, nbHeurs:number, effectifMaxiSurChantier:number, nombreInterimaires:number, entrepriseExterieurs:EntityRef[], entrepriseUtilisatrice:EntityRef, localisation:EntityRef, donneurDOrdre:EntityRef, bdts:EntityRef[], pdp:EntityRef[], workers:EntityRef[], isAnnuelle:boolean) {
        this.id = id;
        this.nom = nom;
        this.operation = operation;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.nbHeurs = nbHeurs;
        this.effectifMaxiSurChantier = effectifMaxiSurChantier;
        this.nombreInterimaires = nombreInterimaires;
        this.entrepriseExterieurs = entrepriseExterieurs;
        this.entrepriseUtilisatrice = entrepriseUtilisatrice;
        this.localisation = localisation;
        this.donneurDOrdre = donneurDOrdre;
        this.bdts = bdts;
        this.pdp = pdp;
        this.workers = workers;
        this.isAnnuelle = isAnnuelle;
    }

}

export default Chantier;