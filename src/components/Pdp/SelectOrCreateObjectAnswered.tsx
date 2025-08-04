
import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
    CircularProgress,
    Alert
} from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import GenericCreateForm, { FormConfig } from '../common/GenericCreateForm';
import ObjectAnsweredObjects from '../../utils/ObjectAnsweredObjects';
import { risqueConfig } from '../config/risqueConfig';
import { dispositifConfig } from '../config/dispositifConfig';
import { auditConfig } from '../config/auditConfig';
import { permitConfig } from '../config/permitConfig';
import useRisque from '../../hooks/useRisque';
import useDispositif from '../../hooks/useDispositif';
import useAuditSecu from '../../hooks/useAuditSecu';
import usePermit from '../../hooks/usePermit';
import { ContentItem, ParentOfRelations } from '../Interfaces';

interface SelectOrCreateObjectAnsweredProps<ITEM extends ContentItem, PARENT extends ParentOfRelations> {
    open: boolean;
    setOpen: (open: boolean) => void;
    parent: PARENT;
    saveParent: (parent: PARENT) => void;
    setIsChanged: (isChanged: boolean) => void;
    objectType: ObjectAnsweredObjects;
    addRelation: (objectType: ObjectAnsweredObjects, selectedItem: any) => void;
    renderAsContent?: boolean; // New prop to render content only (no dialog wrapper)
}

const SelectOrCreateObjectAnswered = <ITEM extends ContentItem, PARENT extends ParentOfRelations>({
    open,
    setOpen,
    parent,
    saveParent,
    setIsChanged,
    objectType,
    addRelation,
    renderAsContent = false, // Default to false for backward compatibility
}: SelectOrCreateObjectAnsweredProps<ITEM, PARENT>) => {
    const [tab, setTab] = useState(0);
    const [items, setItems] = useState<ITEM[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getAllRisques, createRisque } = useRisque();
    const { getAllDispositifs, createDispositif } = useDispositif();
    const { getAllAuditSecus, createAuditSecu } = useAuditSecu();
    const { getAllPermits, createPermit } = usePermit();

    const getConfig = (): FormConfig => {
        switch (objectType) {
            case ObjectAnsweredObjects.RISQUE:
                return risqueConfig;
            case ObjectAnsweredObjects.DISPOSITIF:
                return dispositifConfig;
            case ObjectAnsweredObjects.AUDIT:
                return auditConfig;
            case ObjectAnsweredObjects.PERMIT:
                return permitConfig;
            default:
                throw new Error(`Unsupported object type: ${objectType}`);
        }
    };

    const loadItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let response: any[];
            // Call the appropriate fetch function directly based on objectType
            switch (objectType) {
                case ObjectAnsweredObjects.RISQUE:
                    response = await getAllRisques();
                    break;
                case ObjectAnsweredObjects.DISPOSITIF:
                    response = await getAllDispositifs();
                    break;
                case ObjectAnsweredObjects.AUDIT:
                    response = await getAllAuditSecus();
                    break;
                case ObjectAnsweredObjects.PERMIT:
                    response = await getAllPermits();
                    break;
                default:
                    throw new Error(`Unsupported object type: ${objectType}`);
            }
            setItems(response as ITEM[]);
        } catch (e) {
            setError("Failed to load items.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [objectType, getAllRisques, getAllDispositifs, getAllAuditSecus, getAllPermits]);

    React.useEffect(() => {
        if (open) {
            // Reset tab and clear any previous errors when dialog opens
            setTab(0);
            setError(null);
            setItems([]);
        }
    }, [open]);

    // Separate useEffect for loading items when tab changes to 0
    React.useEffect(() => {
        if (open && tab === 0) {
            loadItems();
        }
    }, [open, tab]);

    const handleSave = async (formData: Record<string, any>) => {
        try {
            // Add default values based on object type
            let enrichedFormData = { ...formData };
            let newItem: any;
            
            if (objectType === ObjectAnsweredObjects.RISQUE) {
                // Use uploaded logo or default empty image
                enrichedFormData = {
                    ...enrichedFormData,
                    logo: enrichedFormData.logo || { imageData: '', mimeType: 'image/png' },
                    permitType: 'NONE' // Default permit type
                };
                newItem = await createRisque(enrichedFormData as ITEM);
            } else if (objectType === ObjectAnsweredObjects.DISPOSITIF) {
                // Use uploaded logo or default empty image
                enrichedFormData = {
                    ...enrichedFormData,
                    logo: enrichedFormData.logo || { imageData: '', mimeType: 'image/png' },
                    type: enrichedFormData.type || 'EPI' // Default type
                };
                newItem = await createDispositif(enrichedFormData as ITEM);
            } else if (objectType === ObjectAnsweredObjects.AUDIT) {
                // Use uploaded logo or default empty image
                enrichedFormData = {
                    ...enrichedFormData,
                    logo: enrichedFormData.logo || { imageData: '', mimeType: 'image/png' },
                    typeOfAudit: enrichedFormData.typeOfAudit || 'INTERVENANTS'
                };
                newItem = await createAuditSecu(enrichedFormData as ITEM);
            } else if (objectType === ObjectAnsweredObjects.PERMIT) {
                // Use uploaded logo or default empty image
                enrichedFormData = {
                    ...enrichedFormData,
                    logo: enrichedFormData.logo || { imageData: '', mimeType: 'image/png' },
                    type: enrichedFormData.type || 'NONE'
                };
                newItem = await createPermit(enrichedFormData as ITEM);
            } else {
                throw new Error(`Unsupported object type: ${objectType}`);
            }
            
            // The hooks return data directly, not wrapped in a response object
            addRelation(objectType, newItem);
            setOpen(false);
        } catch (error) {
            console.error('Error creating item:', error);
            setError('Failed to create item.');
        }
    };

    const alreadySelected = (item: ITEM): boolean => {
        return parent.relations?.some(rel => rel.objectId === item.id && rel.objectType === objectType) ?? false;
    };

    // Content that will be shared between dialog and content-only modes
    const dialogContent = (
        <>
            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
                <Tab icon={<ListIcon />} label="Sélectionner existant" />
                <Tab icon={<AddIcon />} label="Créer nouveau" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
                {tab === 0 && (
                    <Box>
                        {loading && (
                            <Box display="flex" justifyContent="center" p={2}>
                                <CircularProgress />
                            </Box>
                        )}
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        {!loading && !error && items.length === 0 && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Aucun élément trouvé. Vous pouvez créer un nouveau {objectType.toLowerCase()}.
                            </Alert>
                        )}
                        {!loading && !error && items.length > 0 && (
                            <List dense>
                                {items.map(item => (
                                    <ListItem
                                        key={item.id}
                                        onClick={() => !alreadySelected(item) && addRelation(objectType, item)}
                                        sx={{ 
                                            opacity: alreadySelected(item) ? 0.5 : 1,
                                            cursor: alreadySelected(item) ? 'not-allowed' : 'pointer',
                                            '&:hover': {
                                                backgroundColor: !alreadySelected(item) ? 'action.hover' : 'transparent'
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox edge="start" checked={alreadySelected(item)} tabIndex={-1} disableRipple />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={(item as any).title || (item as any).nom || (item as any).question || 'Untitled'} 
                                            secondary={(item as any).description || 'No description'} 
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                )}
                {tab === 1 && (
                    <Box>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <GenericCreateForm
                            config={getConfig()}
                            onSave={handleSave}
                            onCancel={() => setOpen(false)}
                        />
                    </Box>
                )}
            </Box>
        </>
    );

    // If renderAsContent is true, return content only (for use inside another dialog)
    if (renderAsContent) {
        return (
            <Box>
                {dialogContent}
            </Box>
        );
    }

    // Otherwise, return full dialog (for backward compatibility)
    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
            <DialogTitle>Ajouter un {objectType.toLowerCase()}</DialogTitle>
            <DialogContent>
                {dialogContent}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Annuler</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectOrCreateObjectAnswered;
