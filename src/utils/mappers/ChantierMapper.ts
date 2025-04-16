import ChantierDTO from "../entitiesDTO/ChantierDTO.ts";
import Chantier from "../entities/Chantier.ts";
import {getEntrepriseById} from "../../hooks/useEntreprise.ts";
import {getLocalisationById} from "../../hooks/useLocalisation.ts";
import {getUserById} from "../../hooks/useUser.ts";
import {getPdpById} from "../../hooks/usePdp.ts";
import {Entreprise} from "../entities/Entreprise.ts";
import {getBDTById} from "../../hooks/useBdt.ts";
import {BDT} from "../entities/BDT.ts";
import {getWorkerById} from "../../hooks/useWoker.ts";
import {getSelectionsForChantier, getWorkersForChantier} from "../../hooks/useWorkerSelection.ts";
import WorkerChantierSelection from "../entities/WorkerChantierSelection.ts";
import Worker from "../entities/Worker.ts";
import Localisation from "../entities/Localisation.ts";
import User from "../entities/User.ts";
import {Pdp} from "../entities/Pdp.ts";

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
        chantierDTO?.entrepriseUtilisatrice ? getEntrepriseById(chantierDTO?.entrepriseUtilisatrice as number).then(res=>res.data as Entreprise) : undefined,
        getLocalisationById(chantierDTO?.localisation as number).then(res=>res.data as Localisation),
        getUserById(chantierDTO.donneurDOrdre as number).then(res=>res.data as User),
        chantierDTO?.entrepriseExterieurs ? Promise.all(chantierDTO?.entrepriseExterieurs?.length <= 0 ? chantierDTO?.entrepriseExterieurs?.map(id => getEntrepriseById(id).then(res=>res.data as Entreprise)) : [] as Promise<Entreprise>[]) : undefined,

        Promise.all(chantierDTO?.bdts?.map(id => getBDTById(id).then(res=>res.data as BDT)) as Promise<BDT>[]),
        Promise.all(chantierDTO?.pdps?.map(id => getPdpById(id).then(res=>res.data as Pdp)) as Promise<Pdp>[]),
        getSelectionsForChantier(chantierDTO?.id as number).then(res=>res.data as WorkerChantierSelection[]),
        getWorkersForChantier(chantierDTO?.id as number).then(res=>res.data as Worker[]),
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


export const mapChantierToChantierDTO = (chantier: Chantier): ChantierDTO => {
    return {
        id: chantier.id,
        nom: chantier.nom,
        operation: chantier.operation,
        dateDebut: chantier.dateDebut,
        dateFin: chantier.dateFin,
        nbHeurs: chantier.nbHeurs,
        effectifMaxiSurChantier: chantier.effectifMaxiSurChantier,
        nombreInterimaires: chantier.nombreInterimaires,
        isAnnuelle: chantier.isAnnuelle,

        entrepriseUtilisatrice: chantier.entrepriseUtilisatrice?.id,
        localisation: chantier.localisation?.id,
        donneurDOrdre: chantier.donneurDOrdre?.id,
        entrepriseExterieurs: chantier.entrepriseExterieurs?.map(entreprise => entreprise.id) as number[],
        pdps: chantier.pdps?.map(pdp => pdp.id) as number[],
        bdts: chantier.bdts?.map(bdt => bdt.id) as number[],
        workers: chantier.workers?.map(worker => worker.id) as number[],
        workerSelections: chantier.workerSelections?.map(selection => selection.id) as number[],
    };
}