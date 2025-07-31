// Example usage in ViewBdt.tsx or EditCreateBdt.tsx

import BdtPdfButton from '../../components/common/BdtPdfButton';

// In your component where you want to add the PDF button:

const ExampleBdtViewComponent = () => {
    const [bdtData, setBdtData] = useState<BdtDTO | null>(null);
    const [chantierData, setChantierData] = useState<any>(null);
    const [entrepriseData, setEntrepriseData] = useState<any>(null);

    // ... your existing code to load BDT, chantier, and entreprise data

    return (
        <Box>
            {/* Your existing header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Bon de Travail</Typography>
                
                {/* Add the PDF button here */}
                {bdtData && (
                    <BdtPdfButton 
                        bdtData={bdtData}
                        chantierData={chantierData}
                        entrepriseData={entrepriseData}
                        variant="contained"
                        size="medium"
                    />
                )}
            </Box>
            
            {/* Rest of your component */}
        </Box>
    );
};

// Or integrate it into your BaseDocumentEditCreate component by adding it to the toolbar:

// In EditCreateBdt.tsx, you can add it to the header actions:
const handlePdfGeneration = useCallback(async (action: 'download' | 'print' | 'preview') => {
    if (!formData.id) {
        notifications.show('Veuillez sauvegarder le BDT avant de générer le PDF', { severity: 'warning' });
        return;
    }
    
    // You might need to fetch related data if not already available
    const chantier = formData.chantier ? await getChantier(formData.chantier) : null;
    const entreprise = formData.entrepriseExterieure ? await getEntreprise(formData.entrepriseExterieure) : null;
    
    await generateBdtPdf(formData, chantier, entreprise, action);
}, [formData, generateBdtPdf, notifications]);

export default ExampleBdtViewComponent;
