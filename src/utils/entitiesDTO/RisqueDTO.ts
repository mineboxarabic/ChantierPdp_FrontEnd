import { ImageModel } from "../image/ImageModel";
import InfoDeBase from "../InfoDeBase";
import PermiTypes from "../PermiTypes";

class RisqueDTO extends InfoDeBase {
    travailleDangereux?: boolean;
    

    
    travaillePermit?: boolean;
    permitId?: number;
    permitType?: PermiTypes;
}

export default RisqueDTO;