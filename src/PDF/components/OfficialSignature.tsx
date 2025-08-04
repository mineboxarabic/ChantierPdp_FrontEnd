import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    signatureContainer: {
        marginTop: 20,
        border: '2 solid #000000',
        backgroundColor: '#ffffff',
    },
    signatureHeader: {
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderBottom: '1 solid #000000',
    },
    signatureTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    signatureGrid: {
        flexDirection: 'row',
        minHeight: 120,
    },
    signatureColumn: {
        width: '50%',
        borderRight: '1 solid #cccccc',
        padding: 12,
        backgroundColor: '#ffffff',
    },
    signatureColumnLast: {
        width: '50%',
        padding: 12,
        backgroundColor: '#ffffff',
    },
    roleTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 8,
        textTransform: 'uppercase',
        backgroundColor: '#f8f8f8',
        padding: 4,
        border: '1 solid #cccccc',
    },
    roleSubtitle: {
        fontSize: 8,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 12,
        fontStyle: 'italic',
    },
    signatureField: {
        marginBottom: 8,
        backgroundColor: '#ffffff',
        border: '1 solid #cccccc',
        padding: 4,
    },
    fieldLabel: {
        fontSize: 8,
        color: '#333333',
        marginBottom: 2,
        fontWeight: 'bold',
    },
    fieldInput: {
        fontSize: 9,
        color: '#000000',
        backgroundColor: '#fafafa',
        padding: 4,
        border: '0.5 solid #999999',
        minHeight: 16,
    },
    signatureBox: {
        marginTop: 12,
        padding: 8,
        border: '1 solid #999999',
        backgroundColor: '#f9f9f9',
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signatureText: {
        fontSize: 8,
        color: '#666666',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    dateField: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateLabel: {
        fontSize: 8,
        color: '#333333',
        marginRight: 8,
        fontWeight: 'bold',
    },
    dateInput: {
        fontSize: 9,
        color: '#000000',
        backgroundColor: '#fafafa',
        padding: 4,
        border: '0.5 solid #999999',
        minHeight: 16,
        width: 80,
    },
});

interface OfficialSignatureProps {
    leftTitle: string;
    rightTitle: string;
    leftSubtitle?: string;
    rightSubtitle?: string;
}

const OfficialSignature: React.FC<OfficialSignatureProps> = ({ 
    leftTitle, 
    rightTitle, 
    leftSubtitle = "Signature et cachet",
    rightSubtitle = "Signature et cachet"
}) => {
    return (
        <View style={styles.signatureContainer}>
            <View style={styles.signatureHeader}>
                <Text style={styles.signatureTitle}>
                    Signatures et Validation Officielle
                </Text>
            </View>
            
            <View style={styles.signatureGrid}>
                {/* Left Signature Column */}
                <View style={styles.signatureColumn}>
                    <Text style={styles.roleTitle}>{leftTitle}</Text>
                    <Text style={styles.roleSubtitle}>{leftSubtitle}</Text>
                    
                    <View style={styles.signatureField}>
                        <Text style={styles.fieldLabel}>Nom et prénom :</Text>
                        <Text style={styles.fieldInput}>........................</Text>
                    </View>
                    
                    <View style={styles.signatureField}>
                        <Text style={styles.fieldLabel}>Fonction :</Text>
                        <Text style={styles.fieldInput}>........................</Text>
                    </View>
                    
                    <View style={styles.dateField}>
                        <Text style={styles.dateLabel}>Date :</Text>
                        <Text style={styles.dateInput}>____/____/________</Text>
                    </View>
                    
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>
                            Signature et cachet{'\n'}de l'entreprise
                        </Text>
                    </View>
                </View>

                {/* Right Signature Column */}
                <View style={styles.signatureColumnLast}>
                    <Text style={styles.roleTitle}>{rightTitle}</Text>
                    <Text style={styles.roleSubtitle}>{rightSubtitle}</Text>
                    
                    <View style={styles.signatureField}>
                        <Text style={styles.fieldLabel}>Nom et prénom :</Text>
                        <Text style={styles.fieldInput}>........................</Text>
                    </View>
                    
                    <View style={styles.signatureField}>
                        <Text style={styles.fieldLabel}>Fonction :</Text>
                        <Text style={styles.fieldInput}>........................</Text>
                    </View>
                    
                    <View style={styles.dateField}>
                        <Text style={styles.dateLabel}>Date :</Text>
                        <Text style={styles.dateInput}>____/____/________</Text>
                    </View>
                    
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>
                            Signature et cachet{'\n'}de l'entreprise
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default OfficialSignature;
