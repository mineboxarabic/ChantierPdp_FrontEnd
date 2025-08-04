import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    fieldContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
        border: '0.5 solid #cccccc',
        backgroundColor: '#ffffff',
    },
    fieldLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        width: '40%',
        padding: 6,
        backgroundColor: '#f8f8f8',
        borderRight: '0.5 solid #cccccc',
        textAlign: 'left',
    },
    fieldValue: {
        fontSize: 9,
        color: '#000000',
        width: '60%',
        padding: 6,
        backgroundColor: '#ffffff',
        minHeight: 18,
        textAlign: 'left',
    },
    fieldValueEmpty: {
        backgroundColor: '#fafafa',
        color: '#666666',
        fontStyle: 'italic',
    },
    requiredMarker: {
        color: '#dc2626',
        fontWeight: 'bold',
    },
    fieldRow: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    fieldRowLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        padding: 4,
        backgroundColor: '#f0f0f0',
        borderBottom: '0.5 solid #cccccc',
        textAlign: 'left',
    },
    fieldRowValue: {
        fontSize: 9,
        color: '#000000',
        padding: 6,
        backgroundColor: '#ffffff',
        minHeight: 24,
        border: '0.5 solid #cccccc',
        borderTop: 'none',
    },
});

interface OfficialFieldProps {
    label: string;
    value?: string | number;
    placeholder?: string;
    required?: boolean;
    fullWidth?: boolean;
}

const OfficialField: React.FC<OfficialFieldProps> = ({ 
    label, 
    value, 
    placeholder = '........................',
    required = false,
    fullWidth = false
}) => {
    const hasValue = value !== undefined && value !== null && value !== '';
    
    if (fullWidth) {
        return (
            <View style={styles.fieldRow}>
                <Text style={styles.fieldRowLabel}>
                    {label}{required && <Text style={styles.requiredMarker}> *</Text>}:
                </Text>
                <Text style={[
                    styles.fieldRowValue,
                    ...(hasValue ? [] : [styles.fieldValueEmpty])
                ]}>
                    {hasValue ? String(value) : placeholder}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
                {label}{required && <Text style={styles.requiredMarker}> *</Text>}:
            </Text>
            <Text style={[
                styles.fieldValue,
                ...(hasValue ? [] : [styles.fieldValueEmpty])
            ]}>
                {hasValue ? String(value) : placeholder}
            </Text>
        </View>
    );
};

export default OfficialField;
