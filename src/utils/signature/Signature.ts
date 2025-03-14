import {ImageModel} from "../image/ImageModel.ts";
import User from "../user/User.ts";

class Signature {
     id?: number;
     user: User;
     signature: ImageModel;

    constructor(id: number, user: User, signature: ImageModel) {
        this.id = id;
        this.user = user;
        this.signature = signature;
    }

}

export default Signature;