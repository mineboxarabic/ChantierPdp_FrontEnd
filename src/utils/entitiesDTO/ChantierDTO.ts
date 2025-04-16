class ChantierDTO {
    id?: number;
    nom?: string;
    operation?: string;
    dateDebut?: Date;
    dateFin?: Date;
    nbHeurs: number = 0;
    effectifMaxiSurChantier: number = 0;
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
}

export default ChantierDTO;