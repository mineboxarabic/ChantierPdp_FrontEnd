import React, { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { BdtDTO } from '../utils/entitiesDTO/BdtDTO';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO';
import DispositifDTO from '../utils/entitiesDTO/DispositifDTO';
import { LocalisationDTO } from '../utils/entitiesDTO/LocalisationDTO';
import { UserDTO } from '../utils/entitiesDTO/UserDTO';
import { AnalyseDeRisqueDTO } from '../utils/entitiesDTO/AnalyseDeRisqueDTO';
import { AuditSecuDTO } from '../utils/entitiesDTO/AuditSecuDTO';
import { useNotifications } from '@toolpad/core/useNotifications';
import BDT_Page_New from '../PDF/BDT_Page_New';
import { SignatureResponseDTO } from './useDocument';

export const useBdtPdfGeneration = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const notifications = useNotifications();

    const generateBdtPdf = useCallback(async (
        bdtData: BdtDTO, 
        chantierData?: any, 
        entrepriseData?: any,
        allRisksMap?: Map<number, RisqueDTO>,
        allDispositifsMap?: Map<number, DispositifDTO>,
        localisationsMap?: Map<number, LocalisationDTO>,
        usersMap?: Map<number, UserDTO>,
        allAnalysesMap?: Map<number, AnalyseDeRisqueDTO>,
        allAuditsMap?: Map<number, AuditSecuDTO>,
        signatures?: SignatureResponseDTO[],
        action: 'download' | 'print' | 'preview' = 'download'
    ) => {
        setIsGenerating(true);
        try {
            const blob = await pdf(
                <BDT_Page_New
                    currentBdt={bdtData}
                    chantierData={chantierData}
                    entrepriseData={entrepriseData}
                    allRisksMap={allRisksMap}
                    allDispositifsMap={allDispositifsMap}
                    localisationsMap={localisationsMap}
                    usersMap={usersMap}
                    allAnalysesMap={allAnalysesMap}
                    allAuditsMap={allAuditsMap}
                    signatures={signatures}
                />
            ).toBlob();
            
            const filename = `BDT_${bdtData.nom || bdtData.id}_${new Date().toISOString().split('T')[0]}.pdf`;
            
            switch (action) {
                case 'download': {
                    // Create download link
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    
                    notifications.show('PDF téléchargé avec succès', { severity: 'success' });
                    break;
                }
                    
                case 'print': {
                    const printUrl = URL.createObjectURL(blob);
                    const printWindow = window.open(printUrl, '_blank');
                    if (printWindow) {
                        printWindow.onload = () => {
                            printWindow.print();
                            setTimeout(() => {
                                printWindow.close();
                                URL.revokeObjectURL(printUrl);
                            }, 1000);
                        };
                    }
                    break;
                }
                    
                case 'preview': {
                    const previewUrl = URL.createObjectURL(blob);
                    window.open(previewUrl, '_blank');
                    break;
                }
            }
            
            return blob;
        } catch (error) {
            console.error('Error generating BDT PDF:', error);
            notifications.show('Erreur lors de la génération du PDF', { severity: 'error' });
            throw error;
        } finally {
            setIsGenerating(false);
        }
    }, [notifications]);

    return {
        generateBdtPdf,
        isGenerating
    };
};
