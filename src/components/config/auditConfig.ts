

import { FormConfig } from '../common/GenericCreateForm';
import AuditType from '../../utils/AuditType';

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
            type: 'select',
            required: true,
            options: [
                { value: AuditType.INTERVENANT, label: 'Intervenants' },
                { value: AuditType.OUTILS, label: 'Outils' }
            ],
        },
    ],
};

