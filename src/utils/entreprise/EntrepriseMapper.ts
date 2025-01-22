import { Entreprise } from "./Entreprise.ts";
import { EntrepriseDTO } from "./EntrepriseDTO";

class EntrepriseMapper {
   /* public static toDTO(entreprise: Entreprise): EntrepriseDTO {
        return {
            nom: entreprise.nom,
            fonction: entreprise.fonction,
            numTel: entreprise.numTel,
            referentPdp: entreprise.referentPdp,
            responsableChantier: entreprise.responsableChantier,
            raisonSociale: entreprise.raisonSociale,
            isUtilisatrice: entreprise.isUtilisatrice
        };
    }*/

    static createEmptyEntreprise():Entreprise {
    return new Entreprise();
    }
}

export default EntrepriseMapper;