// ViewAllRisques.tsx
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import RisqueCard from "../../components/Risque/RisqueCard";
import EditRisque from "../../components/Risque/EditRisque";
import useRisque from "../../hooks/useRisque";
import  Risque  from "../../utils/Risque/Risque";

const ViewAllRisques = () => {
    const { getAllRisques } = useRisque();
    const [risques, setRisques] = useState<Risque[]>([]);

    // State for modals
    const [modalState, setModalState] = useState({
        isOpen: false,
        isEdit: false,
        selectedRisque: null as Risque | null,
    });

    useEffect(() => {
        if (!modalState.isOpen) {
            getAllRisques().then((response: Risque[]) => {
                setRisques(response);
            });
        }
    }, [modalState.isOpen]);

    const handleOpenModal = (isEdit: boolean, risque: Risque | null) => {
        setModalState({
            isOpen: true,
            isEdit,
            selectedRisque: risque,
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            isEdit: false,
            selectedRisque: null,
        });
    };

    const renderRisques = () =>
        risques?.length > 0 ? (
            risques.map((risque: Risque) => (
                <Grid key={risque.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <RisqueCard
                        openModal={() => handleOpenModal(true, risque)}
                        setRisque={() => {}}
                        risque={risque}
                    />
                </Grid>
            ))
        ) : (
            <Typography variant="h6" color="text.secondary" textAlign="center">
                No Risques Found
            </Typography>
        );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
                View All Risques
            </Typography>
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(false, null)}
                    sx={{ borderRadius: 4 }}
                >
                    Create Risque
                </Button>
            </Box>

            <EditRisque
                isEdit={modalState.isEdit}
                risque={modalState.selectedRisque}
                setRisque={(updated: Risque | null) => setModalState({ ...modalState, selectedRisque: updated })}
                open={modalState.isOpen}
                setOpen={handleCloseModal}
            />

            <Grid container spacing={2}>
                {renderRisques()}
            </Grid>
        </Box>
    );
};

export default ViewAllRisques;
