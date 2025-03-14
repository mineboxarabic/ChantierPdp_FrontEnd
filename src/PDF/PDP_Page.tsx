import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from "../assets/DANONE_LOGO_VERTICAL_SIMPLE.png";
import {Pdp} from "../utils/pdp/Pdp.ts";
import CostomPage from "./components/Page.tsx";
import Grid from "./components/Grid.tsx";
import Horizontal from "./components/Horizontal.tsx";
import Devider from "./components/Devider.tsx";
const styles = StyleSheet.create({
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


interface PDP_PageProps {
    currentPdp: Pdp;
}

const PDP_Page = ({ currentPdp }:PDP_PageProps) => (

    <Document>
        <CostomPage>
            <Horizontal>
                <Image src={logo} style={{ width: 50, objectFit: 'cover' }} />
                <Text style={{ fontSize: 30, marginLeft: 10 }}>Plan de Prévention</Text>
            </Horizontal>
            <Devider />
        </CostomPage>
        <CostomPage>
            <Horizontal>
                <Image src={logo} style={{ width: 50, objectFit: 'cover' }} />
                <Text style={{ fontSize: 30, marginLeft: 10 }}>Plan de Prévention</Text>
            </Horizontal>
            <Devider />
        </CostomPage>
    </Document>
);

export default PDP_Page;
