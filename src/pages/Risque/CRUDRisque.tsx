import React from 'react';
import { GenericCrud, EntityConfig} from "../GenericCrud.tsx";
import useRisque from "../../hooks/useRisque.ts";
import Risque from "../../utils/entities/Risque.ts";


const RisqueCrud: React.FC = () => {
    // Define the configuration for the Risque entity

    const {getAllRisques, getRisque, createRisque, updateRisque, deleteRisque} = useRisque();
    const risqueConfig: EntityConfig<Risque> = {
        entityName: 'Risque',
        entityNamePlural: 'Risques',
        fields: [
            {
                key: 'id',
                label: 'ID',
                type: 'number',
                readOnly: true,
                hidden: false
            },
            {
                key: 'title',
                label: 'Title',
                type: 'text',
                required: true
            },
            {
                key: 'description',
                label: 'Description',
                type: 'text',
                required: true
            },
            {
                key: 'travailleDangereux',
                label: 'Travaille Dangereux',
                type: 'boolean',
                required: true
            },
            {
                key: 'travaillePermit',
                label: 'Travaille Permit',
                type: 'boolean',
                required: true
            },
            {
                key: 'logo',
                label: 'Logo',
                type: 'image',
                required: false
            }
        ],
        fetchData: async () => {
            return await getAllRisques();
        },
        createData: async (data: Risque) => {
            return await createRisque(data);
        },
        updateData: async (id: number, data: Risque) => {
            //return await risqueApi.update(id, data);
            return await updateRisque( data,id);
        },
        deleteData: async (id: number) => {
            //await risqueApi.delete(id);
            await deleteRisque(id);
        },
        getEmptyEntity: () => {
            return {
                title: '',
                description: '',
                travailleDangereux: false,
                travaillePermit: false
            } as Risque;
        }
    };

    return <GenericCrud config={risqueConfig} />;
};

export default RisqueCrud;