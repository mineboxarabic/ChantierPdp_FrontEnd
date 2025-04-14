import { useState } from "react";
import useRisque from "../../hooks/useRisque";
import Risque from "../../utils/entities/Risque.ts";
import EditRisque from "../Risque/EditRisque";
import SelectOrCreateObjectAnswered from "./SelectOrCreateObjectAnswered";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import AnalyseDeRisque from "../../utils/entities/AnalyseDeRisque.ts";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";

interface SelectOrCreateRisqueProps<P> {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentObject: P;
    saveObject: (obj: P) => void;
    setIsChanged: (isChanged: boolean) => void;
    // Function to link a risque to the current object
    linkRisqueToObject: (risqueId: number, objectId: number) => Promise<any>;
    // Optional props for analysis case
    analyseDeRisque?: AnalyseDeRisque;
    setAnalyseDeRisque?: (analyseDeRisque: AnalyseDeRisque) => void;
    linkRisqueToAnalyse?: (analyseId: number, risqueId: number) => Promise<ObjectAnsweredEntreprises>;
    // Function to get risques from the parent object
    getRisques: (obj: P) => any[] | undefined;
}

function SelectOrCreateRisque<P extends { id?: number }>(props: SelectOrCreateRisqueProps<P>) {
    const risqueHook = useRisque();
    const [openCreateRisque, setOpenCreateRisque] = useState(false);

    // Handle special case for analyse de risque
    const onRisqueSelected = (risque: Risque) => {
        if (props.analyseDeRisque && props.setAnalyseDeRisque) {
            props.setIsChanged(true);
            props.setAnalyseDeRisque({ ...props.analyseDeRisque, risque: risque } as AnalyseDeRisque);

            if (props.linkRisqueToAnalyse && props.analyseDeRisque.id) {
                props.linkRisqueToAnalyse(props.analyseDeRisque.id, risque.id as number);
            }
        }
    };

    // Check if risque is already linked to analyse de risque
    const isRisqueAlreadySelected = (risque: Risque) => {
        if (props.analyseDeRisque) {
            return props.analyseDeRisque?.risque?.id === risque?.id;
        }
        return false;
    };

    return (
        <>
            {props.analyseDeRisque ? (
                // Special handling for analyse de risque case
                <SelectOrCreateObjectAnswered<Risque, P>
                    open={props.open}
                    setOpen={props.setOpen}
                    parentObject={props.currentObject}
                    saveParentObject={props.saveObject}
                    setIsChanged={props.setIsChanged}
                    objectType={ObjectAnsweredObjects.RISQUE}
                    itemHook={{
                        getAllItems: risqueHook.getAllRisques
                    }}
                    linkingHook={{
                        linkItem: props.linkRisqueToObject
                    }}
                    getExistingItems={props.getRisques}
                    isItemAlreadySelected={isRisqueAlreadySelected}
                    onItemSelected={onRisqueSelected}
                    createComponent={
                        <EditRisque
                            risque={null}
                            setRisque={() => props.setIsChanged(true)}
                            open={openCreateRisque}
                            setOpen={setOpenCreateRisque}
                            isEdit={false}
                        />
                    }
                />
            ) : (
                // Standard case for PDPs, BDTs, etc.
                <SelectOrCreateObjectAnswered<Risque, P>
                    open={props.open}
                    setOpen={props.setOpen}
                    parentObject={props.currentObject}
                    saveParentObject={props.saveObject}
                    setIsChanged={props.setIsChanged}
                    objectType={ObjectAnsweredObjects.RISQUE}
                    itemHook={{
                        getAllItems: risqueHook.getAllRisques
                    }}
                    linkingHook={{
                        linkItem: props.linkRisqueToObject
                    }}
                    getExistingItems={props.getRisques}
                    createComponent={
                        <EditRisque
                            risque={null}
                            setRisque={() => props.setIsChanged(true)}
                            open={openCreateRisque}
                            setOpen={setOpenCreateRisque}
                            isEdit={false}
                        />
                    }
                />
            )}
        </>
    );
}

export default SelectOrCreateRisque as typeof SelectOrCreateRisque;