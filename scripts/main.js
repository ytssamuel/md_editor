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

    // 分割線拖動邏輯
    const gutterManager = {
        setup: () => {
            let isDragging = false;
            
            gutter.addEventListener('mousedown', (e) => {
                e.preventDefault(); 
                if (splitContainer.classList.contains('view-mode-editor-only') || splitContainer.classList.contains('view-mode-preview-only')) {
                    return;
                }
                isDragging = true;
                document.body.style.cursor = 'col-resize';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                e.preventDefault();

                // 修正：使用 splitContainer 的 getBoundingClientRect().left 作為基準點
                let newWidth = e.clientX - splitContainer.getBoundingClientRect().left;

                // 修正：確保面板不會縮得太小
                const minWidth = 100;
                const maxWidth = splitContainer.offsetWidth - gutter.offsetWidth - minWidth;
                
                if (newWidth < minWidth) {
                    newWidth = minWidth;
                } else if (newWidth > maxWidth) {
                    newWidth = maxWidth;
                }
                
                editorPanel.style.width = `${newWidth / splitContainer.offsetWidth * 100}%`;
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.body.style.cursor = 'default';
            });
        }
    };

    // 負責更新所有相關 UI 的回調函數
    const updateAll = () => {
        markdownRenderer.updateAll(editor, preview, lineNumbers, navList, marked, hljs, mermaid, ABCJS);
    };

    // 綁定所有事件監聽器
    const bindEventListeners = () => {
        // 編輯器內容變動時觸發更新
        editor.addEventListener('input', updateAll);

        // 編輯器滾動時觸發行號同步
        editor.addEventListener('scroll', () => {
            markdownRenderer.syncScroll(editor, lineNumbers);
        });

        // 按鈕點擊事件監聽器
        document.getElementById('download-btn').addEventListener('click', () => fileHandler.download(editor));
        document.getElementById('upload-btn').addEventListener('click', () => fileHandler.upload(editor, updateAll));
        document.getElementById('export-pdf-btn').addEventListener('click', () => fileHandler.exportPDF(editor));
        document.getElementById('clear-btn').addEventListener('click', () => fileHandler.confirmClear(editor, updateAll));
        document.getElementById('load-demo-btn').addEventListener('click', () => fileHandler.insertDemoContent(editor, updateAll));
        
        // 主題切換
        themeToggleBtn.addEventListener('click', uiManager.toggleTheme);

        // 檢視模式切換
        viewButtonsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                const btn = e.target.closest('button');
                const mode = btn.id.replace('view-', '');
                uiManager.setViewMode(mode);
                // 在切換到混合或預覽模式時觸發更新
                if (mode === 'both' || mode === 'preview-only') {
                    // 同步滾動
                    markdownRenderer.updateSidebar(navList, preview);
                    editor.dispatchEvent(new Event('scroll'));
                }
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

        // 確保初始渲染
        updateAll();

        // 確保頁面載入後，可以正常顯示初始預覽區塊
        uiManager.setViewMode('both');
    };

    initialize();
});