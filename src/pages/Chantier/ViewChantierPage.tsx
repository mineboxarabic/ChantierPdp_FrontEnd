// src/pages/Chantier/ViewChantierPage.tsx
import React, { FC, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    CircularProgress,
    Alert,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Person as PersonIcon,
    LocationOn as LocationIcon,
    InfoOutlined as InfoIcon,
    Assignment as PdpIcon,
    Work as BdtIcon,
    PeopleAlt as TeamIcon,
    ErrorOutline as ErrorIcon,
    CalendarMonth as CalendarIcon,
    AccessTime as TimeIcon,
    FormatListNumbered as NumberIcon,
    Construction as OperationIcon,
    Dangerous as TravauxDangereuxIcon,
    VerifiedUser as StatusIcon,
    PeopleAlt,
} from '@mui/icons-material';

// Reusable View Components
import EntityViewHeader from '../../components/EntityView/EntityViewHeader';
import DetailSection from '../../components/EntityView/DetailSection';
import DetailField from '../../components/EntityView/DetailField';
import RelatedEntityLink from '../../components/EntityView/RelatedEntityLink';
import RelatedEntitiesListDisplay from '../../components/EntityView/RelatedEntitiesListDisplay';

// Hooks
import useChantier from '../../hooks/useChantier';
import useEntreprise from '../../hooks/useEntreprise';
import useUser from '../../hooks/useUser';
import useLocalisation from '../../hooks/useLocalisation';
import usePdp from '../../hooks/usePdp';
import useBdt from '../../hooks/useBdt';
import useWoker from '../../hooks/useWoker'; // Corrected typo if it's useWorker

// DTOs
import { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO';
import { EntrepriseDTO } from '../../utils/entitiesDTO/EntrepriseDTO';
import { UserDTO } from '../../utils/entitiesDTO/UserDTO';
import { LocalisationDTO } from '../../utils/entitiesDTO/LocalisationDTO';
import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';
import { BdtDTO } from '../../utils/entitiesDTO/BdtDTO';
import { WorkerDTO } from '../../utils/entitiesDTO/WorkerDTO';

// Routes
import { getRoute } from '../../Routes';
import { ChantierStatus } from '../../utils/enums/ChantierStatus.ts'; // Make sure this path is correct

const ViewChantierPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [chantier, setChantier] = useState<ChantierDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

    // Data maps for related entities
    const [entreprisesMap, setEntreprisesMap] = useState<Map<number, EntrepriseDTO>>(new Map());
    const [usersMap, setUsersMap] = useState<Map<number, UserDTO>>(new Map());
    const [localisationsMap, setLocalisationsMap] = useState<Map<number, LocalisationDTO>>(new Map());
    const [pdpsMap, setPdpsMap] = useState<Map<number, PdpDTO>>(new Map());
    const [bdtsMap, setBdtsMap] = useState<Map<number, BdtDTO>>(new Map());
    const [workersMap, setWorkersMap] = useState<Map<number, WorkerDTO>>(new Map()); // For selected workers

    // Hooks
    const { getChantier: fetchChantierById, deleteChantier } = useChantier();
    const { getAllEntreprises, entreprises: fetchedEntreprises } = useEntreprise();
    const { getUsers, users: fetchedUsers } = useUser(); // Assuming getUsers returns UserDTO[]
    const { getAllLocalisations, localisations: fetchedLocalisations } = useLocalisation();
    const { getAllPDPs, pdps: fetchedPdps } = usePdp();
    const { getAllBDTs, bdts: fetchedBdts } = useBdt();
    const { getSelectedWorkersForChantier, workers: allWorkersSystem } = useWoker(); // Assuming this hook exists

    const loadChantierData = useCallback(async () => {
        if (!id) {
            setError("ID du chantier non fourni.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const chantierId = parseInt(id, 10);
            const chantierData = await fetchChantierById(chantierId);
            setChantier(chantierData);

            // Fetch all related lookup data in parallel
            // These should populate the maps in their respective useEffects below
            await Promise.all([
                getAllEntreprises(),
                getUsers(), // Assuming this fetches all users for lookup
                getAllLocalisations(),
                getAllPDPs(), // Fetch all for lookup, can be optimized if needed
                getAllBDTs(), // Fetch all for lookup
            ]);

            // Fetch workers specifically selected for this chantier
            if (chantierData?.workerSelections && chantierData.workerSelections.length > 0) {
                 // If getSelectedWorkersForChantier returns the workers directly:
                const selectedWorkersData = await getSelectedWorkersForChantier(chantierId);
                const tempWorkersMap = new Map<number, WorkerDTO>();
                selectedWorkersData.forEach(worker => worker.id && tempWorkersMap.set(worker.id, worker));
                setWorkersMap(tempWorkersMap);
            }


        } catch (err: any) {
            console.error("Failed to load chantier details:", err);
            setError(err.message || "Une erreur est survenue lors du chargement du chantier.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadChantierData();
    }, [loadChantierData]);

    // Populate maps from hook data
    useEffect(() => setEntreprisesMap(fetchedEntreprises), [fetchedEntreprises]);
    useEffect(() => {
        const newUsersMap = new Map<number, UserDTO>();
        fetchedUsers.forEach(user => user.id && newUsersMap.set(user.id, user));
        setUsersMap(newUsersMap);
    }, [fetchedUsers]);
    useEffect(() => setLocalisationsMap(fetchedLocalisations), [fetchedLocalisations]);
    useEffect(() => setPdpsMap(fetchedPdps), [fetchedPdps]);
    useEffect(() => setBdtsMap(fetchedBdts), [fetchedBdts]);
    // WorkersMap is populated in loadChantierData after getSelectedWorkersForChantier


    const handleEdit = () => {
        if (chantier?.id) {
            navigate(getRoute('EDIT_CHANTIER', { id: chantier.id.toString() }));
        }
    };

    const handleDeleteConfirm = () => {
        setConfirmDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (chantier?.id) {
            try {
                await deleteChantier(chantier.id);
                navigate(getRoute('HOME')); // Or to a list page
            } catch (err: any) {
                setError(err.message || "Erreur lors de la suppression du chantier.");
            } finally {
                setConfirmDeleteDialogOpen(false);
            }
        }
    };

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" icon={<ErrorIcon />}>{error}</Alert>
                 <Button onClick={() => navigate(getRoute('HOME'))} sx={{mt: 2}}>Retour à l'accueil</Button>
            </Container>
        );
    }

    if (!chantier) {
        return (
            <Container>
                <Alert severity="warning">Chantier non trouvé.</Alert>
                 <Button onClick={() => navigate(getRoute('HOME'))} sx={{mt: 2}}>Retour à l'accueil</Button>
            </Container>
        );
    }
    
    const entrepriseUtilisatriceData = chantier.entrepriseUtilisatrice ? entreprisesMap.get(chantier.entrepriseUtilisatrice) : undefined;
    const donneurDOrdreData = chantier.donneurDOrdre ? usersMap.get(chantier.donneurDOrdre) : undefined;
    const localisationData = chantier.localisation ? localisationsMap.get(chantier.localisation) : undefined;


    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <EntityViewHeader
                title={chantier.nom || "Détails du Chantier"}
                entityTypeLabel="Chantier"
                onEdit={handleEdit}
                onDelete={handleDeleteConfirm}
                backRoute={getRoute('HOME')} // Or a list page for chantiers
            />

            <Grid container spacing={3}>
                {/* General Information Section */}
                <Grid item xs={12} md={7}>
                    <DetailSection title="Informations Générales" icon={<InfoIcon />}>
                        <Grid container spacing={0}> {/* No spacing for DetailFields within a section, DetailField has its own py */}
                            <DetailField label="Nom du Chantier" value={chantier.nom} icon={<BusinessIcon fontSize="small"/>} />
                            <DetailField label="Opération" value={chantier.operation} icon={<OperationIcon fontSize="small"/>} type="multiline" fullWidth/>
                            <DetailField label="Date de Début" value={chantier.dateDebut} type="date" icon={<CalendarIcon fontSize="small"/>} />
                            <DetailField label="Date de Fin" value={chantier.dateFin} type="date" icon={<CalendarIcon fontSize="small"/>} />
                            <DetailField label="Nombre d'Heures" value={chantier.nbHeurs} type="number" icon={<TimeIcon fontSize="small"/>} />
                            <DetailField label="Effectif Max." value={chantier.effectifMaxiSurChantier} type="number" icon={<NumberIcon fontSize="small"/>}/>
                            <DetailField label="Nb. Intérimaires" value={chantier.nombreInterimaires} type="number" icon={<NumberIcon fontSize="small"/>}/>
                            <DetailField label="Annuel (PDP Requis)" value={chantier.isAnnuelle} type="boolean" />
                            <DetailField label="Travaux Dangereux" value={chantier.travauxDangereux} type="boolean" icon={<TravauxDangereuxIcon fontSize="small"/>}/>
                            <DetailField label="Statut" value={ChantierStatus[chantier.status as string] || 'Inconnu'} type="chip" icon={<StatusIcon fontSize="small"/>}
                                chipColor={
                                    chantier.status === ChantierStatus.ACTIVE ? 'info' :
                                    chantier.status === ChantierStatus.PENDING_BDT ? 'warning' :
                                    chantier.status === ChantierStatus.COMPLETED ? 'success' :
                                    chantier.status === ChantierStatus.INACTIVE_TODAY ? 'error' : 'default'
                                }
                            />
                        </Grid>
                    </DetailSection>
                </Grid>

                 {/* Related Parties Section */}
                <Grid item xs={12} md={5}>
                    <DetailSection title="Acteurs Impliqués" icon={<PeopleAlt />}>
                        <Grid container spacing={0}>
                            <RelatedEntityLink
                                label="Entreprise Utilisatrice"
                                entityId={chantier.entrepriseUtilisatrice}
                                entityData={entrepriseUtilisatriceData}
                                getRoute={(id) => getRoute('VIEW_ENTREPRISE', { id: id.toString() })} // Ensure this route exists
                                icon={<BusinessIcon fontSize="small"/>}
                                fullWidth
                            />
                            <RelatedEntityLink
                                label="Donneur d'Ordre"
                                entityId={chantier.donneurDOrdre}
                                entityData={donneurDOrdreData} // Assuming UserDTO has 'username' or 'name'
                                getRoute={(id) => getRoute('VIEW_USER_PROFILE', { id: id.toString() })} // Ensure this route exists
                                icon={<PersonIcon fontSize="small"/>}
                                fullWidth
                            />
                            <RelatedEntityLink
                                label="Localisation"
                                entityId={chantier.localisation}
                                entityData={localisationData}
                                getRoute={(id) => getRoute('VIEW_LOCALISATION', { id: id.toString() })} // Ensure this route exists
                                icon={<LocationIcon fontSize="small"/>}
                                fullWidth
                            />
                             <RelatedEntitiesListDisplay
                                label="Entreprises Extérieures"
                                entityIds={chantier.entrepriseExterieurs}
                                entitiesDataMap={entreprisesMap}
                                getRoute={(id) => getRoute('VIEW_ENTREPRISE', { id: id.toString() })}
                                icon={<BusinessIcon fontSize="small"/>}
                                fullWidth
                            />
                        </Grid>
                    </DetailSection>
                </Grid>

                 {/* Workers Section */}
                {(chantier.workerSelections && chantier.workerSelections.length > 0) && (
                    <Grid item xs={12}>
                        <DetailSection title="Intervenants Affectés" icon={<TeamIcon />}>
                             <RelatedEntitiesListDisplay
                                label="" // No extra label needed as section title is enough
                                entityIds={chantier.workerSelections}
                                entitiesDataMap={workersMap} // Pass the specific workers for this chantier
                                getRoute={(id) => getRoute('VIEW_WORKER', { id: id.toString() })} // Assuming a worker view route
                                fullWidth
                            />
                        </DetailSection>
                    </Grid>
                )}


                {/* Documents Section */}
                {(chantier.pdps && chantier.pdps.length > 0 || chantier.bdts && chantier.bdts.length > 0) && (
                    <Grid item xs={12}>
                        <DetailSection title="Documents Associés" icon={<PdpIcon />}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                     <RelatedEntitiesListDisplay
                                        label="Plans de Prévention (PDPs)"
                                        entityIds={chantier.pdps}
                                        entitiesDataMap={pdpsMap}
                                        getRoute={(id) => getRoute('VIEW_PDP', { id: id.toString() })}
                                        icon={<PdpIcon fontSize="small"/>}
                                        emptyText="Aucun PDP lié."
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                     <RelatedEntitiesListDisplay
                                        label="Bons de Travail (BDTs)"
                                        entityIds={chantier.bdts}
                                        entitiesDataMap={bdtsMap}
                                        getRoute={(id) => getRoute('VIEW_BDT', { id: id.toString() })}
                                        icon={<BdtIcon fontSize="small"/>}
                                        emptyText="Aucun BDT lié."
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </DetailSection>
                    </Grid>
                )}
            </Grid>

            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={() => setConfirmDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer ce chantier ({chantier.nom}) ? Cette action est irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleDelete} color="error">Supprimer</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ViewChantierPage;