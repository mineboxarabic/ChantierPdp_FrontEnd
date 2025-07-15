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
    Divider,
    ToggleButtonGroup,
    ToggleButton,
    FormLabel,
    IconButton
} from '@mui/material';
import { Person, CheckCircle, Pending, Draw, Delete as DeleteIcon } from '@mui/icons-material';
import SignaturePad from '../../../components/DocumentSigning/SignaturePad';
import { WorkerDTO } from '../../../utils/entitiesDTO/WorkerDTO';
import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import useWorkerSelection from '../../../hooks/useWorkerSelection';
import useDocument from '../../../hooks/useDocument';

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
    currentUserId?: number;
    onNavigateBack: () => void;
    onNavigateNext: () => void;
}

const PdpTabDocumentSigning: FC<PdpTabDocumentSigningProps> = ({
    formData,
    allWorkersMap,
    currentUserId,
    onNavigateBack,
    onNavigateNext
}) => {
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | ''>('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const [chantierWorkers, setChantierWorkers] = useState<WorkerDTO[]>([]);
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [documentSignatures, setDocumentSignatures] = useState<any[]>([]);
    const [signatureMode, setSignatureMode] = useState<'worker' | 'donneurDOrdre'>('worker');

    const { getWorkersForChantier } = useWorkerSelection();
    const { 
        isLoading: isDocumentLoading, 
        error: documentError, 
        signDocumentByWorker,
        signDocumentByUser,
        unsignDocumentByUser,
        getSignaturesByDocumentId 
    } = useDocument();

    // Load workers for the specific chantier when component mounts or chantierId changes
    useEffect(() => {
        const loadChantierWorkers = async () => {
            if (!formData.chantier) {
                console.warn('No chantier ID found in PDP data');
                return;
            }

            setLoadingWorkers(true);
            
            try {
                console.log('Loading workers for chantier:', formData.chantier);
                const workers = await getWorkersForChantier(formData.chantier);
                console.log('Workers loaded successfully:', workers);
                setChantierWorkers(workers || []); // Ensure we set an array even if workers is undefined
            } catch (error: any) {
                console.error('Failed to load chantier workers:', error);
            } finally {
                setLoadingWorkers(false);
            }
        };

        loadChantierWorkers();
    }, []);

    // Load existing signatures for the document
    useEffect(() => {
        const loadDocumentSignatures = async () => {
            if (!formData.id) return;
            
            try {
                const response = await getSignaturesByDocumentId(formData.id);
                if (response.data) {
                    setDocumentSignatures(response.data);
                }
            } catch (error) {
                console.error('Failed to load document signatures:', error);
            }
        };

        loadDocumentSignatures();
    }, [formData.id]);

    // Get list of workers that need to sign (only workers assigned to this chantier)
    const getWorkersNeedingSigning = (): WorkerDTO[] => {
        return chantierWorkers;
    };

    // Get signed workers from document signatures
    const getSignedWorkers = (): number[] => {
        return documentSignatures
            .filter((sig: any) => sig.workerId) // Only worker signatures
            .map((sig: any) => sig.workerId) as number[];
    };

    // Check if donneurDOrdre has signed
    const isDonneurDOrdreSigned = (): boolean => {
        return documentSignatures.some((sig: any) => sig.userId && !sig.workerId);
    };

    // Get donneurDOrdre signature ID for unsigning
    const getDonneurDOrdreSignatureId = (): number | null => {
        const signature = documentSignatures.find((sig: any) => sig.userId && !sig.workerId);
        return signature?.id || null;
    };

    const handleWorkerSelection = useCallback((workerId: number) => {
        setSelectedWorkerId(workerId);
        setSuccess(null);
        
        // Find worker in chantier workers first, fallback to allWorkersMap if needed
        const worker = chantierWorkers.find(w => w.id === workerId) || allWorkersMap.get(workerId);
        if (worker) {
            setName(worker.prenom || '');
            setLastName(worker.nom || '');
        }
    }, [chantierWorkers, allWorkersMap]);

    const handleSignatureSave = useCallback(async (signatureData: string) => {
        // For worker mode, require selectedWorkerId
        // For donneurDOrdre mode, no selectedWorkerId needed
        if (signatureMode === 'worker' && !selectedWorkerId) {
            console.error('Missing selectedWorkerId for worker signature');
            return;
        }
        
        if (!formData.id || !currentUserId) {
            console.error('Missing required data:', {
                documentId: formData.id,
                currentUserId,
                name,
                lastName
            });
            return;
        }

        // Validate signature data format (should be pure base64 now)
        if (!signatureData || signatureData.length < 100) {
            console.error('Invalid signature data - too short or empty:', signatureData?.substring(0, 50));
            return;
        }

        setSuccess(null);

        // Create the signature request object - ensure proper types for Java backend
        const signatureRequest = {
            workerId: signatureMode === 'worker' ? Number(selectedWorkerId) : Number(currentUserId),
            documentId: Number(formData.id),
            userId: Number(currentUserId),
            name: (name || '').trim(),
            lastName: (lastName || '').trim(),
            signatureImage: signatureData
        };

        // Validate all required fields are present and valid
        if (!signatureRequest.documentId || !signatureRequest.userId) {
            console.error('Invalid data types or missing values:', signatureRequest);
            return;
        }

        console.log('Submitting signature request:', {
            ...signatureRequest,
            signatureImage: `[Base64 image data - ${signatureRequest.signatureImage.length} characters]` // Show length instead of truncated data
        });

        try {
            if (signatureMode === 'worker') {
                await signDocumentByWorker(signatureRequest);
            } else {
                await signDocumentByUser(signatureRequest);
            }

            setSuccess('Signature enregistrée avec succès');
            
            // Reset form
            setSelectedWorkerId('');
            setName('');
            setLastName('');
            
            // Reload signatures
            const response = await getSignaturesByDocumentId(formData.id);
            if (response.data) {
                setDocumentSignatures(response.data);
            }
            
        } catch (err: any) {
            console.error('Error signing document:', err);
        }
    }, [selectedWorkerId, formData.id, currentUserId, name, lastName, signatureMode, signDocumentByWorker, signDocumentByUser, getSignaturesByDocumentId]);

    // Handle unsigning documents
    const handleUnsignDocument = useCallback(async (signatureId: number, isUserSignature: boolean = false) => {
        if (!currentUserId) return;

        setSuccess(null);

        try {
            await unsignDocumentByUser(currentUserId, signatureId);
            setSuccess('Signature supprimée avec succès');
            
            // Reload signatures
            const response = await getSignaturesByDocumentId(formData.id!);
            if (response.data) {
                setDocumentSignatures(response.data);
            }
            
        } catch (err: any) {
            console.error('Error unsigning document:', err);
        }
    }, [currentUserId, unsignDocumentByUser, getSignaturesByDocumentId, formData.id]);

    const workersNeedingSigning = getWorkersNeedingSigning();
  //  const signedWorkerIds = documentSignatures;

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

                {/* Signature Mode Toggle */}
                <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
                    <CardContent>
                        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>Mode de signature</FormLabel>
                        <ToggleButtonGroup
                            value={signatureMode}
                            exclusive
                            onChange={(event, newMode) => {
                                if (newMode !== null) {
                                    setSignatureMode(newMode);
                                    // Reset form when switching modes
                                    setSelectedWorkerId('');
                                    setName('');
                                    setLastName('');
                                }
                            }}
                            sx={{ mb: 2 }}
                        >
                            <ToggleButton value="worker">Signature Travailleur</ToggleButton>
                            <ToggleButton value="donneurDOrdre">Signature Donneur d'Ordre</ToggleButton>
                        </ToggleButtonGroup>
                    </CardContent>
                </Card>

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
                                    const isSigned = documentSignatures.includes(worker.id as number);
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

                {/* Signature Form - Worker Mode */}
                {signatureMode === 'worker' && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Signature Travailleur
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
                                        .filter(worker => !documentSignatures.includes(worker.id as number))
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
                                    disabled={isDocumentLoading}
                                />
                                <TextField
                                    label="Nom"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    fullWidth
                                    disabled={isDocumentLoading}
                                />
                            </Box>

                            {/* Signature Pad */}
                            <SignaturePad
                                onSignatureSave={handleSignatureSave}
                                disabled={!selectedWorkerId || !name || !lastName || isDocumentLoading}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Signature Form - Donneur d'Ordre Mode */}
                {signatureMode === 'donneurDOrdre' && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Signature Donneur d'Ordre
                            </Typography>
                            
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Mode signature donneur d'ordre - Vous signerez en tant qu'utilisateur connecté.
                            </Alert>

                            {/* Name Fields */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    label="Prénom"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    disabled={isDocumentLoading}
                                />
                                <TextField
                                    label="Nom"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    fullWidth
                                    disabled={isDocumentLoading}
                                />
                            </Box>

                            {/* Signature Pad */}
                            <SignaturePad
                                onSignatureSave={handleSignatureSave}
                                disabled={!name || !lastName || isDocumentLoading}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Existing Signatures List */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Signatures Existantes
                        </Typography>
                        
                        {documentSignatures && documentSignatures.length > 0 ? (
                            <Box>
                                {documentSignatures.map((signature, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1">
                                                {signature.name} {signature.lastName}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Signé le: {new Date(signature.signedAt).toLocaleString()}
                                            </Typography>
                                            {signature.signatureImage && (
                                                <Box sx={{ mt: 1 }}>
                                                    <img 
                                                        src={`data:image/png;base64,${signature.signatureImage}`} 
                                                        alt="Signature" 
                                                        style={{ maxWidth: '200px', maxHeight: '100px', border: '1px solid #ccc' }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                        
                                        {/* Unsign Button */}
                                        {signature.id && (
                                            <IconButton
                                                color="error"
                                                onClick={() => handleUnsignDocument(signature.id!)}
                                                disabled={isDocumentLoading}
                                                title="Supprimer la signature"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography color="textSecondary">
                                Aucune signature enregistrée pour ce document.
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {/* Loading State */}
                {isDocumentLoading && (
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
                
                {documentError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {documentError}
                    </Alert>
                )}

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
