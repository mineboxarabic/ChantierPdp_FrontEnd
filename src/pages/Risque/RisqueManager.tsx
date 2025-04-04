import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD.tsx";
import {EntityConfig, FieldType, CrudOperations, ImageModel} from "../../components/GenericCRUD/TypeConfig.ts";
import Risque from "../../utils/entities/Risque.ts";
import useRisque from "../../hooks/useRisque.ts";
import defaultImage from "../../assets/wornings/worning.webp"

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

// Example component showing how to use the generic CRUD system
const RisqueManager = () => {
    // Get the hook for Risque CRUD operations
    const risqueService = useRisque();

    const getDefaultImage = ():ImageModel => {

        //Turn the image into a base64 string
        const imageData = defaultImage;
        const mimeType = 'image/webp';
        return{
            imageData:imageData,
            mimeType :mimeType
        }
    }

    // Define the entity configuration
    const risqueConfig: EntityConfig = {
        entityType: 'risque',
        displayName: 'Risk',
        pluralName: 'Risks',
        keyField: 'id',
        displayField: 'title',
        searchFields: ['title', 'description'],
        defaultSortField: 'title',
        defaultImage: defaultImage,
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
                key: 'travailleDangereux',
                type: FieldType.Boolean,
                label: 'Dangerous Work',
                order: 3,
            },
            {
                key: 'travaillePermit',
                type: FieldType.Boolean,
                label: 'Requires Permit',
                order: 4,
            },
            {
                key: 'logo',
                type: FieldType.Image,
                label: 'Logo',
                order: 5,
                fullWidth: true
            },
        ],
    };

    // Create CRUD operations adapter from the risque service
    const crudOperations: CrudOperations<Risque> = {
        getAll: async () => {
            const risques = await risqueService.getAllRisques();
            return risques || [];
        },
        getById: async (id: number) => {
            const risque = await risqueService.getRisque(id);
            return risque;
        },
        create: async (entity: Risque) => {
            const newRisque = await risqueService.createRisque(entity);
            return newRisque;
        },
        update: async (id: number, entity: Risque) => {
            const updatedRisque = await risqueService.updateRisque(entity, id);
            return updatedRisque;
        },
        delete: async (id: number) => {
            await risqueService.deleteRisque(id);
        },
    };

    return (
        <ManagerCRUD
            config={risqueConfig}
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

export default RisqueManager;