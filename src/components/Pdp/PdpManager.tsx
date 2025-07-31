import React, { useEffect, useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ManagerCRUD from "../../components/GenericCRUD/ManagerCRUD";
import { EntityConfig, FieldType, CrudOperations } from "../../components/GenericCRUD/TypeConfig";
import usePdp from "../../hooks/usePdp";
import useEntreprise from "../../hooks/useEntreprise";
import useRisque from "../../hooks/useRisque";
import useDispositif from "../../hooks/useDispositif";
import usePermit from "../../hooks/usePermit";
import { EntityRef } from "../../utils/EntityRef";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects";
import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO.ts';

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

// PdpManager component using the generic CRUD system
const PdpManager = () => {
    // Get hooks for Pdp and related entities CRUD operations
    const pdpService = usePdp();
    const entrepriseService = useEntreprise();
    const risqueService = useRisque();
    const dispositifService = useDispositif();
    const permitService = usePermit();

    // State for reference data

    const [risques, setRisques] = useState<EntityRef[]>([]);
    const [dispositifs, setDispositifs] = useState<EntityRef[]>([]);
    const [permits, setPermits] = useState<EntityRef[]>([]);

    // Load reference data
    useEffect(() => {
        const loadReferenceData = async () => {
            try {
                // Load entreprises for dropdown selection
                const loadedEntreprises = await entrepriseService.getAllEntreprises();
                if (loadedEntreprises) {
                    /*setEntreprises(loadedEntreprises.map(ent => ({
                        id: ent.id as number,
                        nom: ent.nom,
                        type: ent.type
                    })));*/
                }

                // Load risques for dropdown selection
                const loadedRisques = await risqueService.getAllRisques();
                if (loadedRisques) {
                    setRisques(loadedRisques.map(risque => ({
                        id: risque.id as number,
                        title: risque.title
                    })));
                }

                // Load dispositifs for dropdown selection
                const loadedDispositifs = await dispositifService.getAllDispositifs();
                if (loadedDispositifs) {
                    setDispositifs(loadedDispositifs.map(disp => ({
                        id: disp.id as number,
                        titre: disp.title
                    })));
                }

                // Load permits for dropdown selection
                const loadedPermits = await permitService.getAllPermits();
                if (loadedPermits) {
                    setPermits(loadedPermits.map(permit => ({
                        id: permit.id as number,
                        titre: permit.title
                    })));
                }
            } catch (error) {
                console.error("Error loading reference data:", error);
            }
        };

        loadReferenceData();
    }, []);

    // Define the entity configuration for Pdp
    const pdpConfig: EntityConfig = {
        entityType: 'pdp',
        displayName: 'Prevention Plan',
        pluralName: 'Prevention Plans',
        keyField: 'id',
        displayField: 'id', // Since PDPs don't have an obvious display field, using ID
        searchFields: ['horairesDetails', 'id'],
        defaultSortField: 'id',
        fields: [
            {
                key: 'id',
                type: FieldType.Number,
                label: 'ID',
                hidden: false, // For PDPs, the ID is important to show
                order: 1,
                section: 'Basic Information',
            },
            {
                key: 'chantier',
                type: FieldType.Number,
                label: 'Site ID',
                required: true,
                order: 2,
                section: 'Basic Information',
                helperText: 'ID of the site this prevention plan is associated with',
            },
            {
                key: 'entrepriseExterieure',
                type: FieldType.EntityRef,
                label: 'External Company',
                required: true,
                order: 3,
                section: 'Basic Information',
                entityType: 'entreprise',
                reference:{fieldName: 'nom', keyField: 'id'}
            },
            {
                key: 'dateInspection',
                type: FieldType.Date,
                label: 'Inspection Date',
                order: 4,
                section: 'Dates',
            },
            {
                key: 'icpdate',
                type: FieldType.Date,
                label: 'ICP Date',
                order: 5,
                section: 'Dates',
            },
            {
                key: 'datePrevenirCSSCT',
                type: FieldType.Date,
                label: 'CSSCT Notification Date',
                order: 6,
                section: 'Dates',
                helperText: 'Date when the CSSCT was notified',
            },
            {
                key: 'datePrev',
                type: FieldType.Date,
                label: 'Planned Date',
                order: 7,
                section: 'Dates',
            },
            {
                key: 'horairesDetails',
                type: FieldType.Text,
                label: 'Working Hours Details',
                multiline: true,
                rows: 3,
                order: 8,
                section: 'Work Details',
                fullWidth: true,
            },
            {
                key: 'entrepriseDInspection',
                type: FieldType.EntityRef,
                label: 'Inspection Company',
                order: 9,
                section: 'Work Details',
                entityType: 'entreprise',
                reference:{fieldName: 'nom', keyField: 'id'}
            },
            {
                key: 'horaireDeTravail',
                type: FieldType.Object,
                label: 'Working Hours',
                order: 10,
                section: 'Work Details',
                fullWidth: true,
            },
            {
                key: 'misesEnDisposition',
                type: FieldType.Object,
                label: 'Provisions',
                order: 11,
                section: 'Work Details',
                fullWidth: true,
            },
            // Note: Complex relationships like risques, dispositifs, permits, and analyseDeRisques
            // will be handled through custom actions rather than directly in the form
        ],
    };

    // Custom actions for managing relationships
    const customActions = [
        {
            name: 'linkRisque',
            label: 'Add Risk',
            action: async (selected: PdpDTO[]) => {
                // This would need to be implemented with a custom dialog
                // For now, it's a placeholder
                console.log('Link risque to PDP:', selected);
            },
            multiple: false,
        },
        {
            name: 'linkDispositif',
            label: 'Add Device',
            action: async (selected: PdpDTO[]) => {
                console.log('Link dispositif to PDP:', selected);
            },
            multiple: false,
        },
        {
            name: 'linkPermit',
            label: 'Add Permit',
            action: async (selected: PdpDTO[]) => {
                console.log('Link permit to PDP:', selected);
            },
            multiple: false,
        },
        {
            name: 'linkAnalyse',
            label: 'Add Risk Analysis',
            action: async (selected: PdpDTO[]) => {
                console.log('Link analyse to PDP:', selected);
            },
            multiple: false,
        },
    ];

    // Create CRUD operations adapter from the pdps service
    const crudOperations: CrudOperations<PdpDTO> = {
        getAll: async () => {
            const pdps = await pdpService.getAllPDPs();
            return pdps || [];
        },
        getById: async (id: number) => {
            const pdp = await pdpService.getPlanDePrevention(id);
            return pdp;
        },
        create: async (entity: PdpDTO) => {
            const newPdp = await pdpService.createPdp(entity);
            return newPdp;
        },
        update: async (id: number, entity: PdpDTO) => {
            const updatedPdp = await pdpService.savePdp(entity, id);
            return updatedPdp;
        },
        delete: async (id: number) => {
            await pdpService.deletePdp(id);
        },
        // Function to get reference entities for dropdowns
        getReferences: async (entityType: string, query?: string) => {
            console.log(`Fetching references for: ${entityType}, query: ${query}`);

            // Return appropriate reference data based on entity type
            switch (entityType.toLowerCase()) {
                case 'entreprise':
                    return Array.from(entrepriseService?.entreprises.values());
                case 'risque':
                    return risques;
                case 'dispositif':
                    return dispositifs;
                case 'permit':
                    return permits;
                default:
                    return [];
            }
        }
    };

    return (
        <ManagerCRUD
            config={pdpConfig}
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

export default PdpManager;