export default class LocalisationDTO {

    nom?: string;
    code?: string;
    description?: string;

    constructor( nom: string, code: string, description: string) {
        this.nom = nom;
        this.code = code;
        this.description = description;
    }
}