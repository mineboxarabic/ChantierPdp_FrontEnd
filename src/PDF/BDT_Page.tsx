import React from 'react';
import { Document, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import logo from "../assets/DANONE_LOGO_VERTICAL_SIMPLE.png";
import { BdtDTO } from "../utils/entitiesDTO/BdtDTO.ts";
import CustomPage from "./components/Page.tsx";
import { EntrepriseDTO } from '../utils/entitiesDTO/EntrepriseDTO.ts';
import { ChantierDTO } from '../utils/entitiesDTO/ChantierDTO.ts';
import RisqueDTO from '../utils/entitiesDTO/RisqueDTO.ts';
import { AnalyseDeRisqueDTO } from '../utils/entitiesDTO/AnalyseDeRisqueDTO.ts';
import { AuditSecuDTO } from '../utils/entitiesDTO/AuditSecuDTO.ts';

// Register emoji source for PDF emoji support
Font.registerEmojiSource({
    format: 'png',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

const styles = StyleSheet.create({
    // Header styles
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    logoSection: {
        width: '15%',
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
    },
    titleSection: {
        width: '70%',
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
    subTitle: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 2,
    },
    dateNumberSection: {
        width: '15%',
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 10,
        marginBottom: 2,
    },
    dateInput: {
        border: '1px solid #000',
        padding: 2,
        fontSize: 10,
        textAlign: 'center',
        minHeight: 15,
    },
    
    // Warning banner
    warningBanner: {
        backgroundColor: '#007bff',
        padding: 8,
        marginBottom: 10,
    },
    warningText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    // Company information section
    companySection: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    companyBox: {
        width: '50%',
        border: '2px solid #000',
        padding: 8,
        marginRight: 5,
        flexShrink: 0,
    },
    companyBoxRight: {
        width: '50%',
        border: '2px solid #000',
        padding: 8,
        marginLeft: 5,
    },
    companyHeader: {
        backgroundColor: '#f0f0f0',
        padding: 4,
        marginBottom: 8,
        textAlign: 'center',
    },
    companyTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    companyRow: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center',
    },
    companyLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        width: '40%',
    },
    companyValue: {
        fontSize: 10,
        width: '60%',
        borderBottom: '1px solid #ccc',
        paddingBottom: 2,
        minHeight: 12,
    },
    
    // Work details section
    workDetailsSection: {
        border: '2px solid #000',
        marginBottom: 15,
    },
    workDetailsHeader: {
        backgroundColor: '#ffff00',
        padding: 6,
        textAlign: 'center',
    },
    workDetailsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    workDetailsContent: {
        padding: 8,
    },
    workDetailsRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    workDetailsLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        width: '30%',
    },
    workDetailsValue: {
        fontSize: 10,
        width: '70%',
        borderBottom: '1px solid #ccc',
        paddingBottom: 2,
        minHeight: 12,
    },
    
    // Risk assessment table
    riskTableSection: {
        marginBottom: 15,
    },
    riskTableHeader: {
        backgroundColor: '#ffff00',
        padding: 6,
        textAlign: 'center',
        marginBottom: 5,
    },
    riskTableTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        border: '1px solid #000',
    },
    tableHeaderCell: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 4,
        border: '1px solid #000',
    },
    tableRow: {
        flexDirection: 'row',
        border: '1px solid #000',
        minHeight: 30,
    },
    tableCell: {
        fontSize: 9,
        padding: 4,
        border: '1px solid #000',
        textAlign: 'center',
    },
    
    // Safety icons section
    safetySection: {
        marginTop: 15,
    },
    safetyRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    safetyColumn: {
        width: '20%',
        alignItems: 'center',
        padding: 5,
    },
    safetyIcon: {
        width: 40,
        height: 40,
        marginBottom: 5,
        backgroundColor: '#f0f0f0',
        border: '1px solid #000',
    },
    safetyText: {
        fontSize: 8,
        textAlign: 'center',
        marginBottom: 3,
    },
    safetyStatus: {
        fontSize: 8,
        textAlign: 'center',
        padding: 2,
        minHeight: 15,
    },
    statusOk: {
        backgroundColor: '#90EE90',
    },
    statusAlert: {
        backgroundColor: '#FFB6C1',
    },
    statusDanger: {
        backgroundColor: '#FF6B6B',
    },
    
    // Second page styles
    detailedRiskTable: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    riskColumn: {
        width: '50%',
        marginRight: 5,
    },
    riskIcon: {
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    equipmentSection: {
        border: '2px solid #000',
        marginBottom: 15,
    },
    equipmentContent: {
        padding: 8,
    },
    interventionsSection: {
        marginBottom: 15,
    },
    interventionsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    interventionsBox: {
        width: '50%',
        border: '2px solid #000',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderBottom: '1px solid #ddd',
    },
    checkbox: {
        width: 10,
        height: 10,
        border: '1px solid #000',
        marginRight: 5,
    },
    checkboxLabel: {
        fontSize: 8,
        flex: 1,
        marginRight: 5,
    },
    signaturesSection: {
        marginTop: 20,
        marginBottom: 15,
    },
    signaturesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    signatureBox: {
        width: '45%',
        border: '2px solid #000',
        padding: 10,
        alignItems: 'center',
    },
    signatureHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    signatureSubheader: {
        fontSize: 9,
        marginBottom: 10,
    },
    signatureSpace: {
        width: '100%',
        height: 40,
        borderBottom: '1px solid #000',
    },
    footerNote: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
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

const BDT_Page = ({ currentBdt, chantierData, entrepriseData, allRisksMap, allAnalyseDeRisque, allAudits }: BdtPageProps) => {
    // Helper function to get enterprise type label
    const getEntrepriseTypeLabel = (type?: string) => {
        if (type === 'EE') return 'Entreprise Extérieure';
        if (type === 'EU') return 'Entreprise Utilisatrice';
        return '';
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

    const analysesDeRisque = getAnalysesDeRisque();
    const risquesParticuliers = getRisquesParticuliers();
    const auditIntervenants = getAuditsByType('INTERVENANTS');
    const auditOutils = getAuditsByType('OUTILS');

    return (
    <Document>
        <CustomPage>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.logoSection}>
                    <Image src={logo} style={styles.logo} />
                </View>
                
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Revue quotidienne de chantier</Text>
                    <Text style={styles.mainTitle}>ET / OU Bon de travail</Text>
                    <Text style={styles.subTitle}>JO 2012 V2</Text>
                </View>
                
                <View style={styles.dateNumberSection}>
                    <Text style={styles.dateLabel}>N° du bon PDF:</Text>
                    <View style={styles.dateInput}>
                        <Text style={{ fontSize: 10 }}>{currentBdt.id || ''}</Text>
                    </View>
                    <Text style={styles.dateLabel}>Date: ___/___/___</Text>
                </View>
            </View>

            {/* Warning Banner */}
            <View style={styles.warningBanner}>
                <Text style={styles.warningText}>
                    CE DOCUMENT CONTRACTUEL ET REGLEMENTAIRE DEVRA ÊTRE PRESENT SUR LE CHANTIER
                </Text>
            </View>

            {/* Company Information Section */}
            <View style={styles.companySection}>
                {/* Entreprise Utilisatrice */}
                <View style={styles.companyBox}>
                    <View style={styles.companyHeader}>
                        <Text style={styles.companyTitle}>ENTREPRISE UTILISATRICE</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>DANONE</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>Raison sociale:</Text>
                        <Text style={styles.companyValue}>DANONE</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>Adresse:</Text>
                        <Text style={styles.companyValue}>50 Impasse du Dan Perdu</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}></Text>
                        <Text style={styles.companyValue}>38540 Saint Just Chaleyssin</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}></Text>
                        <Text style={styles.companyValue}>04.72.70.11.11</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>Donneur d'ordre:</Text>
                        <Text style={styles.companyValue}></Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>Fonction:</Text>
                        <Text style={styles.companyValue}></Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>N° de téléphone:</Text>
                        <Text style={styles.companyValue}></Text>
                    </View>
                </View>

                {/* Entreprise Extérieure */}
                <View style={styles.companyBoxRight}>
                    <View style={styles.companyHeader}>
                        <Text style={styles.companyTitle}>ENTREPRISE EXTÉRIEURE 1</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>Raison sociale:</Text>
                        <Text style={styles.companyValue}>{entrepriseData?.raisonSociale || entrepriseData?.nom || ''}</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>Adresse:</Text>
                        <Text style={styles.companyValue}>{entrepriseData?.address || ''}</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}></Text>
                        <Text style={styles.companyValue}></Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>Responsable chantier:</Text>
                        <Text style={styles.companyValue}></Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>Fonction:</Text>
                        <Text style={styles.companyValue}></Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>N° de téléphone:</Text>
                        <Text style={styles.companyValue}>{entrepriseData?.numTel || ''}</Text>
                    </View>
                </View>
            </View>

            {/* Work Details Section */}
            <View style={styles.workDetailsSection}>
                <View style={styles.workDetailsHeader}>
                    <Text style={styles.workDetailsTitle}>
                        IDENTIFICATION DE CHANTIER, NATURE DES RISQUES ET/OU ÉQUIPEMENTS
                    </Text>
                </View>
                <View style={styles.workDetailsContent}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>
                        DESCRIPTIF DES TACHES AUTORISEES CE JOUR OU RESTRICTIONS :
                    </Text>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Nom du BDT:</Text>
                        <Text style={styles.workDetailsValue}>{currentBdt?.nom || ''}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Date BDT:</Text>
                        <Text style={styles.workDetailsValue}>{currentBdt?.date ? new Date(currentBdt.date).toLocaleDateString('fr-FR') : ''}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Entreprise:</Text>
                        <Text style={styles.workDetailsValue}>{entrepriseData?.nom || ''}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Type d'entreprise:</Text>
                        <Text style={styles.workDetailsValue}>{getEntrepriseTypeLabel(entrepriseData?.type)}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Tâches autorisées:</Text>
                        <Text style={styles.workDetailsValue}>{currentBdt?.tachesAuthoriser || ''}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Lieu d'intervention:</Text>
                        <Text style={styles.workDetailsValue}>{chantierData?.nom || ''}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Date début:</Text>
                        <Text style={styles.workDetailsValue}>{chantierData?.dateDebut ? new Date(chantierData.dateDebut).toLocaleDateString('fr-FR') : ''}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Date fin:</Text>
                        <Text style={styles.workDetailsValue}>{chantierData?.dateFin ? new Date(chantierData.dateFin).toLocaleDateString('fr-FR') : ''}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Personnel présent de cette zone informée:</Text>
                        <Text style={styles.workDetailsValue}>{currentBdt?.personnelDansZone ? 'OUI' : 'NON'}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Effectif maxi sur le chantier:</Text>
                        <Text style={styles.workDetailsValue}>{chantierData?.effectifMaxiSurChantier || ''}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Personnes dont:</Text>
                        <Text style={styles.workDetailsValue}>intérimaires</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Nom du référent COVID</Text>
                        <Text style={styles.workDetailsValue}></Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Préciser les horaires de travail:</Text>
                        <Text style={styles.workDetailsValue}>{currentBdt?.horaireDeTravaille || ''}</Text>
                    </View>
                </View>
            </View>

            {/* Risk Assessment Table */}
            <View style={styles.riskTableSection}>
                <View style={styles.riskTableHeader}>
                    <Text style={styles.riskTableTitle}>
                        RISQUES RÉSULTANTS DE LA COACTIVITÉ AVEC DES ENTREPRISES EXTÉRIEURES
                    </Text>
                </View>
                
                <View style={styles.tableHeaderRow}>
                    <Text style={[styles.tableHeaderCell, { width: '20%' }]}>MODE OPÉRATOIRE</Text>
                    <Text style={[styles.tableHeaderCell, { width: '20%' }]}>MOYENS UTILISÉS</Text>
                    <Text style={[styles.tableHeaderCell, { width: '20%' }]}>RISQUES PRÉVISIBLES</Text>
                    <Text style={[styles.tableHeaderCell, { width: '20%' }]}>MESURES DE PRÉVENTION</Text>
                    <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Réalisé OUI</Text>
                    <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Réalisé NON</Text>
                </View>
                
                {/* Display actual analyses de risque data */}
                {analysesDeRisque.length > 0 ? (
                    analysesDeRisque.slice(0, 4).map((analyse, index) => (
                        <View key={analyse.id ? `analyse-${analyse.id}` : `idx-${index}`} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {analyse.deroulementDesTaches || ''}
                            </Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {analyse.moyensUtilises || ''}
                            </Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {analyse.risque?.title || analyse.risque?.description || ''}
                            </Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {analyse.mesuresDePrevention || ''}
                            </Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}></Text>
                        </View>
                    ))
                ) : (
                    /* Empty rows for filling if no data */
                    [1, 2, 3, 4].map((row) => (
                        <View key={`empty-row-${row}`} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}></Text>
                        </View>
                    ))
                )}
                
                {/* Fill remaining rows with empty rows if we have less than 4 analyses */}
                {analysesDeRisque.length > 0 && analysesDeRisque.length < 4 && 
                    Array.from({ length: 4 - analysesDeRisque.length }).map((_, index) => (
                        <View key={`fill-empty-${index + analysesDeRisque.length}`} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}></Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}></Text>
                        </View>
                    ))
                }
            </View>

            {/* Safety Icons Section */}
            <View style={styles.safetySection}>
                <View style={styles.safetyRow}>
                    <View style={styles.safetyColumn}>
                        <View style={styles.safetyIcon}></View>
                        <Text style={styles.safetyText}>INFIRMERIE</Text>
                        <Text style={styles.safetyText}>en interne</Text>
                        <Text style={styles.safetyText}>04.72.70.1100</Text>
                        <Text style={styles.safetyText}>en externe</Text>
                        <Text style={styles.safetyText}>04.72.70.1100</Text>
                        <Text style={styles.safetyText}>poste de garde:</Text>
                        <Text style={styles.safetyText}>Téléphone interne 1520</Text>
                        <Text style={styles.safetyText}>n° externe 04.72.70.</Text>
                        <Text style={styles.safetyText}>7015 (SAMU)</Text>
                        <View style={[styles.safetyStatus, styles.statusOk]}>
                            <Text>EN CAS D'ACCIDENT</Text>
                        </View>
                    </View>
                    
                    <View style={styles.safetyColumn}>
                        <View style={styles.safetyIcon}></View>
                        <Text style={styles.safetyText}>POSTE DE</Text>
                        <Text style={styles.safetyText}>GARDE</Text>
                        <Text style={styles.safetyText}>1520</Text>
                        <Text style={styles.safetyText}>ou</Text>
                        <Text style={styles.safetyText}>04.72.70.1213</Text>
                        <Text style={styles.safetyText}>Sirius 7018 !</Text>
                        <Text style={styles.safetyText}>Pompiers</Text>
                        <View style={[styles.safetyStatus, styles.statusDanger]}>
                            <Text>EN CAS D'INCENDIE</Text>
                        </View>
                    </View>
                    
                    <View style={styles.safetyColumn}>
                        <View style={styles.safetyIcon}></View>
                        <Text style={styles.safetyText}>MÉTHODE SIRÈNE ET TESTE</Text>
                        <Text style={styles.safetyText}>ÉVACUATION. EMPLACEMENT</Text>
                        <Text style={styles.safetyText}>SUR LA PELOUSE EN FACE DE LA</Text>
                        <Text style={styles.safetyText}>TOUR D'INSPIRATION LAT</Text>
                        <Text style={styles.safetyText}>CONFINEMENT: REGROUPEMENT</Text>
                        <Text style={styles.safetyText}>EN SALLE D'ACTIVITÉ au dessus de</Text>
                        <View style={[styles.safetyStatus, styles.statusAlert]}>
                            <Text>ALERTE</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={{ marginTop: 15, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
                <Text style={{ fontSize: 9, textAlign: 'center', color: '#666' }}>
                    Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                </Text>
                <Text style={{ fontSize: 8, textAlign: 'center', color: '#666', marginTop: 2 }}>
                    Ce document doit être conservé sur le chantier et disponible lors des contrôles
                </Text>
            </View>
        </CustomPage>

        {/* Second Page */}
        <CustomPage>
            {/* Page 2 Header */}
            <View style={styles.riskTableHeader}>
                <Text style={styles.riskTableTitle}>
                    RISQUES PARTICULIERS DE L'OPÉRATION
                </Text>
            </View>

            {/* Detailed Risk Assessment Table */}
            <View style={styles.detailedRiskTable}>
                {/* Left Column - Presence de risque */}
                <View style={styles.riskColumn}>
                    <View style={[styles.tableHeaderRow, { backgroundColor: '#ffff00' }]}>
                        <Text style={[styles.tableHeaderCell, { width: '60%' }]}>Présence de risque</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>OUI</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>NON</Text>
                    </View>

                    {/* Show actual risks from the data */}
                    {risquesParticuliers.slice(0, 15).map((risque, index) => (
                        <View key={risque.id ? `left-${risque.id}` : `left-idx-${index}`} style={styles.tableRow}>
                            <View style={styles.riskIcon}>
                                <Text style={{ fontSize: 16, color: '#ff6600' }}>⚠</Text>
                            </View>
                            <Text style={[styles.tableCell, { width: '50%', textAlign: 'left' }]}>
                                {risque.title || risque.description || ''}
                            </Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {risque.travailleDangereux ? '✓' : ''}
                            </Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {!risque.travailleDangereux ? '✓' : ''}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Right Column - Presence de risque */}
                <View style={styles.riskColumn}>
                    <View style={[styles.tableHeaderRow, { backgroundColor: '#ffff00' }]}>
                        <Text style={[styles.tableHeaderCell, { width: '60%' }]}>Présence de risque</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>OUI</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>NON</Text>
                    </View>

                    {/* Show remaining risks from the data */}
                    {risquesParticuliers.slice(15, 30).map((risque, index) => (
                        <View key={risque.id ? `right-${risque.id}` : `right-idx-${index}`} style={styles.tableRow}>
                            <View style={styles.riskIcon}>
                                <Text style={{ fontSize: 16, color: '#ff6600' }}>⚠</Text>
                            </View>
                            <Text style={[styles.tableCell, { width: '50%', textAlign: 'left' }]}>
                                {risque.title || risque.description || ''}
                            </Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {risque.travailleDangereux ? '✓' : ''}
                            </Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>
                                {!risque.travailleDangereux ? '✓' : ''}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Equipment Information Section */}
            <View style={styles.equipmentSection}>
                <View style={[styles.tableHeaderRow, { backgroundColor: '#ffff00' }]}>
                    <Text style={styles.workDetailsTitle}>COMPLEMENT OU RAPPEL DE MESURES DE PRÉVENTION</Text>
                </View>
                
                <View style={styles.equipmentContent}>
                    <Text style={{ fontSize: 10, marginBottom: 8 }}>
                        Consignation énergétique DM / NOR : ................................ CADENASSE :
                    </Text>
                    <Text style={{ fontSize: 10, marginBottom: 8 }}>
                        Consignation fluide(e) DM / NOR : ................................ CADENASSE :
                    </Text>
                    <Text style={{ fontSize: 10, marginBottom: 8 }}>
                        Consignation électrique DM / NOR : ................................ CADENASSE :
                    </Text>
                    <Text style={{ fontSize: 10, marginBottom: 8 }}>
                        Consignation électrique DU 1424 QUALITÉ, AFGRI ENVIRONNEMENT :
                    </Text>
                </View>
            </View>

            {/* Interventions Section */}
            <View style={styles.interventionsSection}>
                <View style={styles.interventionsRow}>
                    {/* Left section - Les Intervenants */}
                    <View style={styles.interventionsBox}>
                        <View style={[styles.companyHeader, { backgroundColor: '#ffff00' }]}>
                            <Text style={styles.companyTitle}>Les Intervenants :</Text>
                        </View>
                        
                        {auditIntervenants.length > 0 ? (
                            auditIntervenants.map((audit, index) => (
                                <View key={audit.id ? `intervenant-${audit.id}` : `intervenant-idx-${index}`} style={styles.checkboxRow}>
                                    <View style={styles.checkbox}></View>
                                    <Text style={styles.checkboxLabel}>{audit.title || audit.description || `Intervenant #${audit.id}`}</Text>
                                    <Text style={[styles.tableCell, { width: '15%' }]}>OUI</Text>
                                    <Text style={[styles.tableCell, { width: '15%' }]}>NON</Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.checkboxRow}>
                                <View style={styles.checkbox}></View>
                                <Text style={styles.checkboxLabel}>Aucun intervenant défini</Text>
                                <Text style={[styles.tableCell, { width: '15%' }]}>OUI</Text>
                                <Text style={[styles.tableCell, { width: '15%' }]}>NON</Text>
                            </View>
                        )}
                    </View>

                    {/* Right section - Les outils utilisés sont */}
                    <View style={styles.interventionsBox}>
                        <View style={[styles.companyHeader, { backgroundColor: '#ffff00' }]}>
                            <Text style={styles.companyTitle}>Les outils utilisés sont :</Text>
                        </View>
                        
                        {auditOutils.length > 0 ? (
                            auditOutils.map((audit, index) => (
                                <View key={audit.id ? `outil-${audit.id}` : `outil-idx-${index}`} style={styles.checkboxRow}>
                                    <View style={styles.checkbox}></View>
                                    <Text style={styles.checkboxLabel}>{audit.title || audit.description || `Outil #${audit.id}`}</Text>
                                    <Text style={[styles.tableCell, { width: '15%' }]}>OUI</Text>
                                    <Text style={[styles.tableCell, { width: '15%' }]}>NON</Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.checkboxRow}>
                                <View style={styles.checkbox}></View>
                                <Text style={styles.checkboxLabel}>Aucun outil défini</Text>
                                <Text style={[styles.tableCell, { width: '15%' }]}>OUI</Text>
                                <Text style={[styles.tableCell, { width: '15%' }]}>NON</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Signatures Section */}
            <View style={styles.signaturesSection}>
                <View style={styles.signaturesRow}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureHeader}>CHARGE DE TRAVAUX</Text>
                        <Text style={styles.signatureSubheader}>VISA</Text>
                        <View style={styles.signatureSpace}></View>
                    </View>
                    
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureHeader}>DONNEUR D'ORDRES</Text>
                        <Text style={styles.signatureSubheader}>VISA</Text>
                        <View style={styles.signatureSpace}></View>
                    </View>
                </View>
                
                <View style={styles.footerNote}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>
                        LE CODE DU TRAVAIL ET LE CODE DE LA ROUTE SONT APPLICABLES DANS L'ENCEINTE D'USINE
                    </Text>
                </View>
            </View>

            {/* Page footer */}
            <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0 }}>
                <Text style={{ fontSize: 8, textAlign: 'center' }}>Page 2</Text>
            </View>
        </CustomPage>
    </Document>
    );
};

export default BDT_Page;