import {ImageModel} from "../image/ImageModel.ts";
import InfoDeBase from "../InfoDeBase.ts";

class Dispositif extends InfoDeBase{

    id?: number;

    constructor(id: number, titre: string, description: string, image: ImageModel) {
        super(id, titre, description, image);
        this.id = id;
    }
}

export default Dispositif;