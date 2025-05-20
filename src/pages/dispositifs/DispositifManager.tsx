import { EntityConfig, FieldType } from "../../components/GenericCRUD/TypeConfig";
import DispositifDTO from "../../utils/entitiesDTO/DispositifDTO";

export const dispositifConfig: EntityConfig = {
    entityType: 'dispositif',
    displayName: 'Dispositif',
    pluralName: 'Dispositifs',

    keyField: 'id',
    
    displayField: 'title',
    searchFields: ['title', 'description'],
    defaultSortField: 'title',
    fields: [
        {
            key: 'id',
            type: FieldType.Number,
            label: 'ID',
            hidden: true,
        },
        {
            key: 'title',
            type: FieldType.Text,
            label: 'Title',
            required: true,
            order: 1,
        },
        {
            key: 'description',
            type: FieldType.Text,
            label: 'Description',
            required: true,
            multiline: true,
            order: 2,
        },
        {
            key: 'imageUrl',
            type: FieldType.Image,
            label: 'Image URL',
            required: false,
            order: 3,
        },
    ],

}