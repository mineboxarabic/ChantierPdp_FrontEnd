import React, { useEffect, useState } from 'react';
import { createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD";
import { EntityConfig, FieldType, CrudOperations, EntityRef } from "../../components/GenericCRUD/TypeConfig";
import useWorker from "../../hooks/useWoker.ts";
import useEntreprise from "../../hooks/useEntreprise.ts";
import usePdp from "../../hooks/usePdp";
import useChantier from "../../hooks/useChantier";
import { WorkerDTO } from '../../utils/entitiesDTO/WorkerDTO.ts';

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

// WorkerManager component using the generic CRUD system
const WorkerManager = () => {
    // Get hooks for WorkerDTO and related entities CRUD operations
    const workerService = useWorker();
    const entrepriseService = useEntreprise();
    const pdpService = usePdp();
    const chantierService = useChantier();

    // State for reference data
    const [entreprises, setEntreprises] = useState<EntityRef[]>([]);
    const [pdps, setPdps] = useState<EntityRef[]>([]);
    const [chantiers, setChantiers] = useState<EntityRef[]>([]);

    // Load reference data
    useEffect(() => {
        const loadReferenceData = async () => {
            try {
                // Load entreprises for dropdown selection
                const loadedEntreprises = await entrepriseService.getAllEntreprises();
                if (loadedEntreprises) {
                    setEntreprises(loadedEntreprises.map(ent => ({
                        id: ent.id as number,
                        nom: ent.nom
                    })));
                }

                // Load pdps for dropdown selection
                const loadedPdps = await pdpService.getAllPDPs();
                if (loadedPdps) {
                    setPdps(loadedPdps.map(pdp => ({
                        id: pdp.id as number,
                        // Using ID as display since PDPs don't have a clear display field
                        label: `Plan #${pdp.id}`
                    })));
                }

                // Load chantiers for dropdown selection
                const loadedChantiers = await chantierService.getAllChantiers();
                if (loadedChantiers) {
                    setChantiers(loadedChantiers.map(chantier => ({
                        id: chantier.id as number,
                        nom: chantier.nom
                    })));
                }
            } catch (error) {
                console.error("Error loading reference data:", error);
            }
        };

        loadReferenceData();
    }, []);

    // Define the entity configuration for WorkerDTO
    const workerConfig: EntityConfig = {
        entityType: 'worker',
        displayName: 'WorkerDTO',
        pluralName: 'Workers',
        keyField: 'id',
        displayField: 'nom',
        searchFields: ['nom', 'prenom'],
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
                label: 'Last Name',
                required: true,
                order: 1,
                section: 'Personal Information',
            },
            {
                key: 'prenom',
                type: FieldType.Text,
                label: 'First Name',
                required: true,
                order: 2,
                section: 'Personal Information',
            },
            {
                key: 'entreprise',
                type: FieldType.EntityRef,
                label: 'Companies',
                order: 3,
                section: 'Affiliations',
                entityType: 'entreprise',
                helperText: 'Companies the worker is affiliated with',
                reference:{
                   fieldName: 'nom',
                     keyField: 'id',
                }
            },
            {
                key: 'pdp',
                type: FieldType.ArrayOfEntityRefs,
                label: 'Prevention Plans',
                order: 4,
                section: 'Affiliations',
                entityType: 'pdp',
                helperText: 'Prevention plans the worker is involved with',
            },
            {
                key: 'chantier',
                type: FieldType.ArrayOfEntityRefs,
                label: 'Sites',
                order: 5,
                section: 'Affiliations',
                entityType: 'chantier',
                helperText: 'Sites the worker is assigned to',
            },
            // Note: signatures is a complex field that might need special handling
            {
                key: 'signatures',
                type: FieldType.Object,
                label: 'Signatures',
                order: 6,
                section: 'Documentation',
                hidden: true, // Initially hide this complex field
            },
        ],
    };

    // Custom actions for filtering workers
    const customActions = [
        {
            name: 'filterByCompany',
            label: 'Filter by Company',
            action: async (selected: WorkerDTO[]) => {
                // This would need a custom implementation - placeholder for now
                console.log('Filter workers by company');
            },
            multiple: false,
        },
        {
            name: 'filterByPdp',
            label: 'Filter by Prevention Plan',
            action: async (selected: WorkerDTO[]) => {
                console.log('Filter workers by PDP');
            },
            multiple: false,
        },
        {
            name: 'filterBySite',
            label: 'Filter by Site',
            action: async (selected: WorkerDTO[]) => {
                console.log('Filter workers by site');
            },
            multiple: false,
        },
    ];

    // Create CRUD operations adapter from the worker service
    const crudOperations: CrudOperations<WorkerDTO> = {
        getAll: async () => {
            const workers = await workerService.getAllWorkers();
            return workers || [];
        },
        getById: async (id: number) => {
            const worker = await workerService.getWorker(id);
            return worker;
        },
        create: async (entity: WorkerDTO) => {
            const newWorker = await workerService.createWorker(entity);
            return newWorker;
        },
        update: async (id: number, entity: WorkerDTO) => {
            const updatedWorker = await workerService.updateWorker(entity, id);
            return updatedWorker;
        },
        delete: async (id: number) => {
            await workerService.deleteWorker(id);
        },
        // Function to get reference entities for dropdowns
        getReferences: async (entityType: string, query?: string) => {
            console.log(`Fetching references for: ${entityType}, query: ${query}`);

            // Return appropriate reference data based on entity type
            switch (entityType.toLowerCase()) {
                case 'entreprise':
                    return entreprises;
                case 'pdp':
                    return pdps;
                case 'chantier':
                    return chantiers;
                default:
                    return [];
            }
        }
    };

    return (
        <ManagerCRUD
            config={workerConfig}
            crudOperations={crudOperations}
            actions={{
                create: true,
                edit: true,
                delete: true,
                view: true,
                export: true,
                import: true,
                custom: customActions,
            }}
        />
    );
};

export default WorkerManager;