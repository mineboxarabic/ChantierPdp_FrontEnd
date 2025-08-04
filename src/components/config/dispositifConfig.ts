
import { FormConfig } from '../common/GenericCreateForm';

export const dispositifConfig: FormConfig = {
    fields: [
        {
            name: 'title',
            label: 'Titre du Dispositif',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            required: true,
            multiline: true,
            rows: 4,
        },
        {
            name: 'type',
            label: 'Type de Dispositif',
            type: 'select',
            required: true,
            options: [
                { value: 'EPI', label: 'EPI - Équipement de Protection Individuelle' },
                { value: 'EPC', label: 'EPC - Équipement de Protection Collective' },
            ],
        },
        {
            name: 'logo',
            label: 'Image/Logo du Dispositif',
            type: 'file',
            accept: 'image/*',
        },
    ],
};
