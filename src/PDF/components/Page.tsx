import {Page, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
        fontWeight: "normal",
        fontFamily: "Inter",
    }
});

const CostomPage = ({ children }) => (

    <Page size={'A4'} style={styles.page}>
        {children}
    </Page>
);

export default CostomPage;