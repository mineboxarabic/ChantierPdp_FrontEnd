import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WarningIcon from '@mui/icons-material/Warning';
import PermitDTO from '../../../utils/entitiesDTO/PermitDTO';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';

interface RequiredPermitModalProps {
    open: boolean;
    onClose: () => void;
    permitData?: PermitDTO | null; // Permit data including PDF
    risque?: RisqueDTO | null; // Associated risk that triggered this requirement
    onDownload?: () => void; // Additional callback for download button
    showPdfPreview?: boolean; // Option to show PDF preview in the modal
    neededPermits?: PermitDTO[]; // List of all needed permits related to the current PDP
}

/**
 * A modal component that displays permit requirements 
 * when a dangerous risk is added to a PDP
 */
const RequiredPermitModal: React.FC<RequiredPermitModalProps> = ({
    open,
    onClose,
    permitData,
    risque,
    onDownload,
    showPdfPreview = true,
    neededPermits = []
}) => {
    const handleDownload = () => {
        // If custom download handler is provided, use it
        if (onDownload) {
            onDownload();
            return;
        }

        // Default download behavior - create a download from the base64 data
        if (permitData?.pdfData) {
            const linkSource = `data:application/pdf;base64,${permitData.pdfData}`;
            const downloadLink = document.createElement('a');
            const fileName = `${permitData.title || 'Permis'}.pdf`;

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="required-permit-dialog-title"
        >
            <DialogTitle 
                id="required-permit-dialog-title"
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    bgcolor: 'warning.light', 
                    color: 'warning.contrastText'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon />
                    <Typography variant="h6">Permis de Travail Requis</Typography>
                </Box>
                <IconButton 
                    edge="end" 
                    color="inherit" 
                    onClick={onClose} 
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Message Important
                    </Typography>
                    <Typography paragraph>
                        Vous avez ajouté le risque <strong>{risque?.title || 'sélectionné'}</strong> qui est 
                        classifié comme travail dangereux. Pour continuer ce plan de 
                        prévention, vous devez télécharger et compléter le permis de travail 
                        correspondant.
                    </Typography>
                    
                    {permitData && (
                        <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Permis requis: <strong>{permitData.title}</strong>
                            </Typography>
                            
                            {permitData.description && (
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {permitData.description}
                                </Typography>
                            )}
                            
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FileDownloadIcon />}
                                onClick={handleDownload}
                                sx={{ mt: 1 }}
                                disabled={!permitData.pdfData}
                            >
                                Télécharger le Permis
                            </Button>
                        </Paper>
                    )}
                    
                    {(!permitData && neededPermits.length === 0) && (
                        <Typography color="error">
                            Aucun permis disponible pour ce type de travail dangereux.
                        </Typography>
                    )}
                </Box>
                
                {neededPermits.length > 0 && (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Liste des Permis Nécessaires pour ce PDP:
                        </Typography>
                        <List>
                            {neededPermits.map((permit) => (
                                <React.Fragment key={permit.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <WarningIcon color="warning" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={permit.title} 
                                            secondary={permit.description || 'Aucune description disponible'} 
                                        />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<FileDownloadIcon />}
                                            onClick={() => {
                                                // Create a download link for this permit
                                                if (permit.pdfData) {
                                                    const linkSource = `data:application/pdf;base64,${permit.pdfData}`;
                                                    const downloadLink = document.createElement('a');
                                                    const fileName = `${permit.title || 'Permis'}.pdf`;
                                                    downloadLink.href = linkSource;
                                                    downloadLink.download = fileName;
                                                    downloadLink.click();
                                                }
                                            }}
                                            disabled={!permit.pdfData}
                                        >
                                            Télécharger
                                        </Button>
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                )}
                
                {showPdfPreview && permitData?.pdfData && (
                    <Box sx={{ mt: 3, height: '50vh', width: '100%' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Aperçu du Document:
                        </Typography>
                        <iframe
                            src={`data:application/pdf;base64,${permitData.pdfData}`}
                            width="100%"
                            height="100%"
                            style={{ border: '1px solid #ccc' }}
                            title={permitData.title || "Aperçu du Permis"}
                        />
                    </Box>
                )}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Fermer
                </Button>
                {permitData?.pdfData && (
                    <Button 
                        onClick={handleDownload} 
                        color="primary" 
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                    >
                        Télécharger le Permis
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default RequiredPermitModal;