import React from 'react';
import { Document, View, StyleSheet, Text, Font } from '@react-pdf/renderer';
import { BdtDTO } from "../utils/entitiesDTO/BdtDTO.ts";
import CustomPage from "./components/Page.tsx";
import { EntrepriseDTO } from '../utils/entitiesDTO/EntrepriseDTO.ts';
import { ChantierDTO } from '../utils/entitiesDTO/ChantierDTO.ts';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO.ts';
import { AnalyseDeRisqueDTO } from '../utils/entitiesDTO/AnalyseDeRisqueDTO.ts';
import { AuditSecuDTO } from '../utils/entitiesDTO/AuditSecuDTO.ts';
import {
    ModernCard,
    ModernField,
    ModernTable,
    ModernIcon,
    ModernHeader,
    RiskItem,
    ModernSignature
} from './components';

// Register emoji source for PDF emoji support
Font.registerEmojiSource({
    format: 'png',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

const styles = StyleSheet.create({
    // Dynamic and flexible styles
    pageContainer: {
        backgroundColor: '#ffffff',
        padding: 12,
        flexGrow: 1,
        minHeight: '100%',
    },
    companySection: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    companyColumn: {
        width: '48%',
        marginRight: '2%',
        flexShrink: 0,
    },
    companyColumnLast: {
        width: '48%',
        marginLeft: '2%',
        flexShrink: 0,
    },
    safetySection: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    safetyGrid: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    safetyColumn: {
        width: '50%',
        padding: 6,
        border: '1 solid #cccccc',
        backgroundColor: '#f8f8f8',
        minHeight: 60,
        flexShrink: 0,
    },
    safetyIconColumn: {
        width: '31%',
        marginRight: '3%',
        padding: 6,
        border: '1 solid #cccccc',
        backgroundColor: '#f8f8f8',
        minHeight: 60,
        flexShrink: 0,
    },
    safetyTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#dc2626',
        marginBottom: 6,
        textAlign: 'center',
        lineHeight: 1.2,
    },
    riskGrid: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    riskColumn: {
        width: '48%',
        marginRight: '2%',
        flexShrink: 0,
    },
    interventionsSection: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    interventionColumn: {
        width: '48%',
        marginRight: '2%',
        flexShrink: 0,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 4,
        marginBottom: 2,
        backgroundColor: '#ffffff',
        border: '1 solid #eeeeee',
        minHeight: 20,
        flexShrink: 0,
    },
    checkboxSmall: {
        width: 10,
        height: 10,
        border: '1 solid #999999',
        marginRight: 4,
        backgroundColor: '#ffffff',
    },
    checkboxText: {
        fontSize: 7,
        color: '#000000',
        flex: 1,
        lineHeight: 1.2,
    },
    statusGroup: {
        flexDirection: 'row',
    },
    statusMini: {
        width: 14,
        height: 10,
        border: '1 solid #999999',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 2,
        backgroundColor: '#ffffff',
    },
    statusMiniText: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#000000',
    },
});

interface BdtPageProps {
    currentBdt: BdtDTO;
    chantierData?: ChantierDTO;
    entrepriseData?: EntrepriseDTO;
    allRisksMap?: Map<number, RisqueDTO>;
    allAnalyseDeRisque?: Map<number, AnalyseDeRisqueDTO>;
    allAudits?: Map<number, AuditSecuDTO>;
}

const BDT_Page_Modern = ({ currentBdt, chantierData, entrepriseData, allRisksMap, allAnalyseDeRisque, allAudits }: BdtPageProps) => {
    // Helper function to get enterprise type label
    const getEntrepriseTypeLabel = (type?: string) => {
        if (type === 'EE') return 'Entreprise Extérieure';
        if (type === 'EU') return 'Entreprise Utilisatrice';
        return '';
    };

    // Helper function to get risk icon based on risk type
    const getRiskIcon = (risque: RisqueDTO): string => {
        const title = risque.title?.toLowerCase() || '';
        const description = risque.description?.toLowerCase() || '';

        if (title.includes('feu') || title.includes('incendie') || description.includes('feu')) return '🔥';
        if (title.includes('électr') || description.includes('électr')) return '⚡';
        if (title.includes('chute') || description.includes('chute')) return '⬇️';
        if (title.includes('bruit') || description.includes('bruit')) return '🔊';
        if (title.includes('chimique') || description.includes('chimique')) return '⚗️';
        if (title.includes('machine') || description.includes('machine')) return '⚙️';
        if (title.includes('radiation') || description.includes('radiation')) return '☢️';
        if (title.includes('gaz') || description.includes('gaz')) return '💨';
        if (title.includes('température') || description.includes('température')) return '🌡️';
        if (title.includes('ergonomie') || description.includes('ergonomie')) return '🏃';
        
        return risque.travailleDangereux ? '⚠️' : '📋';
    };

    // Get analyses de risque from the relations
    const getAnalysesDeRisque = () => {
        if (!currentBdt.relations || !allAnalyseDeRisque) return [];
        
        return currentBdt.relations
            .filter(rel => rel.objectType?.toString().toLowerCase().includes('risque'))
            .map(rel => allAnalyseDeRisque.get(rel.objectId))
            .filter(Boolean) as AnalyseDeRisqueDTO[];
    };

    // Get risks that are marked as dangerous work from the relations
    const getRisquesParticuliers = () => {
        if (!currentBdt.relations || !allRisksMap) return [];
        
        return currentBdt.relations
            .filter(rel => rel.objectType?.toString().toLowerCase().includes('risque'))
            .map(rel => allRisksMap.get(rel.objectId))
            .filter(Boolean) as RisqueDTO[];
    };

    // Get audits that are categorized by type
    const getAuditsByType = (auditType: string) => {
        if (!currentBdt.relations || !allAudits) return [];
        
        return currentBdt.relations
            .filter(rel => rel.objectType?.toString().toLowerCase().includes('audit'))
            .map(rel => allAudits.get(rel.objectId))
            .filter(audit => audit && audit.typeOfAudit === auditType) as AuditSecuDTO[];
    };

    // Helper function to chunk array into smaller arrays for dynamic pages
    const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const analysesDeRisque = getAnalysesDeRisque();
    const risquesParticuliers = getRisquesParticuliers();
    const auditIntervenants = getAuditsByType('INTERVENANTS');
    const auditOutils = getAuditsByType('OUTILS');

    // Dynamically split risks if there are too many (more than 8 risks)
    const riskChunks = risquesParticuliers.length > 8 
        ? chunkArray(risquesParticuliers, 8) 
        : [risquesParticuliers];

    return (
        <Document>
            {/* Page 1: Basic Information */}
            <CustomPage>
                <View style={styles.pageContainer}>
                    {/* Modern Header */}
                    <ModernHeader
                        documentNumber={currentBdt.id}
                        date={currentBdt.date ? new Date(currentBdt.date).toLocaleDateString('fr-FR') : undefined}
                    />

                    {/* Company Information Section */}
                    <View style={styles.companySection}>
                        <View style={styles.companyColumn}>
                            <ModernCard 
                                title="ENTREPRISE UTILISATRICE" 
                                subtitle="DANONE"
                                accentColor="#0066cc"
                            >
                                <ModernField label="Raison sociale" value="DANONE" />
                                <ModernField label="Adresse" value="50 Impasse du Dan Perdu" />
                                <ModernField label="Ville" value="38540 Saint Just Chaleyssin" />
                                <ModernField label="Téléphone" value="04.72.70.11.11" />
                                <ModernField label="Donneur d'ordre" value="" placeholder="À remplir" />
                                <ModernField label="Fonction" value="" placeholder="À remplir" />
                            </ModernCard>
                        </View>

                        <View style={styles.companyColumnLast}>
                            <ModernCard 
                                title="ENTREPRISE EXTÉRIEURE" 
                                subtitle="Prestataire"
                                accentColor="#009900"
                            >
                                <ModernField 
                                    label="Raison sociale" 
                                    value={entrepriseData?.raisonSociale || entrepriseData?.nom} 
                                    placeholder="Non renseigné"
                                />
                                <ModernField 
                                    label="Adresse" 
                                    value={entrepriseData?.address} 
                                    placeholder="Non renseignée"
                                />
                                <ModernField 
                                    label="Téléphone" 
                                    value={entrepriseData?.numTel} 
                                    placeholder="Non renseigné"
                                />
                                <ModernField 
                                    label="Type" 
                                    value={getEntrepriseTypeLabel(entrepriseData?.type)} 
                                    placeholder="Non défini"
                                />
                                <ModernField label="Responsable chantier" value="" placeholder="À remplir" />
                            </ModernCard>
                        </View>
                    </View>

                    {/* Work Details Section */}
                    <ModernCard 
                        title="IDENTIFICATION DU CHANTIER" 
                        subtitle="Nature des risques et équipements"
                        accentColor="#ff9900"
                    >
                        <ModernField label="Nom du BDT" value={currentBdt?.nom} placeholder="Non renseigné" />
                        <ModernField 
                            label="Date BDT" 
                            value={currentBdt?.date ? new Date(currentBdt.date).toLocaleDateString('fr-FR') : undefined} 
                            placeholder="Non renseignée"
                        />
                        <ModernField label="Lieu d'intervention" value={chantierData?.nom} placeholder="Non renseigné" />
                        <ModernField 
                            label="Date début" 
                            value={chantierData?.dateDebut ? new Date(chantierData.dateDebut).toLocaleDateString('fr-FR') : undefined} 
                            placeholder="Non renseignée"
                        />
                        <ModernField 
                            label="Date fin" 
                            value={chantierData?.dateFin ? new Date(chantierData.dateFin).toLocaleDateString('fr-FR') : undefined} 
                            placeholder="Non renseignée"
                        />
                        <ModernField 
                            label="Tâches autorisées" 
                            value={currentBdt?.tachesAuthoriser} 
                            placeholder="Non définies"
                        />
                        <ModernField 
                            label="Personnel informé" 
                            value={currentBdt?.personnelDansZone ? 'OUI' : 'NON'} 
                        />
                        <ModernField 
                            label="Effectif maxi sur chantier" 
                            value={chantierData?.effectifMaxiSurChantier} 
                            placeholder="Non défini"
                        />
                        <ModernField 
                            label="Horaires de travail" 
                            value={currentBdt?.horaireDeTravaille} 
                            placeholder="Non définis"
                        />
                    </ModernCard>

                    {/* Safety Equipment Section */}
                    <ModernCard 
                        title="MESURES DE SÉCURITÉ" 
                        subtitle="Équipements et précautions obligatoires"
                        accentColor="#dc2626"
                    >
                        <View style={styles.safetySection}>
                            <View style={styles.safetyColumn}>
                                <Text style={styles.safetyTitle}>ÉQUIPEMENTS DE PROTECTION INDIVIDUELLE (EPI)</Text>
                                <ModernField label="Casque de sécurité" value="À définir" />
                                <ModernField label="Lunettes de sécurité" value="À définir" />
                                <ModernField label="Protection auditive" value="À définir" />
                                <ModernField label="Gants de protection" value="À définir" />
                                <ModernField label="Chaussures de sécurité" value="À définir" />
                                <ModernField label="Vêtements HV" value="À définir" />
                            </View>
                            <View style={styles.safetyColumn}>
                                <Text style={styles.safetyTitle}>ÉQUIPEMENTS DE PROTECTION COLLECTIVE (EPC)</Text>
                                <ModernField label="Garde-corps" value="À définir" />
                                <ModernField label="Filets de sécurité" value="À définir" />
                                <ModernField label="Barrières de sécurité" value="À définir" />
                                <ModernField label="Signalisation" value="À définir" />
                                <ModernField label="Éclairage" value="À définir" />
                                <ModernField label="Ventilation" value="À définir" />
                            </View>
                        </View>
                    </ModernCard>

                    {/* Safety Icons Section */}
                    <ModernCard 
                        title="INFORMATIONS DE SÉCURITÉ" 
                        subtitle="Numéros d'urgence et procédures"
                        accentColor="#dc2626"
                    >
                        <View style={styles.safetyGrid}>
                            <View style={styles.safetyIconColumn}>
                                <ModernIcon
                                    icon="🚨"
                                    label="EN CAS D'ACCIDENT"
                                    description="Infirmerie interne: 04.72.70.1100 - Poste garde: 1520 - SAMU: 15"
                                    backgroundColor="#fee2e2"
                                    color="#dc2626"
                                    status="danger"
                                />
                            </View>
                            
                            <View style={styles.safetyIconColumn}>
                                <ModernIcon
                                    icon="🔥"
                                    label="EN CAS D'INCENDIE"
                                    description="Poste de garde: 1520 ou 04.72.70.1213 - Sirius: 7018 - Pompiers: 18"
                                    backgroundColor="#fef3c7"
                                    color="#f59e0b"
                                    status="warning"
                                />
                            </View>
                            
                            <View style={styles.safetyIconColumn}>
                                <ModernIcon
                                    icon="⚠️"
                                    label="ÉVACUATION/ALERTE"
                                    description="Méthode sirène - Rassemblement pelouse face tour d'inspiration"
                                    backgroundColor="#dbeafe"
                                    color="#2563eb"
                                    status="ok"
                                />
                            </View>
                        </View>
                    </ModernCard>
                </View>
            </CustomPage>

            {/* Dynamic Pages for Risks */}
            {riskChunks.map((riskChunk, pageIndex) => {
                const pageKey = `risk-page-${Date.now()}-${pageIndex}`;
                const pageTitle = pageIndex > 0 
                    ? `RISQUES PARTICULIERS DE L'OPÉRATION (Suite ${pageIndex + 1})`
                    : 'RISQUES PARTICULIERS DE L\'OPÉRATION';
                
                return (
                    <CustomPage key={pageKey}>
                        <View style={styles.pageContainer}>
                            {/* Risk Assessment Table - Show on first risk page if data exists */}
                            {pageIndex === 0 && analysesDeRisque.length > 0 && (
                                <ModernCard 
                                    title="ANALYSE DES RISQUES" 
                                    subtitle="Coactivité avec les entreprises extérieures"
                                    accentColor="#dc2626"
                                >
                                    <ModernTable
                                        columns={[
                                            { header: 'Mode Opératoire', width: '25%', align: 'left' },
                                            { header: 'Moyens Utilisés', width: '25%', align: 'left' },
                                            { header: 'Risques Prévisibles', width: '25%', align: 'left' },
                                            { header: 'Mesures de Prévention', width: '25%', align: 'left' }
                                        ]}
                                        data={analysesDeRisque.slice(0, 4).map(analyse => ({
                                            modeOperatoire: analyse.deroulementDesTaches || '',
                                            moyensUtilises: analyse.moyensUtilises || '',
                                            risquesPrevisibles: analyse.risque?.title || analyse.risque?.description || '',
                                            mesuresPrevention: analyse.mesuresDePrevention || ''
                                        }))}
                                        minRows={3}
                                        emptyRowText="À compléter"
                                    />
                                </ModernCard>
                            )}

                            {/* Detailed Risk Assessment */}
                            {riskChunk.length > 0 && (
                                <ModernCard 
                                    title={pageTitle}
                                    subtitle="Évaluation détaillée des risques"
                                    accentColor="#dc2626"
                                >
                                    <View style={styles.riskGrid}>
                                        <View style={styles.riskColumn}>
                                            {riskChunk.slice(0, Math.ceil(riskChunk.length / 2)).map((risque, index) => (
                                                <RiskItem
                                                    key={`risk-left-${risque.id || index}`}
                                                    title={risque.title || risque.description || `Risque #${risque.id}`}
                                                    description={risque.description !== risque.title ? risque.description : undefined}
                                                    riskLevel={risque.travailleDangereux ? 'high' : 'medium'}
                                                    isDangerous={risque.travailleDangereux}
                                                    icon={getRiskIcon(risque)}
                                                />
                                            ))}
                                        </View>
                                        
                                        <View style={styles.riskColumn}>
                                            {riskChunk.slice(Math.ceil(riskChunk.length / 2)).map((risque, index) => (
                                                <RiskItem
                                                    key={`risk-right-${risque.id || index}`}
                                                    title={risque.title || risque.description || `Risque #${risque.id}`}
                                                    description={risque.description !== risque.title ? risque.description : undefined}
                                                    riskLevel={risque.travailleDangereux ? 'high' : 'medium'}
                                                    isDangerous={risque.travailleDangereux}
                                                    icon={getRiskIcon(risque)}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                </ModernCard>
                            )}

                            {/* Equipment/Consignation Section - Only on last risk page */}
                            {pageIndex === riskChunks.length - 1 && (
                                <ModernCard 
                                    title="MESURES DE PRÉVENTION COMPLÉMENTAIRES" 
                                    subtitle="Consignations et procédures"
                                    accentColor="#0ea5e9"
                                >
                                    <ModernField label="Consignation énergétique DM/NOR" value="" placeholder="À remplir - CADENASSÉ:" />
                                    <ModernField label="Consignation fluide(s) DM/NOR" value="" placeholder="À remplir - CADENASSÉ:" />
                                    <ModernField label="Consignation électrique DM/NOR" value="" placeholder="À remplir - CADENASSÉ:" />
                                    <ModernField label="Consignation DU 1424" value="" placeholder="QUALITÉ, AFGRI ENVIRONNEMENT" />
                                </ModernCard>
                            )}
                        </View>
                    </CustomPage>
                );
            })}

            {/* Final Page - Interventions and Signatures */}
            <CustomPage>
                <View style={styles.pageContainer}>
                    {/* Interventions Section */}
                    <View style={styles.interventionsSection}>
                        <View style={styles.interventionColumn}>
                            <ModernCard 
                                title="LES INTERVENANTS" 
                                subtitle="Personnel autorisé"
                                accentColor="#059669"
                            >
                                {auditIntervenants.length > 0 ? (
                                    auditIntervenants.map((audit, index) => (
                                        <View key={`intervenant-${audit.id || index}`} style={styles.checklistItem}>
                                            <View style={styles.checkboxSmall} />
                                            <Text style={styles.checkboxText}>
                                                {audit.title || audit.description || `Intervenant #${audit.id}`}
                                            </Text>
                                            <View style={styles.statusGroup}>
                                                <View style={styles.statusMini}>
                                                    <Text style={styles.statusMiniText}>O</Text>
                                                </View>
                                                <View style={styles.statusMini}>
                                                    <Text style={styles.statusMiniText}>N</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.checklistItem}>
                                        <View style={styles.checkboxSmall} />
                                        <Text style={styles.checkboxText}>Aucun intervenant défini</Text>
                                        <View style={styles.statusGroup}>
                                            <View style={styles.statusMini} />
                                            <View style={styles.statusMini} />
                                        </View>
                                    </View>
                                )}
                            </ModernCard>
                        </View>

                        <View style={styles.interventionColumn}>
                            <ModernCard 
                                title="OUTILS UTILISÉS" 
                                subtitle="Équipements autorisés"
                                accentColor="#8b5cf6"
                            >
                                {auditOutils.length > 0 ? (
                                    auditOutils.map((audit, index) => (
                                        <View key={`outil-${audit.id || index}`} style={styles.checklistItem}>
                                            <View style={styles.checkboxSmall} />
                                            <Text style={styles.checkboxText}>
                                                {audit.title || audit.description || `Outil #${audit.id}`}
                                            </Text>
                                            <View style={styles.statusGroup}>
                                                <View style={styles.statusMini}>
                                                    <Text style={styles.statusMiniText}>O</Text>
                                                </View>
                                                <View style={styles.statusMini}>
                                                    <Text style={styles.statusMiniText}>N</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.checklistItem}>
                                        <View style={styles.checkboxSmall} />
                                        <Text style={styles.checkboxText}>Aucun outil défini</Text>
                                        <View style={styles.statusGroup}>
                                            <View style={styles.statusMini} />
                                            <View style={styles.statusMini} />
                                        </View>
                                    </View>
                                )}
                            </ModernCard>
                        </View>
                    </View>

                    {/* Signatures Section */}
                    <ModernSignature
                        leftTitle="CHARGÉ DE TRAVAUX"
                        rightTitle="DONNEUR D'ORDRES"
                        leftSubtitle="SIGNATURE ET VISA"
                        rightSubtitle="SIGNATURE ET VISA"
                    />
                </View>
            </CustomPage>
        </Document>
    );
};

export default BDT_Page_Modern;
