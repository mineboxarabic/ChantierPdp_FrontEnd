// ViewAllEntreprises.tsx
import Grid from "@mui/material/Grid2";
import EntrepriseCard from "../../components/Entreprise/EntrepriseCard";
import { Entreprise } from "../../utils/entities/Entreprise.ts";
import useEntreprise from "../../hooks/useEntreprise.ts";
import { useEffect, useState } from "react";
import EditEntreprise from "../../components/Entreprise/EditEntreprise.tsx";
import { Button, Typography, Box } from "@mui/material";

const ViewAllEntreprises = () => {
    const { getAllEntreprises } = useEntreprise();
    const [entreprises, setEntreprises] = useState<Entreprise[]>([]);

    // State for modals
    const [modalState, setModalState] = useState({
        isOpen: false,
        isEdit: false,
        selectedEntreprise: null as Entreprise | null,
    });

    useEffect(() => {
        if (!modalState.isOpen) {
            getAllEntreprises().then((response: Entreprise[]) => {
                setEntreprises(response);
            });
        }
    }, [modalState.isOpen]);

    const handleOpenModal = (isEdit: boolean, entreprise: Entreprise | null) => {
        setModalState({
            isOpen: true,
            isEdit,
            selectedEntreprise: entreprise,
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            isEdit: false,
            selectedEntreprise: null,
        });
    };

    const renderEntreprises = () =>
        entreprises.length > 0 ? (
            entreprises.map((entreprise: Entreprise) => (
                <Grid key={entreprise.id}  size={{xs:12, sm:6, md:4, lg:3}}>
                    <EntrepriseCard
                        openModal={() => handleOpenModal(true, entreprise)}
                        setEntreprise={() => {}}
                        entreprise={entreprise}
                    />
                </Grid>
            ))
        ) : (
            <Typography variant="h6" color="text.secondary" textAlign="center">
                No Entreprises Found
            </Typography>
        );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
                View All Entreprises
            </Typography>
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(false, null)}
                    sx={{ borderRadius: 4 }}
                >
                    Create Entreprise
                </Button>
            </Box>

            <EditEntreprise
                isEdit={modalState.isEdit}
                entreprise={modalState.selectedEntreprise}
                setEntreprise={(updated: Entreprise | null) => setModalState({ ...modalState, selectedEntreprise: updated })}
                open={modalState.isOpen}
                setOpen={handleCloseModal}
            />

            <Grid container spacing={3}>
                {renderEntreprises()}
            </Grid>
        </Box>
    );
};

export default ViewAllEntreprises;
