import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD.tsx";
import {EntityConfig, FieldType, CrudOperations, ImageModel} from "../../components/GenericCRUD/TypeConfig.ts";
import useAuditSecu from "../../hooks/useAuditSecu.ts";
import {AuditSecu} from "../../utils/entities/AuditSecu.ts";

// Create a theme instance
const theme = createTheme({
    shape: {
        borderRadius: 8,
    },
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'sans-serif',
        ].join(','),
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
});

// Component for Audit Security management
const AuditSecuManager = () => {
    // Get the hook for AuditSecu CRUD operations
    const auditSecuService = useAuditSecu();


    // Define the entity configuration
    const auditSecuConfig: EntityConfig = {
        entityType: 'auditSecu',
        displayName: 'Security Audit',
        pluralName: 'Security Audits',
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
                multiline: true,
                rows: 4,
                order: 2,
                fullWidth: true,
            },
            {
                key: 'completionStatus',
                type: FieldType.Boolean,
                label: 'Completion Status',
                order: 3,
            },
            {
                key: 'securityLevel',
                type: FieldType.ArrayOfSimpleValues,
                label: 'Security Level',
                options: [
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'critical', label: 'Critical' }
                ],
                order: 4,
            },
            {
                key: 'comments',
                type: FieldType.Text,
                label: 'Comments',
                multiline: true,
                rows: 3,
                order: 5,
                fullWidth: true,
            },
            {
                key: 'logo',
                type: FieldType.Image,
                label: 'Logo',
                order: 6,
                fullWidth: true
            },
        ],
    };

    // Create CRUD operations adapter from the audit service
    const crudOperations: CrudOperations<AuditSecu> = {
        getAll: async () => {
            const auditSecus = await auditSecuService.getAllAuditSecus();
            return auditSecus || [];
        },
        getById: async (id: number) => {
            const auditSecu = await auditSecuService.getAuditSecu(id);
            return auditSecu;
        },
        create: async (entity: AuditSecu) => {
            const newAuditSecu = await auditSecuService.createAuditSecu(entity);
            return newAuditSecu;
        },
        update: async (id: number, entity: AuditSecu) => {
            const updatedAuditSecu = await auditSecuService.updateAuditSecu(entity, id);
            return updatedAuditSecu;
        },
        delete: async (id: number) => {
            await auditSecuService.deleteAuditSecu(id);
        },
    };

    return (
        <ManagerCRUD
            config={auditSecuConfig}
            crudOperations={crudOperations}
            actions={{
                create: true,
                edit: true,
                delete: true,
                view: true,
                export: true,
                import: true,
            }}
        />
    );
};

export default AuditSecuManager;