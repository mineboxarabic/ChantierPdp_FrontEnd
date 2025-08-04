import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    tableContainer: {
        marginBottom: 12,
        border: '2 solid #000000',
        backgroundColor: '#ffffff',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
        borderBottom: '1 solid #000000',
        padding: 0,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '0.5 solid #cccccc',
        minHeight: 24,
    },
    tableRowLast: {
        flexDirection: 'row',
        minHeight: 24,
    },
    tableCellHeader: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        padding: 6,
        textAlign: 'center',
        borderRight: '0.5 solid #999999',
        backgroundColor: '#e6e6e6',
        textTransform: 'uppercase',
    },
    tableCellHeaderLast: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        padding: 6,
        textAlign: 'center',
        backgroundColor: '#e6e6e6',
        textTransform: 'uppercase',
    },
    tableCell: {
        fontSize: 8,
        color: '#000000',
        padding: 6,
        borderRight: '0.5 solid #cccccc',
        backgroundColor: '#ffffff',
        textAlign: 'left',
        minHeight: 18,
    },
    tableCellLast: {
        fontSize: 8,
        color: '#000000',
        padding: 6,
        backgroundColor: '#ffffff',
        textAlign: 'left',
        minHeight: 18,
    },
    tableCellEmpty: {
        backgroundColor: '#fafafa',
        color: '#999999',
        fontStyle: 'italic',
    },
    tableCellCenter: {
        textAlign: 'center',
    },
    tableCellRight: {
        textAlign: 'right',
    },
});

interface Column {
    header: string;
    width: string;
    align?: 'left' | 'center' | 'right';
}

interface OfficialTableProps {
    columns: Column[];
    data: Record<string, any>[];
    minRows?: number;
    emptyRowText?: string;
}

const OfficialTable: React.FC<OfficialTableProps> = ({ 
    columns, 
    data, 
    minRows = 0,
    emptyRowText = "........................"
}) => {
    // Ensure minimum rows
    const allData = [...data];
    while (allData.length < minRows) {
        const emptyRow: Record<string, any> = {};
        columns.forEach(col => {
            emptyRow[Object.keys(data[0] || {})[columns.indexOf(col)] || col.header.toLowerCase().replace(/\s+/g, '')] = '';
        });
        allData.push(emptyRow);
    }

    return (
        <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
                {columns.map((column, index) => (
                    <Text 
                        key={index}
                        style={[
                            index === columns.length - 1 ? styles.tableCellHeaderLast : styles.tableCellHeader,
                            { width: column.width }
                        ]}
                    >
                        {column.header}
                    </Text>
                ))}
            </View>

            {/* Table Rows */}
            {allData.map((row, rowIndex) => (
                <View 
                    key={rowIndex} 
                    style={rowIndex === allData.length - 1 ? styles.tableRowLast : styles.tableRow}
                >
                    {columns.map((column, colIndex) => {
                        const cellKey = Object.keys(row)[colIndex] || column.header.toLowerCase().replace(/\s+/g, '');
                        const cellValue = row[cellKey];
                        const hasValue = cellValue !== undefined && cellValue !== null && cellValue !== '';
                        
                        let alignStyle = {};
                        if (column.align === 'center') alignStyle = styles.tableCellCenter;
                        if (column.align === 'right') alignStyle = styles.tableCellRight;

                        return (
                            <Text 
                                key={colIndex}
                                style={[
                                    colIndex === columns.length - 1 ? styles.tableCellLast : styles.tableCell,
                                    { width: column.width },
                                    alignStyle,
                                    ...(hasValue ? [] : [styles.tableCellEmpty])
                                ]}
                            >
                                {hasValue ? String(cellValue) : emptyRowText}
                            </Text>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

export default OfficialTable;
