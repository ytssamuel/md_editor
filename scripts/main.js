import { markdownRenderer, customRenderer } from './markdownRenderer.js';
import { fileHandler } from './fileHandler.js';
import { uiManager } from './uiManager.js';
import { settingsManager } from './settingsManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // CodeMirror 編輯器實例
    const editor = CodeMirror(document.getElementById('editor-container'), {
        mode: 'gfm', // GitHub Flavored Markdown
        theme: 'material-darker',
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
        styleActiveLine: { nonEmpty: true },
        styleActiveSelected: true
    });

    // 初始化 Marked.js，只執行一次
    window.marked.use({ renderer: customRenderer });

    // DOM 元素引用
    const preview = document.getElementById('preview');
    const gutter = document.getElementById('gutter');
    const splitContainer = document.getElementById('split-container');
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

        markdownRenderer.updatePreview(
            editor,
            preview,
            navList,
            window.marked,
            window.hljs,
            window.mermaid,
            window.ABCJS
        );
    };

    const bindEventListeners = () => {
        const syncEditorToPreview = () => {
            const scrollInfo = editor.getScrollInfo();
            // 避免在沒有滾動條時計算，導致 NaN
            if (scrollInfo.height <= scrollInfo.clientHeight) {
                return;
            }
            const ratio = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);
            preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
        };

        editor.on('change', () => {
            updateAll();
            syncEditorToPreview();
        });

        editor.on('scroll', () => {
            syncEditorToPreview();
        });
        
        // 檔案操作按鈕
        document.getElementById('download-btn').addEventListener('click', () => fileHandler.download(editor));
        document.getElementById('upload-btn').addEventListener('click', () => fileHandler.upload(editor, updateAll));
        document.getElementById('clear-btn').addEventListener('click', () => fileHandler.confirmClear(editor, updateAll));
        document.getElementById('export-pdf-btn').addEventListener('click', () => fileHandler.exportPDF(editor));
        document.getElementById('demo-btn').addEventListener('click', () => fileHandler.insertDemoContent(editor, updateAll));

        // 主題切換按鈕
        themeToggleBtn.addEventListener('click', () => {
            uiManager.toggleTheme(editor);
            settingsManager.applyHeadingColors();
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
                editor.refresh(); // 重新整理 CodeMirror 編輯器
            }
        });

        // 其他 UI 事件綁定
        uiManager.bindEventListeners();

        // 設定面板事件綁定
        settingsManager.init(updateAll);

        // 點擊 modal 外部關閉
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = "none";
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
            editor.setOption('theme', 'eclipse');
            document.getElementById('hljs-theme').href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/github.min.css";
        } else {
            document.body.classList.remove('light-mode');
            themeToggleBtn.innerHTML = `<i class=\"fas fa-sun\"></i><span id=\"theme-text\">淺色模式</span>`;
            editor.setOption('theme', 'material-darker');
            document.getElementById('hljs-theme').href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/atom-one-dark.min.css";
        }

        // 首次啟動時，也會執行 updateAll 來初始化所有內容和主題
        settingsManager.applyHeadingColors(); // 確保在 updateAll 之前應用顏色
        updateAll();
    };

    initialize();
});