// ViewAllUser.tsx
import Grid from "@mui/material/Grid2";
import UserCard from "../../components/User/UserCard";
import useUser from "../../hooks/useUser.ts";
import { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import User from "../../utils/entities/User.ts";
import EditUser from "../../components/User/EditUser";

const ViewAllUser = () => {
    const { getUsers } = useUser();
    const [users, setUsers] = useState<User[]>([]);

    // State for modals
    const [modalState, setModalState] = useState({
        isOpen: false,
        isEdit: false,
        selectedUser: null as User | null,
    });

    useEffect(() => {
        console.log(modalState.isOpen);
        if (!modalState.isOpen) {
            getUsers().then((response: User[]) => {
                setUsers(response);
            });
        }
    }, [modalState.isOpen]);

    const handleOpenModal = (isEdit: boolean, user: User | null) => {
        setModalState({
            isOpen: true,
            isEdit,
            selectedUser: user,
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            isEdit: false,
            selectedUser: null,
        });
    };

    const addUserToState = (newUser: User) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
    };

    const renderUsers = () =>
        users.length > 0 ? (
            users.map((user: User) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={user.id}>
                    <UserCard
                        openModal={() => handleOpenModal(true, user)}
                        setUser={() => {}}
                        user={user}
                    />
                </Grid>
            ))
        ) : (
            <Typography variant="h6" color="text.secondary" textAlign="center">
                No Users Found
            </Typography>
        );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: "bold" }}>
                View All Users
            </Typography>
            <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(false, null)}
                    sx={{ borderRadius: 4 }}
                >
                    Create User
                </Button>
            </Box>

            <EditUser
                user={modalState.selectedUser}
                setUser={(newUser) => {
                    if (!modalState.isEdit) if (newUser) {
                        addUserToState(newUser);
                    }

                }}
                open={modalState.isOpen}
                setOpen={handleCloseModal}
                isEdit={modalState.isEdit}
            />

            <Grid container spacing={3}>{renderUsers()}</Grid>
        </Box>
    );
};

export default ViewAllUser;
