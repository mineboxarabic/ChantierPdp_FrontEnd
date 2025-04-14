import ChantierDTO from "../entitiesDTO/ChantierDTO.ts";
import Chantier from "../entities/Chantier.ts";

export const mapChantierDTOToChantier = async (chantierDTO: ChantierDTO): Promise<Chantier> =>{
    const [
        entrepriseUtilisatrice,
        localisation,
        donneurDOrdre,
        entrepriseExterieurs,
        bdts,
        pdps,
        workerSelections,
        workers,
    ] = await Promise.all([
        getEntrepriseById(chantierDTO.entrepriseUtilisatrice),
        getLocalisationById(chantierDTO.localisation),
        getUserById(chantierDTO.donneurDOrdre),
        Promise.all(chantierDTO.entrepriseExterieurs.map(getEntrepriseById)),
        Promise.all(chantierDTO.bdts.map(getBDTById)),
        Promise.all(chantierDTO.pdps.map(getPdpById)),
        Promise.all(chantierDTO.workerSelections.map(getWorkerSelectionById)),
        Promise.all(chantierDTO.workers.map(getWorkerById)),
    ]);

    return {
        ...chantierDTO,
        entrepriseUtilisatrice,
        localisation,
        donneurDOrdre,
        entrepriseExterieurs,
        bdts,
        pdps,
        workerSelections,
        workers,
    };
}