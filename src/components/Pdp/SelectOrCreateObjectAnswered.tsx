import SelectOrCreate from "./SelectOrCreate";
import { useState } from "react";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import InfoDeBase from "../../utils/InfoDeBase.ts";
import { ImageModel} from "../../utils/image/ImageModel.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";

// Define a generic interface for items that can be part of ObjectAnswered
export interface Linkable extends InfoDeBase {
    id?: number;
    title: string;
    description: string;
    logo: ImageModel;
}

// Interface for hook results that retrieve and manage linkable objects
export interface LinkableHook<T extends Linkable> {
    getAllItems: () => Promise<T[]>;
    getItem?: (id: number) => Promise<T>;
    createItem?: (item: T) => Promise<T>;
    updateItem?: (item: T, id: number) => Promise<T>;
    deleteItem?: (id: number) => Promise<boolean>;
}

// Interface for hook results that link objects to a parent entity
export interface LinkingHook {
    linkItem: (itemId: number, parentId: number) => Promise<ObjectAnswered>;
    unlinkItem?: (itemId: number, parentId: number) => Promise<ObjectAnswered>;
}

interface SelectOrCreateObjectAnsweredProps<T extends Linkable, P> {
    open: boolean;
    setOpen: (open: boolean) => void;
    parentObject: P;
    saveParentObject: (obj: P) => void;
    setIsChanged: (isChanged: boolean) => void;
    objectType: ObjectAnsweredObjects;
    itemHook: LinkableHook<T>;
    linkingHook: LinkingHook;
    // Optional create component for creating new items
    createComponent?: React.ReactNode;
    // Optional function to check if an item is already selected
    isItemAlreadySelected?: (item: T) => boolean;
    // Optional callback when an item is selected
    onItemSelected?: (item: T) => void;
    // Function to get existing items from parent object
    getExistingItems: (parent: P) => ObjectAnswered[] | undefined;
}

function SelectOrCreateObjectAnswered<T extends Linkable, P extends { id?: number }>(
    props: SelectOrCreateObjectAnsweredProps<T, P>
) {
    const [openCreateItem, setOpenCreateItem] = useState(false);

    // Determine if an item is already selected/linked
    const alreadySelected = (item: T) => {
        // If custom function is provided, use it
        if (props.isItemAlreadySelected) {
            return props.isItemAlreadySelected(item);
        }

        // Default behavior: check if the item exists in the existing items
        const existingItems = props.getExistingItems(props.parentObject);
        if (!existingItems) return false;

        switch (props.objectType) {
            case ObjectAnsweredObjects.RISQUE:
                return existingItems.some((obj) => obj.risque?.id === item.id);
            case ObjectAnsweredObjects.DISPOSITIF:
                return existingItems.some((obj) => obj.dispositif?.id === item.id);
            case ObjectAnsweredObjects.PERMIT:
                return existingItems.some((obj) => obj.permit?.id === item.id);
            case ObjectAnsweredObjects.AUDIT:
                return existingItems.some((obj) => obj.auditSecu?.id === item.id);
            default:
                return false;
        }
    };

    // Handle validation/selection of an item
    const onValidate = (selectedItem: T) => {
        if (!selectedItem) return;

        // If custom handler is provided, use it
        if (props.onItemSelected) {
            props.onItemSelected(selectedItem);
            props.setOpen(false);
            return;
        }

        // Handle existing parent object with ID (requires API call)
        if (props.parentObject.id != null) {
            props.linkingHook.linkItem(selectedItem.id as number, props.parentObject.id)
                .then((objectAnswered: ObjectAnswered) => {
                    // Set the appropriate property based on objectType
                    switch (props.objectType) {
                        case ObjectAnsweredObjects.RISQUE:
                            objectAnswered.risque = selectedItem as any;
                            break;
                        case ObjectAnsweredObjects.DISPOSITIF:
                            objectAnswered.dispositif = selectedItem as any;
                            break;
                        case ObjectAnsweredObjects.PERMIT:
                            objectAnswered.permit = selectedItem as any;
                            break;
                        case ObjectAnsweredObjects.AUDIT:
                            objectAnswered.auditSecu = selectedItem as any;
                            break;
                    }

                    // Update the parent object with the new linked item
                    const existingItems = props.getExistingItems(props.parentObject) || [];

                    // Create a new object with the updated items
                    const updatedParentObject = {
                        ...props.parentObject,
                    } as P;

                    // Update the appropriate array based on objectType
                    switch (props.objectType) {
                        case ObjectAnsweredObjects.RISQUE:
                            (updatedParentObject as any).risques = [...existingItems, objectAnswered];
                            break;
                        case ObjectAnsweredObjects.DISPOSITIF:
                            (updatedParentObject as any).dispositifs = [...existingItems, objectAnswered];
                            break;
                        case ObjectAnsweredObjects.PERMIT:
                            (updatedParentObject as any).permits = [...existingItems, objectAnswered];
                            break;
                        case ObjectAnsweredObjects.AUDIT:
                            (updatedParentObject as any).auditSecu = [...existingItems, objectAnswered];
                            break;
                    }

                    props.saveParentObject(updatedParentObject);
                    props.setIsChanged(true);
                });
        } else {
            // New parent object being created (no API call needed)
            const existingItems = props.getExistingItems(props.parentObject) || [];

            // Create a new ObjectAnswered for the selected item
            const newObjectAnswered: ObjectAnswered = {
                id: -1, // Temporary ID that will be replaced when saved to server
                answer: true
            } as ObjectAnswered;

            // Set the appropriate property based on objectType
            switch (props.objectType) {
                case ObjectAnsweredObjects.RISQUE:
                    newObjectAnswered.risque = selectedItem as any;
                    break;
                case ObjectAnsweredObjects.DISPOSITIF:
                    newObjectAnswered.dispositif = selectedItem as any;
                    break;
                case ObjectAnsweredObjects.PERMIT:
                    newObjectAnswered.permit = selectedItem as any;
                    break;
                case ObjectAnsweredObjects.AUDIT:
                    newObjectAnswered.auditSecu = selectedItem as any;
                    break;
            }

            // Create a new object with the updated items
            const updatedParentObject = {
                ...props.parentObject,
            } as P;

            // Update the appropriate array based on objectType
            switch (props.objectType) {
                case ObjectAnsweredObjects.RISQUE:
                    (updatedParentObject as any).risques = [...existingItems, newObjectAnswered];
                    break;
                case ObjectAnsweredObjects.DISPOSITIF:
                    (updatedParentObject as any).dispositifs = [...existingItems, newObjectAnswered];
                    break;
                case ObjectAnsweredObjects.PERMIT:
                    (updatedParentObject as any).permits = [...existingItems, newObjectAnswered];
                    break;
                case ObjectAnsweredObjects.AUDIT:
                    (updatedParentObject as any).auditSecu = [...existingItems, newObjectAnswered];
                    break;
            }

            props.saveParentObject(updatedParentObject);
            props.setIsChanged(true);
        }

        props.setOpen(false);
    };

    const getItemImage = (item: T) => {
        return item?.logo
            ? `data:${item.logo.mimeType};base64,${item.logo.imageData}`
            : '';
    };

    return (
        <>
            <SelectOrCreate<T>
                open={props.open}
                setOpen={props.setOpen}
                currentPdp={props.parentObject as any}
                savePdp={props.saveParentObject as any}
                setIsChanged={props.setIsChanged}
                where={props.objectType.toLowerCase() as any}
                fetchItems={props.itemHook.getAllItems}
                linkItem={props.linkingHook.linkItem}
                alreadySelected={alreadySelected}
                getItemId={(item) => item.id as number}
                getItemTitle={(item) => item.title}
                getItemDescription={(item) => item.description}
                getItemImage={getItemImage}
                onValidate={onValidate}
                openCreate={openCreateItem}
                setOpenCreate={setOpenCreateItem}
                createComponent={props.createComponent}
            />
        </>
    );
}

export default SelectOrCreateObjectAnswered as typeof SelectOrCreateObjectAnswered;