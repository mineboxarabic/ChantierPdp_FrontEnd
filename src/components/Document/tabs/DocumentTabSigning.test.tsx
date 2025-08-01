import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DocumentTabSigning from './DocumentTabSigning';
import { WorkerDTO } from '../../../utils/entitiesDTO/WorkerDTO';
import { DocumentDTO } from '../../../utils/entitiesDTO/DocumentDTO';

// Mock the hooks
const mockGetWorkersForChantier = vi.fn();
const mockGetSignaturesByDocumentId = vi.fn();

vi.mock('../../../hooks/useDocument', () => ({
    default: () => ({
        getSignaturesByDocumentId: mockGetSignaturesByDocumentId,
        signDocumentByWorker: vi.fn(),
        signDocumentByUser: vi.fn(),
        unsignDocumentByWorker: vi.fn(),
        unsignDocumentByUser: vi.fn(),
    }),
}));

vi.mock('../../../hooks/useWorkerSelection', () => ({
    default: () => ({
        getWorkersForChantier: mockGetWorkersForChantier,
    }),
}));

vi.mock('../../DocumentSigning/SignaturePad', () => ({
    default: ({ onSignatureSave, disabled }: any) => (
        <div data-testid="signature-pad">
            SignaturePad Component {disabled ? '(disabled)' : '(enabled)'}
        </div>
    ),
}));

describe('DocumentTabSigning', () => {
    const mockFormData: DocumentDTO = {
        id: 1,
        entrepriseExterieure: 1,
        chantier: 123, // Specific chantier ID
    };

    const mockWorkersMap = new Map<number, WorkerDTO>([
        [1, { id: 1, nom: 'Doe', prenom: 'John', entreprise: 1 }],
        [2, { id: 2, nom: 'Smith', prenom: 'Jane', entreprise: 1 }],
    ]);

    const mockChantierWorkers: WorkerDTO[] = [
        { id: 1, nom: 'Doe', prenom: 'John', entreprise: 1 },
        { id: 3, nom: 'Johnson', prenom: 'Bob', entreprise: 1 }, // Only workers assigned to this chantier
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockGetWorkersForChantier.mockResolvedValue(mockChantierWorkers);
        mockGetSignaturesByDocumentId.mockResolvedValue([]);
    });

    it('renders the signature component successfully', async () => {
        render(
            <DocumentTabSigning
                formData={mockFormData}
                allWorkersMap={mockWorkersMap}
                currentUserId={1}
            />
        );

        // Check if the main elements are rendered
        expect(screen.getByText('Signature des Documents')).toBeInTheDocument();
        expect(screen.getByText('Mode de signature')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Signature Travailleur' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Signature Donneur d\'Ordre' })).toBeInTheDocument();
    });

    it('loads and displays only workers assigned to the specific chantier', async () => {
        render(
            <DocumentTabSigning
                formData={mockFormData}
                allWorkersMap={mockWorkersMap}
                currentUserId={1}
            />
        );

        // Verify that getWorkersForChantier was called with the correct chantier ID
        expect(mockGetWorkersForChantier).toHaveBeenCalledWith(123);

        // Wait for workers to load and check if only chantier workers are displayed
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        });

        // Jane Smith should NOT be displayed because she's not assigned to this chantier
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    it('shows correct worker status sections', async () => {
        render(
            <DocumentTabSigning
                formData={mockFormData}
                allWorkersMap={mockWorkersMap}
                currentUserId={1}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('État des Signatures - Travailleurs du Chantier')).toBeInTheDocument();
            expect(screen.getByText('État des Signatures - Utilisateurs (Donneur d\'Ordre)')).toBeInTheDocument();
        });
    });

    it('shows loading state for workers', () => {
        mockGetWorkersForChantier.mockImplementation(() => new Promise(() => {})); // Never resolves

        render(
            <DocumentTabSigning
                formData={mockFormData}
                allWorkersMap={mockWorkersMap}
                currentUserId={1}
            />
        );

        expect(screen.getByText('Chargement des travailleurs du chantier...')).toBeInTheDocument();
    });

    it('shows warning when no workers are assigned to chantier', async () => {
        mockGetWorkersForChantier.mockResolvedValue([]);

        render(
            <DocumentTabSigning
                formData={mockFormData}
                allWorkersMap={mockWorkersMap}
                currentUserId={1}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Aucun travailleur assigné à ce chantier. Veuillez d\'abord assigner des travailleurs au chantier.')).toBeInTheDocument();
        });
    });

    it('shows user selection in donneur d\'ordre mode', async () => {
        render(
            <DocumentTabSigning
                formData={mockFormData}
                allWorkersMap={mockWorkersMap}
                currentUserId={1}
            />
        );

        // Switch to donneur d'ordre mode
        const donneurButton = screen.getByText('Signature Donneur d\'Ordre');
        fireEvent.click(donneurButton);

        await waitFor(() => {
            expect(screen.getByRole('combobox', { name: /sélectionner un utilisateur/i })).toBeInTheDocument();
            expect(screen.getByText('Mode signature donneur d\'ordre - Sélectionnez l\'utilisateur qui va signer.')).toBeInTheDocument();
        });
    });

    it('shows signature pad in worker mode', async () => {
        render(
            <DocumentTabSigning
                formData={mockFormData}
                allWorkersMap={mockWorkersMap}
                currentUserId={1}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('signature-pad')).toBeInTheDocument();
        });
    });

    it('Filters out already signed workers from selection dropdown', async () => {
        // Mock a signature for worker ID 1
        mockGetSignaturesByDocumentId.mockResolvedValue([
            { id: 1, workerId: 1, userId: null, prenom: 'John', nom: 'Doe' }
        ]);

        render(
            <DocumentTabSigning
                formData={mockFormData}
                allWorkersMap={mockWorkersMap}
                currentUserId={1}
            />
        );

        await waitFor(() => {
            // John Doe should show as signed in the status list
            expect(screen.getByText('Signé')).toBeInTheDocument();
        });
    });
});
