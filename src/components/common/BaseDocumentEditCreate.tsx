// src/components/common/BaseDocumentEditCreate.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { 
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNotifications } from '@toolpad/core/useNotifications';
import { DocumentDTO } from '../../utils/entitiesDTO/DocumentDTO';

// Base interfaces
export interface TabConfig {
    icon: React.ReactElement;
    label: string;
    component: React.ReactElement;
}

export interface BaseDocumentEditCreateProps<T extends DocumentDTO> {
    title: string;
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    isEditMode: boolean;
    isLoading: boolean;
    isSaving: boolean;
    saveError: string | null;
    setSaveError: React.Dispatch<React.SetStateAction<string | null>>;
    tabs: TabConfig[];
    onSave: () => Promise<void>;
    onValidate: (currentData: T, allowTolerantSave?: boolean) => { 
        isValid: boolean; 
        hasWarnings: boolean; 
        firstErrorTabIndex: number 
    };
    backRoute?: string;
}

// Navigation component for tabs
interface DocumentTabNavigationProps {
    tabIndex: number;
    isLastTab: boolean;
    isSaving: boolean;
    isLoading: boolean;
    onBack: () => void;
    onNext: () => void;
    onSave: () => void;
    showSaveButton?: boolean;
}

const DocumentTabNavigation: React.FC<DocumentTabNavigationProps> = ({ 
    tabIndex, 
    isLastTab, 
    isSaving, 
    isLoading, 
    onBack, 
    onNext, 
    onSave,
    showSaveButton = true
}) => (
    <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 3, 
        pt: 2, 
        borderTop: '1px solid',
        borderColor: 'divider'
    }}>
        <Button 
            variant="outlined" 
            onClick={onBack} 
            disabled={tabIndex === 0}
        >
            Précédent
        </Button>
        
        {showSaveButton && (
            <Button
                variant="contained"
                color="primary"
                onClick={onSave}
                startIcon={<SaveIcon />}
                disabled={isSaving || isLoading}
            >
                {isSaving ? <CircularProgress size={24} color="inherit" /> : "Sauvegarder"}
            </Button>
        )}
        
        {!isLastTab && (
            <Button 
                variant="outlined" 
                onClick={onNext}
            >
                Suivant
            </Button>
        )}
    </Box>
);

// TabPanel component
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`document-tabpanel-${index}`}
            aria-labelledby={`document-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 2, pb: 2 }} key={`tabpanel-${index}`}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `document-tab-${index}`,
        'aria-controls': `document-tabpanel-${index}`,
    };
}

// Main BaseDocumentEditCreate component
function BaseDocumentEditCreate<T extends DocumentDTO>({
    title,
    formData,
    errors,
    isEditMode,
    isLoading,
    isSaving,
    saveError,
    setSaveError,
    tabs,
    onSave,
    onValidate,
    backRoute
}: BaseDocumentEditCreateProps<T>) {
    const navigate = useNavigate();
    const notifications = useNotifications();
    const [tabIndex, setTabIndex] = useState<number>(0);

    // Tab navigation
    const handleTabChange = useCallback((_event: React.SyntheticEvent, newIndex: number) => {
        setTabIndex(newIndex);
    }, []);

    // Navigation functions
    const handleNavigateNext = useCallback(() => {
        const validation = onValidate(formData, false);
        if ((validation.isValid || validation.hasWarnings) && tabIndex < tabs.length - 1) {
            setTabIndex(tabIndex + 1);
        }
    }, [formData, onValidate, tabIndex, tabs.length]);

    const handleNavigateBack = useCallback(() => {
        if (tabIndex > 0) {
            setTabIndex(tabIndex - 1);
        }
    }, [tabIndex]);

    const handleSave = useCallback(async () => {
        const validation = onValidate(formData, true);
        if (validation.isValid) {
            await onSave();
        }
    }, [formData, onValidate, onSave]);

    const handleBack = useCallback(() => {
        if (backRoute) {
            navigate(backRoute);
        } else {
            navigate(-1);
        }
    }, [navigate, backRoute]);

    // Loading indicator
    if (isLoading && !formData.id) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">
                        {title}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Retour
                    </Button>
                </Box>

                {saveError && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError(null)}>
                        {saveError}
                    </Alert>
                )}

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs 
                        value={tabIndex} 
                        onChange={handleTabChange} 
                        aria-label="document form tabs" 
                        variant="scrollable" 
                        scrollButtons="auto"
                    >
                        {tabs.map((tab, index) => (
                            <Tab 
                                key={index}
                                icon={tab.icon} 
                                iconPosition="start" 
                                label={tab.label} 
                                {...a11yProps(index)} 
                            />
                        ))}
                    </Tabs>
                </Box>

                {tabs.map((tab, index) => (
                    <TabPanel key={index} value={tabIndex} index={index}>
                        {React.cloneElement(tab.component, {
                            // Pass common props to tab components
                            formData,
                            errors
                        })}
                        <DocumentTabNavigation
                            tabIndex={tabIndex}
                            isLastTab={tabIndex === tabs.length - 1}
                            isSaving={isSaving}
                            isLoading={isLoading}
                            onBack={handleNavigateBack}
                            onNext={handleNavigateNext}
                            onSave={handleSave}
                        />
                    </TabPanel>
                ))}
            </Paper>
        </Box>
    );
}

export default BaseDocumentEditCreate;
