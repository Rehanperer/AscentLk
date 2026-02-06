import { useRef, useEffect } from 'react';
import useSound from 'use-sound';

// Premium UI Sound Assets (Publicly available high-quality UI sounds)
const SOUNDS = {
    hover: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Subtle tech blip
    click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Clean tech click
    glitch: 'https://assets.mixkit.co/active_storage/sfx/2591/2591-preview.mp3', // Error/Glitch effect
    whoosh: 'https://assets.mixkit.co/active_storage/sfx/2561/2561-preview.mp3', // Fast transition whoosh
    success: 'https://assets.mixkit.co/active_storage/sfx/2581/2581-preview.mp3', // Success/Confirm
};

export const useAudio = () => {
    const [playHover] = useSound(SOUNDS.hover, { volume: 0.25 });
    const [playClick] = useSound(SOUNDS.click, { volume: 0.4 });
    const [playGlitch] = useSound(SOUNDS.glitch, { volume: 0.3 });
    const [playWhoosh] = useSound(SOUNDS.whoosh, { volume: 0.4 });
    const [playSuccess] = useSound(SOUNDS.success, { volume: 0.5 });

    return {
        playHover,
        playClick,
        playGlitch,
        playWhoosh,
        playSuccess,
    };
};
