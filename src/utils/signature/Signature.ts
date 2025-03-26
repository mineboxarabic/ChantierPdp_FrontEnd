import {ImageModel} from "../image/ImageModel.ts";
import User from "../user/User.ts";
import {EntityRef} from "../EntityRef.ts";

class Signature {
     id?: number;
     user: EntityRef;
     signature: ImageModel;

    constructor(id: number, user: EntityRef, signature: ImageModel) {
        this.id = id;
        this.user = user;
        this.signature = signature;
    }

}

export default Signature;