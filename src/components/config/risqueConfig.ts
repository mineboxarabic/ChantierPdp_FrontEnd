
import { FormConfig } from '../common/GenericCreateForm';

export const risqueConfig: FormConfig = {
    fields: [
        {
            name: 'title',
            label: 'Titre du Risque',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            multiline: true,
            rows: 4,
        },
        {
            name: 'logo',
            label: 'Image/Logo du Risque',
            type: 'file',
            accept: 'image/*',
        },
        {
            name: 'travailleDangereux',
            label: 'Travail Dangereux',
            type: 'boolean',
        },
        {
            name: 'travaillePermit',
            label: 'Nécessite un permis',
            type: 'boolean',
        },
    ],
};
