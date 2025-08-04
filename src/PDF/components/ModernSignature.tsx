import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    signatureContainer: {
        marginTop: 20,
        marginBottom: 12,
    },
    signatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    signatureBox: {
        width: '45%',
        backgroundColor: '#ffffff',
        padding: 12,
        border: '2 solid #cccccc',
        alignItems: 'center',
    },
    signatureHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 3,
        textAlign: 'center',
    },
    signatureSubheader: {
        fontSize: 8,
        color: '#333333',
        marginBottom: 12,
        textAlign: 'center',
    },
    signatureSpace: {
        width: '100%',
        height: 40,
        borderBottom: '1 solid #999999',
        marginBottom: 6,
        backgroundColor: '#fafafa',
    },
    signatureDate: {
        fontSize: 7,
        color: '#666666',
        textAlign: 'center',
    },
    footerNote: {
        backgroundColor: '#fff8dc',
        padding: 12,
        border: '2 solid #ff9900',
        marginTop: 12,
    },
    footerNoteText: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        lineHeight: 1.3,
    },
});

interface SignatureProps {
    leftTitle: string;
    rightTitle: string;
    leftSubtitle?: string;
    rightSubtitle?: string;
    showDate?: boolean;
    footerNote?: string;
}

const ModernSignature: React.FC<SignatureProps> = ({ 
    leftTitle,
    rightTitle,
    leftSubtitle = "VISA",
    rightSubtitle = "VISA",
    showDate = true,
    footerNote = "LE CODE DU TRAVAIL ET LE CODE DE LA ROUTE SONT APPLICABLES DANS L'ENCEINTE D'USINE"
}) => {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    return (
        <View style={styles.signatureContainer}>
            <View style={styles.signatureRow}>
                <View style={styles.signatureBox}>
                    <Text style={styles.signatureHeader}>{leftTitle}</Text>
                    <Text style={styles.signatureSubheader}>{leftSubtitle}</Text>
                    <View style={styles.signatureSpace} />
                    {showDate && (
                        <Text style={styles.signatureDate}>Date: {currentDate}</Text>
                    )}
                </View>
                
                <View style={styles.signatureBox}>
                    <Text style={styles.signatureHeader}>{rightTitle}</Text>
                    <Text style={styles.signatureSubheader}>{rightSubtitle}</Text>
                    <View style={styles.signatureSpace} />
                    {showDate && (
                        <Text style={styles.signatureDate}>Date: {currentDate}</Text>
                    )}
                </View>
            </View>
            
            {footerNote && (
                <View style={styles.footerNote}>
                    <Text style={styles.footerNoteText}>
                        {footerNote}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default ModernSignature;
