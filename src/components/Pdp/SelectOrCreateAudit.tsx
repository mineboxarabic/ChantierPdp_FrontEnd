import SelectOrCreate from "./SelectOrCreate";
import useAuditSecu from "../../hooks/useAuditSecu";
import usePdp from "../../hooks/usePdp";
import useBdt from "../../hooks/useBdt";
import {AuditSecu} from "../../utils/entities/AuditSecu.ts";
import { useState } from "react";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import { BDT } from "../../utils/entities/BDT.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";

interface SelectOrCreateAuditSecuProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentObject: any; // Can be PDP or BDT
    saveObject: (obj: any) => void;
    setIsChanged: (isChanged: boolean) => void;
    targetType: "pdp" | "bdt"; // Specifies whether we're adding to PDP or BDT
}

const SelectOrCreateAuditSecu = (props: SelectOrCreateAuditSecuProps) => {
    const { getAllAuditSecus } = useAuditSecu();
    const { linkObjectToPdp } = usePdp();
    const { linkAuditToBDT } = useBdt();

    const [openCreateAuditSecu, setOpenCreateAuditSecu] = useState(false);

    const alreadySelected = (auditSecu: AuditSecu) => {
        if (props.targetType === "pdp") {
            return props.currentObject?.auditSecus?.some((a: any) => a.auditSecu.id === auditSecu.id);
        } else if (props.targetType === "bdt") {
            // Handling for BDT - check if the auditSecu is already linked
            return props.currentObject?.auditSecu?.some((a: any) => a.id === auditSecu.id);
        }

        return false;
    };

    const onValidate = (selectedAuditSecu: AuditSecu) => {
        if (selectedAuditSecu) {
            if (props.targetType === "pdp") {
                // Handling for PDP
                if (props.currentObject.id != null) {
                    // Link auditSecu to existing PDP
                    linkObjectToPdp(selectedAuditSecu.id as number, props.currentObject.id as number,ObjectAnsweredObjects.AUDIT).then((auditSecu: ObjectAnswered) => {
                        auditSecu.auditSecu = selectedAuditSecu;
                        props.saveObject({
                            ...props.currentObject,
                            auditSecus: [...(props.currentObject.auditSecus || []), auditSecu]
                        });
                        props.setIsChanged(true);
                    });
                } else {
                    // Add auditSecu to new PDP being created
                    props.saveObject({
                        ...props.currentObject,
                        auditSecus: [...(props.currentObject.auditSecus || []), { auditSecu: selectedAuditSecu }]
                    });
                    props.setIsChanged(true);
                }
            } else if (props.targetType === "bdt") {
                // Handling for BDT
                if (props.currentObject.id != null) {
                    // Link auditSecu to existing BDT
                    linkAuditToBDT(props.currentObject.id as number, selectedAuditSecu.id as number).then((auditSecu: ObjectAnswered) => {
                        // Update the BDT with the new auditSecu
                        const updatedAuditSecus = [...(props.currentObject.auditSecu || [])];
                        // Add the new auditSecu to the BDT
                        if (!updatedAuditSecus.some(a => a.id === selectedAuditSecu.id)) {
                            updatedAuditSecus.push({
                                id: selectedAuditSecu.id,
                                auditSecu: selectedAuditSecu
                            });
                        }

                        props.saveObject({
                            ...props.currentObject,
                            auditSecu: updatedAuditSecus
                        });
                        props.setIsChanged(true);
                    });
                } else {
                    // Add auditSecu to new BDT being created
                    const updatedAuditSecus = [...(props.currentObject.auditSecu || [])];
                    if (!updatedAuditSecus.some(a => a.id === selectedAuditSecu.id)) {
                        updatedAuditSecus.push({
                            id: selectedAuditSecu.id,
                            auditSecu: selectedAuditSecu
                        });
                    }

                    props.saveObject({
                        ...props.currentObject,
                        auditSecu: updatedAuditSecus
                    });
                    props.setIsChanged(true);
                }
            }
        }

        console.log("Selected auditSecu:", props.currentObject);
        props.setOpen(false);
    };

    return (
        <SelectOrCreate<AuditSecu>
            open={props.open}
            where={"chantier"}
            setOpen={props.setOpen}
            currentPdp={props.currentObject} // Map currentObject to currentPdp expected by SelectOrCreate
            savePdp={props.saveObject} // Map saveObject to savePdp expected by SelectOrCreate
            setIsChanged={props.setIsChanged}
            fetchItems={getAllAuditSecus}
            linkItem={linkAuditToBDT}
            alreadySelected={alreadySelected}
            getItemId={(auditSecu) => auditSecu.id as number}
            getItemTitle={(auditSecu) => auditSecu.title}
            getItemDescription={(auditSecu) => auditSecu.description}
            getItemImage={(auditSecu) => auditSecu?.logo ? `data:${auditSecu.logo.mimeType};base64,${auditSecu.logo.imageData}` : ''}
            onValidate={onValidate}
            openCreate={openCreateAuditSecu}
            setOpenCreate={setOpenCreateAuditSecu}
            createComponent={
                    <></>
            }
        />
    );
};

export default SelectOrCreateAuditSecu;