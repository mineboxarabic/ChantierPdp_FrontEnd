import { Box, Card, Checkbox, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip, IconButton } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DispositifDTO from "../../utils/entitiesDTO/DispositifDTO";
import { ObjectAnsweredDTO } from "../../utils/entitiesDTO/ObjectAnsweredDTO";
import { ParentOfRelations } from "../Interfaces";
import SecurityIcon from '@mui/icons-material/Security'; // For Dispositifs
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface DispositifCardProps<PARENT extends ParentOfRelations> {
    object: ObjectAnsweredDTO;
    saveParent: (updatedParent: PARENT) => void;
    parent: PARENT;
    setIsChanged: (changed: boolean) => void;
    itemData: DispositifDTO;
    onDeleteRelationFromItem: () => void;
    onUpdateRelationFieldFromItem: (relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => void;
}

const DispositifCard = <PARENT extends ParentOfRelations>({
    object,
    saveParent,
    parent,
    setIsChanged,
    itemData,
    onDeleteRelationFromItem,
    onUpdateRelationFieldFromItem
}: DispositifCardProps<PARENT>) => {

    const [openDialog, setOpenDialog] = useState(false);
    const [checked, setChecked] = useState(object.answer ? true : false);

    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        setOpenDialog(false);
        if (onDeleteRelationFromItem) {
            onDeleteRelationFromItem();
        }
    };

    const onCheckChange = (value: boolean) => {
        setChecked(value);
        if (onUpdateRelationFieldFromItem) {
            onUpdateRelationFieldFromItem(object.id!, 'answer', value);
        } else {
            const currentArrayofObjects = parent.relations as ObjectAnsweredDTO[];
            const newArrayofObjects = currentArrayofObjects?.map((p: ObjectAnsweredDTO) => {
                if (p.id === object.id) {
                    return {
                        ...p,
                        answer: value,
                    };
                }
                return p;
            });
            saveParent({
                ...parent,
                relations: newArrayofObjects,
            });
            setIsChanged(true);
        }
    };

    return (
        <Box display={"flex"} alignItems={'flex-start'} width={'100%'} justifyContent={'space-between'} sx={{ mb: 2 }}>
            <Card
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: 'all 0.3s ease-in-out',
                    border: checked ? '2px solid #4CAF50' : '2px solid transparent',
                    '&:hover': {
                        boxShadow: 8,
                        transform: 'translateY(-2px)',
                    },
                }}
            >
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '20px',
                    flexGrow: 1,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SecurityIcon color="primary" sx={{ mr: 1.5, fontSize: '2rem' }} />
                            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {itemData?.title || 'Dispositif Inconnu'}
                            </Typography>
                        </Box>
                        <Checkbox
                            checked={checked}
                            onChange={e => onCheckChange(e.target.checked)}
                            icon={<RadioButtonUncheckedIcon color="action" />}
                            checkedIcon={<CheckCircleOutlineIcon color="success" />}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    </Box>

                    {itemData?.type && (
                        <Chip
                            label={itemData.type}
                            color={itemData.type === 'EPI' ? 'info' : 'success'}
                            size="medium"
                            sx={{ alignSelf: 'flex-start', mb: 1, fontWeight: 'bold' }}
                        />
                    )}

                    {itemData?.description && (
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
                            {itemData.description}
                        </Typography>
                    )}

                    {itemData?.logo?.imageData && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <img
                                src={`data:${itemData.logo.mimeType};base64,${itemData.logo.imageData}`}
                                alt={itemData.title || 'Dispositif Image'}
                                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                            />
                        </Box>
                    )}

                </CardContent>
            </Card>

            <IconButton
                color={"error"}
                onClick={handleDeleteClick}
                sx={{
                    ml: 1,
                    mt: 1, // Align with the top of the card
                    p: 1, // Padding for the icon button
                    borderRadius: '50%',
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': {
                        bgcolor: 'error.light',
                        color: 'white',
                    },
                }}
            >
                <RemoveCircleIcon fontSize="large" />
            </IconButton>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DispositifCard;