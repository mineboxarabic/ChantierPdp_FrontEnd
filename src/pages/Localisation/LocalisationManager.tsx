import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD";
import { EntityConfig, FieldType, CrudOperations } from "../../components/GenericCRUD/TypeConfig";
import Localisation from "../../utils/entities/Localisation.ts";
import useLocalisation from "../../hooks/useLocalisation";

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

// LocalisationManager component using the generic CRUD system
const LocalisationManager = () => {
    // Get the hook for Localisation CRUD operations
    const localisationService = useLocalisation();

    // Define the entity configuration for Localisation
    const localisationConfig: EntityConfig = {
        entityType: 'localisation',
        displayName: 'Location',
        pluralName: 'Locations',
        keyField: 'id',
        displayField: 'nom',
        searchFields: ['nom', 'code', 'description'],
        defaultSortField: 'nom',
        fields: [
            {
                key: 'id',
                type: FieldType.Number,
                label: 'ID',
                hidden: true,
            },
            {
                key: 'nom',
                type: FieldType.Text,
                label: 'Name',
                required: true,
                order: 1,
                validation: {
                    pattern: '^[\\w\\s-]{2,50}$',
                    patternMessage: 'Name must be between 2 and 50 characters',
                },
            },
            {
                key: 'code',
                type: FieldType.Text,
                label: 'Code',
                required: true,
                order: 2,
                validation: {
                    pattern: '^[A-Z0-9-]{1,20}$',
                    patternMessage: 'Code must consist of uppercase letters, numbers, and hyphens only',
                },
                helperText: 'Location code (e.g., FR-PAR for Paris, France)',
            },
            {
                key: 'description',
                type: FieldType.Text,
                label: 'Description',
                multiline: true,
                rows: 4,
                order: 3,
                fullWidth: true,
                placeholder: 'Provide a detailed description of this location',
            },
        ],
    };

    // Create CRUD operations adapter from the localisation service
    const crudOperations: CrudOperations<Localisation> = {
        getAll: async () => {
            const localisations = await localisationService.getAllLocalisations();
            return localisations || [];
        },
        getById: async (id: number) => {
            const localisation = await localisationService.getLocalisation(id);
            return localisation;
        },
        create: async (entity: Localisation) => {
            const newLocalisation = await localisationService.createLocalisation(entity);
            return newLocalisation;
        },
        update: async (id: number, entity: Localisation) => {
            const updatedLocalisation = await localisationService.updateLocalisation(entity, id);
            return updatedLocalisation;
        },
        delete: async (id: number) => {
            await localisationService.deleteLocalisation(id);
        },
    };

    return (
        <ManagerCRUD
            config={localisationConfig}
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

export default LocalisationManager;