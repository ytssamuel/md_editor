import { markdownRenderer } from './markdownRenderer.js';
import { fileHandler } from './fileHandler.js';
import { uiManager } from './uiManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素引用
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const gutter = document.getElementById('gutter');
    const splitContainer = document.getElementById('split-container');
    const lineNumbers = document.getElementById('lineNumbers');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const viewButtonsContainer = document.getElementById('view-mode-bar');
    const navList = document.getElementById('nav-list');
    const mainHeader = document.getElementById('main-header');
    const topToggleBtn = document.getElementById('top-toggle-btn');
    
    // 取得面板元素
    const editorPanel = document.getElementById('editor-panel');
    const previewPanel = document.getElementById('preview-panel');

    // 顏色對應表
    const colorMap = {
        'default-text': { dark: '#abb2bf', light: '#343a40' }, // 直接使用顏色代碼
        'blue':         { dark: '#61afef', light: '#0056b3' },
        'red':          { dark: '#e06c75', light: '#c82333' },
        'orange':       { dark: '#d19a66', light: '#e08e0b' },
        'green':        { dark: '#98c379', light: '#218838' },
        'purple':       { dark: '#c678dd', light: '#563d7c' }
    };

    // 分割線拖動邏輯
    const gutterManager = {
        setup: () => {
            let isDragging = false;
            
            gutter.addEventListener('mousedown', (e) => {
                if (splitContainer.classList.contains('view-mode-editor-only') || splitContainer.classList.contains('view-mode-preview-only')) {
                    return;
                }
                isDragging = true;
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const container = gutter.parentElement;
                const editorPanel = container.querySelector('#editor-panel');
                const previewPanel = container.querySelector('#preview-panel');
                const containerWidth = container.offsetWidth;
                const newEditorWidth = (e.clientX - container.offsetLeft) / containerWidth;

                if (newEditorWidth > 0.1 && newEditorWidth < 0.9) {
                    editorPanel.style.flex = `${newEditorWidth}`;
                    previewPanel.style.flex = `${1 - newEditorWidth}`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.body.style.cursor = 'default';
            });
        }
    };

    // UI 更新與事件綁定
    const updateAll = () => {
        // 在每次渲染前，根據當前主題重新初始化 Mermaid
        const isLightMode = document.body.classList.contains('light-mode');
        const mermaidTheme = isLightMode ? 'default' : 'dark';

        window.mermaid.initialize({ 
            theme: mermaidTheme,
            startOnLoad: false,
            // 由於不再處理自訂類別顏色，這裡的 flowchart 設定改回預設
            flowchart: {
                curve: 'basis'
            }
        });

        markdownRenderer.updateAll(
            editor,
            preview,
            lineNumbers,
            navList,
            window.marked,
            window.hljs,
            window.mermaid, // 傳入 mermaid 函式庫
            window.ABCJS
        );
    };

    const bindEventListeners = () => {
        editor.addEventListener('input', () => {
            updateAll();
        });

        editor.addEventListener('scroll', () => {
            markdownRenderer.syncScroll(editor, lineNumbers);
        });
        
        // 檔案操作按鈕
        document.getElementById('download-btn').addEventListener('click', () => fileHandler.download(editor));
        document.getElementById('upload-btn').addEventListener('click', () => fileHandler.upload(editor, updateAll));
        document.getElementById('clear-btn').addEventListener('click', () => fileHandler.confirmClear(editor, updateAll));
        document.getElementById('export-pdf-btn').addEventListener('click', () => fileHandler.exportPDF(editor));
        document.getElementById('demo-btn').addEventListener('click', () => fileHandler.insertDemoContent(editor, updateAll));

        // 主題切換按鈕
        themeToggleBtn.addEventListener('click', () => {
            uiManager.toggleTheme();
            // 在切換主題後，重新應用標題顏色並渲染一次預覽區
            applyHeadingColors();
            updateAll(); 
        });

        // 檢視模式按鈕
        viewButtonsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button) {
                const mode = button.dataset.mode;
                uiManager.setViewMode(mode);

                // 修正: 檢查是否切換到 "both" 模式，並重設面板寬度
                if (mode === 'both') {
                    editorPanel.style.flex = '1';
                    previewPanel.style.flex = '1';
                } else if (mode === 'editor-only') {
                    editorPanel.style.flex = '1';
                    previewPanel.style.flex = '0';
                } else if (mode === 'preview-only') {
                    editorPanel.style.flex = '0';
                    previewPanel.style.flex = '1';
                }

                markdownRenderer.updatePreview(editor, preview, navList, window.marked, window.hljs, window.mermaid, window.ABCJS);
                markdownRenderer.updateSidebar(navList, preview);
                editor.dispatchEvent(new Event('scroll'));
            }
        });

        // 新增的事件監聽器
        topToggleBtn.addEventListener('click', () => {
            const isHidden = document.body.classList.toggle('collapsed-header');
            if (isHidden) {
                topToggleBtn.title = "顯示標頭";
            } else {
                topToggleBtn.title = "隱藏標頭";
            }
        });

        // 設定按鈕
        document.getElementById('settings-btn').addEventListener('click', () => {
            const settingsModal = document.getElementById('settingsModal');
            settingsModal.style.display = 'flex';
        });

        // 關閉設定面板
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                modal.style.display = 'none';
            });
        });

        // 儲存設定
        document.getElementById('save-settings').addEventListener('click', () => {
            const h1ColorKey = document.getElementById('h1-color').value;
            const h2ColorKey = document.getElementById('h2-color').value;
            const h3ColorKey = document.getElementById('h3-color').value;

            localStorage.setItem('h1ColorKey', h1ColorKey);
            localStorage.setItem('h2ColorKey', h2ColorKey);
            localStorage.setItem('h3ColorKey', h3ColorKey);

            applyHeadingColors();

            const settingsModal = document.getElementById('settingsModal');
            settingsModal.style.display = 'none';
        });

        // 還原預設值
        document.getElementById('reset-settings').addEventListener('click', () => {
            localStorage.removeItem('h1ColorKey');
            localStorage.removeItem('h2ColorKey');
            localStorage.removeItem('h3ColorKey');

            // 重置下拉選單
            document.getElementById('h1-color').value = 'blue';
            document.getElementById('h2-color').value = 'blue';
            document.getElementById('h3-color').value = 'green';

            applyHeadingColors(); // 應用預設顏色

            const settingsModal = document.getElementById('settingsModal');
            settingsModal.style.display = 'none';
        });

        // 點擊 modal 外部關閉
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = "none";
            }
        });

        const applyHeadingColors = () => {
            const root = document.documentElement;
            const isLightMode = document.body.classList.contains('light-mode');
            const theme = isLightMode ? 'light' : 'dark';

            const h1Key = localStorage.getItem('h1ColorKey') || 'blue';
            const h2Key = localStorage.getItem('h2ColorKey') || 'blue';
            const h3Key = localStorage.getItem('h3ColorKey') || 'green';

            root.style.setProperty('--h1-color', colorMap[h1Key][theme]);
            root.style.setProperty('--h2-color', colorMap[h2Key][theme]);
            root.style.setProperty('--h3-color', colorMap[h3Key][theme]);
        };

        const loadSettings = () => {
            // 應用儲存的顏色或預設顏色
            applyHeadingColors();

            // 更新下拉選單的顯示值
            document.getElementById('h1-color').value = localStorage.getItem('h1ColorKey') || 'blue';
            document.getElementById('h2-color').value = localStorage.getItem('h2ColorKey') || 'blue';
            document.getElementById('h3-color').value = localStorage.getItem('h3ColorKey') || 'green';
        };

        loadSettings();
    };

    // 初始化應用程式
    const initialize = async () => {
        gutterManager.setup();
        bindEventListeners();
        
        await fileHandler.insertDemoContent(editor, updateAll);

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggleBtn.innerHTML = `<i class=\"fas fa-moon\"></i><span id=\"theme-text\">深色模式</span>`;
            document.getElementById('hljs-theme').href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/github.min.css";
        } else {
            document.body.classList.remove('light-mode');
            themeToggleBtn.innerHTML = `<i class=\"fas fa-sun\"></i><span id=\"theme-text\">淺色模式</span>`;
            document.getElementById('hljs-theme').href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/atom-one-dark.min.css";
        }

        // 首次啟動時，也會執行 updateAll 來初始化所有內容和主題
        applyHeadingColors(); // 確保在 updateAll 之前應用顏色
        updateAll();
    };

    initialize();
});