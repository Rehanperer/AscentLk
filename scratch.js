const fs = require('fs');

const asciiPath = './src/pages/AsciiDemoPage.tsx';
const loadingPath = './src/components/LoadingScreen.tsx';

let code = fs.readFileSync(asciiPath, 'utf8');

// 1. Add framer-motion import
code = code.replace(
    `import React, { useEffect, useRef, useState } from 'react';`,
    `import React, { useEffect, useRef, useState } from 'react';\nimport { motion } from 'framer-motion';\nimport { useAudio } from '../hooks/useAudio';`
);

// 2. Remove Link import
code = code.replace(`import { Link } from 'react-router-dom';\n`, '');

// 3. Rename component and add props
code = code.replace(
    `const AsciiDemoPage: React.FC = () => {`,
    `interface LoadingScreenProps {\n    onComplete?: () => void;\n}\n\nconst LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {\n    const { playSuccess } = useAudio();`
);

// 4. Add complete trigger
code = code.replace(
    `if (settled && !logoVisible) setLogoVisible(true);`,
    `if (settled && !logoVisible) {\n                setLogoVisible(true);\n                setTimeout(() => {\n                    if (onComplete) onComplete();\n                }, 2500);\n            }`
);

// 5. Replace wrapper <div> with <motion.div> to maintain exit effects
code = code.replace(
    `<div className="relative w-full h-screen bg-[#08080a] overflow-hidden font-teko">`,
    `<motion.div \n            className="fixed inset-0 z-[9999] bg-[#08080a] overflow-hidden font-teko"\n            initial={{ opacity: 1 }}\n            exit={{\n                opacity: 0,\n                scaleY: 0.005,\n                scaleX: 0,\n                filter: "brightness(500%)",\n                transition: { duration: 0.5, ease: "circIn" }\n            }}\n        >`
);

code = code.replace(
    `export default AsciiDemoPage;`,
    `export default LoadingScreen;`
);

// Remove the HUD UI (Top bar with AsciiMorph tag and Link) completely
code = code.replace(
    /<div className="absolute top-0 left-0 w-full p-6 z-10(.*?)\/div>\n\s+<\/div>/s,
    ''
);

// Change root closing tag
code = code.replace(
    `</div >`, // Might not match exactly so let's use regex
    ``
);
code = code.replace(/<\/div>(?![\s\S]*<\/div>)/, '</motion.div>'); // Replace the VERY LAST </div> with </motion.div>

fs.writeFileSync(loadingPath, code, 'utf8');
console.log('LoadingScreen.tsx overwritten!');
