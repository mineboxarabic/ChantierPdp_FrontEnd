import React from 'react';
import { Document, View, StyleSheet, Text, Image } from '@react-pdf/renderer';
import { BdtDTO } from "../utils/entitiesDTO/BdtDTO.ts";
import CustomPage from "./components/Page.tsx";
import { EntrepriseDTO } from '../utils/entitiesDTO/EntrepriseDTO.ts';
import { ChantierDTO } from '../utils/entitiesDTO/ChantierDTO.ts';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO.ts';
import DispositifDTO from "../utils/entitiesDTO/DispositifDTO.ts";
import { LocalisationDTO } from '../utils/entitiesDTO/LocalisationDTO.ts';
import { UserDTO } from '../utils/entitiesDTO/UserDTO.ts';
import { AnalyseDeRisqueDTO } from '../utils/entitiesDTO/AnalyseDeRisqueDTO.ts';
import { AuditSecuDTO } from '../utils/entitiesDTO/AuditSecuDTO.ts';
import ObjectAnsweredObjects from '../utils/ObjectAnsweredObjects.ts';
import { ObjectAnsweredDTO } from '../utils/entitiesDTO/ObjectAnsweredDTO.ts';
import AuditType from '../utils/AuditType.ts';
import { SignatureResponseDTO } from '../hooks/useDocument.ts';

const styles = StyleSheet.create({
    // Header styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20,
        marginBottom: 20,
        borderBottom: '2 solid #0066cc',
    },
    headerLeft: {
        width: '20%',
        alignItems: 'center',
    },
    headerCenter: {
        width: '50%',
        alignItems: 'center',
    },
    headerRight: {
        width: '30%',
        alignItems: 'flex-end',
    },
    logo: {
        width: 80,
        height: 40,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0066cc',
        textAlign: 'center',
        lineHeight: 1.3,
    },
    bdtNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'right',
    },
    
    // Section styles
    section: {
        marginBottom: 0, // Remove bottom margin
        border: '1 solid #cccccc',
        backgroundColor: '#f9f9f9',
        break: false, // Prevent breaking sections across pages
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: '#0066cc',
        color: '#ffffff',
        padding: 8,
        textAlign: 'center',
        orphans: 2,
        widows: 2,
    },
    sectionContent: {
        padding: 12,
        marginLeft: 10, // Add left margin
        marginRight: 10, // Add right margin
    },
    
    // Entreprises section styles
    entreprisesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    entrepriseColumn: {
        width: '48%',
        border: '1 solid #dddddd',
        backgroundColor: '#ffffff',
        padding: 10,
    },
    entrepriseTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0066cc',
        marginBottom: 8,
        textAlign: 'center',
        backgroundColor: '#e6f3ff',
        padding: 4,
    },
    fieldRow: {
        flexDirection: 'row',
        marginBottom: 6,
        alignItems: 'flex-start',
    },
    fieldLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#333333',
        width: '40%',
        marginRight: 5,
    },
    fieldValue: {
        fontSize: 9,
        color: '#000000',
        flex: 1,
        borderBottom: '1 solid #cccccc',
        paddingBottom: 2,
        minHeight: 12,
    },
    fieldValueEmpty: {
        fontSize: 9,
        color: '#999999',
        flex: 1,
        borderBottom: '1 solid #cccccc',
        paddingBottom: 2,
        minHeight: 12,
        fontStyle: 'italic',
    },
    
    // Daily review section styles
    dailyReviewField: {
        marginBottom: 10,
    },
    fieldLabelStandalone: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    fieldValueLarge: {
        fontSize: 9,
        color: '#000000',
        borderBottom: '1 solid #cccccc',
        paddingBottom: 4,
        minHeight: 40,
        textAlign: 'left',
    },
    fieldValueSmall: {
        fontSize: 9,
        color: '#000000',
        borderBottom: '1 solid #cccccc',
        paddingBottom: 2,
        minHeight: 15,
    },
    yesNoField: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    yesNoLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333333',
        marginRight: 10,
        flex: 1,
    },
    yesNoValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0066cc',
        width: 40,
        textAlign: 'center',
        border: '1 solid #0066cc',
        padding: 3,
    },
    
    // Table styles
    table: {
        marginBottom: 0, // Remove bottom margin
        border: '1 solid #cccccc',
        break: false, // Keep table together
        wrap: false, // Don't wrap table across pages
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#0066cc',
        color: '#ffffff',
        fontWeight: 'bold',
        break: false,
    },
    tableHeaderCell: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#ffffff',
        padding: 6,
        textAlign: 'center',
        border: '1 solid #ffffff',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1 solid #cccccc',
        break: false, // Keep rows together
    },
    tableCell: {
        fontSize: 8,
        color: '#000000',
        padding: 4,
        textAlign: 'left',
        border: '1 solid #cccccc',
        minHeight: 30,
    },
    tableCellCenter: {
        fontSize: 8,
        color: '#000000',
        padding: 4,
        textAlign: 'center',
        border: '1 solid #cccccc',
        minHeight: 30,
    },
});

interface BdtPageNewProps {
    currentBdt: BdtDTO;
    chantierData?: ChantierDTO;
    entrepriseData?: EntrepriseDTO;
    allRisksMap?: Map<number, RisqueDTO>;
    allDispositifsMap?: Map<number, DispositifDTO>;
    localisationsMap?: Map<number, LocalisationDTO>;
    usersMap?: Map<number, UserDTO>;
    allAnalysesMap?: Map<number, AnalyseDeRisqueDTO>;
    allAuditsMap?: Map<number, AuditSecuDTO>;
    signatures?: SignatureResponseDTO[];
}

const BDT_Page_New = ({ 
    currentBdt, 
    chantierData, 
    entrepriseData, 
    allRisksMap,
    allDispositifsMap,
    localisationsMap, 
    usersMap, 
    allAnalysesMap, 
    allAuditsMap,
    signatures = []
}: BdtPageNewProps) => {
    
    // Format BDT number as specified: No_de_bdt/Annee
    const formatBdtNumber = () => {
        const bdtId = currentBdt.id || '___';
        const currentYear = new Date().getFullYear();
        const currentDate = new Date().toLocaleDateString('fr-FR');
        return `N° BDT ${bdtId}/${currentYear}\n${currentDate}`;
    };

    // Helper component for field display
    const Field = ({ label, value, placeholder = "_______________" }: { label: string; value?: string | number; placeholder?: string }) => (
        <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label}:</Text>
            <Text style={value ? styles.fieldValue : styles.fieldValueEmpty}>
                {value || placeholder}
            </Text>
        </View>
    );

    // Helper component for large text fields
    const LargeField = ({ label, value, placeholder = "À remplir" }: { label: string; value?: string; placeholder?: string }) => (
        <View style={styles.dailyReviewField}>
            <Text style={styles.fieldLabelStandalone}>{label}:</Text>
            <Text style={styles.fieldValueLarge}>
                {value || placeholder}
            </Text>
        </View>
    );

    // Helper component for small fields
    const SmallField = ({ label, value, placeholder = "À remplir" }: { label: string; value?: string | number; placeholder?: string }) => (
        <View style={styles.dailyReviewField}>
            <Text style={styles.fieldLabelStandalone}>{label}:</Text>
            <Text style={styles.fieldValueSmall}>
                {value || placeholder}
            </Text>
        </View>
    );

    // Helper component for Yes/No fields
    const YesNoField = ({ label, value }: { label: string; value?: boolean | string }) => {
        const displayValue = typeof value === 'boolean' ? (value ? 'OUI' : 'NON') : (value || 'À remplir');
        return (
            <View style={styles.yesNoField}>
                <Text style={styles.yesNoLabel}>{label}:</Text>
                <Text style={styles.yesNoValue}>{displayValue}</Text>
            </View>
        );
    };

    // Helper component for tables
    const CoactivityRisksTable = () => {
        // Get analyse de risque relations from BDT with EE/EU information
        const getAnalysesWithRelations = () => {
            if (!currentBdt.relations || !allAnalysesMap) return [];
            return currentBdt.relations
                .filter(rel => rel.objectType === 'ANALYSE_DE_RISQUE' && rel.answer === true)
                .map(rel => ({
                    analyse: allAnalysesMap.get(rel.objectId as number),
                    relation: rel
                }))
                .filter(item => item.analyse) as { analyse: AnalyseDeRisqueDTO; relation: any }[];
        };

        const analysesWithRelations = getAnalysesWithRelations();
        
        // Helper function to format location
        const formatLocation = () => {
            if (!chantierData?.localisation) return 'Lieu non défini';
            const localisation = localisationsMap?.get(chantierData.localisation);
            if (!localisation) return 'Lieu non défini';
            
            const nom = localisation.nom || '';
            const code = localisation.code || '';
            return nom && code ? `${nom} ${code}` : nom || code || 'Lieu non défini';
        };

        // Helper function to determine EE/EU responsibility
        const getResponsibility = (relation: any) => {
            if (relation.ee && relation.eu) return 'EE/EU';
            if (relation.ee) return 'EE';
            if (relation.eu) return 'EU';
            return 'EU'; // Default to EU if not specified
        };
        
        return (
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Lieu</Text>
                    <View style={{ width: '25%', borderRight: '1 solid #ffffff' }}>
                        <Text style={[styles.tableHeaderCell, { borderBottom: '1 solid #ffffff', borderRight: 'none' }]}>Mode opératoire</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.tableHeaderCell, { width: '50%', fontSize: 8, borderRight: '1 solid #ffffff', borderTop: 'none' }]}>Phase</Text>
                            <Text style={[styles.tableHeaderCell, { width: '50%', fontSize: 8, borderTop: 'none' }]}>Moyens Utilisés</Text>
                        </View>
                    </View>
                    <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Risques prévisibles</Text>
                    <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Mesures de prévention</Text>
                    <Text style={[styles.tableHeaderCell, { width: '10%' }]}>À prendre par</Text>
                </View>

                {/* Table Rows */}
                {analysesWithRelations.length > 0 ? (
                    analysesWithRelations.map(({ analyse, relation }, index) => (
                        <View key={analyse.id || index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '15%' }]}>
                                {formatLocation()}
                            </Text>
                            <View style={{ width: '25%', flexDirection: 'column' }}>
                                <Text style={[styles.tableCell, { width: '100%', borderBottom: '1 solid #cccccc', borderTop: 'none' }]}>
                                    {analyse.deroulementDesTaches || 'Phase non définie'}
                                </Text>
                                <Text style={[styles.tableCell, { width: '100%', borderTop: 'none', borderBottom: 'none' }]}>
                                    {analyse.moyensUtilises || 'Moyens non définis'}
                                </Text>
                            </View>
                            <Text style={[styles.tableCell, { width: '25%' }]}>
                                {analyse.risque?.title || analyse.risque?.description || 'Risque non défini'}
                            </Text>
                            <Text style={[styles.tableCell, { width: '25%' }]}>
                                {analyse.mesuresDePrevention || 'Mesures non définies'}
                            </Text>
                            <Text style={[styles.tableCellCenter, { width: '10%' }]}>
                                {getResponsibility(relation)}
                            </Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '100%', textAlign: 'center', fontStyle: 'italic' }]}>
                            Aucune analyse de risque de coactivité définie
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    // Helper component for specific operation risks
    const SpecificOperationRisks = () => {
        // Get risk relations from BDT
        const getRisksWithRelations = () => {
            if (!currentBdt.relations || !allRisksMap) return [];
            return currentBdt.relations
                .filter(rel => rel.objectType === 'RISQUE' && rel.answer === true)
                .map(rel => ({
                    risque: allRisksMap.get(rel.objectId as number),
                    relation: rel
                }))
                .filter(item => item.risque) as { risque: any; relation: any }[];
        };

        const risksWithRelations = getRisksWithRelations();
        
        // Check if permit is present for a risk
        const isPermitPresent = (risque: any) => {
            if (!risque.travaillePermit || !risque.permitType) return null;
            
            // Check if a permit of the required type is linked to this document
            const hasRequiredPermit = currentBdt.relations?.some(rel => 
                rel.objectType === 'PERMIT' && 
                rel.answer === true
                // We would need to check the permit type here, but for now simplified
            );
            
            return hasRequiredPermit;
        };

        // Split risks into two columns
        const leftColumnRisks = risksWithRelations.slice(0, Math.ceil(risksWithRelations.length / 2));
        const rightColumnRisks = risksWithRelations.slice(Math.ceil(risksWithRelations.length / 2));

        const RiskItem = ({ risque, relation }: { risque: any; relation: any }) => {
            const isDangerous = risque.travailleDangereux;
            const permitPresent = isPermitPresent(risque);
            
            return (
                <View style={{ 
                    marginBottom: 8, 
                    padding: 6, 
                    border: '1 solid #cccccc',
                    backgroundColor: '#ffffff',
                    borderRadius: 4
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        {/* Risk icon/indicator */}
                        {isDangerous && (
                            <Text style={{
                                fontSize: 12,
                                marginRight: 6,
                                color: '#dc2626'
                            }}>
                                🔴
                            </Text>
                        )}
                        <Text style={{
                            fontSize: 9,
                            fontWeight: 'bold',
                            color: '#000000',
                            flex: 1
                        }}>
                            {risque.title || 'Risque sans titre'}
                        </Text>
                    </View>
                    
                    {risque.description && (
                        <Text style={{
                            fontSize: 8,
                            color: '#555555',
                            marginBottom: 4,
                            lineHeight: 1.2
                        }}>
                            {risque.description}
                        </Text>
                    )}
                    
                    {/* Permit status indicators */}
                    {risque.travaillePermit && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {permitPresent === true && (
                                <Text style={{
                                    fontSize: 7,
                                    color: '#059669',
                                    fontWeight: 'bold'
                                }}>
                                    ✅ Permit présent
                                </Text>
                            )}
                            {permitPresent === false && (
                                <Text style={{
                                    fontSize: 7,
                                    color: '#dc2626',
                                    fontWeight: 'bold'
                                }}>
                                    🚫 Permit absent
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            );
        };

        return (
            <View>
                <Text style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: '#333333',
                    marginBottom: 8,
                    textAlign: 'center'
                }}>
                    PRÉSENCE DE RISQUE
                </Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* Left Column */}
                    <View style={{ width: '48%' }}>
                        {leftColumnRisks.map(({ risque, relation }, index) => (
                            <RiskItem 
                                key={risque.id || `left-${index}`} 
                                risque={risque} 
                                relation={relation} 
                            />
                        ))}
                    </View>
                    
                    {/* Right Column */}
                    <View style={{ width: '48%' }}>
                        {rightColumnRisks.map(({ risque, relation }, index) => (
                            <RiskItem 
                                key={risque.id || `right-${index}`} 
                                risque={risque} 
                                relation={relation} 
                            />
                        ))}
                    </View>
                </View>
                
                {risksWithRelations.length === 0 && (
                    <Text style={{
                        fontSize: 9,
                        color: '#999999',
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}>
                        Aucun risque particulier défini pour cette opération
                    </Text>
                )}
            </View>
        );
    };

    // Helper component for prevention complements
    const PreventionComplements = () => {
        const complements = currentBdt.complementOuRappels || [];
        
        return (
            <View>
                {complements.length > 0 ? (
                    complements.map((complement, index) => (
                        <View key={index} style={{ 
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 8,
                            padding: 6,
                            border: '1 solid #cccccc',
                            backgroundColor: '#ffffff'
                        }}>
                            <Text style={{
                                fontSize: 9,
                                color: '#000000',
                                flex: 1,
                                marginRight: 10
                            }}>
                                {complement.complement}
                            </Text>
                            <View style={{
                                width: 60,
                                height: 25,
                                border: '1 solid #0066cc',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: complement.respect ? '#e6f3ff' : '#ffe6e6'
                            }}>
                                <Text style={{
                                    fontSize: 9,
                                    fontWeight: 'bold',
                                    color: complement.respect ? '#0066cc' : '#dc2626'
                                }}>
                                    {complement.respect ? 'OUI' : 'NON'}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={{
                        fontSize: 9,
                        color: '#999999',
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}>
                        Aucun complément ou rappel de prévention défini
                    </Text>
                )}
            </View>
        );
    };

    // Helper component for quality/environment audits
    const QualityEnvironmentAudits = () => {
        // Get audit relations from BDT
        const getAuditsWithRelations = () => {
            if (!currentBdt.relations || !allAuditsMap) return [];
            return currentBdt.relations
                .filter(rel => rel.objectType === ObjectAnsweredObjects.AUDIT)
                .map(rel => ({
                    audit: allAuditsMap.get(rel.objectId),
                    relation: rel
                }))
                .filter(item => item.audit) as { audit: AuditSecuDTO; relation: ObjectAnsweredDTO }[];
        };

        const auditsWithRelations = getAuditsWithRelations();
        // Split audits by type
        const intervenantAudits = auditsWithRelations.filter(({ audit }) => 
            audit.typeOfAudit === AuditType.INTERVENANT
        );
        const outilsAudits = auditsWithRelations.filter(({ audit }) => 
            audit.typeOfAudit === AuditType.OUTILS
        );

        const AuditItem = ({ audit }: { audit: AuditSecuDTO }) => (
            <View style={{ 
                marginBottom: 6, 
                padding: 4, 
                border: '1 solid #cccccc',
                backgroundColor: '#ffffff',
                minHeight: 20
            }}>
                <Text style={{
                    fontSize: 8,
                    color: '#000000',
                    fontWeight: 'bold'
                }}>
                    {audit.title || `Audit ${audit.id}`}
                </Text>
                {audit.description && (
                    <Text style={{
                        fontSize: 7,
                        color: '#555555',
                        marginTop: 2
                    }}>
                        {audit.description}
                    </Text>
                )}
            </View>
        );

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* Left Column - Intervenants */}
                <View style={{ width: '48%' }}>
                    <Text style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: '#0066cc',
                        marginBottom: 8,
                        textAlign: 'center',
                        backgroundColor: '#e6f3ff',
                        padding: 4
                    }}>
                        INTERVENANTS
                    </Text>
                    {intervenantAudits.length > 0 ? (
                        intervenantAudits.map(({ audit }, index) => (
                            <AuditItem key={audit.id || `int-${index}`} audit={audit} />
                        ))
                    ) : (
                        <Text style={{
                            fontSize: 8,
                            color: '#999999',
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>
                            Aucun audit intervenant
                        </Text>
                    )}
                </View>
                
                {/* Right Column - Outils */}
                <View style={{ width: '48%' }}>
                    <Text style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: '#0066cc',
                        marginBottom: 8,
                        textAlign: 'center',
                        backgroundColor: '#e6f3ff',
                        padding: 4
                    }}>
                        OUTILS
                    </Text>
                    {outilsAudits.length > 0 ? (
                        outilsAudits.map(({ audit }, index) => (
                            <AuditItem key={audit.id || `out-${index}`} audit={audit} />
                        ))
                    ) : (
                        <Text style={{
                            fontSize: 8,
                            color: '#999999',
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>
                            Aucun audit outils
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    // Helper component for signatures
    const SignaturesSection = ({ signatures, entrepriseData }: { signatures: SignatureResponseDTO[], entrepriseData: EntrepriseDTO | null | undefined }) => {

        const isValidSignatureImage = (signature: SignatureResponseDTO) => {
            return signature?.signatureImage?.imageData &&
                typeof signature.signatureImage.imageData === 'string' &&
                signature.signatureImage.imageData.trim() !== '';
        };
        const getDanoneSignature = () => {
            return signatures.find(sig =>
                entrepriseData?.responsableChantier &&
                sig.userId === entrepriseData.responsableChantier
            );
        };

        const getEntrepriseSignature = () => {
            return signatures.find(sig =>
                sig.workerId !== null &&
                sig.workerId !== undefined
            );
        };

        const danoneSignature = getDanoneSignature();
        const entrepriseSignature = getEntrepriseSignature();
            console.log('testt', danoneSignature)
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                {/* Left: Entreprise Utilisatrice (Danone) */}
                <View style={{ width: '48%', border: '1 solid #0066cc', padding: 10 }}>
                    <Text style={{
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: '#0066cc',
                        textAlign: 'center',
                        marginBottom: 15
                    }}>
                        ENTREPRISE UTILISATRICE (DANONE)
                    </Text>
                    
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 9, marginBottom: 5 }}>Signature:</Text>
                        {danoneSignature && isValidSignatureImage(danoneSignature) ? (
                            <Image
                                src={`data:${danoneSignature!.signatureImage.mimeType || 'image/png'};base64,${danoneSignature!.signatureImage.imageData}`}
                                style={{
                                    height: 60,
                                    width: '100%',
                                    objectFit: 'contain',
                                    border: '1 solid #cccccc'
                                }}
                            />
                        ) : (
                            <View style={{ height: 60, border: '1 solid #cccccc' }} />
                        )}
                    </View>
                    
                    <View>
                        <Text style={{ fontSize: 9 }}>Nom et fonction:</Text>
                        <Text style={{ fontSize: 8, marginTop: 2, paddingBottom: 5, borderBottom: '1 solid #cccccc' }}>
                            {danoneSignature ? `${danoneSignature.prenom} ${danoneSignature.nom}` : '_______________'}
                        </Text>
                    </View>
                </View>
                
                {/* Right: Entreprise Sous-Traitante */}
                <View style={{ width: '48%', border: '1 solid #0066cc', padding: 10 }}>
                    <Text style={{
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: '#0066cc',
                        textAlign: 'center',
                        marginBottom: 15
                    }}>
                        ENTREPRISE SOUS-TRAITANTE
                    </Text>
                    
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 9 }}>Donneur d'ordre:</Text>
                        <Text style={{ fontSize: 8, marginTop: 2 }}>
                            {usersMap?.get(currentBdt.donneurDOrdre as number)?.username || 'Non défini'}
                        </Text>
                    </View>
                    
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 9, marginBottom: 5 }}>Signature:</Text>
                        {entrepriseSignature && isValidSignatureImage(entrepriseSignature) ? (
                            <Image
                                src={`data:${entrepriseSignature!.signatureImage.mimeType || 'image/png'};base64,${entrepriseSignature!.signatureImage.imageData}`}
                                style={{
                                    height: 60,
                                    width: '100%',
                                    objectFit: 'contain',
                                    border: '1 solid #cccccc'
                                }}
                            />
                        ) : (
                            <View style={{ height: 60, border: '1 solid #cccccc' }} />
                        )}
                    </View>
                    
                    <View>
                        <Text style={{ fontSize: 9 }}>Nom et fonction:</Text>
                        <Text style={{ fontSize: 8, marginTop: 2, paddingBottom: 5, borderBottom: '1 solid #cccccc' }}>
                            {entrepriseSignature ? `${entrepriseSignature.prenom} ${entrepriseSignature.nom}` : '_______________'}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };
    
    return (
        <Document>
            <CustomPage>
                <View style={{ padding: 20 }}>
                    {/* HEADER SECTION */}
                    <View style={styles.header}>
                        {/* Left: Danone Logo */}
                        <View style={styles.headerLeft}>
                            <Image 
                                src="/src/assets/DANONE_LOGO_VERTICAL.png" 
                                style={styles.logo}
                            />
                        </View>
                        
                        {/* Center: Title */}
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle}>
                                REVUE QUOTIDIENNE DE CHANTIER ET / OU Bon de travil
                            </Text>
                        </View>
                        
                        {/* Right: BDT Number and Date */}
                        <View style={styles.headerRight}>
                            <Text style={styles.bdtNumber}>
                                {formatBdtNumber()}
                            </Text>
                        </View>
                    </View>

                    {/* ENTREPRISES SECTION */}
                    <View style={styles.section} break={false}>
                        <Text style={styles.sectionTitle}>ENTREPRISES</Text>
                        <View style={styles.sectionContent}>
                            <View style={styles.entreprisesRow}>
                                
                                {/* 1) Section Entreprise Utilisatrice (Danone) */}
                                <View style={styles.entrepriseColumn}>
                                    <Text style={styles.entrepriseTitle}>ENTREPRISE UTILISATRICE (DANONE)</Text>
                                    
                                    <Field 
                                        label="Raison sociale" 
                                        value="DANONE" 
                                    />
                                    <Field 
                                        label="Adresse" 
                                        value="50 Impasse du Dan Perdu, 38540 Saint Just Chaleyssin" 
                                    />
                                    <Field 
                                        label="Numéro de téléphone" 
                                        value="04.72.70.11.11" 
                                    />
                                    <Field 
                                        label="Donneur d'ordre" 
                                        value={usersMap?.get(currentBdt.donneurDOrdre as number)?.username}
                                    />
                                    <Field 
                                        label="Fonction du donneur d'ordre" 
                                        value={usersMap?.get(currentBdt.donneurDOrdre as number)?.fonction}
                                    />
                                    <Field 
                                        label="N° tél. donneur d'ordre" 
                                        value={usersMap?.get(currentBdt.donneurDOrdre as number)?.notel}
                                    />
                                </View>

                                {/* 2) Section Entreprise Sous-Traitante */}
                                <View style={styles.entrepriseColumn}>
                                    <Text style={styles.entrepriseTitle}>ENTREPRISE SOUS-TRAITANTE</Text>
                                    
                                    <Field 
                                        label="Raison sociale" 
                                        value={entrepriseData?.raisonSociale || entrepriseData?.nom}
                                    />
                                    <Field 
                                        label="Adresse" 
                                        value={entrepriseData?.address}
                                    />
                                    <Field 
                                        label="Numéro de téléphone" 
                                        value={entrepriseData?.numTel}
                                    />
                                    <Field 
                                        label="Responsable chantier" 
                                        value={usersMap?.get(entrepriseData?.responsableChantier as number)?.username}
                                    />
                                    <Field 
                                        label="Fonction du responsable chantier" 
                                        value={usersMap?.get(entrepriseData?.responsableChantier as number)?.fonction}
                                    />
                                    <Field 
                                        label="N° tél. responsable chantier" 
                                        value={usersMap?.get(entrepriseData?.responsableChantier as number)?.notel}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* DAILY REVIEW SECTION */}
                    <View style={styles.section} break={false}>
                        <Text style={styles.sectionTitle}>
                            REVUE QUOTIDIENNE DE CHANTIER (Hygiène, Sécurité, Qualité et Environnement)
                        </Text>
                        <View style={styles.sectionContent}>
                            
                            {/* Descriptif des tâches autorisées - Large multi-line text */}
                            <LargeField 
                                label="Descriptif des tâches autorisées ce jour ou restrictions" 
                                value={currentBdt.tachesAuthoriser}
                            />

                            {/* Lieu d'intervention - One line */}
                            <SmallField 
                                label="Lieu d'intervention" 
                                value={chantierData?.localisation ? 
                                    localisationsMap?.get(chantierData.localisation)?.nom || 
                                    `Localisation ID: ${chantierData.localisation}` : 
                                    undefined}
                            />

                            {/* Personnel Danone informé - Yes/No */}
                            <YesNoField 
                                label="Personnel Danone de la zone informé" 
                                value={currentBdt.personnelDansZone}
                            />

                            {/* Effectif maximum - Calculate total and intérimaires */}
                            <SmallField 
                                label="Effectif maximum sur le chantier" 
                                value={`${chantierData?.effectifMaxiSurChantier || '__'} personnes dont ${chantierData?.nombreInterimaires || '__'} intérimaires`}
                            />

                            {/* Horaires de travail */}
                            <SmallField 
                                label="Les horaires de travail" 
                                value={currentBdt.horaireDeTravaille}
                            />

                        </View>
                    </View>

                    {/* COACTIVITY RISKS SECTION */}
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>
                            RISQUES RÉSULTANTS DE LA COACTIVITÉ AVEC DES ENTREPRISES EXTÉRIEURES
                        </Text>
                        <View style={styles.sectionContent}>
                            <CoactivityRisksTable />
                        </View>
                    </View>

                    {/* SPECIFIC OPERATION RISKS SECTION */}
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>
                            RISQUES PARTICULIERS DE L'OPÉRATION
                        </Text>
                        <View style={styles.sectionContent}>
                            <SpecificOperationRisks />
                        </View>
                    </View>

                    {/* PREVENTION COMPLEMENTS SECTION */}
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>
                            COMPLÉMENT OU RAPPEL DE PRÉVENTION
                        </Text>
                        <View style={styles.sectionContent}>
                            <PreventionComplements />
                        </View>
                    </View>

                    {/* QUALITY/ENVIRONMENT AUDITS SECTION */}
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>
                            COMPLÉMENTS OU RAPPELS LIÉS À LA QUALITÉ ET/OU ENVIRONNEMENT
                        </Text>
                        <View style={styles.sectionContent}>
                            <QualityEnvironmentAudits />
                        </View>
                    </View>

                    {/* SIGNATURES SECTION */}
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>
                            SIGNATURES
                        </Text>
                        <View style={styles.sectionContent}>
                            <SignaturesSection signatures={signatures} entrepriseData={entrepriseData} />
                        </View>
                    </View>

                </View>
            </CustomPage>
        </Document>
    );
};

export default BDT_Page_New;