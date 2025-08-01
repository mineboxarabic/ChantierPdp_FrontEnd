import React from 'react';
import { createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD.tsx";
import {EntityConfig, FieldType, CrudOperations} from "../../components/GenericCRUD/TypeConfig.ts";
import useAnalyseRisque from "../../hooks/useAnalyseRisque.ts";
import defaultImage from "../../assets/wornings/worning.webp"
import {AnalyseDeRisqueDTO} from '../../utils/entitiesDTO/AnalyseDeRisqueDTO.ts';

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

// Define the entity configuration for AnalyseDeRisque
export const AnalyseDeRisqueConfig: EntityConfig = {
    entityType: 'analyseDeRisque',
    displayName: 'Analyse de Risque',
    pluralName: 'Analyses de Risque',
    keyField: 'id',
    displayField: 'deroulementDesTaches',
    searchFields: ['deroulementDesTaches', 'moyensUtilises', 'mesuresDePrevention'],
    defaultSortField: 'id',
    defaultImage: defaultImage,
    fields: [
        {
            key: 'id',
            type: FieldType.Number,
            label: 'ID',
            hidden: true,
        },
        {
            key: 'risque',
            type: FieldType.EntityRef,
            label: 'Risque',
            helperText: 'Select the risk associated with this analysis',
            reference: {
                fieldName: 'title',
                keyField: 'id',
            },
            required: true,
            order: 1,
        },
        {
            key: 'deroulementDesTaches',
            type: FieldType.Text,
            label: 'Task Flow',
            helperText: 'Describe the sequence of tasks and activities',
            multiline: true,
            rows: 4,
            order: 2,
            fullWidth: true,
        },
        {
            key: 'moyensUtilises',
            type: FieldType.Text,
            label: 'Tools and Means Used',
            helperText: 'List the tools, equipment, and resources used',
            multiline: true,
            rows: 3,
            order: 3,
            fullWidth: true,
        },
        {
            key: 'mesuresDePrevention',
            type: FieldType.Text,
            label: 'Prevention Measures',
            helperText: 'Describe the safety and prevention measures implemented',
            multiline: true,
            rows: 4,
            order: 4,
            fullWidth: true,
        },
    ],
};
// Example component showing how to use the generic CRUD system for AnalyseDeRisque
const AnalyseDeRisqueManager = () => {
    // Get the hook for AnalyseDeRisque CRUD operations
    const analyseService = useAnalyseRisque();

    // Create CRUD operations adapter from the analyse service
    const crudOperations: CrudOperations<AnalyseDeRisqueDTO> = {
        getAll: async () => {
            const analyses = await analyseService.getAllAnalyses();
            return analyses || [];
        },
        getById: async (id: number) => {
            const analyse = await analyseService.getAnalyseRisque(id);
            return analyse;
        },
        create: async (entity: AnalyseDeRisqueDTO) => {
            const newAnalyse = await analyseService.createAnalyse(entity);
            return newAnalyse;
        },
        update: async (id: number, entity: AnalyseDeRisqueDTO) => {
            const updatedAnalyse = await analyseService.updateAnalyse(id, entity);
            return updatedAnalyse;
        },
        delete: async (id: number) => {
            await analyseService.deleteAnalyse(id);
        },
    };

    return (
        <ManagerCRUD
            config={AnalyseDeRisqueConfig}
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

export default AnalyseDeRisqueManager;