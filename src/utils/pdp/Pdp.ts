import {Entreprise} from "../entreprise/Entreprise.ts";
import { PdpDTO } from "./PdpDTO.ts";
import HoraireDeTravaille from "./HoraireDeTravaille.ts";
import MiseEnDisposition from "./MiseEnDisposition.ts";
import {MedecinDuTravailleEE} from "./MedecinDuTravailleEE.ts";
import ObjectAnswered from "./ObjectAnswered.ts";
import Dispositif from "../dispositif/Dispositif.ts";
import ObjectAnsweredEntreprises from "./ObjectAnsweredEntreprises.ts";
import Localisation from "../Localisation/Localisation.ts";
import Permit from "../permit/Permit.ts";
import Signature from "../signature/Signature.ts";
import Worker from "../Worker.ts";
import {EntityRef} from "../EntityRef.ts";
/*package com.danone.pdpbackend.entities;


import com.danone.pdpbackend.Utils.HoraireDeTravaille;
import com.danone.pdpbackend.Utils.MedecinDuTravailleEE;
import com.danone.pdpbackend.Utils.MisesEnDisposition;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity(name = "pdp")
@Getter
@Setter
public class Pdp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    private Chantier chantier; // ✅ PDP is always linked to a chantier

    @ManyToOne
    private Entreprise entrepriseExterieure; // ✅ PDP is linked to an EE (Entreprise Extérieure)


    private Date dateInspection;
    private Date icpdate;
    private String horairesDetails;


    @OneToOne
    private Entreprise entrepriseDInspection;

    @Embedded
    private HoraireDeTravaille horaireDeTravail;

    @Embedded
    private MisesEnDisposition misesEnDisposition;


    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ObjectAnswered> risques;


    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ObjectAnswered> dispositifs;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ObjectAnswered> permits;


    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ObjectAnsweredEntreprises> analyseDeRisques;


    @OneToMany(mappedBy = "pdp", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Worker> signatures; // ✅ List of workers who signed the PDP


    private Date datePrevenirCSSCT; // ✅ Notification date for CSSCT (if required)
    private Date datePrev; // ✅ Planned date for something (depends on business rules)

}*/
export class Pdp  {


    id?: number;
    chantier?: number;

    entrepriseExterieure?:EntityRef;
    entrepriseExterieureEnt?:Entreprise;

    dateInspection?: Date;
    icpdate?: Date;
    horairesDetails?: string;
    entrepriseDInspection?: EntityRef
    horaireDeTravail?: HoraireDeTravaille;
    misesEnDisposition?: MiseEnDisposition;
    risques?: ObjectAnswered[];
    dispositifs?: ObjectAnswered[];
    permits?: ObjectAnswered[];
    analyseDeRisques?: ObjectAnsweredEntreprises[];
    signatures?: Worker[];
    datePrevenirCSSCT?: Date;
    datePrev?: Date;
    constructor(id:number, chantier:number, entrepriseExterieure:EntityRef, dateInspection:Date, icpdate:Date, horairesDetails:string, entrepriseDInspection:EntityRef, horaireDeTravail:HoraireDeTravaille, misesEnDisposition:MiseEnDisposition, risques:ObjectAnswered[], dispositifs:ObjectAnswered[], permits:ObjectAnswered[], analyseDeRisques:ObjectAnsweredEntreprises[], signatures:Worker[], datePrevenirCSSCT:Date, datePrev:Date, entrepiseExterieurEnt:Entreprise) {
        this.id = id;
        this.chantier = chantier;
        this.entrepriseExterieure = entrepriseExterieure;
        this.dateInspection = dateInspection;
        this.icpdate = icpdate;
        this.horairesDetails = horairesDetails;
        this.entrepriseDInspection = entrepriseDInspection;
        this.horaireDeTravail = horaireDeTravail;
        this.misesEnDisposition = misesEnDisposition;
        this.risques = risques;
        this.dispositifs = dispositifs;
        this.permits = permits;
        this.analyseDeRisques = analyseDeRisques;
        this.signatures = signatures;
        this.datePrevenirCSSCT = datePrevenirCSSCT;
        this.datePrev = datePrev;
        this.entrepriseExterieureEnt = entrepiseExterieurEnt;
    }


}