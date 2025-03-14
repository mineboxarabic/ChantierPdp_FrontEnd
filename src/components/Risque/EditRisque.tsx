import React, {useEffect, useState} from "react";
import EditItem, {FieldConfig} from "../EditItem.tsx";
import Risque from "../../utils/Risque/Risque.ts";
import useRisque from "../../hooks/useRisque.ts";

interface EditRisqueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
    risque?: Risque | null;
    setRisque: (risque: Risque) => void;
}

const EditRisque = ({
                              open,
                              setOpen,
                              isEdit,
                              risque,
                              setRisque,
                          }: EditRisqueProps) => {
    const { createRisque, updateRisque, deleteRisque, getRisque } = useRisque();

    const [localRisque, setLocalRisque] = useState<Risque>(
        {
            title: "",
            description: "",
            travailleDangereux: false,
            travaillePermit: false,
            logo: { mimeType: "", imageData: "" },
        }
    );

    useEffect(() => {

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


    const fieldsConfig:FieldConfig<any>[] = [
        {
            label: "Logo",
            type: "image",
            getter: () => localRisque.logo,
            setter: (value: { mimeType: string; imageData: string }) =>
                setLocalRisque((prev) => ({ ...prev, logo: value })),
        },
        {
            label: "Title",
            type: "text",
            getter: () => localRisque.title,
            setter: (value: string) => setLocalRisque((prev) => ({ ...prev, title: value })),
        },
        {
            label: "Description",
            type: "text",
            getter: () => localRisque.description,
            setter: (value: string) => setLocalRisque((prev) => ({ ...prev, description: value })),
        },
        {
            label: "Travaille Dangereux",
            type: "checkbox",
            getter: () => localRisque.travailleDangereux,
            setter: (value: boolean) => setLocalRisque((prev) => ({ ...prev, travailleDangereux: value })),
        },
        {
            label: "Travaille Permit",
            type: "checkbox",
            getter: () => localRisque.travaillePermit,
            setter: (value: boolean) => setLocalRisque((prev) => ({ ...prev, travaillePermit: value })),
        },

    ];


    const onSave = async() => {
        if (isEdit) {
            console.log("updating risque",localRisque);
            updateRisque(localRisque, localRisque?.id as number).then((response:Risque) => {
                    setRisque(response);
                    setOpen(false);
                }
            );
        } else {
            console.log("creating risque",localRisque);
            createRisque(localRisque).then((response:Risque) => {
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
        <EditItem <Risque>
            open={open}
            setOpen={setOpen}
            isEdit={isEdit}
            title="Risque"
            fieldsConfig={fieldsConfig}
            initialItem={localRisque}
            itemId={risque?.id}
            onSave={onSave}
            onDelete={onDelete}
        />
    );
};

export default EditRisque;

