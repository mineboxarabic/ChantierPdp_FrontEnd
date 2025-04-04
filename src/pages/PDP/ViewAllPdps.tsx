// ViewAllRisques.tsx
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import usePdp from "../../hooks/usePdp.ts";
import {Pdp} from "../../utils/entities/Pdp.ts";
import PdpDataGrid from "../../components/Pdp/PdpDataGrid.tsx";

const ViewAllPdps = () => {
    const { getAllPDPs } = usePdp();
    const [pdps, setPdps] = useState<Pdp[]>([]);



    useEffect(() => {

            getAllPDPs().then((response: Pdp[]) => {
                setPdps(response);
            });

    }, []);

    return (
        <>
            <Box sx={{width:"100%"}}>
                <Typography variant="h4" color="text.primary" textAlign="center">
                    All PDPs
                </Typography>
                <Grid container spacing={2}>
                    {pdps.length > 0 ? (
               <PdpDataGrid pdps={pdps} />
                    ) : (
                        <Typography variant="h6" color="text.secondary" textAlign="center">
                            No Pdps Found
                        </Typography>
                    )}
                </Grid>
            </Box>

        </>
    )


};

export default ViewAllPdps;
