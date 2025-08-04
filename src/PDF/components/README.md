# Modern BDT PDF Components

This folder contains modernized, reusable components for generating BDT (Bon de Travail) PDF documents with a contemporary design.

## Components Overview

### 🎨 Design Philosophy
- **Modern & Clean**: Replaced cubic, outdated styling with rounded corners, subtle shadows, and modern colors
- **Component-Based**: Highly reusable components that can be easily maintained and extended
- **Icon-Rich**: Uses modern emojis and icons throughout for better visual communication
- **Professional**: Maintains corporate standards while improving readability

### 📦 Available Components

#### 1. **ModernCard**
A versatile container component with modern styling.
- Rounded corners with subtle shadows
- Customizable accent colors
- Built-in header with title and subtitle support
- Clean content area

#### 2. **ModernField**
Displays label-value pairs with modern styling.
- Consistent field layouts
- Automatic placeholder handling for empty values
- Modern input-like styling with subtle backgrounds

#### 3. **ModernTable**
A flexible table component with modern design.
- Alternating row colors for better readability
- Rounded corners and clean borders
- Responsive column widths
- Support for minimum rows with empty state handling

#### 4. **ModernIcon**
Displays icons with labels and status indicators.
- Circular icon containers with customizable colors
- Status indicators (OK, Warning, Danger)
- Clean typography for labels and descriptions

#### 5. **ModernHeader**
Modern document header with professional layout.
- Prominent logo placement
- Clean typography hierarchy
- Document metadata (number, date)
- Eye-catching banner for important notices

#### 6. **RiskItem**
Specialized component for displaying risks with visual indicators.
- Color-coded risk levels (Low: Green, Medium: Yellow, High: Red)
- Modern icons based on risk type (🔥 for fire, ⚡ for electrical, etc.)
- Interactive status checkboxes
- Dangerous work highlighting

#### 7. **ModernSignature**
Professional signature areas with modern styling.
- Clean signature boxes with rounded corners
- Date stamps
- Important footer notices with warning styling

### 🎯 Key Improvements

#### Visual Design
- **Colors**: Modern color palette with semantic meanings
  - Blue (#3b82f6): Primary/Information
  - Green (#059669): Success/Confirmation
  - Yellow (#f59e0b): Warning/Attention
  - Red (#dc2626): Danger/Critical
  - Gray tones: Professional neutrals

#### Typography
- **Hierarchy**: Clear font size and weight hierarchy
- **Readability**: Improved line spacing and contrast
- **Consistency**: Standardized font sizes across components

#### Icons & Visual Elements
- **Risk Icons**: Contextual icons based on risk type
  - 🔥 Fire/Incendie
  - ⚡ Electrical/Électrique
  - 📉 Falls/Chutes
  - 🔊 Noise/Bruit
  - 🧪 Chemical/Chimique
  - ⚙️ Machinery/Machines
  - ☢️ Radiation
  - 💨 Gas/Gaz
  - 🌡️ Temperature/Température
  - 👤 Ergonomics/Ergonomie

#### Layout & Spacing
- **Grid System**: Consistent spacing and alignment
- **White Space**: Generous spacing for better readability
- **Responsive**: Flexible layouts that work across different content sizes

### 🔧 Usage Examples

```tsx
// Using ModernCard
<ModernCard 
    title="🏢 Company Information" 
    subtitle="Enterprise details"
    accentColor="#1d4ed8"
>
    <ModernField label="Name" value={company.name} />
    <ModernField label="Address" value={company.address} />
</ModernCard>

// Using ModernTable
<ModernTable
    columns={[
        { header: 'Task', width: '40%', align: 'left' },
        { header: 'Status', width: '20%' },
        { header: 'Priority', width: '40%' }
    ]}
    data={taskData}
    minRows={5}
/>

// Using RiskItem
<RiskItem
    title="Electrical Risk"
    description="High voltage equipment present"
    riskLevel="high"
    isDangerous={true}
    icon="⚡"
/>
```

### 🚀 Benefits

1. **Maintainability**: Modular components are easier to update and maintain
2. **Consistency**: Standardized styling across all PDF documents
3. **Reusability**: Components can be used in other PDF documents
4. **Modern Appeal**: Professional, contemporary design improves document perception
5. **Accessibility**: Better contrast and typography improve readability
6. **Extensibility**: Easy to add new components or modify existing ones

### 📋 Data Integration

The components seamlessly integrate with existing DTO structures:
- `BdtDTO` for main document data
- `EntrepriseDTO` for company information
- `ChantierDTO` for worksite details
- `RisqueDTO` for risk information
- `AnalyseDeRisqueDTO` for risk analysis
- `AuditSecuDTO` for security audits

All components handle empty/null data gracefully with appropriate placeholders and empty states.
