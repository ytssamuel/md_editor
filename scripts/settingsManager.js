/**
 * 處理所有與設定面板相關的邏輯
 */

// 顏色對應表
const colorMap = {
    'default-text': { dark: '#abb2bf', light: '#343a40' },
    'blue':         { dark: '#61afef', light: '#0056b3' },
    'red':          { dark: '#e06c75', light: '#c82333' },
    'orange':       { dark: '#d19a66', light: '#e08e0b' },
    'green':        { dark: '#98c379', light: '#218838' },
    'purple':       { dark: '#c678dd', light: '#563d7c' }
};

// 標題預設顏色
const defaultHeadingColors = {
    h1: 'blue',
    h2: 'blue',
    h3: 'green'
};

const applyHeadingColors = () => {
    const root = document.documentElement;
    const isLightMode = document.body.classList.contains('light-mode');
    const theme = isLightMode ? 'light' : 'dark';

    const h1Key = localStorage.getItem('h1ColorKey') || defaultHeadingColors.h1;
    const h2Key = localStorage.getItem('h2ColorKey') || defaultHeadingColors.h2;
    const h3Key = localStorage.getItem('h3ColorKey') || defaultHeadingColors.h3;

    root.style.setProperty('--h1-color', colorMap[h1Key][theme]);
    root.style.setProperty('--h2-color', colorMap[h2Key][theme]);
    root.style.setProperty('--h3-color', colorMap[h3Key][theme]);
};

const loadSettings = () => {
    applyHeadingColors();
    document.getElementById('h1-color').value = localStorage.getItem('h1ColorKey') || defaultHeadingColors.h1;
    document.getElementById('h2-color').value = localStorage.getItem('h2ColorKey') || defaultHeadingColors.h2;
    document.getElementById('h3-color').value = localStorage.getItem('h3ColorKey') || defaultHeadingColors.h3;
};

export const settingsManager = {
    init: (updateCallback) => {
        const settingsModal = document.getElementById('settingsModal');

        document.getElementById('settings-btn').addEventListener('click', () => {
            settingsModal.style.display = 'flex';
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            const h1ColorKey = document.getElementById('h1-color').value;
            const h2ColorKey = document.getElementById('h2-color').value;
            const h3ColorKey = document.getElementById('h3-color').value;

            localStorage.setItem('h1ColorKey', h1ColorKey);
            localStorage.setItem('h2ColorKey', h2ColorKey);
            localStorage.setItem('h3ColorKey', h3ColorKey);

            applyHeadingColors();
            updateCallback();
            settingsModal.style.display = 'none';
        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            localStorage.removeItem('h1ColorKey');
            localStorage.removeItem('h2ColorKey');
            localStorage.removeItem('h3ColorKey');

            loadSettings();
            updateCallback();
            settingsModal.style.display = 'none';
        });

        loadSettings();
    },
    applyHeadingColors
};
//             closeModal();
//         });

//         loadSettings();
//     },
//     applyHeadingColors
// };
