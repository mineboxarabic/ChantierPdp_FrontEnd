import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {TextField} from "@mui/material";
import AddButtonComponent from "../../components/AddButtonComponent.tsx";
import {DatePicker} from "@mui/x-date-pickers";
import {HorizontalBox, VerticalBox} from "../../components/Layout/Layouts.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Cas from "../../components/static/Cas.tsx";
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RisqueComponent from "../../components/Steps/RisqueComponent.tsx";
import Dispositive from "../../components/Steps/Dispositive.tsx";
const Step5 = () => {
    return (
        <Box sx={{ padding: 3 }}>
            {/* Title Section */}
            <TitleHeading title="ANALYSE DES RISQUES RÉSULTANTS DE LA COACTIVITÉ AVEC DES ENTREPRISES EXTÉRIEURES" severity="error" />

            {/* Table Section */}
            <Box sx={{ overflowX: "auto", mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>DEROULE DES TACHES</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>MOYENS UTILISES</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>RISQUES PREVISIBLES</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>MESURES DE PREVENTION</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>EE</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>EU</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(4)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ border: "1px solid #ccc", height: 50,}}></TableCell>
                                <TableCell sx={{ border: "1px solid #ccc", height: 50,}}></TableCell>
                                <TableCell sx={{ border: "1px solid #ccc", height: 50,}}></TableCell>
                                <TableCell sx={{ border: "1px solid #ccc", height: 50,}}></TableCell>

                                <TableCell align="center" sx={{border: "1px solid #ccc",}}><Checkbox /></TableCell>
                                <TableCell align="center" sx={{border: "1px solid #ccc",}}><Checkbox /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Bottom Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 2,
                    flexWrap: "wrap",
                }}
            >
                <TextField label="PHASE" variant="outlined" size="small" />
                <TextField label="MOYENS UTILISES" variant="outlined" size="small" />
                <TextField label="RISQUES" variant="outlined" multiline minRows={3} />
                <TextField label="MESURES DE PREV." variant="outlined" multiline minRows={3} />
                <Box>
                    <Checkbox />
                    <span>EE</span>
                </Box>
                <Box>
                    <Checkbox />
                    <span>EU</span>
                </Box>
            </Box>


        </Box>
    )
}
export default Step5;