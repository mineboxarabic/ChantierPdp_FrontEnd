import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Divider,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton,
    ToggleButtonGroup,
    ToggleButton,
    FormLabel,
} from '@mui/material';
import { Person, CheckCircle, Pending, Delete as DeleteIcon } from '@mui/icons-material';
import { WorkerDTO } from '../../../utils/entitiesDTO/WorkerDTO';
import { UserDTO } from '../../../utils/entitiesDTO/UserDTO';
import { DocumentDTO } from '../../../utils/entitiesDTO/DocumentDTO';
import useDocument, { SignatureRequestDTO } from '../../../hooks/useDocument';
import useWorkerSelection from '../../../hooks/useWorkerSelection';
import SignaturePad from '../../DocumentSigning/SignaturePad';

interface DocumentTabSigningProps<T extends DocumentDTO> {
    readonly formData: T;
    readonly allWorkersMap: Map<number, WorkerDTO>;
    readonly currentUserId?: number;
}

function DocumentTabSigning<T extends DocumentDTO>({
    formData,
    allWorkersMap,
    currentUserId,
}: DocumentTabSigningProps<T>) {
    const [documentSignatures, setDocumentSignatures] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [signatureMode, setSignatureMode] = useState<'worker' | 'donneurDOrdre'>('worker');
    const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [isDocumentLoading, setIsDocumentLoading] = useState(false);
    const [success, setSuccess] = useState<string>('');
    const [documentError, setDocumentError] = useState<string>('');
    const [chantierWorkers, setChantierWorkers] = useState<WorkerDTO[]>([]);
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<UserDTO[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const { 
        getSignaturesByDocumentId, 
        signDocumentByWorker,
        signDocumentByUser,
        unsignDocumentByWorker,
        unsignDocumentByUser
    } = useDocument();

    const { getWorkersForChantier } = useWorkerSelection();

    // Load workers for the specific chantier when component mounts or chantierId changes
    useEffect(() => {
        const loadChantierWorkers = async () => {
            if (!formData.chantier) {
                console.warn('No chantier ID found in document data');
                return;
            }

            setLoadingWorkers(true);
            
            try {
                console.log('Loading workers for chantier:', formData.chantier);
                const workers = await getWorkersForChantier(formData.chantier);
                console.log('Workers loaded successfully:', workers);
                setChantierWorkers(workers || []);
            } catch (error: any) {
                console.error('Failed to load chantier workers:', error);
            } finally {
                setLoadingWorkers(false);
            }
        };

        loadChantierWorkers();
    }, [formData.chantier]);

    // Load available users for donneur d'ordre signatures
    useEffect(() => {
        const loadAvailableUsers = async () => {
            setLoadingUsers(true);
            
            try {
                // For now, we'll use a simplified approach
                // In the real implementation, you might want to load specific users
                const users: UserDTO[] = [];
                
                // Add current user if available
                if (currentUserId) {
                    users.push({
                        id: currentUserId,
                        username: 'Current User',
                        email: 'current@example.com'
                    } as UserDTO);
                }
                
                setAvailableUsers(users);
            } catch (error: any) {
                console.error('Failed to load available users:', error);
            } finally {
                setLoadingUsers(false);
            }
        };

        loadAvailableUsers();
    }, [currentUserId]);

    // Load existing signatures for the document
    useEffect(() => {
        const loadDocumentSignatures = async () => {
            if (!formData.id) return;
            
            setIsLoading(true);
            try {
                const response = await getSignaturesByDocumentId(formData.id);
                console.log('All signatures loaded:', response);
                setDocumentSignatures(response || []);
            } catch (error) {
                console.error('Failed to load document signatures:', error);
                setErrorMessage('Erreur lors du chargement des signatures');
            } finally {
                setIsLoading(false);
            }
        };

        loadDocumentSignatures();
    }, [formData.id]);

    // Get workers for selection (only workers assigned to this chantier)
    const workersNeedingSigning = chantierWorkers;

    // Signature handlers
    const handleSignatureSave = async (signatureData: string) => {
        if (!formData.id) {
            setDocumentError('ID du document manquant');
            return;
        }

        setIsDocumentLoading(true);
        setDocumentError('');
        setSuccess('');

        try {
            const signatureRequest: SignatureRequestDTO = {
                documentId: formData.id,
                signatureImage: signatureData,
                prenom: name,
                nom: lastName,
                workerId: signatureMode === 'worker' ? parseInt(selectedWorkerId) : null,
                userId: signatureMode === 'donneurDOrdre' ? parseInt(selectedUserId) : null,
            };

            if (signatureMode === 'worker') {
                await signDocumentByWorker(signatureRequest);
            } else {
                await signDocumentByUser(signatureRequest);
            }

            setSuccess('Signature enregistrée avec succès');
            
            // Reset form
            setName('');
            setLastName('');
            setSelectedWorkerId('');
            setSelectedUserId('');

            // Reload signatures
            if (formData.id) {
                const response = await getSignaturesByDocumentId(formData.id);
                setDocumentSignatures(response || []);
            }

        } catch (error) {
            console.error('Error saving signature:', error);
            setDocumentError('Erreur lors de l\'enregistrement de la signature');
        } finally {
            setIsDocumentLoading(false);
        }
    };

    const handleWorkerSelection = (workerId: number) => {
        setSelectedWorkerId(workerId.toString());
        const worker = chantierWorkers.find(w => w.id === workerId) || allWorkersMap.get(workerId);
        if (worker) {
            setName(worker.prenom || '');
            setLastName(worker.nom || '');
        }
    };

    const handleUserSelection = (userId: number) => {
        setSelectedUserId(userId.toString());
        const user = availableUsers.find(u => u.id === userId);
        if (user) {
            setName(user.username || '');
            setLastName('');
        }
    };

    const handleUnsignDocument = async (signature: any) => {
        try {
            if (signature.workerId) {
                await unsignDocumentByWorker(signature.workerId, signature.id);
            } else if (signature.userId) {
                await unsignDocumentByUser(signature.userId, signature.id);
            }
            
            // Reload signatures
            if (formData.id) {
                const response = await getSignaturesByDocumentId(formData.id);
                setDocumentSignatures(response || []);
            }
        } catch (error) {
            console.error('Error removing signature:', error);
            setDocumentError('Erreur lors de la suppression de la signature');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Signature des Documents
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Sélectionnez un travailleur assigné au document et apposez votre signature pour le valider.
            </Typography>

            {/* Error Messages */}
            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
                    {errorMessage}
                </Alert>
            )}

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
                                setSelectedUserId('');
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

            {/* Workers Signatures Status */}
            <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        État des Signatures - Travailleurs du Chantier
                    </Typography>
                    
                    {loadingWorkers && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} />
                                Chargement des travailleurs du chantier...
                            </Box>
                        </Alert>
                    )}
                    
                    {!loadingWorkers && workersNeedingSigning.length === 0 && formData.chantier && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Aucun travailleur assigné à ce chantier. Veuillez d'abord assigner des travailleurs au chantier.
                        </Alert>
                    )}
                    
                    {workersNeedingSigning.length > 0 ? (
                        <List>
                            {workersNeedingSigning.map((worker) => {
                                const isSigned = documentSignatures.filter(sig => sig.workerId != null && sig.workerId === worker.id).length > 0;
                                return (
                                    <React.Fragment key={`worker-${worker.id}`}>
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
                    ) : !loadingWorkers && (
                        <Alert severity="info">
                            Aucun travailleur assigné à ce chantier.
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Users Signatures Status */}
            <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        État des Signatures - Utilisateurs (Donneur d'Ordre)
                    </Typography>
                    
                    {loadingUsers && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} />
                                Chargement des utilisateurs...
                            </Box>
                        </Alert>
                    )}
                    
                    {!loadingUsers && availableUsers.length > 0 ? (
                        <List>
                            {availableUsers.map((user) => {
                                const isSigned = documentSignatures.filter(sig => sig.userId != null && sig.userId === user.id).length > 0;
                                return (
                                    <React.Fragment key={`user-${user.id}`}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: isSigned ? 'success.main' : 'grey.400' }}>
                                                    {isSigned ? <CheckCircle /> : <Pending />}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={user.username || `Utilisateur ${user.id}`}
                                                secondary={`ID: ${user.id}` + (user.email ? ` - ${user.email}` : '')}
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
                            {loadingUsers 
                                ? "Chargement des utilisateurs..."
                                : "Aucun utilisateur disponible pour signature."
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
                                onChange={(e) => handleWorkerSelection(Number(e.target.value))}
                                label="Sélectionner un travailleur du chantier"
                                disabled={loadingWorkers || chantierWorkers.length === 0}
                            >
                                {workersNeedingSigning
                                    .filter(worker => !documentSignatures.some(sig => sig.workerId != null && sig.workerId === worker.id))
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
                            Mode signature donneur d'ordre - Sélectionnez l'utilisateur qui va signer.
                        </Alert>

                        {/* User Selection */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Sélectionner un utilisateur</InputLabel>
                            <Select
                                value={selectedUserId}
                                onChange={(e) => handleUserSelection(Number(e.target.value))}
                                label="Sélectionner un utilisateur"
                                disabled={loadingUsers || availableUsers.length === 0}
                            >
                                {availableUsers
                                    .filter(user => !documentSignatures.some(sig => sig.userId != null && sig.userId === user.id))
                                    .map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Person fontSize="small" />
                                                {user.username || `Utilisateur ${user.id}`}
                                                <Typography variant="caption" color="text.secondary">
                                                    - ID: {user.id}
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
                            disabled={!selectedUserId || !name || !lastName || isDocumentLoading}
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
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box>
                            {documentSignatures && documentSignatures.length > 0 ? (
                                <Box>
                                    {documentSignatures.map((signature) => (
                                        <Box key={`${signature.workerId != null ? "Worker" : "User"}-${signature.id}`} sx={{ mb: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1">
                                                    {signature.workerId != null ? `Signature Travailleur: ${signature.prenom || ''} ${signature.nom || ''}` : `Signature Utilisateur: ${signature.prenom || ''} ${signature.nom || ''}`}
                                                </Typography>
                                            </Box>
                                            {/* Unsign Button */}
                                            {Boolean(signature.id) && (
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleUnsignDocument(signature)}
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
                        </Box>
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
        </Box>
    );
}

export default DocumentTabSigning;
