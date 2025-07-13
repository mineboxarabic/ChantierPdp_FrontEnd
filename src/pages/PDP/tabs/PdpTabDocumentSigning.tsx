import React, { FC, useState, useCallback, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Divider
} from '@mui/material';
import { Person, CheckCircle, Pending, Draw } from '@mui/icons-material';
import SignaturePad from '../../../components/DocumentSigning/SignaturePad';
import { WorkerDTO } from '../../../utils/entitiesDTO/WorkerDTO';
import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import useWorkerSelection from '../../../hooks/useWorkerSelection';

interface SignatureData {
    workerId: number;
    userId: number;
    name: string;
    lastName: string;
    signatureImage: string;
    signedAt: Date;
}

interface PdpTabDocumentSigningProps {
    formData: PdpDTO;
    allWorkersMap: Map<number, WorkerDTO>; // Keep for backward compatibility, but we'll use chantier-specific workers
    onSignDocument: (signatureData: {
        workerId: number;
        documentId: number;
        userId: number;
        name: string;
        lastName: string;
        signatureImage: string;
    }) => Promise<void>;
    currentUserId?: number;
    onNavigateBack: () => void;
    onNavigateNext: () => void;
}

const PdpTabDocumentSigning: FC<PdpTabDocumentSigningProps> = ({
    formData,
    allWorkersMap,
    onSignDocument,
    currentUserId,
    onNavigateBack,
    onNavigateNext
}) => {
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | ''>('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [chantierWorkers, setChantierWorkers] = useState<WorkerDTO[]>([]);
    const [loadingWorkers, setLoadingWorkers] = useState(false);

    const { getWorkersForChantier } = useWorkerSelection();

    // Load workers for the specific chantier when component mounts or chantierId changes
    useEffect(() => {
        const loadChantierWorkers = async () => {
            if (!formData.chantier) {
                console.warn('No chantier ID found in PDP data');
                return;
            }

            setLoadingWorkers(true);
            setError(null); // Clear any previous errors
            
            try {
                console.log('Loading workers for chantier:', formData.chantier);
                const workers = await getWorkersForChantier(formData.chantier);
                console.log('Workers loaded successfully:', workers);
                setChantierWorkers(workers || []); // Ensure we set an array even if workers is undefined
            } catch (error: any) {
                console.error('Failed to load chantier workers:', error);
                
                // Check if it's a JSON parsing error
                if (error.message && error.message.includes('Unexpected end of JSON input')) {
                    setError('Erreur de communication avec le serveur. Veuillez vérifier que le serveur est en cours d\'exécution.');
                } else if (error.message && error.message.includes('Network Error')) {
                    setError('Erreur de réseau. Veuillez vérifier votre connexion internet.');
                } else if (error.message && error.message.includes('404')) {
                    setError('Chantier non trouvé ou aucun travailleur assigné.');
                } else {
                    setError(error.message || 'Erreur lors du chargement des travailleurs du chantier');
                }
            } finally {
                setLoadingWorkers(false);
            }
        };

        loadChantierWorkers();
    }, []);

    // Get list of workers that need to sign (only workers assigned to this chantier)
    const getWorkersNeedingSigning = (): WorkerDTO[] => {
        return chantierWorkers;
    };

    // Get signed workers from document signatures
    const getSignedWorkers = (): number[] => {
        if (!formData.signatures) return [];
        return formData.signatures.map((sig: any) => sig.workerId).filter(Boolean) as number[];
    };

    const handleWorkerSelection = useCallback((workerId: number) => {
        setSelectedWorkerId(workerId);
        setError(null);
        setSuccess(null);
        
        // Find worker in chantier workers first, fallback to allWorkersMap if needed
        const worker = chantierWorkers.find(w => w.id === workerId) || allWorkersMap.get(workerId);
        if (worker) {
            setName(worker.prenom || '');
            setLastName(worker.nom || '');
        }
    }, [chantierWorkers, allWorkersMap]);

    const handleSignatureSave = useCallback(async (signatureData: string) => {
        if (!selectedWorkerId || !formData.id || !currentUserId) {
            setError('Informations manquantes pour la signature');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await onSignDocument({
                workerId: selectedWorkerId as number,
                documentId: formData.id,
                userId: currentUserId,
                name,
                lastName,
                signatureImage: signatureData
            });

            setSuccess('Signature enregistrée avec succès');
            
            // Reset form
            setSelectedWorkerId('');
            setName('');
            setLastName('');
            
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'enregistrement de la signature');
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedWorkerId, formData.id, currentUserId, name, lastName, onSignDocument]);

    const workersNeedingSigning = getWorkersNeedingSigning();
    const signedWorkerIds = getSignedWorkers();

    return (
        <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
            <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2.5 }, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Draw color="primary" />
                    Signature des Documents
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                    Sélectionnez un travailleur assigné au chantier et apposez votre signature pour valider le plan de prévention.
                </Typography>

                {/* Loading indicator for workers */}
                {loadingWorkers && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            Chargement des travailleurs du chantier...
                        </Box>
                    </Alert>
                )}

                {/* Error loading workers */}
                {!loadingWorkers && chantierWorkers.length === 0 && formData.chantier && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Aucun travailleur assigné à ce chantier. Veuillez d'abord assigner des travailleurs au chantier.
                    </Alert>
                )}

                {/* Signatures Status */}
                <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            État des Signatures - Chantier {formData.chantier}
                        </Typography>
                        
                        {!loadingWorkers && workersNeedingSigning.length > 0 ? (
                            <List>
                                {workersNeedingSigning.map((worker) => {
                                    const isSigned = signedWorkerIds.includes(worker.id as number);
                                    return (
                                        <React.Fragment key={worker.id}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: isSigned ? 'success.main' : 'grey.400' }}>
                                                        {isSigned ? <CheckCircle /> : <Pending />}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`${worker.prenom || ''} ${worker.nom || ''}`}
                                                    secondary={`ID: ${worker.id}`}
                                                />
                                                <Chip
                                                    label={isSigned ? 'Signé' : 'En attente'}
                                                    color={isSigned ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        ) : (
                            <Alert severity="info">
                                {loadingWorkers 
                                    ? "Chargement des travailleurs..."
                                    : "Aucun travailleur assigné à ce chantier."
                                }
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Signature Form */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Nouvelle Signature
                        </Typography>

                        {/* Worker Selection */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Sélectionner un travailleur du chantier</InputLabel>
                            <Select
                                value={selectedWorkerId}
                                onChange={(e) => handleWorkerSelection(e.target.value as number)}
                                label="Sélectionner un travailleur du chantier"
                                disabled={loadingWorkers || chantierWorkers.length === 0}
                            >
                                {workersNeedingSigning
                                    .filter(worker => !signedWorkerIds.includes(worker.id as number))
                                    .map((worker) => (
                                        <MenuItem key={worker.id} value={worker.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Person fontSize="small" />
                                                {`${worker.prenom || ''} ${worker.nom || ''}`}
                                                <Typography variant="caption" color="text.secondary">
                                                    - ID: {worker.id}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        {/* Name Fields */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                label="Prénom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                disabled={isSubmitting}
                            />
                            <TextField
                                label="Nom"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                                disabled={isSubmitting}
                            />
                        </Box>

                        {/* Signature Pad */}
                        <SignaturePad
                            onSignatureSave={handleSignatureSave}
                            disabled={!selectedWorkerId || isSubmitting}
                        />

                        {/* Loading State */}
                        {isSubmitting && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2">
                                    Enregistrement de la signature...
                                </Typography>
                            </Box>
                        )}

                        {/* Success/Error Messages */}
                        {success && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {success}
                            </Alert>
                        )}
                        
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
                    <Button variant="outlined" onClick={onNavigateBack}>
                        Précédent
                    </Button>
                    <Button variant="contained" onClick={onNavigateNext}>
                        Suivant
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PdpTabDocumentSigning;
