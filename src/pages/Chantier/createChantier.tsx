import React, {useEffect, useState } from "react";
import {
    TextField, Button, Container, Typography, Paper, MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import useChantier from "../../hooks/useChantier"; // Adjust the path if needed
import Chantier from "../../utils/Chantier/Chantier.ts";
import { useNotifications } from "@toolpad/core/useNotifications";
import { Entreprise } from "../../utils/entreprise/Entreprise";
import User from "../../utils/user/User";
import Localisation from "../../utils/Localisation/Localisation.ts";
import SelectEntreprise from "../../components/Entreprise/SelectEntreprise.tsx";
import useUser from "../../hooks/useUser.ts";
import useEntreprise from "../../hooks/useEntreprise.ts";
import useLocalisation from "../../hooks/useLocalisation.ts";

const CreateChantier: React.FC = () => {
    const { createChantier, loading } = useChantier();
    const { getUsers } = useUser();
    const {getAllEntreprises} = useEntreprise();
    const {getAllLocalisations} = useLocalisation();
    const notifications = useNotifications();

    const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [localisations, setLocalisations] = useState<Localisation[]>([]);


    const [isAnuelle, setIsAnuelle] = useState<boolean>(false);


    useEffect(() => {
        getAllEntreprises().then((data) => {
            setEntreprises(data);
        });

        getUsers().then((data) => {
            setUsers(data);
        });

        getAllLocalisations().then((data) => {
            setLocalisations(data);
        });

    }, []);



    const [chantier, setChantier] = useState<Partial<Chantier>>({
        nom: "",
        entrepriseExterieur: {} as Entreprise,
        responsable: {} as User,
        localisation: {} as Localisation,
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChantier({ ...chantier, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
    console.log("chantier",chantier);
        if (!chantier.nom || !chantier.entrepriseExterieur || !chantier.responsable || !chantier.localisation) {
            notifications.show("Please fill in all required fields!", { severity: "error" });
            return;
        }

        try {
            await createChantier(chantier as Chantier);
            notifications.show("Chantier created successfully!", { severity: "success" });
        } catch (error) {
            notifications.show("Error creating chantier!", { severity: "error" });
        }
    };

    function checkDates(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {


        if(e.target.name === "nbHeurs" && Number(e.target.value) > 400) {
            setIsAnuelle(true);
        }else{
            setIsAnuelle(false);
        }

        if(e.target.name === "dateDebut" || e.target.name === "dateFin") {
            const dateDebut:Date = new Date(e.target.value);
            const dateFin :Date= new Date(e.target.value);
            if (dateFin.getFullYear() - dateDebut.getFullYear() === 1) {
                setIsAnuelle(true);
            }
        }


    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Create New Chantier {isAnuelle && "Aneulle (Avec PDP)"}
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            label="Chantier Name"
                            name="nom"
                            value={chantier.nom}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={chantier.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                    </Grid>


                    {/*Make two date pickers for dateDeput and dateFin*/}

                    <Grid size={{xs:12, md:6}}>
                        <TextField
                            fullWidth
                            label="Date Debut"
                            name="dateDebut"
                            value={chantier.dateDebut}
                            onChange={(e)=>{
                                handleChange(e)
                                checkDates(e);
                            }}
                            type="date"
                        />

                    </Grid>

                    <Grid size={{xs:12, md:6}}>
                        <TextField
                            fullWidth
                            label="Date Fin"
                            name="dateFin"
                            value={chantier.dateFin}
                            onChange={(e)=>{
                                handleChange(e)
                                checkDates(e);
                            }}
                            type="date"
                        />
                    </Grid>

                    <Grid size={{xs:12, md:6}}>
                        <TextField
                            fullWidth
                            label={"Nombre d'heurs"}
                            name="nbHeurs"
                            value={chantier.nbHeurs}
                            onChange={(e)=>{
                                handleChange(e);
                              checkDates(e);
                            }
                        }
                            type="number"
                        />
                    </Grid>

                    {/* Example dropdowns - You might replace these with API-fetched values */}
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            select
                            label="Entreprise Exterieure"
                            name="entrepriseExterieur"
                            value={chantier.entrepriseExterieur?.id || ""}
                            onChange={(e) => setChantier({ ...chantier, entrepriseExterieur: { id: Number(e.target.value) } as Entreprise })}
                        >

                            {entreprises.map((entreprise) => (
                                <MenuItem key={entreprise.id} value={entreprise.id}>
                                    {entreprise.nom}
                                </MenuItem>
                            ))}

                        </TextField>
                    </Grid>

                    <Grid size={{xs:12, md:6}}>
                        <TextField
                            fullWidth
                            select
                            label="Responsable"
                            name="responsable"
                            value={chantier.responsable?.id || ""}
                            onChange={(e) => setChantier({ ...chantier, responsable: { id: Number(e.target.value) } as User })}
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{xs:12, md:6}}>
                        <TextField
                            fullWidth
                            select
                            label="Localisation"
                            name="localisation"
                            value={chantier.localisation?.id || ""}
                            onChange={(e) => setChantier({ ...chantier, localisation: { id: Number(e.target.value) } as Localisation })}
                        >
                            {
                                localisations.map((localisation) => (
                                    <MenuItem key={localisation.id} value={localisation.id}>
                                        {localisation.nom}
                                    </MenuItem>
                                ))
                            }
                        </TextField>
                    </Grid>

                    <Grid size={{xs:12}}>
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
