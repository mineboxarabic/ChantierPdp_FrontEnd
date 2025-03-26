/*package com.danone.pdpbackend.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String nom;

    private String prenom;


    @ManyToOne
    private Entreprise entreprise;


    @ManyToOne
    private Pdp pdp;


    @ManyToMany
    private List<Signature> signatures;

    @ManyToOne
    private Chantier chantier;
}
*/

import {Entreprise} from "./entreprise/Entreprise.ts";
import {Pdp} from "./pdp/Pdp.ts";
import Signature from "./signature/Signature.ts";
import Chantier from "./Chantier/Chantier.ts";

class Worker{
    id?: number;
    nom?: string;
    prenom?: string;
    entreprise?: Entreprise;
    pdp?: Pdp;
    signatures?: Signature[];
    chantier?: Chantier;
    constructor(id:number, nom:string, prenom:string, entreprise:Entreprise, pdp:Pdp, signatures:Signature[], chantier:Chantier) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.entreprise = entreprise;
        this.pdp = pdp;
        this.signatures = signatures;
        this.chantier = chantier;
    }
}

export default Worker;