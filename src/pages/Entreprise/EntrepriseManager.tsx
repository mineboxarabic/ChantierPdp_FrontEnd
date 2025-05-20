import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD";
import { EntityConfig, FieldType, CrudOperations } from "../../components/GenericCRUD/TypeConfig";
import useEntreprise from "../../hooks/useEntreprise";
import useWorker from "../../hooks/useWoker.ts";
import {EntrepriseDTO} from "../../utils/entitiesDTO/EntrepriseDTO.ts";

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

// EntrepriseManager component using the generic CRUD system
const EntrepriseManager = () => {
    // Get the hook for Entreprise CRUD operations
    const entrepriseService = useEntreprise();
    const workerService = useWorker();
    // Define the entity configuration for Entreprise
    const entrepriseConfig: EntityConfig = {
        entityType: 'entreprise',
        displayName: 'Company',
        pluralName: 'Companies',
        keyField: 'id',
        displayField: 'nom',
        searchFields: ['nom', 'description', 'raisonSociale'],
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
                section: 'Basic Information',
            },
            {
                key: 'type',
                type: FieldType.Enum,
                label: 'Company Type',
                order: 2,
                section: 'Basic Information',
                options: [
                    { value: 'EE', label: 'External Company (EE)' },
                    { value: 'EU', label: 'User Company (EU)' }
                ],
            },
            {
                key: 'raisonSociale',
                type: FieldType.Text,
                label: 'Corporate Name',
                order: 3,
                section: 'Basic Information',
            },
            {
                key: 'description',
                type: FieldType.Text,
                label: 'Description',
                multiline: true,
                rows: 4,
                order: 4,
                section: 'Basic Information',
                fullWidth: true,
            },
            {
                key: 'numTel',
                type: FieldType.Text,
                label: 'Phone Number',
                order: 5,
                section: 'Contact Information',
                validation: {
                    pattern: '^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$',
                    patternMessage: 'Please enter a valid phone number',
                },
            },
            {
                key: 'image',
                type: FieldType.Image,
                label: 'Logo',
                order: 6,
                section: 'Visual',
                fullWidth: true,
            },
            {
                key: 'pdps',
                type: FieldType.ArrayOfEntityRefs,
                label: 'Prevention Plans',
                order: 7,
                section: 'Relationships',
                entityType: 'pdp',
                fullWidth: true,
            },
            {
                key: 'workers',
                type: FieldType.ArrayOfEntityRefs,
                label: 'Workers',
                order: 8,
                section: 'Relationships',
                entityType: 'worker',
                fullWidth: true,
                reference:{fieldName:'nom', keyField:'id'},
            },
            {
                key: 'medecinDuTravailleEE',
                type: FieldType.Object,
                label: 'Occupational Physician',
                order: 9,
                section: 'Healthcare',
                fullWidth: true,
                helperText: 'Enter information about the occupational physician',
            },
        ],
    };

    // Create CRUD operations adapter from the entreprise service
    const crudOperations: CrudOperations<EntrepriseDTO> = {
        getAll: async () => {
            const entreprises = await entrepriseService.getAllEntreprises();
            return entreprises || [];
        },
        getById: async (id: number) => {
            const entreprise = await entrepriseService.getEntreprise(id);
            return entreprise;
        },
        create: async (entity: EntrepriseDTO) => {
            const newEntreprise = await entrepriseService.createEntreprise(entity);
            return newEntreprise;
        },
        update: async (id: number, entity: EntrepriseDTO) => {
            const updatedEntreprise = await entrepriseService.updateEntreprise(entity, id);
            return updatedEntreprise;
        },
        delete: async (id: number) => {
            await entrepriseService.deleteEntreprise(id);
        },
        // Optional function to get reference entities for dropdowns
        getReferences: async (entityType: string, query?: string) => {
            // This would need to be implemented to fetch referenced entities
            // For example, workers or PDPs for selection in dropdowns
            // For now, return an empty array
            console.log(`Fetching references forxx: ${entityType}, query: ${query}`);
            if(entityType == 'worker'){
                return await workerService.getAllWorkers();
            }

            return [];
        }
    };

    return (
        <ManagerCRUD
            config={entrepriseConfig}
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

export default EntrepriseManager;