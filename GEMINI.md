# Gemini Development Guidelines for ChantierPdp

## 1. Project Overview

-   **Frontend:** React, TypeScript, Material-UI. Located in `ChantierPdp_FrontEnd`.
-   **Backend:** Java, Spring Boot. Located in `ChantierPdp_BackEnd`.
-   **Purpose:** Manage construction site safety documentation (PDP, BDT, Risk Analysis).

## 2. Core Instructions

-   **Analyze Existing Code:** Before creating new components or services, check for existing implementations that can be reused or modified.
-   **Use Generic CRUD:** Prioritize using the existing `GenericCRUD` system for new entities.
-   **Follow Conventions:** Adhere to the existing coding style, architecture, and Material-UI design patterns.
-   **Verify Changes:** After any significant modification, run the appropriate build and validation commands.

## 3. Build and Validation

### Frontend

-   **Build (Development):** `npm run build` in `ChantierPdp_FrontEnd`
-   **Type Check:** `npm run type-check` in `ChantierPdp_FrontEnd`

## 4. Backend API Endpoints

All endpoints are prefixed with `/api`.

-   `/pdp`: PDP Management
-   `/chantier`: Chantier Management
-   `/bdt`: BDT (Safety Documents) Management
-   `/entreprise`: Enterprise Management
-   `/user`: User Management
-   `/analyseDeRisque`: Risk Analysis Management
-   `/worker`: Worker Management
-   `/permit`: Permit Management
-   `/dispositif`: Safety Device Management
-   `/auditsecu`: Security Audit Management
-   `/dashboard`: Dashboard Data
-   `/auth`: Authentication

## 5. Data Transfer Objects (DTOs)

-   Each backend entity has a corresponding DTO.
-   Ensure frontend TypeScript interfaces match the backend DTO structures.