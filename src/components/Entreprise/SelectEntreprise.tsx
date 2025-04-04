import { Select, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useEntreprise from "../../hooks/useEntreprise.ts";
import { Entreprise } from "../../utils/entities/Entreprise.ts";

interface SelectEntrepriseProps {
    selectedEntrepriseId: number | null;
    onSelectEntreprise: (entreprise: Entreprise | null) => void;
    entreprises: Entreprise[];

    label?: string;
}

const SelectEntreprise = ({
                              selectedEntrepriseId,
                              onSelectEntreprise,
                              label = "Select an Entreprise",
    entreprises
                          }: SelectEntrepriseProps) => {


    return (
        <>
            {label && <Typography variant="subtitle1">{label}</Typography>}
            <Select
                fullWidth
                displayEmpty
                variant="outlined"
                value={selectedEntrepriseId || ""}
                onChange={(e) => {
                    const selectedId = e.target.value === "" ? null : Number(e.target.value);
                    const selectedEntreprise = entreprises.find(
                        (entreprise) => entreprise.id === selectedId
                    ) || null;
                    onSelectEntreprise(selectedEntreprise);
                }}
            >
                <MenuItem value="">Select an Entreprise</MenuItem>
                {entreprises.map((entreprise) => (
                    <MenuItem key={entreprise.id} value={entreprise.id}>
                        {`${entreprise.nom || "No Name"} (${entreprise.id})`}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
};

export default SelectEntreprise;
