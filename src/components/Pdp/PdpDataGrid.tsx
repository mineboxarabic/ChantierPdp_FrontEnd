import { Paper, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Pdp } from "../../utils/pdp/Pdp.ts";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog.tsx";
import {useState} from "react";
import usePdp from "../../hooks/usePdp.ts";

const PdpDataGrid = ({ pdps }: { pdps: Pdp[]}) => {

    const {deletePdp} = usePdp();
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID',  maxWidth: 100, minWidth: 100 },
        { field: 'operation', headerName: 'Operation', editable: true ,width: 250},
        { field: 'dateDebutTravaux', headerName: 'Date debut de travaux', width: 250, editable: true },
        { field: 'dateFinTravaux', headerName: 'Date fin de travaux', width: 250, editable: true },
        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => {
                        window.location.href = `/create/pdp/${params.row.id}/1`;
                    }} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() =>

                        {
                            setCurrentId(params.row.id as number);
                            setOpenDialog(true);
                        }

                    } color="error">
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    const rows = pdps.map((pdp: Pdp) => ({
        id: pdp.id,
        operation: pdp.operation,
        dateDebutTravaux: pdp.datedebuttravaux,
        dateFinTravaux: pdp.datefintravaux,
    }));




    const handleConfirmDelete = () => {
        deletePdp(currentId as number);
        setOpenDialog(false);
    };

    return (
        <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 , width: '100%'}}
            />

            <ConfirmDeleteDialog open={openDialog} onClose={setOpenDialog} onConfirm={handleConfirmDelete} />
        </Paper>
    );
};

export default PdpDataGrid;
