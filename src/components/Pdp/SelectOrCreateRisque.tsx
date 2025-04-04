import SelectOrCreate from "./SelectOrCreate";
import useRisque from "../../hooks/useRisque";
import usePdp from "../../hooks/usePdp";
import useBdt from "../../hooks/useBdt";
import EditRisque from "../Risque/EditRisque";
import defaultImage from "../../assets/default_entreprise_image.png";
import Risque from "../../utils/entities/Risque.ts";
import { useState } from "react";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";
import AnalyseDeRisque from "../../utils/entities/AnalyseDeRisque.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import { BDT } from "../../utils/entities/BDT.ts";

interface SelectOrCreateRisqueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentObject: any; // Can be PDP or BDT
    saveObject: (obj: any) => void;
    setIsChanged: (isChanged: boolean) => void;
    targetType: "pdp" | "bdt"; // Specifies whether we're adding to PDP or BDT
    linkRisqueToAnalyse?: (analyseId: number, risqueId: number) => Promise<ObjectAnsweredEntreprises>;
    analyseDeRisque?: AnalyseDeRisque;
    setAnalyseDeRisque?: (analyseDeRisque: AnalyseDeRisque) => void;
}

const SelectOrCreateRisque = (props: SelectOrCreateRisqueProps) => {
    const { getAllRisques } = useRisque();

    const { linkRisqueToPdp } = usePdp();
    const { linkRisqueToBDT } = useBdt();

    const [openCreateRisque, setOpenCreateRisque] = useState(false);

    const alreadySelected = (risque: Risque) => {
        if (props.analyseDeRisque) {
            return props.analyseDeRisque?.risque?.id === risque?.id;
        }

        if (props.targetType === "pdp") {
            return props.currentObject?.risques?.some((r: any) => r.risque.id === risque.id);
        } else if (props.targetType === "bdt") {
            // Handling for BDT - check if the risque is already linked
            return props.currentObject?.risques?.some((r: any) => r.risque.id === risque.id);
        }

        return false;
    };

    const onValidate = (selectedRisque: Risque) => {
        if (selectedRisque) {
            if (props.targetType === "pdp") {
                // Handling for PDP
                if (props.analyseDeRisque) {
                    // Handling for analyze risk case
                    props.setIsChanged(true);
                    if (props.setAnalyseDeRisque) {
                        props.setAnalyseDeRisque({ ...props.analyseDeRisque, risque: selectedRisque } as AnalyseDeRisque);
                    }

                    if (props.linkRisqueToAnalyse && props.analyseDeRisque.id) {
                        props.linkRisqueToAnalyse(props.analyseDeRisque.id, selectedRisque.id as number);
                    }
                } else if (props.currentObject.id != null) {
                    // Link risque to existing PDP
                    linkRisqueToPdp(selectedRisque.id as number, props.currentObject.id as number).then((risque: ObjectAnswered) => {
                        risque.risque = selectedRisque;
                        props.saveObject({
                            ...props.currentObject,
                            risques: [...props.currentObject.risques, risque]
                        });
                        props.setIsChanged(true);
                    });
                } else {
                    // Add risque to new PDP being created
                    props.saveObject({
                        ...props.currentObject,
                        risques: [...(props.currentObject.risques || []), { risque: selectedRisque }]
                    });
                    props.setIsChanged(true);
                }
            } else if (props.targetType === "bdt") {
                // Handling for BDT
                if (props.currentObject.id != null) {
                    // Link risque to existing BDT
                    linkRisqueToBDT( selectedRisque.id as number,props.currentObject.id as number).then((risque: ObjectAnswered) => {
                        // Update the BDT with the new risque
                        console.log('linking', props.currentObject.id as number);

                        risque.risque = selectedRisque;
                        props.saveObject({
                            ...props.currentObject,
                            risques: [...props.currentObject.risques, risque]
                        });
                        props.setIsChanged(true);
                    });
                } else {
                    // Add risque to new BDT being created
                    const updatedRisques = [...(props.currentObject.risques || [])];
                    if (!updatedRisques.some(r => r.risque.id === selectedRisque.id)) {
                        updatedRisques.push({
                            id: selectedRisque.id,
                            risque: selectedRisque
                        });
                    }

                    props.saveObject({
                        ...props.currentObject,
                        risques: updatedRisques
                    });
                    props.setIsChanged(true);
                }

            }
        }

        console.log("Selected risque:", props.currentObject);
        props.setOpen(false);
    };

    return (
        <SelectOrCreate<Risque>
            open={props.open}
            setOpen={props.setOpen}
            currentPdp={props.currentObject} // Map currentObject to currentPdp expected by SelectOrCreate
            savePdp={props.saveObject} // Map saveObject to savePdp expected by SelectOrCreate
            setIsChanged={props.setIsChanged}
            where="risques"
            fetchItems={getAllRisques}
            linkItem={
                props.targetType === "pdp"
                    ? (props.linkRisqueToAnalyse || linkRisqueToPdp)
                    : linkRisqueToBDT
            }
            alreadySelected={alreadySelected}
            getItemId={(risque) => risque.id as number}
            getItemTitle={(risque) => risque.title}
            getItemDescription={(risque) => risque.description}
            getItemImage={(risque) => risque?.logo ? `data:${risque.logo.mimeType};base64,${risque.logo.imageData}` : defaultImage}
            onValidate={onValidate}
            openCreate={openCreateRisque}
            setOpenCreate={setOpenCreateRisque}
            createComponent={
                <EditRisque
                    risque={null}
                    setRisque={(newRisque: Risque) => props.setIsChanged(true)}
                    open={openCreateRisque}
                    setOpen={setOpenCreateRisque}
                    isEdit={false}
                />
            }
        />
    );
};

export default SelectOrCreateRisque;