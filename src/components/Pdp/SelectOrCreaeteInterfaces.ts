import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects";
import ObjectAnsweredDTO from "../../utils/pdp/ObjectAnswered";
import { ParentOfRelations } from "../Interfaces";

export interface Where < PARENT extends {id?: number}> {
    itemNameInParent: keyof PARENT;
}

export interface SelectOrCreateObjectAnsweredProps<ITEM,PARENT extends ParentOfRelations> {
    open: boolean;
    setOpen: (open: boolean) => void;

    parent: PARENT;
    saveParent: (parent: PARENT) => void;

    setIsChanged: (isChanged: boolean) => void;
    objectType: ObjectAnsweredObjects;

    addRelation?: (objectType: ObjectAnsweredObjects, selectedItem: ITEM) => void;
}
