import {StyleSheet} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    section: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        border: '1px solid #ccc',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1976d2',
    },
    text: {
        fontSize: 12,
        marginBottom: 2,
        color: '#333',
    },
});

export default styles;