import InfoDeBase from "../InfoDeBase.ts";
import PermiTypes from "../PermiTypes.ts";
import {ImageModel} from "../image/ImageModel.ts";

export default class Permit extends InfoDeBase {
    type?: PermiTypes = PermiTypes.NONE;
    pdfData?: string;

    constructor(id: number | undefined, titre: string, description: string, image: ImageModel) {
        super(id, titre, description, image);
        this.id = id;
    }
}