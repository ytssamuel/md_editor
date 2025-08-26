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
    
    // 統一的更新函式
    const updateAll = () => {
        markdownRenderer.updateAll(
            editor, 
            preview, 
            lineNumbers, 
            navList, 
            window.marked, 
            window.hljs, 
            window.mermaid, 
            window.ABCJS
        );
    };

    // 事件監聽器綁定
    const bindEventListeners = () => {
        editor.addEventListener('input', updateAll);
        editor.addEventListener('scroll', () => markdownRenderer.syncScroll(editor, lineNumbers));
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'Backspace') {
                setTimeout(() => markdownRenderer.updateLineNumbers(editor, lineNumbers), 0);
            }
        });

        document.getElementById('upload-btn').addEventListener('click', () => fileHandler.upload(editor, updateAll));
        document.getElementById('download-btn').addEventListener('click', () => fileHandler.download(editor));
        document.getElementById('export-pdf-btn').addEventListener('click', () => fileHandler.exportPDF(editor));
        document.getElementById('clear-btn').addEventListener('click', () => fileHandler.confirmClear(editor, updateAll));
        document.getElementById('demo-btn').addEventListener('click', () => fileHandler.insertDemoContent(editor, updateAll));
        themeToggleBtn.addEventListener('click', () => {
            uiManager.toggleTheme();
            markdownRenderer.updatePreview(editor, preview, navList, window.marked, window.hljs, window.mermaid, window.ABCJS);
        });

        viewButtonsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button) {
                const mode = button.dataset.mode;
                uiManager.setViewMode(mode);
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
            themeToggleBtn.innerHTML = `<i class="fas fa-moon"></i><span id="theme-text">深色模式</span>`;
            document.getElementById('hljs-theme').href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/github.min.css";
        }
    };

    initialize();
});