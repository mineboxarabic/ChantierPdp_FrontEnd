# Development Guidelines for ChantierPdp Application
- Dont write code until i ask you to do so.
- When you want to build dont build for production, build for development.
- Dont correct errors that has nothing to do with the task i asked you to do.
- please read the src from Chantier_Frontend and read Chantier_Backend to understand project to know it's context and structure and design i am using.
- if you are not sure about something, ask me before making changes.
- if there is a not found module search for it in the project or a replacment and if you dont find it ask me or create it.
- Read the entire document before starting any task.
- if i ask you to make a task with frontend check if a component already exists that can be used or modified instead of creating a new one.
- if i ask you to make a task with backend check if an endpoint already exists that can be used or modified instead of creating a new one.

## 🚀 Overview
This is a React TypeScript frontend with Spring Boot backend application for managing construction site safety documentation (PDP, BDT, Risk Analysis). Follow these guidelines for efficient development and maintainability.

1. **Analyze Requirements**
   - Understand the business logic
   - Check existing similar implementations
   - Identify affected entities and relationships

2. **Check Backend APIs**
   - Verify endpoint availability in controllers
   - Check DTO structure matches your needs
   - Test API responses with actual data

3. **Review Frontend Architecture**
   - Look for existing similar components
   - Check if Generic CRUD can be used
   - Understand the routing structure


Always check for errors after each change
   # Frontend
   npm run build
   npm run type-check


2. **Common Error Sources**
   - TypeScript type mismatches
   - Missing imports or exports
   - API endpoint mismatches
   - DTO structure differences



### Build Validation

After every significant change:

1. **Frontend Build**
   cd ChantierPdp_FrontEnd
   npm run build


3. **Responsive Design**
   - Use Material-UI breakpoints
   - Implement mobile-friendly interfaces
   - Test on different screen sizes



### Do's
- ✅ Use the existing Generic CRUD system when possible
- ✅ Follow Material-UI design patterns
- ✅ Implement proper TypeScript typing
- ✅ Check API endpoints before frontend work
- ✅ Build and test after each significant change
- ✅ Use consistent component patterns
- ✅ Implement smart user workflows
- ✅ Handle errors gracefully
- ✅ Modern style and responsive design

### Don'ts
- ❌ Create new CRUD from scratch if Generic CRUD works
- ❌ Ignore TypeScript warnings
- ❌ Skip testing API endpoints
- ❌ Forget to handle loading/error states
- ❌ Use hardcoded values instead of dynamic data
- ❌ Ignore existing design patterns
- ❌ Skip the build validation step


### Quick Fixes

1. **Update DTOs** when backend changes
2. **Rebuild** after dependency changes
3. **Clear cache** if seeing stale data
4. **Check logs** for specific error messages

Remember: This application has a solid foundation with Generic CRUD, Material-UI, and Spring Boot. Build upon existing patterns and always validate your changes.

### Backend API Endpoints
All endpoints follow the pattern `/api/{entity}` with standardized CRUD operations:

#### Core Entities and Endpoints:

1. **PDP Management** - `/api/pdp`
   - `GET /api/pdp` - List all PDPs
   - `GET /api/pdp/{id}` - Get PDP by ID
   - `POST /api/pdp` - Create new PDP
   - `PUT /api/pdp/{id}` - Update PDP
   - `DELETE /api/pdp/{id}` - Delete PDP

2. **Chantier Management** - `/api/chantier`
   - `GET /api/chantier` - List all construction sites
   - `GET /api/chantier/{id}` - Get specific chantier
   - `POST /api/chantier` - Create new chantier
   - `PUT /api/chantier/{id}` - Update chantier
   - `DELETE /api/chantier/{id}` - Delete chantier

3. **BDT (Safety Documents)** - `/api/bdt`
   - Full CRUD operations for safety documentation

4. **Enterprise Management** - `/api/entreprise`
   - Manage external companies (EE) and user companies (EU)

5. **User Management** - `/api/user`
   - User authentication and management

6. **Risk Analysis** - `/api/analyseDeRisque`
   - Risk assessment documentation

7. **Workers** - `/api/worker`
   - Worker registration and management

8. **Permits** - `/api/permit`
   - Work permit management

9. **Safety Devices** - `/api/dispositif`
   - Safety equipment and devices

10. **Security Audits** - `/api/auditsecu`
    - Safety audit management

11. **Dashboard** - `/api/dashboard`
    - Analytics and statistics

12. **Authentication** - `/api/auth`
    - Login, logout, token refresh

### DTO Structure

All entities have corresponding DTOs in both frontend and backend:
