# PDP System Analysis - Summary

## **Project Structure**
```
src/pages/PDP/
├── EditCreatePdp.tsx          # Main form component (6 tabs)
├── CreatePdpPage.tsx          # Entry point for creation
├── ViewPdp.tsx               # View existing PDPs
├── ViewAllPdps.tsx           # List all PDPs
└── tabs/
    ├── PdpTabGeneralInfo.tsx      # Basic info & dates (PDP-specific)
    ├── PdpTabHorairesDispo.tsx    # Work hours & facilities (PDP-specific) 
    ├── PdpTabRisquesDispositifs.tsx # Risks & devices (GLOBALIZABLE) By relations type RISQUE and DISPOSITIF
    ├── PdpTabPermits.tsx          # Permits management (GLOBALIZABLE) By relations type PERMIS
    ├── PdpTabAnalysesRisques.tsx  # Risk analyses (GLOBALIZABLE) By relations type ANALYSE_DE_RISQUE
    ├── PdpTabDocumentSigning.tsx  # Document signing (GLOBALIZABLE) By signatures 
    └── RequiredPermitModal.tsx    # Permit modal
```

## **Data Architecture**
```typescript
// Inheritance Structure
interface DocumentDTO {
  id?, chantier?, entrepriseExterieure?, donneurDOrdre?
  status?, actionType?, date?, creationDate?
  signatures?: number[]          // ✅ Used by signing tab
  relations?: ObjectAnsweredDTO[] // ✅ Used by relations tabs
}

interface PdpDTO extends DocumentDTO {
  // PDP-specific fields:
  dateInspection?, icpdate?, datePrevenirCSSCT?, datePrev?
  horairesDetails?, entrepriseDInspection?
  horaireDeTravail?, misesEnDisposition?
}
```

## **Tab System (6 Tabs)**

### **Tabs Using ONLY DocumentDTO (Globalizable)**
```typescript
// Tab 2: Risks & Devices - Uses formData.relations
PdpTabRisquesDispositifs ✅
  - Manages RISQUE and DISPOSITIF relations
  - Can be renamed: DocumentTabRelations

// Tab 3: Permits - Uses formData.relations  
PdpTabPermits ✅
  - Manages PERMIT relations
  - Can be renamed: DocumentTabPermits

// Tab 4: Risk Analyses - Uses formData.relations
PdpTabAnalysesRisques ✅
  - Manages ANALYSE_DE_RISQUE relations
  - Can be renamed: DocumentTabRiskAnalyses

// Tab 5: Document Signing - Uses formData.chantier, formData.signatures
PdpTabDocumentSigning ✅
  - Signature workflow management
  - Can be renamed: DocumentTabSigning
```

### **Tabs Using PDP-Specific Fields (NOT Globalizable)**
```typescript
// Tab 0: General Info - Uses PDP-specific fields
PdpTabGeneralInfo ❌
  - Uses: entrepriseDInspection, dateInspection, icpdate, etc.

// Tab 1: Hours & Facilities - Uses PDP-specific fields  
PdpTabHorairesDispo ❌
  - Uses: horairesDetails, horaireDeTravail, misesEnDisposition
```

## **Navigation System**
```typescript
// Smart validation-based navigation
const handleNavigateNext = () => {
  const validation = validateForm(formData, false);
  if ((validation.isValid || validation.hasWarnings) && tabIndex < 5) {
    setTabIndex(prev => prev + 1);
  }
}

// Tab structure: 0=General, 1=Hours, 2=Risks, 3=Permits, 4=Analyses, 5=Signatures
```

## **Key Features**
- **Relations Management**: Uses `formData.relations` array for linking objects
- **Permit Requirements**: Auto-tracking of required permits based on risks
- **Document Signing**: Integrated signature workflow
- **Validation System**: Smart form validation with tolerant save
- **Multi-Modal System**: Dialogs for adding/editing relations

## **Generalization Strategy**
```typescript
// Generic document tab interface
interface DocumentTabProps<T extends DocumentDTO> {
  formData: T;
  errors: Record<string, string>;
  // ... other common props
}

// 4 out of 6 tabs can be made generic for any DocumentDTO subtype
// 2 tabs remain PDP-specific (General Info, Hours/Facilities)
```

## **Business Logic**
- **Risk → Permit Linking**: Dangerous risks automatically require specific permit types
- **Multi-step Workflow**: 6-tab process with validation at each step
- **Document Inheritance**: Leverages DocumentDTO base class for common functionality
- **Safety Compliance**: Ensures all required permits and analyses are linked before completion