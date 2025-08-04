import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    fieldGroup: {
        flexDirection: 'row',
        marginBottom: 6,
        alignItems: 'flex-start',
    },
    fieldLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#333333',
        width: '35%',
        paddingRight: 6,
    },
    fieldValue: {
        fontSize: 9,
        color: '#000000',
        width: '65%',
        backgroundColor: '#ffffff',
        padding: 4,
        borderRadius: 2,
        border: '1 solid #cccccc',
        minHeight: 12,
    },
    fieldValueFilled: {
        backgroundColor: '#ffffff',
        border: '1 solid #999999',
    },
    fieldValueEmpty: {
        backgroundColor: '#f5f5f5',
        color: '#999999',
        fontStyle: 'italic',
    },
});

interface ModernFieldProps {
    label: string;
    value?: string | number;
    placeholder?: string;
}

const ModernField: React.FC<ModernFieldProps> = ({ 
    label, 
    value, 
    placeholder = '' 
}) => {
    const hasValue = value !== undefined && value !== null && value !== '';
    
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{label}:</Text>
            <Text style={[
                styles.fieldValue,
                hasValue ? styles.fieldValueFilled : styles.fieldValueEmpty
            ]}>
                {hasValue ? String(value) : placeholder}
            </Text>
        </View>
    );
};

export default ModernField;
