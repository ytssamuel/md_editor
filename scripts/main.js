import { markdownRenderer, customRenderer } from './markdownRenderer.js';
import { fileHandler } from './fileHandler.js';
import { uiManager } from './uiManager.js';
import { settingsManager } from './settingsManager.js';

/**
 * 簡單 debounce
 * @param {Function} fn
 * @param {number} delay
 */
const debounce = (fn, delay = 250) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

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

    // DOM 元素集中快取
    const dom = {
        preview: document.getElementById('preview'),
        gutter: document.getElementById('gutter'),
        splitContainer: document.getElementById('split-container'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        viewButtonsContainer: document.getElementById('view-mode-bar'),
        navList: document.getElementById('nav-list'),
        mainHeader: document.getElementById('main-header'),
        topToggleBtn: document.getElementById('top-toggle-btn'),
        editorPanel: document.getElementById('editor-panel'),
        previewPanel: document.getElementById('preview-panel')
    };

    // Mermaid 主題記錄，避免每次重設
    let currentMermaidTheme = null;

    const ensureMermaidInit = (theme) => {
        if (currentMermaidTheme !== theme) {
            window.mermaid.initialize({
                theme,
                startOnLoad: false,
                flowchart: { curve: 'basis' }
            });
            currentMermaidTheme = theme;
        }
    };

    // 分割線拖動邏輯
    const gutterManager = {
        setup: () => {
            let isDragging = false;
            dom.gutter.addEventListener('mousedown', (e) => {
                if (dom.splitContainer.classList.contains('view-mode-editor-only') || dom.splitContainer.classList.contains('view-mode-preview-only')) {
                    return;
                }
                isDragging = true;
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const container = dom.gutter.parentElement;
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

    /**
     * 更新整體預覽（含 Mermaid / MathJax 等）
     */
    const updateAll = () => {
        const isLightMode = document.body.classList.contains('light-mode');
        const mermaidTheme = isLightMode ? 'default' : 'dark';
        // 僅在需要時初始化 Mermaid
        ensureMermaidInit(mermaidTheme);

        markdownRenderer.updatePreview(
            editor,
            dom.preview,
            dom.navList,
            window.marked,
            window.hljs,
            window.mermaid,
            window.ABCJS
        );
    };

    const bindEventListeners = () => {
        const syncEditorToPreview = () => {
            const scrollInfo = editor.getScrollInfo();
            if (scrollInfo.height <= scrollInfo.clientHeight) return;
            const ratio = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);
            dom.preview.scrollTop = ratio * (dom.preview.scrollHeight - dom.preview.clientHeight);
        };

        const debouncedChange = debounce(() => {
            updateAll();
            syncEditorToPreview();
        }, 300);

        editor.on('change', debouncedChange);

        // 滾動同步使用 rAF throttle
        let scrollScheduled = false;
        editor.on('scroll', () => {
            if (!scrollScheduled) {
                scrollScheduled = true;
                requestAnimationFrame(() => {
                    syncEditorToPreview();
                    scrollScheduled = false;
                });
            }
        });

        // 檔案操作按鈕
        document.getElementById('download-btn').addEventListener('click', () => fileHandler.download(editor));
        document.getElementById('upload-btn').addEventListener('click', () => fileHandler.upload(editor, updateAll));
        document.getElementById('clear-btn').addEventListener('click', () => fileHandler.confirmClear(editor, updateAll));
        document.getElementById('export-pdf-btn').addEventListener('click', () => fileHandler.exportPDF(editor));
        document.getElementById('demo-btn').addEventListener('click', () => fileHandler.insertDemoContent(editor, updateAll));

        // 主題切換按鈕
        dom.themeToggleBtn.addEventListener('click', () => {
            uiManager.toggleTheme(editor);
            settingsManager.applyHeadingColors();
            updateAll();
        });

        // 檢視模式按鈕
        dom.viewButtonsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button) {
                const mode = button.dataset.mode;
                uiManager.setViewMode(mode);
                if (mode === 'both') {
                    dom.editorPanel.style.flex = '1';
                    dom.previewPanel.style.flex = '1';
                } else if (mode === 'editor-only') {
                    dom.editorPanel.style.flex = '1';
                    dom.previewPanel.style.flex = '0';
                } else if (mode === 'preview-only') {
                    dom.editorPanel.style.flex = '0';
                    dom.previewPanel.style.flex = '1';
                }
                markdownRenderer.updatePreview(editor, dom.preview, dom.navList, window.marked, window.hljs, window.mermaid, window.ABCJS);
                markdownRenderer.updateSidebar(dom.navList, dom.preview);
                editor.refresh();
            }
        });

        uiManager.bindEventListeners();
        settingsManager.init(updateAll);

        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
    };

    const initialize = async () => {
        gutterManager.setup();
        bindEventListeners();
        await fileHandler.insertDemoContent(editor, updateAll);

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            dom.themeToggleBtn.innerHTML = `<i class="fas fa-moon"></i><span id="theme-text">深色模式</span>`;
            editor.setOption('theme', 'eclipse');
            document.getElementById('hljs-theme').href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/github.min.css";
        } else {
            document.body.classList.remove('light-mode');
            dom.themeToggleBtn.innerHTML = `<i class="fas fa-sun"></i><span id="theme-text">淺色模式</span>`;
            editor.setOption('theme', 'material-darker');
            document.getElementById('hljs-theme').href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/atom-one-dark.min.css";
        }
        settingsManager.applyHeadingColors();
        updateAll();
    };

    initialize();
});