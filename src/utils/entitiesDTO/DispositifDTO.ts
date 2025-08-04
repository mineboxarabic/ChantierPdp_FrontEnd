import {ImageModel} from "../image/ImageModel.ts";
import InfoDeBase from "../InfoDeBase.ts";

class DispositifDTO extends InfoDeBase{

    id?: number;
    type?: string; // EPI or EPC

    constructor(id: number, titre: string, description: string, image: ImageModel, type: string) {
        super(id, titre, description, image);
        this.id = id;
        this.type = type;
    }
}

export default DispositifDTO;