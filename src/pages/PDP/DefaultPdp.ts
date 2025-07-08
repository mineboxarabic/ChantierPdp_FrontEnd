export interface DefaultPdp {
    id: undefined;
    chantier: undefined;
    entrepriseExterieure: undefined;
    dateInspection: undefined;
    icpdate: undefined;
    datePrevenirCSSCT: undefined;
    datePrev: undefined;
    horairesDetails: '';
    entrepriseDInspection: undefined;
    horaireDeTravail: {
        enJournee: false;
        enNuit: false;
        samedi: false;
    };
    misesEnDisposition: {
        vestiaires: false;
        sanitaires: false;
        restaurant: false;
        energie: false;
    };
    risques: [];
    dispositifs: [];
    permits: [];
    analyseDeRisques: [];
    signatures: [];
}