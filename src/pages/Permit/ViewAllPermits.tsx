import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import PermitCard from "../../components/Permit/PermitCard";
import EditPermit from "../../components/Permit/EditPermit";
import usePermit from "../../hooks/usePermit";
import Permit from "../../utils/permit/Permit";

const ViewAllPermits = () => {
    const { getAllPermits } = usePermit();
    const [permits, setPermits] = useState<Permit[]>([]);

    // State for modals
    const [modalState, setModalState] = useState({
        isOpen: false,
        isEdit: false,
        selectedPermit: null as Permit | null,
    });

    useEffect(() => {
        if (!modalState.isOpen) {
            getAllPermits().then((response: Permit[]) => {
                setPermits(response);
            });
        }
    }, [modalState.isOpen]);

    const handleOpenModal = (isEdit: boolean, permit: Permit | null) => {
        setModalState({
            isOpen: true,
            isEdit,
            selectedPermit: permit,
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            isEdit: false,
            selectedPermit: null,
        });
    };

    const renderPermits = () =>
        permits?.length > 0 ? (
            permits.map((permit: Permit) => (
                <Grid key={permit.id} item xs={12} sm={6} md={4} lg={3}>
                    <PermitCard
                        openModal={() => handleOpenModal(true, permit)}
                        setPermit={() => {}}
                        permit={permit}
                    />
                </Grid>
            ))
        ) : (
            <Typography variant="h6" color="text.secondary" textAlign="center">
                No Permits Found
            </Typography>
        );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
                View All Permits
            </Typography>
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(false, null)}
                    sx={{ borderRadius: 4 }}
                >
                    Create Permit
                </Button>
            </Box>

            <EditPermit
                isEdit={modalState.isEdit}
                permit={modalState.selectedPermit}
                setPermit={(updated: Permit | null) => setModalState({ ...modalState, selectedPermit: updated })}
                open={modalState.isOpen}
                setOpen={handleCloseModal}
            />

            <Grid container spacing={2}>
                {renderPermits()}
            </Grid>
        </Box>
    );
};

export default ViewAllPermits;
