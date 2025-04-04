// UserCard.tsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import  User  from "../../utils/entities/User.ts";
import defaultUserImage from "../../assets/default-user.jpg";
import Box from "@mui/material/Box";
import EditUser from "./EditUser";
import {useEffect, useState} from "react";

interface UserCardProps {
    user: User;
    setUser: (user: User | null) => void;
    key?: number;
    openModal: (e: boolean) => void;
}

const UserCard = ({openModal, user, setUser, key }: UserCardProps) => {
 //   const [isEditModalOpen, setEditModalOpen] = useState(false);





    return (
        <>
            <Card
                key={key}
                sx={{
                    boxShadow: 3,
                    borderRadius: 4,
                    overflow: "hidden",
                    transition: "transform 0.2s",
                    "&:hover": {
                        transform: "scale(1.05)",
                    },
                }}
            >
                <CardMedia
                    component="img"
                    height="140"
                 //   image={user?.image ? `data:${user.image.mimeType};base64,${user.image.imageData}` : defaultUserImage}
                    image={defaultUserImage}
                    alt="User Image"
                />
                <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                        Email: {user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Role: {user.role}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Box sx={{ textAlign: "center", width: "100%" }}>
                        <Button
                            onClick={() => openModal(true)}
                            size="small"
                            variant="contained"
                            sx={{ borderRadius: 2 }}
                        >
                            Edit
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </>
    );
};

export default UserCard;
