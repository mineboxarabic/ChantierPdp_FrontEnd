class RisqueDTO {
    private title: string;
    private description: string;
    private logo: string;
    private travailleDangereux: boolean;
    private travaillePermit: boolean;

    constructor(title: string, description: string, logo: string, travailleDangereux: boolean, travaillePermit: boolean){
        this.title = title;
        this.description = description;
        this.logo = logo;
        this.travailleDangereux = travailleDangereux;
        this.travaillePermit = travaillePermit;
    }
}

export default RisqueDTO;