//Object that has title and description and photo
//relation object
//object that are stuff linked to (the parent)

import RisqueDTO from "../utils/entitiesDTO/RisqueDTO";
import { ImageModel } from "../utils/image/ImageModel";
import ObjectAnsweredObjects from "../utils/ObjectAnsweredObjects";
import { ObjectAnsweredDTO } from "../utils/entitiesDTO/ObjectAnsweredDTO";

export interface ContentItem {
    id?: number;
    title: string;
    description: string;
    logo: ImageModel;
}


export interface ParentOfRelations {
    id?: number;
    relations?: ObjectAnsweredDTO[];
}

export interface ParentOAnalyseDeRisque {
    id?: number;
    risque?: RisqueDTO[];
}

export interface ObjectAnsweredBasedComponentProps<ITEM extends ContentItem, PARENT extends ParentOfRelations> {
    object: ObjectAnsweredDTO;
    objectType: ObjectAnsweredObjects;
    saveParent: (pdp: PARENT) => void;
    parent: PARENT;
    setIsChanged: (value: boolean) => void;
    itemData?: ITEM; // Optional item data for display
    onDeleteRelationFromItem?: () => void; // Optional delete function
    onUpdateRelationFieldFromItem?: (relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => void; // Optional update function
}