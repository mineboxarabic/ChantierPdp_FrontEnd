// ViewAllRisques.tsx
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import usePdp from "../../hooks/usePdp.ts";
import { PdpDTO } from "../../utils/entitiesDTO/PdpDTO.ts";

const ListPdps = () => {
    const { getAllPDPs } = usePdp();



    useEffect(() => {

         

    }, []);

    return (
        <>
        

        </>
    )


};

export default ListPdps;
