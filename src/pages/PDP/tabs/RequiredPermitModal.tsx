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
    // Debug logging - Log when modal opens with permitData
    React.useEffect(() => {
        if (open && permitData) {
            console.log('=== RequiredPermitModal Debug ===');
            console.log('Modal opened at:', new Date().toISOString());
            console.log('Permit Data:', permitData);
            console.log('Permit ID:', permitData.id);
            console.log('Permit Title:', permitData.title);
            console.log('Permit Type:', permitData.type);
            console.log('PDF Data exists:', !!permitData.pdfData);
            console.log('PDF Data length:', permitData.pdfData?.length || 0);
            console.log('PDF Data first 100 chars:', permitData.pdfData?.substring(0, 100) || 'None');
            console.log('Associated Risk:', risque);
            console.log('==================================');
        }
    }, [open, permitData, risque]);

    const handleDownload = () => {
        // If custom download handler is provided, use it
        if (onDownload) {
            onDownload();
            return;
        }

        // Default download behavior - create a download from the base64 data
        if (permitData?.pdfData && permitData.pdfData.trim().length > 0) {
            try {
                const linkSource = `data:application/pdf;base64,${permitData.pdfData}`;
                const downloadLink = document.createElement('a');
                const fileName = `${permitData.title || 'Permis'}.pdf`;

                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            } catch (error) {
                console.error('Error downloading PDF:', error);
                alert('Erreur lors du téléchargement du PDF. Le fichier pourrait être corrompu.');
            }
        } else {
            alert('Aucun document PDF disponible pour ce permis.');
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
                            
                            {/* Debug information - Only show document status */}
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                État du document: {
                                    permitData.pdfData && permitData.pdfData.trim().length > 0 
                                        ? `PDF disponible (${permitData.pdfData.length} caractères)`
                                        : 'Aucun PDF disponible'
                                }
                            </Typography>
                            
                            {/* Uncomment below for detailed debugging if needed
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Permit ID: {permitData.id || 'Non défini'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Permit Type: {permitData.type || 'Non défini'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                PDF Data Preview: {
                                    permitData.pdfData ? 
                                    `${permitData.pdfData.substring(0, 50)}...` : 
                                    'Aucun'
                                }
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Modal opened at: {new Date().toLocaleTimeString()}
                            </Typography>
                            */}
                            
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FileDownloadIcon />}
                                onClick={handleDownload}
                                sx={{ mt: 1 }}
                                disabled={!permitData.pdfData || permitData.pdfData.trim().length === 0}
                            >
                                {permitData.pdfData && permitData.pdfData.trim().length > 0 
                                    ? 'Télécharger le Permis' 
                                    : 'Aucun document disponible'
                                }
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
                                                if (permit.pdfData && permit.pdfData.trim().length > 0) {
                                                    try {
                                                        const linkSource = `data:application/pdf;base64,${permit.pdfData}`;
                                                        const downloadLink = document.createElement('a');
                                                        const fileName = `${permit.title || 'Permis'}.pdf`;
                                                        downloadLink.href = linkSource;
                                                        downloadLink.download = fileName;
                                                        downloadLink.click();
                                                    } catch (error) {
                                                        console.error('Error downloading PDF:', error);
                                                        alert('Erreur lors du téléchargement du PDF.');
                                                    }
                                                } else {
                                                    alert('Aucun document PDF disponible pour ce permis.');
                                                }
                                            }}
                                            disabled={!permit.pdfData || permit.pdfData.trim().length === 0}
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
                
                {showPdfPreview && permitData?.pdfData && permitData.pdfData.trim().length > 0 && (
                    <Box sx={{ mt: 3, height: '50vh', width: '100%' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Aperçu du Document:
                        </Typography>
                        <iframe
                            key={`pdf-${permitData.id}-${Date.now()}`} // Force re-render with unique key
                            src={`data:application/pdf;base64,${permitData.pdfData}#toolbar=0&navpanes=0&scrollbar=0&zoom=100`}
                            width="100%"
                            height="100%"
                            style={{ border: '1px solid #ccc' }}
                            title={`${permitData.title || "Aperçu du Permis"} - ${permitData.id}`}
                            onError={(e) => {
                                console.error('Error loading PDF preview:', e);
                                console.error('PDF data that failed:', permitData.pdfData?.substring(0, 100));
                                // Hide the iframe if there's an error
                                (e.target as HTMLIFrameElement).style.display = 'none';
                            }}
                            onLoad={() => {
                                console.log('PDF iframe loaded successfully for permit:', permitData.id);
                            }}
                        />
                    </Box>
                )}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Fermer
                </Button>
                {permitData?.pdfData && permitData.pdfData.trim().length > 0 && (
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