import React from 'react';
import { Document, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from "../assets/DANONE_LOGO_VERTICAL_SIMPLE.png";
import { BdtDTO } from "../utils/entitiesDTO/BdtDTO.ts";
import CustomPage from "./components/Page.tsx";

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
    },
    companyBox: {
        width: '50%',
        border: '2px solid #000',
        padding: 8,
        marginRight: 5,
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
});

interface BdtPageProps {
    currentBdt: BdtDTO;
    chantierData?: any;
    entrepriseData?: any;
}

const BDT_Page = ({ currentBdt, chantierData, entrepriseData }: BdtPageProps) => (
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
                        <Text style={styles.companyValue}>{entrepriseData?.nom || ''}</Text>
                    </View>
                    <View style={styles.companyRow}>
                        <Text style={styles.companyLabel}>Adresse:</Text>
                        <Text style={styles.companyValue}></Text>
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
                        <Text style={styles.workDetailsLabel}>Lieu d'intervention:</Text>
                        <Text style={styles.workDetailsValue}>{chantierData?.nom || ''}</Text>
                    </View>
                    
                    <View style={styles.workDetailsRow}>
                        <Text style={styles.workDetailsLabel}>Personnel présent de cette zone informée:</Text>
                        <Text style={styles.workDetailsValue}>OUI - NON</Text>
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
                        <Text style={styles.workDetailsValue}></Text>
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
                
                {/* Empty rows for filling */}
                {[1, 2, 3, 4].map((row) => (
                    <View key={row} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                        <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                        <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                        <Text style={[styles.tableCell, { width: '20%' }]}></Text>
                        <Text style={[styles.tableCell, { width: '10%' }]}></Text>
                        <Text style={[styles.tableCell, { width: '10%' }]}></Text>
                    </View>
                ))}
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
    </Document>
);

export default BDT_Page;
