import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import logo from "../../assets/DANONE_LOGO_VERTICAL_SIMPLE.png";

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
        paddingBottom: 10,
        borderBottom: '2 solid #cccccc',
    },
    logoSection: {
        width: '20%',
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
    },
    titleSection: {
        width: '60%',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    mainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 3,
    },
    subTitle: {
        fontSize: 12,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 5,
    },
    version: {
        fontSize: 9,
        color: '#666666',
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
        padding: 3,
    },
    metaSection: {
        width: '20%',
        alignItems: 'center',
    },
    metaItem: {
        marginBottom: 6,
        alignItems: 'center',
    },
    metaLabel: {
        fontSize: 8,
        color: '#666666',
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        backgroundColor: '#f8f8f8',
        padding: 4,
        border: '1 solid #cccccc',
        textAlign: 'center',
        minWidth: 50,
    },
    bannerContainer: {
        backgroundColor: '#0066cc',
        padding: 8,
        marginBottom: 15,
    },
    bannerText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

interface ModernHeaderProps {
    documentNumber?: string | number;
    date?: string;
    version?: string;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ 
    documentNumber, 
    date,
    version = "JO 2012 V2"
}) => {
    return (
        <>
            <View style={styles.headerContainer}>
                <View style={styles.logoSection}>
                    <Image src={logo} style={styles.logo} />
                </View>
                
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Revue Quotidienne de Chantier</Text>
                    <Text style={styles.subTitle}>Bon de Travail</Text>
                    <Text style={styles.version}>{version}</Text>
                </View>
                
                <View style={styles.metaSection}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>N° Document</Text>
                        <Text style={styles.metaValue}>
                            {documentNumber || '---'}
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Date</Text>
                        <Text style={styles.metaValue}>
                            {date || new Date().toLocaleDateString('fr-FR')}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.bannerContainer}>
                <Text style={styles.bannerText}>
                    CE DOCUMENT CONTRACTUEL ET RÉGLEMENTAIRE DEVRA ÊTRE PRÉSENT SUR LE CHANTIER
                </Text>
            </View>
        </>
    );
};

export default ModernHeader;
