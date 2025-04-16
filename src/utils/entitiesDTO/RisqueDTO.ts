import { ImageModel } from "../image/ImageModel";

class RisqueDTO {
    id?: number;
    title: string;
    description: string;
    travailleDangereux: boolean;
    travaillePermit: boolean;
   logo?: ImageModel;

   constructor(id: number, title: string, description: string, logo: string, travailleDangereux: boolean, travaillePermit: boolean){
       this.id = id;
       this.title = title;
       this.description = description;
       this.logo = {imageData: logo, mimeType: "image/png"};
       this.travailleDangereux = travailleDangereux;
       this.travaillePermit = travaillePermit;
   }
}

export default RisqueDTO;