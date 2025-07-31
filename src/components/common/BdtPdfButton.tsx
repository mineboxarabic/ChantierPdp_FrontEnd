import React, { useState } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    SxProps,
    Theme,
} from '@mui/material';
import {
    PictureAsPdf as PdfIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Preview as PreviewIcon,
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { BdtDTO } from '../../utils/entitiesDTO/BdtDTO';
import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO';
import { AnalyseDeRisqueDTO } from '../../utils/entitiesDTO/AnalyseDeRisqueDTO';
import { AuditSecuDTO } from '../../utils/entitiesDTO/AuditSecuDTO';
import { useBdtPdfGeneration } from '../../hooks/useBdtPdfGeneration';

interface BdtPdfButtonProps {
    bdtData: BdtDTO;
    chantierData?: any;
    entrepriseData?: any;
    allRisksMap?: Map<number, RisqueDTO>;
    allAnalyseDeRisque?: Map<number, AnalyseDeRisqueDTO>;
    allAudits?: Map<number, AuditSecuDTO>;
    variant?: 'contained' | 'outlined' | 'text';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    sx?: SxProps<Theme>;
}

const BdtPdfButton: React.FC<BdtPdfButtonProps> = ({
    bdtData,
    chantierData,
    entrepriseData,
    allRisksMap,
    allAnalyseDeRisque,
    allAudits,
    variant = 'contained',
    size = 'medium',
    disabled = false,
    sx
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { generateBdtPdf, isGenerating } = useBdtPdfGeneration();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAction = async (action: 'download' | 'print' | 'preview') => {
        handleClose();
        
        try {
            await generateBdtPdf(
                bdtData, 
                chantierData, 
                entrepriseData, 
                allRisksMap, 
                allAnalyseDeRisque,
                allAudits,
                action
            );
        } catch (error) {
            console.error('BDT PDF generation failed:', error);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                startIcon={isGenerating ? <CircularProgress size={16} /> : <PdfIcon />}
                endIcon={<ExpandMoreIcon />}
                onClick={handleClick}
                disabled={disabled || isGenerating}
                sx={{ minWidth: 120, ...sx }}
            >
                {isGenerating ? 'Génération...' : 'PDF BDT'}
            </Button>
            
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleAction('preview')}>
                    <ListItemIcon>
                        <PreviewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Aperçu</ListItemText>
                </MenuItem>
                
                <MenuItem onClick={() => handleAction('download')}>
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Télécharger</ListItemText>
                </MenuItem>
                
                <MenuItem onClick={() => handleAction('print')}>
                    <ListItemIcon>
                        <PrintIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Imprimer</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default BdtPdfButton;
