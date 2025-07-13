import React, { useRef, useState, useCallback } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Alert
} from '@mui/material';
import { Clear, Save } from '@mui/icons-material';

interface SignaturePadProps {
    onSignatureSave: (signatureData: string) => void;
    disabled?: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureSave, disabled = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (disabled) return;
        
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setHasSignature(true);
    }, [disabled]);

    const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || disabled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(x, y);
        ctx.stroke();
    }, [isDrawing, disabled]);

    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
    }, []);

    const clearSignature = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    }, []);

    const saveSignature = useCallback(() => {
        if (!hasSignature) {
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const signatureData = canvas.toDataURL('image/png');
        onSignatureSave(signatureData);
    }, [hasSignature, onSignatureSave]);

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Zone de Signature
            </Typography>
            
            {disabled && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Veuillez sélectionner un travailleur avant de signer
                </Alert>
            )}

            <Box sx={{ border: '2px dashed #ccc', borderRadius: 1, mb: 2 }}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    style={{
                        width: '100%',
                        height: '200px',
                        cursor: disabled ? 'not-allowed' : 'crosshair',
                        touchAction: 'none'
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={clearSignature}
                    disabled={!hasSignature || disabled}
                >
                    Effacer
                </Button>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveSignature}
                    disabled={!hasSignature || disabled}
                >
                    Sauvegarder Signature
                </Button>
            </Box>
        </Paper>
    );
};

export default SignaturePad;
