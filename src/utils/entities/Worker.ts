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
    private Pdp pdps;


    @ManyToMany
    private List<Signature> signatures;

    @ManyToOne
    private Chantier chantier;
}
*/

import {Entreprise} from "./Entreprise.ts";
import {Pdp} from "./Pdp.ts";
import Signature from "./Signature.ts";
import Chantier from "./Chantier.ts";
import {EntityRef} from "../EntityRef.ts";

class Worker{
    id?: number;
    nom?: string;
    prenom?: string;
    entreprise?: EntityRef;
    pdp?: EntityRef[];
    signatures?: Signature[];
    chantier?: EntityRef[];
    constructor(id:number, nom:string, prenom:string, entreprise:EntityRef, pdp:EntityRef[], signatures:Signature[], chantier:EntityRef[]) {
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