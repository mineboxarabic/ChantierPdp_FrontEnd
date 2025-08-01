

import { FormConfig } from '../common/GenericCreateForm';

export const auditConfig: FormConfig = {
    fields: [
        {
            name: 'title',
            label: 'Titre de l\'audit',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            required: true,
            multiline: true,
            rows: 3,
        },
        {
            name: 'logo',
            label: 'Image/Logo de l\'audit',
            type: 'file',
            accept: 'image/*',
        },
        {
            name: 'typeOfAudit',
            label: 'Type d\'audit',
            type: 'text',
            required: false,
        },
    ],
};

