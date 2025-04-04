import React, { useEffect, useState } from "react";
import {
    TextField, Button, Container, Typography, Paper, MenuItem,
    Chip, Box, OutlinedInput, InputLabel, FormControl, Select, SelectChangeEvent,
    Accordion, AccordionSummary, AccordionDetails, Divider
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from "@mui/material/Grid2";
import useChantier from "../../hooks/useChantier";
import Chantier from "../../utils/entities/Chantier.ts";
import { useNotifications } from "@toolpad/core/useNotifications";
import { Entreprise } from "../../utils/entities/Entreprise.ts";
import User from "../../utils/entities/User.ts";
import Localisation from "../../utils/entities/Localisation.ts";
import useUser from "../../hooks/useUser.ts";
import useEntreprise from "../../hooks/useEntreprise.ts";
import useLocalisation from "../../hooks/useLocalisation.ts";
import usePdp from "../../hooks/usePdp.ts";
import useBdt from "../../hooks/useBdt.ts";
import { Pdp } from "../../utils/entities/Pdp.ts";
import { BDT } from "../../utils/entities/BDT.ts";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const CreateChantier: React.FC = () => {
    const { createChantier, loading } = useChantier();
    const { getUsers } = useUser();
    const { getAllEntreprises } = useEntreprise();
    const { getAllLocalisations } = useLocalisation();
    const { createPdp } = usePdp();
    const { createBDT } = useBdt();
    const notifications = useNotifications();

    const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [localisations, setLocalisations] = useState<Localisation[]>([]);
    const [isAnuelle, setIsAnuelle] = useState<boolean>(false);

    // State to manage PDPs
    const [pdps, setPdps] = useState<Partial<Pdp>[]>([]);
    // State to manage BDTs
    const [bdts, setBdts] = useState<Partial<BDT>[]>([]);

    const [chantier, setChantier] = useState<Partial<Chantier>>({
        nom: "",
        operation: "",
        dateDebut: undefined,
        dateFin: undefined,
        nbHeurs: undefined,
        effectifMaxiSurChantier: undefined,
        nombreInterimaires: undefined,
        entrepriseExterieurs: [],
        entrepriseUtilisatrice: {} as Entreprise,
        localisation: {} as Localisation,
        donneurDOrdre: {} as User,
        bdts: [],
        pdps: [],
        workers: []
    });

    // Current PDP and BDT being edited
    const [currentPdp, setCurrentPdp] = useState<Partial<Pdp>>({});
    const [currentBdt, setCurrentBdt] = useState<Partial<BDT>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
       /*         const enterprisesData = await getAllEntreprises();
                console.log(enterprisesData);
                if (enterprisesData) {
                    setEntreprises(enterprisesData);
                }*/

                getAllEntreprises().then((response:Entreprise[]) =>{
                    setEntreprises(response);
                });

                const usersData = await getUsers();
                if (usersData) {
                    setUsers(usersData);
                }

                const locationsData = await getAllLocalisations();
                if (locationsData) {
                    setLocalisations(locationsData);
                }
            } catch (error) {
                console.error("Error loading initial data:", error);
                notifications.show("Error loading initial data. Please try refreshing the page.", { severity: "error" });
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChantier({ ...chantier, [e.target.name]: e.target.value });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChantier({ ...chantier, [e.target.name]: Number(e.target.value) });
    };

    const handleMultiSelectChange = (event: SelectChangeEvent<number[]>, field: string) => {
        const { value } = event.target;
        const selectedIds = typeof value === 'string' ? value.split(',').map(Number) : value;

        // Map the selected IDs to their respective objects
        if (field === 'entrepriseExterieurs') {
            const selectedEntreprises = entreprises.filter(e => selectedIds.includes(e.id as number));
            setChantier({ ...chantier, entrepriseExterieurs: selectedEntreprises });
        }
    };

    const checkDates = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.target.name === "nbHeurs" && Number(e.target.value) > 400) {
            setIsAnuelle(true);
        } else if (e.target.name !== "nbHeurs") {
            setIsAnuelle(false);
        }

        if (e.target.name === "dateDebut" || e.target.name === "dateFin") {
            if (chantier.dateDebut && chantier.dateFin) {
                const dateDebut: Date = new Date(chantier.dateDebut);
                const dateFin: Date = new Date(chantier.dateFin);
                if (dateFin.getFullYear() - dateDebut.getFullYear() === 1) {
                    setIsAnuelle(true);
                }
            }
        }
    };

    // PDP handlers
    const handleAddPdp = () => {
        setPdps([...pdps, { ...currentPdp }]);
        setCurrentPdp({});
    };

    const handlePdpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentPdp({ ...currentPdp, [e.target.name]: e.target.value });
    };

    const handlePdpSelectChange = (e: SelectChangeEvent<number>) => {
        setCurrentPdp({ ...currentPdp, [e.target.name]: Number(e.target.value) });
    };

    const removePdp = (index: number) => {
        const updatedPdps = [...pdps];
        updatedPdps.splice(index, 1);
        setPdps(updatedPdps);
    };

    // BDT handlers
    const handleAddBdt = () => {
        setBdts([...bdts, { ...currentBdt }]);
        setCurrentBdt({});
    };

    const handleBdtChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentBdt({ ...currentBdt, [e.target.name]: e.target.value });
    };

    const removeBdt = (index: number) => {
        const updatedBdts = [...bdts];
        updatedBdts.splice(index, 1);
        setBdts(updatedBdts);
    };

    const handleSubmit = async () => {
        if (!chantier.nom || !chantier.entrepriseUtilisatrice || !chantier.donneurDOrdre || !chantier.localisation) {
            notifications.show("Please fill in all required fields!", { severity: "error" });
            return;
        }

        try {
            // First create the chantier
            const createdChantier = await createChantier(chantier as Chantier);

            // Then create all PDPs linked to this chantier
            if (pdps.length > 0) {
                for (const pdp of pdps) {
                    await createPdp({
                        ...pdp,
                        chantier: createdChantier.id
                    });
                }
            }

            // Then create all BDTs linked to this chantier
            if (bdts.length > 0) {
                for (const bdt of bdts) {
                    await createBDT({
                        ...bdt as BDT
                    });
                }
            }

            notifications.show("Chantier created successfully with all associated elements!", { severity: "success" });
        } catch (error) {
            notifications.show("Error creating chantier!", { severity: "error" });
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Create New Chantier {isAnuelle && "Anuelle (Avec PDP)"}
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Chantier Name"
                            name="nom"
                            value={chantier.nom}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Operation"
                            name="operation"
                            value={chantier.operation}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Date Debut"
                            name="dateDebut"
                            type="date"
                            value={chantier.dateDebut ? new Date(chantier.dateDebut).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                setChantier({ ...chantier, dateDebut: new Date(e.target.value) });
                                checkDates(e);
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Date Fin"
                            name="dateFin"
                            type="date"
                            value={chantier.dateFin ? new Date(chantier.dateFin).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                setChantier({ ...chantier, dateFin: new Date(e.target.value) });
                                checkDates(e);
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Nombre d'heures"
                            name="nbHeurs"
                            value={chantier.nbHeurs || ''}
                            onChange={(e) => {
                                handleNumberChange(e);
                                checkDates(e);
                            }}
                            type="number"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Effectif Maximum Sur Chantier"
                            name="effectifMaxiSurChantier"
                            value={chantier.effectifMaxiSurChantier || ''}
                            onChange={handleNumberChange}
                            type="number"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Nombre d'Interimaires"
                            name="nombreInterimaires"
                            value={chantier.nombreInterimaires || ''}
                            onChange={handleNumberChange}
                            type="number"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                            <InputLabel id="entreprise-exterieurs-label">Entreprises Exterieures</InputLabel>
                            <Select
                                labelId="entreprise-exterieurs-label"
                                multiple
                                value={chantier.entrepriseExterieurs?.map(e => e.id) || []}
                                onChange={(e) => handleMultiSelectChange(e as SelectChangeEvent<number[]>, 'entrepriseExterieurs')}
                                input={<OutlinedInput label="Entreprises Exterieures" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected && selected.length > 0 && selected.map((value) => {
                                            const entreprise = entreprises && entreprises.length > 0
                                                ? entreprises.find(e => e.id === value)
                                                : null;
                                            return (
                                                <Chip key={value} label={entreprise?.nom || `ID: ${value}`} />
                                            );
                                        })}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {entreprises && entreprises.length > 0 && entreprises.map((entreprise) => (
                                    <MenuItem key={entreprise.id} value={entreprise.id}>
                                        {entreprise.nom}
                                    </MenuItem>
                                ))}
                                {(!entreprises || entreprises.length === 0) && (
                                    <MenuItem value="">No companies available</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            select
                            label="Entreprise Utilisatrice"
                            name="entrepriseUtilisatrice"
                            value={chantier.entrepriseUtilisatrice?.id || ""}
                            onChange={(e) => setChantier({ ...chantier, entrepriseUtilisatrice: { id: Number(e.target.value) } as Entreprise })}
                            required
                        >
                            {entreprises && entreprises.length > 0 && entreprises.map((entreprise) => (
                                <MenuItem key={entreprise.id} value={entreprise.id}>
                                    {entreprise.nom}
                                </MenuItem>
                            ))}
                            {(!entreprises || entreprises.length === 0) && (
                                <MenuItem value="">No companies available</MenuItem>
                            )}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            select
                            label="Donneur d'Ordre"
                            name="donneurDOrdre"
                            value={chantier.donneurDOrdre?.id || ""}
                            onChange={(e) => setChantier({ ...chantier, donneurDOrdre: { id: Number(e.target.value) } as User })}
                            required
                        >
                            {users && users.length > 0 && users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                            {(!users || users.length === 0) && (
                                <MenuItem value="">No users available</MenuItem>
                            )}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            select
                            label="Localisation"
                            name="localisation"
                            value={chantier.localisation?.id || ""}
                            onChange={(e) => setChantier({ ...chantier, localisation: { id: Number(e.target.value) } as Localisation })}
                            required
                        >
                            {localisations && localisations.length > 0 && localisations.map((localisation) => (
                                <MenuItem key={localisation.id} value={localisation.id}>
                                    {localisation.nom}
                                </MenuItem>
                            ))}
                            {(!localisations || localisations.length === 0) && (
                                <MenuItem value="">No locations available</MenuItem>
                            )}
                        </TextField>
                    </Grid>

                    {/* PDP Section */}
                    <Grid size={{ xs: 12 }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">Plan de Prévention (PDP) {isAnuelle ? "(Requis pour projets annuels)" : ""}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {/* List of added PDPs */}
                                    {pdps && pdps.length > 0 && (
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="subtitle2" gutterBottom>PDPs ajoutés:</Typography>
                                            {pdps.map((pdp, index) => (
                                                <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography>{pdp.entrepriseExterieure ? `PDP pour entreprise externe ID: ${pdp.entrepriseExterieure}` : `PDP #${index + 1}`}</Typography>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() => removePdp(index)}
                                                    >
                                                        Supprimer
                                                    </Button>
                                                </Box>
                                            ))}
                                            <Divider sx={{ my: 2 }} />
                                        </Grid>
                                    )}

                                    {/* PDP form */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Entreprise Extérieure"
                                            name="entrepriseExterieure"
                                            value={currentPdp.entrepriseExterieure || ""}
                                            onChange={(e) => handlePdpSelectChange(e as SelectChangeEvent<number>)}
                                        >
                                            {entreprises && entreprises.length > 0 && entreprises.map((entreprise) => (
                                                <MenuItem key={entreprise.id} value={entreprise.id}>
                                                    {entreprise.nom}
                                                </MenuItem>
                                            ))}
                                            {(!entreprises || entreprises.length === 0) && (
                                                <MenuItem value="">No companies available</MenuItem>
                                            )}
                                        </TextField>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Entreprise d'Inspection"
                                            name="entrepriseDInspection"
                                            value={currentPdp.entrepriseDInspection || ""}
                                            onChange={(e) => handlePdpSelectChange(e as SelectChangeEvent<number>)}
                                        >
                                            {entreprises && entreprises.length > 0 && entreprises.map((entreprise) => (
                                                <MenuItem key={entreprise.id} value={entreprise.id}>
                                                    {entreprise.nom}
                                                </MenuItem>
                                            ))}
                                            {(!entreprises || entreprises.length === 0) && (
                                                <MenuItem value="">No companies available</MenuItem>
                                            )}
                                        </TextField>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Date d'Inspection"
                                            name="dateInspection"
                                            type="date"
                                            value={currentPdp.dateInspection ? new Date(currentPdp.dateInspection).toISOString().split('T')[0] : ''}
                                            onChange={(e) => setCurrentPdp({ ...currentPdp, dateInspection: new Date(e.target.value) })}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Détails des Horaires"
                                            name="horairesDetails"
                                            value={currentPdp.horairesDetails || ''}
                                            onChange={handlePdpChange}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={handleAddPdp}
                                            sx={{ mt: 2 }}
                                            fullWidth
                                        >
                                            Ajouter ce PDP
                                        </Button>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    {/* BDT Section */}
                    <Grid size={{ xs: 12 }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">Bon de Travail (BDT)</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {/* List of added BDTs */}
                                    {bdts && bdts.length > 0 && (
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="subtitle2" gutterBottom>BDTs ajoutés:</Typography>
                                            {bdts.map((bdt, index) => (
                                                <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography>{bdt.nom || `BDT #${index + 1}`}</Typography>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() => removeBdt(index)}
                                                    >
                                                        Supprimer
                                                    </Button>
                                                </Box>
                                            ))}
                                            <Divider sx={{ my: 2 }} />
                                        </Grid>
                                    )}

                                    {/* BDT form */}
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Nom du BDT"
                                            name="nom"
                                            value={currentBdt.nom || ''}
                                            onChange={handleBdtChange}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={handleAddBdt}
                                            sx={{ mt: 2 }}
                                            fullWidth
                                        >
                                            Ajouter ce BDT
                                        </Button>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Chantier"}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default CreateChantier;