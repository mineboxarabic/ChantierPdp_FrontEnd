import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD";
import { EntityConfig, FieldType, CrudOperations } from "../../components/GenericCRUD/TypeConfig";
import Permit from "../../utils/entities/Permit.ts";
import usePermit from "../../hooks/usePermit";
import PermiTypes from "../../utils/PermiTypes";

// Create a theme instance (reusing the same theme for consistency)
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

// PermitManager component using the generic CRUD system
const PermitManager = () => {
    // Get the hook for Permit CRUD operations
    const permitService = usePermit();

    // Define the entity configuration for Permit
    const permitConfig: EntityConfig = {
        entityType: 'permit',
        displayName: 'Permit',
        pluralName: 'Permits',
        keyField: 'id',
        displayField: 'title', // Using 'titre' as display field from InfoDeBase
        searchFields: ['title', 'description'],
        defaultSortField: 'title',
        fields: [
            {
                key: 'id',
                type: FieldType.Number,
                label: 'ID',
                hidden: true

            },
            {
                key: 'title',
                type: FieldType.Text,
                label: 'Title',
                required: true,
                order: 1,
                section: 'Basic Information',
            },
            {
                key: 'description',
                type: FieldType.Text,
                label: 'Description',
                multiline: true,
                rows: 4,
                order: 2,
                section: 'Basic Information',
                fullWidth: true,
            },
          /*  {
                key: 'type',
                type: FieldType.Enum,
                label: 'Permit Type',
                required: true,
                order: 3,
                section: 'Permit Details',
                options: [
                    { value: PermiTypes.NONE, label: 'None' },
                    { value: PermiTypes.TYPE1, label: 'Type 1' },
                    { value: PermiTypes.TYPE2, label: 'Type 2' },
                    { value: PermiTypes.TYPE3, label: 'Type 3' },
                    // Add other types as needed based on your PermiTypes enum
                ],
            },*/
            {
                key: 'pdfData',
                type: FieldType.Text,
                label: 'PDF Data',
                multiline: true,
                rows: 3,
                order: 4,
                section: 'Permit Details',
                fullWidth: true,
                helperText: 'Base64 encoded PDF data',
                hidden: true,
            },
            {
                key: 'image',
                type: FieldType.Image,
                label: 'Image',
                order: 5,
                section: 'Visual',
                fullWidth: true,
            },
        ],
    };

    // Create CRUD operations adapter from the permit service
    const crudOperations: CrudOperations<Permit> = {
        getAll: async () => {
            const permits = await permitService.getAllPermits();
            return permits || [];
        },
        getById: async (id: number) => {
            const permit = await permitService.getPermit(id);
            return permit;
        },
        create: async (entity: Permit) => {
            const newPermit = await permitService.createPermit(entity);
            return newPermit;
        },
        update: async (id: number, entity: Permit) => {
            const updatedPermit = await permitService.updatePermit(entity, id);
            return updatedPermit;
        },
        delete: async (id: number) => {
            await permitService.deletePermit(id);
        },
    };

    return (
        <ManagerCRUD
            config={permitConfig}
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

export default PermitManager;