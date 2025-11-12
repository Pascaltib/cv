'use client';

import { useEffect } from 'react';
import fluidCursor from '@/hooks/use-FluidCursor';

const FluidCursor = () => {
    useEffect(() => {
        fluidCursor();
    }, []);

    return (
        <canvas
            id='fluid'
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 100,
                pointerEvents: 'none',
                opacity: 0.6
            }}
        />
    );
};

export default FluidCursor;
