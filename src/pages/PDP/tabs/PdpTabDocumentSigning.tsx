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
import { UserDTO } from '../../../utils/entitiesDTO/UserDTO';
import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import useWorkerSelection from '../../../hooks/useWorkerSelection';
import useDocument, { SignatureRequestDTO, SignatureResponseDTO } from '../../../hooks/useDocument';
import useChantier from '../../../hooks/useChantier';
import useUser from '../../../hooks/useUser';



interface PdpTabDocumentSigningProps {
    formData: PdpDTO;
    allWorkersMap: Map<number, WorkerDTO>; // Keep for backward compatibility, but we'll use chantier-specific workers
    currentUserId?: number;
}
const PdpTabDocumentSigning: FC<PdpTabDocumentSigningProps> = ({
    formData,
    allWorkersMap,
    currentUserId,
}) => {
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | ''>('');
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [name, setName] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [lastName, setLastName] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const [chantierWorkers, setChantierWorkers] = useState<WorkerDTO[]>([]);
    const [availableUsers, setAvailableUsers] = useState<UserDTO[]>([]);
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [documentSignatures, setDocumentSignatures] = useState<SignatureResponseDTO[]>([]);
    const [signatureMode, setSignatureMode] = useState<'worker' | 'donneurDOrdre'>('worker');

    const { getWorkersForChantier } = useWorkerSelection();
    const { getChantier } = useChantier();
    const { getUser } = useUser();
    const { 
        isLoading: isDocumentLoading, 
        error: documentError, 
        signDocumentByWorker,
        signDocumentByUser,
        unsignDocumentByUser,
        unsignDocumentByWorker,
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

    // Load available users for the specific chantier
    useEffect(() => {
        const loadAvailableUsers = async () => {
            if (!formData.chantier || !currentUserId) {
                console.warn('No chantier ID or currentUserId found');
                return;
            }

            setLoadingUsers(true);
            
            try {
                console.log('Loading users for chantier:', formData.chantier);
                
                // Get chantier details to access donneurDOrdre
                const chantierData = await getChantier(formData.chantier);
                console.log('Chantier data loaded:', chantierData);
                
                const users: UserDTO[] = [];
                
                // Add donneurDOrdre if exists
                if (chantierData.donneurDOrdre) {
                    try {
                        const donneurUser = await getUser(chantierData.donneurDOrdre);
                        console.log('Donneur d\'ordre loaded:', donneurUser);
                        console.log('Donneur d\'ordre user details:', {
                            id: donneurUser.id,
                            username: donneurUser.username,
                            role: donneurUser.role,
                            fonction: donneurUser.fonction,
                            email: donneurUser.email
                        });
                        if (donneurUser) {
                            users.push(donneurUser);
                        }
                    } catch (error) {
                        console.error('Failed to load donneur d\'ordre user:', error);
                    }
                }
                
                // Add current user if different from donneurDOrdre
                if (currentUserId !== chantierData.donneurDOrdre) {
                    try {
                        const currentUser = await getUser(currentUserId);
                        console.log('Current user loaded:', currentUser);
                        console.log('Current user details:', {
                            id: currentUser.id,
                            username: currentUser.username,
                            role: currentUser.role,
                            fonction: currentUser.fonction,
                            email: currentUser.email
                        });
                        if (currentUser) {
                            users.push(currentUser);
                        }
                    } catch (error) {
                        console.error('Failed to load current user:', error);
                    }
                }
                
                console.log('Available users:', users);
                console.log('Available users detailed:', users.map(u => ({
                    id: u.id,
                    username: u.username,
                    role: u.role,
                    fonction: u.fonction,
                    hasUsername: !!u.username,
                    hasRole: !!u.role,
                    hasFonction: !!u.fonction
                })));
                setAvailableUsers(users);
                
            } catch (error: any) {
                console.error('Failed to load available users:', error);
            } finally {
                setLoadingUsers(false);
            }
        };
    
        loadAvailableUsers();
    }, [formData.chantier, currentUserId]);

    // Load existing signatures for the document
    useEffect(() => {
        const loadDocumentSignatures = async () => {
            if (!formData.id) return;
            
            try {
                const response = await getSignaturesByDocumentId(formData.id);

                console.log('All signatures loaded:', response);
                
                // Debug: Check the structure of individual signature objects
                if (response && response.length > 0) {
                    console.log('Sample signature objects:', response.map((sig, index) => ({
                        index,
                        workerId: sig.workerId,
                        userId: sig.userId,
                        id: sig.id,
                        documentId: sig.documentId,
                        prenom: sig.prenom,
                        nom: sig.nom,
                        fullObject: JSON.stringify(sig, null, 2)
                    })));
                }

                // Now the backend returns all signatures in one call
                // We need to separate them based on workerId vs userId and add typeOfSign property
                const allSignatures: any[] = (response || []).map(sig => {
                    console.log('Processing signature:', sig);
                    console.log('Signature properties:', Object.keys(sig));
                    console.log('Signature workerId:', sig.workerId);
                    console.log('Signature userId:', sig.userId);
                    console.log('Signature id field:', sig.id);
                    
                    // Add typeOfSign property based on workerId vs userId
                    if (sig.workerId !== null && sig.workerId !== undefined) {
                        console.log('Creating worker signature for workerId:', sig.workerId);
                        return {
                            ...sig, // Keep all original properties from backend
                            typeOfSign: 'worker' // Add typeOfSign for frontend logic
                        };
                    } else {
                        // Otherwise it's a user signature
                        console.log('Creating user signature for userId:', sig.userId);
                        return {
                            ...sig, // Keep all original properties from backend
                            typeOfSign: 'user' // Add typeOfSign for frontend logic
                        };
                    }
                });
                
                console.log('Combined signatures:', allSignatures);

                if(!allSignatures || allSignatures.length === 0) {
                    console.warn('No signatures found for document:', formData.id);
                }

                setDocumentSignatures(allSignatures);

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

    const handleUserSelection = useCallback((userId: number) => {
        setSelectedUserId(userId);
        setSuccess(null);
        
        // Find user in available users
        const user = availableUsers.find(u => u.id === userId);
        if (user) {
            setName(user.username || '');
            setLastName(''); // UserDTO doesn't have lastName, so keep it empty
        }
    }, [availableUsers]);




    const handleSignatureSave = useCallback(async (imageBase: string) => {
        // For worker mode, require selectedWorkerId
        // For donneurDOrdre mode, require selectedUserId

        //console.log('handleSignatureSave called with:', signatureData);
        if (signatureMode === 'worker' && !selectedWorkerId) {
            console.error('Missing selectedWorkerId for worker signature');
            return;
        }
        
        if (signatureMode === 'donneurDOrdre' && !selectedUserId) {
            console.error('Missing selectedUserId for donneur d\'ordre signature');
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
        // if (!signatureData || signatureData.length < 100) {
        //     console.error('Invalid signature data - too short or empty:', signatureData?.substring(0, 50));
        //     return;
        // }

        setSuccess(null);

        // Create the signature request object - ensure proper types for Java backend
        // const signatureRequest = {
        //     workerId: signatureMode === 'worker' ? Number(selectedWorkerId) : Number(selectedUserId),
        //     documentId: Number(formData.id),
        //     userId: Number(currentUserId),
        //     name: (name || '').trim(),
        //     lastName: (lastName || '').trim(),
        //     signatureImage: signatureData
        // };


        const signatureRequest: SignatureRequestDTO = {
            workerId: signatureMode === 'worker' ? Number(selectedWorkerId) : null,
            userId: signatureMode === 'donneurDOrdre' ? Number(selectedUserId) : null,
            documentId: Number(formData.id),
            prenom: (name || '').trim(),
            nom: (lastName || '').trim(),
            signatureImage: imageBase || '' // Use the image state directly
        }

        // Validate all required fields are present and valid
        if (!signatureRequest.documentId) {
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
            setSelectedUserId('');
            setName('');
            setLastName('');
            
            // Reload signatures using the same unified approach
            if (formData.id) {
                const response = await getSignaturesByDocumentId(formData.id);

                // Now the backend returns all signatures in one call
                // We need to separate them based on workerId vs userId and add typeOfSign property
                const allSignatures: any[] = (response || []).map(sig => {
                    console.log('Reloading - Processing signature:', sig);
                    
                    // Add typeOfSign property based on workerId vs userId
                    if (sig.workerId !== null && sig.workerId !== undefined) {
                        console.log('Reloading - Creating worker signature for workerId:', sig.workerId);
                        return {
                            ...sig, // Keep all original properties from backend
                            typeOfSign: 'worker' // Add typeOfSign for frontend logic
                        };
                    } else {
                        // Otherwise it's a user signature
                        console.log('Reloading - Creating user signature for userId:', sig.userId);
                        return {
                            ...sig, // Keep all original properties from backend
                            typeOfSign: 'user' // Add typeOfSign for frontend logic
                        };
                    }
                });
                
                setDocumentSignatures(allSignatures);
            }
            
        } catch (err: any) {
            console.error('Error signing document:', err);
        }
    }, [selectedWorkerId, selectedUserId, formData.id, currentUserId, name, lastName, signatureMode ]);

    // Handle unsigning documents
    const handleUnsignDocument = useCallback(async (signature: SignatureResponseDTO) => {
        if (!currentUserId || !formData.id) {
            console.error('Missing currentUserId or formData.id for unsigning');
            return;
        }

        setSuccess(null);

        try {
            console.log('Attempting to unsign document:', {
                userId: signature.userId,
                signatureId : signature.id, // This is the actual signature ID
                workerId : signature.workerId, // This is the worker ID or user ID
                documentId: signature.documentId,
            });
            
            const isWorker = signature.workerId !== null && signature.workerId !== undefined;

            // Use appropriate unsign function based on signature type
            if (isWorker) {
                if (signature.workerId !== null) {
                    console.log('Unsigning worker - workerId:', signature.workerId, 'signatureId:', signature.id);
                    
                    // API expects: workerId, signatureId
                    await unsignDocumentByWorker(signature.workerId, signature.id);
                } else {
                    console.error('workerId is null, cannot unsign worker signature:', signature);
                    return;
                }
            } else {
            
                console.log('Unsigning user - userId:', signature.userId, 'signatureId:', signature.id);
                    if(signature.userId !== null) {
                            await unsignDocumentByUser(signature.userId , signature.id);
                    }
            }
            
            setSuccess('Signature supprimée avec succès');
            
            // Reload signatures
            if (formData.id) {
                const response = await getSignaturesByDocumentId(formData.id);

                // Now the backend returns all signatures in one call
                // We need to separate them based on workerId vs userId and add typeOfSign property
                const allSignatures: any[] = (response || []).map(sig => {
                    console.log('After unsign - Processing signature:', sig);
                    
                    // Add typeOfSign property based on workerId vs userId
                    if (sig.workerId !== null && sig.workerId !== undefined) {
                        console.log('After unsign - Creating worker signature for workerId:', sig.workerId);
                        return {
                            ...sig, // Keep all original properties from backend
                            typeOfSign: 'worker' // Add typeOfSign for frontend logic
                        };
                    } else {
                        // Otherwise it's a user signature
                        console.log('After unsign - Creating user signature for userId:', sig.userId);
                        return {
                            ...sig, // Keep all original properties from backend
                            typeOfSign: 'user' // Add typeOfSign for frontend logic
                        };
                    }
                });
                
                setDocumentSignatures(allSignatures);
            }
            
        } catch (err: any) {
            console.error('Error unsigning document:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            
            // Show the error to the user
            let errorMessage = 'Erreur inconnue';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            // Special handling for backend "Signature not found" error
            if (errorMessage === 'Signature not found') {
                errorMessage = `Impossible de supprimer la signature (ID: ${signature.id}). La signature n'existe peut-être plus dans la base de données. Veuillez rafraîchir la page.`;
            }
            
            setSuccess(`Erreur lors de la suppression de la signature: ${errorMessage}`);
            
            if (documentError) {
                console.error('Document error after unsigning:', documentError);
            }
        }
    }, [currentUserId, formData.id, unsignDocumentByUser, unsignDocumentByWorker, getSignaturesByDocumentId, documentError]);

    const workersNeedingSigning = getWorkersNeedingSigning();

    return (
        <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
            <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2.5 }, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Draw color="primary" />
                    Signature des Documents
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
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

                {/* Users Signatures Status */}
                <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            État des Signatures - Utilisateurs
                        </Typography>
                        
                        {/* Loading indicator for users */}
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
                                                    secondary={`ID: ${user.id}` + (user.role ? ` - ${user.role}` : '') + (user.fonction ? ` - ${user.fonction}` : '')}
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
                                    onChange={(e) => handleWorkerSelection(e.target.value as number)}
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
                                    onChange={(e) => handleUserSelection(e.target.value as number)}
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
                                                        - {user.role || 'Aucun rôle'} - ID: {user.id}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            {/* Name Fields */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    label="Nom"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    disabled={isDocumentLoading}
                                />
                                <TextField
                                    label="Nom de famille"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    fullWidth
                                    disabled={isDocumentLoading}
                                />
                            </Box>

                            {/* Signature Pad */}
                            <SignaturePad
                                onSignatureSave={handleSignatureSave}
                                disabled={!selectedUserId || !name || isDocumentLoading}
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
                                                onClick={() => {
                                                    console.log('Attempting to delete signature:', signature);                                                   
                                                    handleUnsignDocument(signature);
                                            
                                                }}
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
            </Paper>
        </Box>
    );
};

export default PdpTabDocumentSigning;
