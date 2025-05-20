import { ImageModel } from "../image/ImageModel";
import InfoDeBase from "../InfoDeBase";

class RisqueDTO extends InfoDeBase {
    travailleDangereux?: boolean;
    travaillePermit?: boolean;
}

export default RisqueDTO;