import SelectOrCreate from "./SelectOrCreate";
import {useState} from "react";
import InfoDeBase from "../../utils/InfoDeBase.ts";
import {ImageModel} from "../../utils/image/ImageModel.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import {SelectOrCreateObjectAnsweredProps} from "./SelectOrCreaeteInterfaces.ts";
import usePdp, {getObjectAnswereds} from "../../hooks/usePdp.ts";
import useDispositif, {createDispositif, getAllDispositifs} from "../../hooks/useDispositif.ts";
import useRisque, {createRisque, getAllRisques} from "../../hooks/useRisque.ts";
import usePermit, {createPermit, getAllPermits} from "../../hooks/usePermit.ts";
import useAuditSecu, {createAuditSecu, getAllAuditSecus} from "../../hooks/useAuditSecu.ts";
import useAnalyseRisque, {createAnalyse, getAllAnalyses} from "../../hooks/useAnalyseRisque.ts";
import EditItem, {FieldConfig} from "../EditItem.tsx";
import {risqueConfig} from "../../pages/Risque/RisqueManager.tsx";
import {permitConfig} from "../../pages/Permit/PermiManager.tsx";
import {auditSecuConfig} from "../../pages/AudiSecu/AudiSecuManager.tsx";
import {AnalyseDeRisqueConfig} from "../../pages/AnalyseDeRisque/AnalyseDeRisqueManager.tsx";
import EditGeneric from "../GenericCRUD/EditGeneirc.tsx";
import {EntityConfig} from "../GenericCRUD/TypeConfig.ts";
import { dispositifConfig } from "../../pages/dispositifs/DispositifManager.tsx";
import ObjectAnsweredDTO from "../../utils/pdp/ObjectAnswered.ts";
import { ContentItem, ParentOfRelations } from "../Interfaces.ts";

// Interface for hook results that retrieve and manage linkable objects
export interface LinkableHook<T extends ContentItem> {
    getAllItems: () => Promise<T[]>;
    getItem?: (id: number) => Promise<T>;
    createItem?: (item: T) => Promise<T>;
    updateItem?: (item: T, id: number) => Promise<T>;
    deleteItem?: (id: number) => Promise<boolean>;
}

function SelectOrCreateObjectAnswered<ITEM extends ContentItem, PARENT extends ParentOfRelations>(
    {
        open, setOpen, parent, saveParent, setIsChanged, objectType, addRelation
    }: SelectOrCreateObjectAnsweredProps<ITEM, PARENT>
) {
    const [openCreateItem, setOpenCreateItem] = useState(false);

        // Determine if an item is already selected/linked
    const alreadySelected = (item: ITEM):boolean => {
        const existingRelations = parent.relations as ObjectAnsweredDTO[] || [];
        return existingRelations.some((existingRelation) => {
            return existingRelation.objectId === item.id && existingRelation.objectType === objectType;
        });
    };

    const getItemImage = (item: ITEM) => {
        return item?.logo
            ? `data:${item.logo.mimeType};base64,${item.logo.imageData}`
            : '';
    };

    //Fetch a list of all items line all risques,  all dispoisitfs
    const fetchAllItems = async (): Promise<ITEM[]> => {
       let response;
        switch (objectType){
            case ObjectAnsweredObjects.RISQUE:
                response = await getAllRisques();
                break;
            case ObjectAnsweredObjects.DISPOSITIF:
                response = await getAllDispositifs();
                break;
            case ObjectAnsweredObjects.PERMIT:
                response = await getAllPermits();
                break;
            case ObjectAnsweredObjects.AUDIT:
                response = await getAllAuditSecus();
                break;
            case ObjectAnsweredObjects.ANALYSE_DE_RISQUE:
                response = await getAllAnalyses();
                break;
            default:
                throw new Error("Invalid item type");
        }

        return response.data;
    }
    const getItemName = () => {
        switch (objectType) {
            case ObjectAnsweredObjects.RISQUE:
                return "Risque";
            case ObjectAnsweredObjects.DISPOSITIF:
                return "Dispositif";
            case ObjectAnsweredObjects.PERMIT:
                return "Permis";
            case ObjectAnsweredObjects.AUDIT:
                return "Audit de sécurité";
            case ObjectAnsweredObjects.ANALYSE_DE_RISQUE:
                return "Analyse de risque";
            default:
                return "";
        }
    }

    const getFieldConfig = (): EntityConfig => {
        switch (objectType) {
            case ObjectAnsweredObjects.RISQUE:
                return risqueConfig;
            case ObjectAnsweredObjects.DISPOSITIF:
                return dispositifConfig;
            case ObjectAnsweredObjects.PERMIT:
                return permitConfig;
            case ObjectAnsweredObjects.AUDIT:
                return auditSecuConfig;
            case ObjectAnsweredObjects.ANALYSE_DE_RISQUE:
                return AnalyseDeRisqueConfig;
            default:
                throw new Error("Invalid item type");
        }
    }


    const onSumbit = async (item: ITEM) => {
        // Create the item using the appropriate hook
        let response;
        console.log("updatedParentObject");

        switch (objectType) {
            case ObjectAnsweredObjects.RISQUE:
                response = await createRisque(item as ITEM) as ITEM;
                break;
            case ObjectAnsweredObjects.DISPOSITIF:
                response = await createDispositif(item as ITEM) as ITEM;
                break;
            case ObjectAnsweredObjects.PERMIT:
                response = await createPermit(item as ITEM) as ITEM;
                break;
            case ObjectAnsweredObjects.AUDIT:
                response = await createAuditSecu(item as ITEM) as ITEM;
                break;
            case ObjectAnsweredObjects.ANALYSE_DE_RISQUE:
                response = await createAnalyse(item as ITEM) as ITEM;
                break;
            default:
                throw new Error("Invalid item type");
        }

        const createdItem = response.data as ITEM;

        // Link the newly created item to the parent
        let updatedParentObject;

        // Update the parent object with the new linked item
        const existingItems = parent.relations || [];

        //No id + answer = create new object answered
        const objectAnswered: ObjectAnsweredDTO = {
            answer: true,
            objectId: createdItem.id,
            objectType: objectType,
        } as ObjectAnsweredDTO;
        
        updatedParentObject = {
            ...parent,
           relations: [...existingItems, objectAnswered],
            
        } as PARENT;

        if(addRelation){
            addRelation(objectType, createdItem);
        }else{
            saveParent(updatedParentObject);
        }
        setIsChanged(true);
        setOpenCreateItem(false);
    }

    const createComponent = (): React.ReactNode =>{
        return (
            <EditGeneric config={getFieldConfig()} open={openCreateItem} onClose={()=>{setOpenCreateItem(false)}} onSubmit={onSumbit} />
        )
    }

    return (
        <>
            <SelectOrCreate<ITEM, PARENT>
                open={open}
                objectType={objectType}
                setOpen={setOpen}
                parent={parent}
                saveParent={saveParent}
                setIsChanged={()=>{}}
                fetchItems={fetchAllItems}
                alreadySelected={alreadySelected}
                getItemId={(item) => item.id as number}
                getItemTitle={(item) => item.title}
                getItemDescription={(item) => item.description}
                getItemImage={getItemImage}
                openCreate={openCreateItem}
                setOpenCreate={setOpenCreateItem}
                createComponent={createComponent()}
                addRelation={addRelation}
            />
        </>
    );
}

export default SelectOrCreateObjectAnswered as typeof SelectOrCreateObjectAnswered;