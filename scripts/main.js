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
                const minWidth = 300;
                let newWidth = e.clientX;
                const maxPreviewWidth = splitContainer.offsetWidth - minWidth;
                
                if (newWidth < minWidth) newWidth = minWidth;
                if (newWidth > maxPreviewWidth) newWidth = maxPreviewWidth;
                
                editor.style.width = newWidth + 'px';
                preview.style.width = `calc(100% - ${newWidth}px - ${gutter.offsetWidth}px)`;
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
        const mermaidTheme = document.body.classList.contains('light-mode') ? 'default' : 'dark';
        window.mermaid.initialize({ 
            theme: mermaidTheme,
            startOnLoad: false,
            // 更多客製化設定，如果需要
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

        // 主題切換按鈕
        themeToggleBtn.addEventListener('click', () => {
            uiManager.toggleTheme();
            // 在切換主題後，重新渲染一次預覽區
            updateAll(); 
        });

        // 檢視模式按鈕
        viewButtonsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button) {
                const mode = button.dataset.mode;
                uiManager.setViewMode(mode);
                // 在切換模式後重新渲染一次，並更新大綱
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
        updateAll();
    };

    initialize();
});