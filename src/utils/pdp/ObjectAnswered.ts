
import Risque from "../Risque/Risque.ts";
import Dispositif from "../dispositif/Dispositif.ts";
import Permit from "../permit/Permit.ts";

class ObjectAnswered {

    id: number;
    risque?: Risque;
    dispositif?: Dispositif;
    permit?: Permit;
    answer: boolean;

    constructor(id:number, risque:Risque, answer:boolean) {
        this.id = risque.id;
        this.risque = risque;
        this.answer = answer;
    }
}

export default ObjectAnswered;