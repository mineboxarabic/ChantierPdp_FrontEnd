class ChantierDTO {
    id?: number;
    nom?: string;
    operation?: string;
    dateDebut?: Date;
    dateFin?: Date;
    nbHeurs?: number;
    effectifMaxiSurChantier?: number;
    nombreInterimaires?: number;
    entrepriseExterieurs?: number[];
    entrepriseUtilisatrice?: number;
    localisation?: number;
    donneurDOrdre?: number;
    bdts?: number[];
    pdps?: number[];
    workers?: number[];
    isAnnuelle?:boolean;
    workerSelections?: number[];

    entrepriseExterieurEnts?: number[];
    entrepriseUtilisatriceEnt?: number;
    localisationEnt?: number;
    workerEnts?: number[];
}

export default ChantierDTO;