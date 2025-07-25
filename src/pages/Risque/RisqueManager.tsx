import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD.tsx";
import {EntityConfig, FieldType, CrudOperations, ImageModel} from "../../components/GenericCRUD/TypeConfig.ts";
import useRisque from "../../hooks/useRisque.ts";
import defaultImage from "../../assets/wornings/worning.webp"
import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO.ts';
import PermiTypes from '../../utils/PermiTypes.ts';

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
    // Define the entity configuration
export const risqueConfig: EntityConfig = {
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
            key: 'permitId',
            type: FieldType.Number,
            label: 'Permit ID',
            order: 5,
            hidden: false, // You can set to true if you don't want to show this field in forms
        },
        {
            key: 'permitType',
            type: FieldType.Enum,
            label: 'Permit Type',
            order: 6,
            options: [
                { value: PermiTypes.NONE, label: 'None' },
                { value: PermiTypes.FOUILLE, label: 'Fouille (Excavation Work)' },
                { value: PermiTypes.ATEX, label: 'ATEX (Explosive Atmosphere)' },
                { value: PermiTypes.ESPACE_CONFINE, label: 'Espace Confiné (Confined Space)' },
                { value: PermiTypes.LEVAGE, label: 'Levage (Lifting Work)' },
                { value: PermiTypes.HAUTEUR, label: 'Hauteur (Height Work)' },
                { value: PermiTypes.TOITURE, label: 'Toiture (Roof Work)' },
            ],
        },
        {
            key: 'logo',
            type: FieldType.Image,
            label: 'Logo',
            order: 7,
            fullWidth: true
        },
    ],
};
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




    // Create CRUD operations adapter from the risque service
    const crudOperations: CrudOperations<RisqueDTO> = {
        getAll: async () => {
            const risques = await risqueService.getAllRisques();
            return risques || [];
        },
        getById: async (id: number) => {
            const risque = await risqueService.getRisque(id);
            return risque;
        },
        create: async (entity: RisqueDTO) => {
            const newRisque = await risqueService.createRisque(entity);
            return newRisque;
        },
        update: async (id: number, entity: RisqueDTO) => {
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