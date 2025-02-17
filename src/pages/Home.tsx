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
import {Pdp} from "../utils/pdp/Pdp.ts";
//https://github.com/mui/material-ui/blob/v6.1.10/docs/data/material/getting-started/templates/dashboard/components/AppNavbar.js

interface DataToDisplay {
    id?: number;
    operation?: string;
    datedebuttravaux?: string;
    datefintravaux?: string;
}


//let rows: DataToDisplay[] = [];
const Home: FC = () => {


    const [modalPdpCreate, setModalPdpCreate] = useState<boolean>(false);
    const [modalPdpCreateResponse, setModalPdpCreateResponse] = useState<boolean>(false);
    const [recentPdps, setRecentPdps] = useState<DataToDisplay[]>([]);
    const {getRecentPdps} = usePdp();


    useEffect(() => {
        if(modalPdpCreateResponse) window.location.href = 'create/pdp';
    }, [modalPdpCreateResponse]);


    useEffect(() => {
        getRecentPdps().then((response:Pdp[]) =>{
            console.log('xx',response);

       /*     for (let i = 0; i < response.length; i++) {
                /!*rows.push({
                    id: response[i].id,
                    operation: response[i].operation,
                    startDate: response[i].datedebuttravaux?.toDateString(),
                    endDate: response[i].datefintravaux?.toDateString()
                })*!/
                setRecentPdps([...recentPdps, {
                    id: response[i].id,
                    operation: response[i].operation,
                    startDate: "",
                    endDate: ""
                }]);

            }*/

            setRecentPdps(response as DataToDisplay[]);

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
                  <Button variant={'contained'} onClick={() => setModalPdpCreateResponse(true)}>Oui</Button>
              </Box>
          </Modal>

        <Section
            title={"Creation :"}
        >
            <ButtonGroup orientation="vertical" variant="contained" aria-label="Basic button group">

                <Button onClick={() => setModalPdpCreate(true)}>
                    Plan de prevention
                </Button>

                <Button>
                    BT
                </Button>

                <Button>
                    Permit
                </Button>

            </ButtonGroup>
            <HorizontalSplit></HorizontalSplit>
        </Section>

        <Section
        title={"Activite :"}
        >

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
                        {recentPdps.map((row) => (
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
                                    <Link href={`/create/pdp/${row.id}/1`}>Voir</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Section>


      </Box>


    );
};

export default Home;