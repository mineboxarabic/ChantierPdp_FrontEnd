import {FC, useEffect, useState} from "react";
import {
    Box,
    ButtonGroup,
    Link,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Button from "@mui/material/Button";
import Section from "../components/Section.tsx";
import {HorizontalSplit} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import usePdp from "../hooks/usePdp.ts";
import {Pdp} from "../utils/entities/Pdp.ts";
import {useNavigate} from 'react-router-dom'
import {PdpDTO} from "../utils/entitiesDTO/PdpDTO.ts";
import CircularProgress from '@mui/material/CircularProgress';
import useBdt from "../hooks/useBdt.ts";
import {BDT} from "../utils/entities/BDT.ts";
import {useAuth} from "../hooks/useAuth.tsx";
import useChantier from "../hooks/useChantier.ts";
import Chantier from "../utils/entities/Chantier.ts";
import {getRoute} from "../Routes.tsx";
import ChantierDTO from "../utils/entitiesDTO/ChantierDTO.ts";

interface DataToDisplay {
    id?: number;
    operation?: string;
    datedebuttravaux?: string;
    datefintravaux?: string;
}

const Home: FC = () => {
    const navigate = useNavigate();

    const [modalPdpCreate, setModalPdpCreate] = useState<boolean>(false);
    const [modalPdpCreateResponse, setModalPdpCreateResponse] = useState<boolean>(false);
    const [recentPdps, setRecentPdps] = useState<DataToDisplay[]>([]);

    const [modalBdtCreate, setModalBdtCreate] = useState<boolean>(false);
    const [modalBdtCreateResponse, setModalBdtCreateResponse] = useState<boolean>(false);
    const [recentBdts, setRecentBdts] = useState<DataToDisplay[]>([]);


    const {loading, getRecentPdps, getLastId:getPdpLastId, createPdp, getPlanDePrevention} = usePdp();
    const {loading:loadingBDT, getAllBDTs, createBDT} = useBdt();
    const {loading:loadingChantier, getRecentChantiers, createChantier, toChantier} = useChantier();

    // Added for Chantier
    const [recentChantiers, setRecentChantiers] = useState<Chantier[]>([]);

    const {connectedUser} = useAuth();

    useEffect(() => {

        }, []);


    async function createBdtAndRedirect() {
        const createdBdt:BDT = await createBDT(BDT.createEmpty() as BDT);
        console.log('createdBdt', createdBdt);
        navigate(`/create/bdt/${(createdBdt?.id as number )}/1`);
    }

    useEffect(() => {

        getRecentChantiers().then((response: ChantierDTO[]) => {
            Promise.all(response).then(chantiers => {
                setRecentChantiers(chantiers as Chantier[]);
            });
        });
    }, []);

    return (
        <Box sx={{width:"100%"}}>
            <Modal
                open={modalPdpCreate}
                onClose={() => setModalPdpCreate(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #444',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Voulez vous cree un nouveau PDP ?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    </Typography>

                    <Button  onClick={() => setModalPdpCreate(false)}>Non</Button>
                    <Button variant={'contained'}>Oui</Button>
                </Box>
            </Modal>
            <Modal
                open={modalBdtCreate}
                onClose={() => setModalBdtCreate(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #444',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Voulez vous cree un nouveau BDT ?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    </Typography>

                    <Button  onClick={() => setModalBdtCreate(false)}>Non</Button>
                    <Button variant={'contained'} onClick={() => createBdtAndRedirect()}>Oui</Button>
                </Box>
            </Modal>

            <Section
                title={"Creation :"}
            >
                <ButtonGroup orientation="vertical" variant="contained" aria-label="Basic button group">
                    <Button onClick={() =>{
                        window.location.href = '/create/chantier'
                    }}>
                        Chantier
                    </Button>

                    <Button onClick={() => setModalPdpCreate(true)}>
                        Plan de prevention
                    </Button>

                    <Button onClick={() => setModalBdtCreate(true)}>
                        BT
                    </Button>

                    <Button>
                        Permit
                    </Button>
                </ButtonGroup>
                <HorizontalSplit></HorizontalSplit>
            </Section>

            {/* Recent Chantiers Section */}
            <Section title={"Chantiers récents :"}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="chantier table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Nom</TableCell>
                                <TableCell>Operation</TableCell>
                                <TableCell align="right">Date Début</TableCell>
                                <TableCell align="right">Date Fin</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentChantiers && recentChantiers.length > 0 && recentChantiers.map((chantier) => (
                                <TableRow
                                    key={chantier.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {chantier.id}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {chantier.nom}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {chantier.operation}
                                    </TableCell>
                                    <TableCell align="right">
                                        {chantier.dateDebut instanceof Date
                                            ? chantier.dateDebut.toLocaleDateString()
                                            : chantier.dateDebut ? new Date(chantier.dateDebut).toLocaleDateString() : ''}
                                    </TableCell>
                                    <TableCell align="right">
                                        {chantier.dateFin instanceof Date
                                            ? chantier.dateFin.toLocaleDateString()
                                            : chantier.dateFin ? new Date(chantier.dateFin).toLocaleDateString() : ''}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link href={`/view/chantier/${chantier.id}`}>Voir</Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!recentChantiers || recentChantiers.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Pas de chantiers récents</TableCell>
                                </TableRow>
                            )}
                            {loadingChantier && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Section>

            <Section title={"PDP récents :"}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Operation</TableCell>
                                <TableCell align="right">Date deput de travaux</TableCell>
                                <TableCell align="right">Date fin de travaux</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentPdps && recentPdps.length > 0 && recentPdps.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.operation}
                                    </TableCell>
                                    <TableCell align="right">{row.datedebuttravaux}</TableCell>
                                    <TableCell align="right">{row.datefintravaux}</TableCell>
                                    <TableCell align="right">
                                        <Link href={getRoute('VIEW_PDP', {id: row.id})}>Voir</Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {
                                !recentPdps &&(
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">Pas de PDP</TableCell>
                                    </TableRow>
                                )
                            }
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Section>
        </Box>
    );
};

export default Home;