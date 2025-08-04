import React, { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { BdtDTO } from '../utils/entitiesDTO/BdtDTO';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO';
import { AnalyseDeRisqueDTO } from '../utils/entitiesDTO/AnalyseDeRisqueDTO';
import { AuditSecuDTO } from '../utils/entitiesDTO/AuditSecuDTO';
import BdtPageModern from '../PDF/BDT_Page_Modern'; // Updated to use the modern dynamic PDF
import { useNotifications } from '@toolpad/core/useNotifications';

export const useBdtPdfGeneration = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const notifications = useNotifications();

    const generateBdtPdf = useCallback(async (
        bdtData: BdtDTO, 
        chantierData?: any, 
        entrepriseData?: any,
        allRisksMap?: Map<number, RisqueDTO>,
        allAnalyseDeRisque?: Map<number, AnalyseDeRisqueDTO>,
        allAudits?: Map<number, AuditSecuDTO>,
        action: 'download' | 'print' | 'preview' = 'download'
    ) => {
        setIsGenerating(true);
        try {
            const blob = await pdf(
                <BdtPageModern 
                    currentBdt={bdtData}
                    chantierData={chantierData}
                    entrepriseData={entrepriseData}
                    allRisksMap={allRisksMap}
                    allAnalyseDeRisque={allAnalyseDeRisque}
                    allAudits={allAudits}
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
