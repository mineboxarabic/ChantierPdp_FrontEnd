import { EntityRef } from "../EntityRef";
import Worker from "./Worker";
import Chantier from "./Chantier";
import User from "./User";

class WorkerChantierSelection {
    id?: number;
    worker?: EntityRef;
    chantier?: EntityRef;
    selectionDate?: Date;
    isSelected?: boolean;
    selectionNote?: string;
    selectedBy?: EntityRef;

    // Objets complets (non persistés, pour l'UI)
    workerFull?: Worker;
    chantierFull?: Chantier;
    selectedByFull?: User;

    constructor(
        id?: number,
        worker?: EntityRef,
        chantier?: EntityRef,
        selectionDate?: Date,
        isSelected?: boolean,
        selectionNote?: string,
        selectedBy?: EntityRef
    ) {
        this.id = id;
        this.worker = worker;
        this.chantier = chantier;
        this.selectionDate = selectionDate;
        this.isSelected = isSelected || true;
        this.selectionNote = selectionNote;
        this.selectedBy = selectedBy;
    }
}

export default WorkerChantierSelection;