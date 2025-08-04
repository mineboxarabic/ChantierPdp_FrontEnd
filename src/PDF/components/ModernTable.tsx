import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    tableContainer: {
        borderRadius: 2,
        border: '1 solid #cccccc',
        marginBottom: 12,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottom: '1 solid #cccccc',
    },
    tableHeaderCell: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#333333',
        padding: 8,
        textAlign: 'center',
        borderRight: '1 solid #cccccc',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1 solid #eeeeee',
        minHeight: 25,
    },
    tableRowEven: {
        backgroundColor: '#fafafa',
    },
    tableRowOdd: {
        backgroundColor: '#ffffff',
    },
    tableCell: {
        fontSize: 8,
        color: '#333333',
        padding: 6,
        textAlign: 'center',
        borderRight: '1 solid #eeeeee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableCellLeft: {
        textAlign: 'left',
    },
    emptyRow: {
        color: '#999999',
        fontStyle: 'italic',
    },
});

interface TableColumn {
    header: string;
    width: string;
    align?: 'left' | 'center' | 'right';
}

interface TableRow {
    [key: string]: string | number;
}

interface ModernTableProps {
    columns: TableColumn[];
    data: TableRow[];
    minRows?: number;
    emptyRowText?: string;
}

const ModernTable: React.FC<ModernTableProps> = ({ 
    columns, 
    data, 
    minRows = 0,
    emptyRowText = ''
}) => {
    // Ensure we have at least minRows
    const displayData = [...data];
    while (displayData.length < minRows) {
        const emptyRow: TableRow = {};
        columns.forEach((_, index) => {
            emptyRow[`col${index}`] = '';
        });
        displayData.push(emptyRow);
    }

    return (
        <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
                {columns.map((column, index) => (
                    <Text 
                        key={`header-${column.header}-${index}`}
                        style={[
                            styles.tableHeaderCell, 
                            { width: column.width },
                            ...(index === columns.length - 1 ? [{ borderRight: 'none' }] : [])
                        ]}
                    >
                        {column.header}
                    </Text>
                ))}
            </View>

            {/* Table Rows */}
            {displayData.map((row, rowIndex) => {
                const rowKeys = Object.keys(row).join('-');
                const uniqueKey = rowKeys || `empty-${rowIndex}`;
                
                return (
                    <View 
                        key={`row-${uniqueKey}`}
                        style={[
                            styles.tableRow,
                            rowIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                        ]}
                    >
                        {columns.map((column, colIndex) => {
                            const cellKey = Object.keys(row)[colIndex] || `col${colIndex}`;
                            const cellValue = row[cellKey];
                            const isEmpty = !cellValue || cellValue === '';
                            
                            return (
                                <Text 
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    style={[
                                        styles.tableCell,
                                        { width: column.width },
                                        ...(column.align === 'left' ? [styles.tableCellLeft] : []),
                                        ...(isEmpty ? [styles.emptyRow] : []),
                                        ...(colIndex === columns.length - 1 ? [{ borderRight: 'none' }] : [])
                                    ]}
                                >
                                    {isEmpty ? emptyRowText : String(cellValue)}
                                </Text>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
};

export default ModernTable;