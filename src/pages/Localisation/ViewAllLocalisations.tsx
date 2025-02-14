import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import LocalisationCard from "../../components/Localisation/LocalisationCard";
import EditLocalisation from "../../components/Localisation/EditLocalisation";
import useLocalisation from "../../hooks/useLocalisation";
import Localisation from "../../utils/Localisation/Localisation";

const ViewAllLocalisations = () => {
    const { getAllLocalisations } = useLocalisation();
    const [localisations, setLocalisations] = useState<Localisation[]>([]);

    // State for modals
    const [modalState, setModalState] = useState({
        isOpen: false,
        isEdit: false,
        selectedLocalisation: null as Localisation | null,
    });

    useEffect(() => {
        if (!modalState.isOpen) {
            getAllLocalisations().then((response: Localisation[]) => {
                setLocalisations(response);
            });
        }
    }, [modalState.isOpen]);

    const handleOpenModal = (isEdit: boolean, localisation: Localisation | null) => {
        setModalState({
            isOpen: true,
            isEdit,
            selectedLocalisation: localisation,
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            isEdit: false,
            selectedLocalisation: null,
        });
    };

    const renderLocalisations = () =>
        localisations?.length > 0 ? (
            localisations.map((localisation: Localisation) => (
                <Grid key={localisation.id} item xs={12} sm={6} md={4} lg={3}>
                    <LocalisationCard
                        openModal={() => handleOpenModal(true, localisation)}
                        localisation={localisation}
                    />
                </Grid>
            ))
        ) : (
            <Typography variant="h6" color="text.secondary" textAlign="center">
                No Localisations Found
            </Typography>
        );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
                View All Localisations
            </Typography>
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(false, null)}
                    sx={{ borderRadius: 4 }}
                >
                    Create Localisation
                </Button>
            </Box>

            <EditLocalisation
                isEdit={modalState.isEdit}
                localisation={modalState.selectedLocalisation}
                setLocalisation={(updated: Localisation | null) =>
                    setModalState({ ...modalState, selectedLocalisation: updated })
                }
                open={modalState.isOpen}
                setOpen={handleCloseModal}
            />

            <Grid container spacing={2}>
                {renderLocalisations()}
            </Grid>
        </Box>
    );
};

export default ViewAllLocalisations;
