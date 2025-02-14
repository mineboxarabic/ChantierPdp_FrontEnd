import {ImageModel} from "./image/ImageModel.ts";

class InfoDeBase {

    id: number;
    title: string;
    description: string;
    logo: ImageModel;


    constructor(id:number, title:string, description:string, logo:ImageModel) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.logo = logo;
    }
}

export default InfoDeBase;