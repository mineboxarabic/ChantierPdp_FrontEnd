import React, {useEffect, useState} from "react";
import EditItem, {FieldConfig} from "../EditItem.tsx";
import Risque from "../../utils/entities/Risque.ts";
import useRisque from "../../hooks/useRisque.ts";
import EditGeneric from "../GenericCRUD/EditGeneirc.tsx";
import RisqueDTO from "../../utils/entitiesDTO/RisqueDTO.ts";
import { risqueConfig } from "../../pages/Risque/RisqueManager.tsx";

interface EditRisqueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
    risque?: RisqueDTO | null;
    setRisque: (risque: RisqueDTO) => void;
}

const EditRisque = ({
                              open,
                              setOpen,
                              isEdit,
                              risque,
                              setRisque,
                          }: EditRisqueProps) => {
    const { createRisque, updateRisque, deleteRisque, getRisque, getAllRisques } = useRisque();

    const [localRisque, setLocalRisque] = useState<RisqueDTO>(
        {
            title: "",
            description: "",
            travailleDangereux: false,
            travaillePermit: false,
            logo: { mimeType: "", imageData: "" },
        }
    );

    useEffect(() => {
        console.log("open", open);
        if (isEdit && risque) {
            setLocalRisque({ ...risque });
        } else {
            setLocalRisque({
                title: "",
                description: "",
                travailleDangereux: false,
                travaillePermit: false,
                logo: { mimeType: "", imageData: "" },
            });
        }
    }, [open]);


    const updateRisqueRe = (id:number , risque: RisqueDTO) : Promise<RisqueDTO> => {
        console.log("updating risque",id,risque);
        return updateRisque(risque, id).then((response:RisqueDTO) => {
            setRisque(response);
            setOpen(false);
        }) as Promise<RisqueDTO>;
    }

    const deleteRisqueRe = (id: number) : Promise<void> =>  {
        return deleteRisque(id).then(() => {
            setOpen(false);
        });
    }

    /*const onSave = async() => {
        if (isEdit) {
            updateRisque(localRisque, localRisque?.id as number).then((response:RisqueDTO) => {
                    setRisque(response);
                    setOpen(false);
                }
            );
        } else {
            console.log("creating risque",localRisque);
            createRisque(localRisque).then((response:RisqueDTO) => {
                setRisque(response);
                setOpen(false);
            });
        }
    }*/
    const onSave = async(localRisque:RisqueDTO) => {
        if (isEdit) {
            updateRisque(localRisque, localRisque?.id as number).then((response:RisqueDTO) => {
                    setRisque(response);
                    setOpen(false);
                }
            );
        } else {
            console.log("creating risque",localRisque);
            createRisque(localRisque).then((response:RisqueDTO) => {
                setRisque(response);
                setOpen(false);
            });
        }
    }
    const onDelete = async () => {
        console.log("deleting risque",localRisque);

        deleteRisque(localRisque?.id as number).then(() => {
            setOpen(false);
        });
    }
    return (
        <EditGeneric<RisqueDTO>
        entity={localRisque}
        config={risqueConfig}
        open={open}
        onClose={() => setOpen(false)}

        onSubmit={(e:RisqueDTO)=>{
            setLocalRisque(e);
            onSave(e);
        }}

        crudOperations={{
            create: createRisque,
            update: updateRisqueRe,
            delete: deleteRisqueRe,
            getById: getRisque,
            getAll: getAllRisques,
            getReferences: () => Promise.resolve([]),
        }} 
        
        />
    );
};

export default EditRisque;

