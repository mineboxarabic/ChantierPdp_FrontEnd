import React, { useRef, useState, useCallback, useEffect } from 'react';
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

    // Initialize canvas on mount
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set up canvas for high DPI displays
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        
        // Set drawing styles
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
    }, []);

    const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if ('touches' in e) {
            e.preventDefault(); // Prevent scrolling
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (disabled) return;
        
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e);

        ctx.beginPath();
        ctx.moveTo(x, y);
        setHasSignature(true);
    }, [disabled]);

    const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || disabled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e);

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

        const rect = canvas.getBoundingClientRect();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
        setHasSignature(false);
    }, []);

    const saveSignature = useCallback(() => {
        if (!hasSignature) {
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const signatureData = canvas.toDataURL('image/png');
        // Remove the "data:image/png;base64," prefix for backend compatibility
        const base64Data = signatureData.replace(/^data:image\/[a-z]+;base64,/, '');

        onSignatureSave(base64Data);
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

            <Box sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 1, 
                mb: 2,
                width: '100%',
                height: '200px',
                position: 'relative'
            }}>
                <canvas
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
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
