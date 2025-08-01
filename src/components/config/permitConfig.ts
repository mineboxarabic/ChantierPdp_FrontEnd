import { FormConfig } from '../common/GenericCreateForm';

export const permitConfig: FormConfig = {
    fields: [
        {
            name: 'title',
            label: 'Titre du Permis',
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
            label: 'Image/Logo du Permis',
            type: 'file',
            accept: 'image/*',
        },
    ],
};
