export default class Localisation {
/*    @Id
    private Long id;

    private String nom;
    private String code;
    private String description;*/

    id?: number;
    nom?: string;
    code?: string;
    description?: string;

    constructor(id: number, nom: string, code: string, description: string) {
        this.id = id;
        this.nom = nom;
        this.code = code;
        this.description = description;
    }
}