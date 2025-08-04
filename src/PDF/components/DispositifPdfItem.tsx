import React from 'react';
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import DispositifDTO from '../../utils/entitiesDTO/DispositifDTO';

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        padding: 6,
        border: '1 solid #e0e0e0',
        borderRadius: 4,
        backgroundColor: '#f9f9f9',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333333',
        flexGrow: 1,
    },
    typeChip: {
        fontSize: 8,
        fontWeight: 'bold',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
        color: '#ffffff',
    },
    description: {
        fontSize: 9,
        color: '#555555',
        lineHeight: 1.4,
    },
    imageContainer: {
        marginTop: 8,
        alignItems: 'center',
    },
    image: {
        maxWidth: '100%',
        maxHeight: 80,
        objectFit: 'contain',
    },
});

interface DispositifPdfItemProps {
    dispositif: DispositifDTO;
}

const DispositifPdfItem: React.FC<DispositifPdfItemProps> = ({ dispositif }) => {
    const chipColor = dispositif.type === 'EPI' ? '#1976d2' : '#4CAF50'; // Material-UI info and success colors

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{dispositif.title || 'Dispositif'}</Text>
                {dispositif.type && (
                    <Text style={{ ...styles.typeChip, backgroundColor: chipColor }}>
                        {dispositif.type}
                    </Text>
                )}
            </View>
            {dispositif.description && (
                <Text style={styles.description}>{dispositif.description}</Text>
            )}
            {dispositif.logo?.imageData && (
                <View style={styles.imageContainer}>
                    <Image
                        src={`data:${dispositif.logo.mimeType};base64,${dispositif.logo.imageData}`}
                        style={styles.image}
                    />
                </View>
            )}
        </View>
    );
};

export default DispositifPdfItem;
