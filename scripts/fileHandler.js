import { modalManager } from './modalManager.js';
import { logger } from './logger.js';

export const fileHandler = {
    /**
     * 下載目前編輯內容
     * @param {CodeMirror.Editor} editor
     */
    download: async (editor) => {
        const text = editor.getValue();
        if (!text.trim()) {
            await modalManager.show('編輯器內容是空的，無法下載！', false);
            return;
        }
        const result = await modalManager.show('請輸入檔案名稱:', true, true, 'document.md');
        if (result.confirmed) {
            let filename = result.value.trim();
            if (!filename) filename = 'document.md';
            if (!filename.toLowerCase().endsWith('.md')) filename += '.md';
            const blob = new Blob([text], { type: 'text/markdown' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
        }
    },
    /**
     * 上傳本地檔案
     * @param {CodeMirror.Editor} editor
     * @param {Function} updateCallback
     */
    upload: (editor, updateCallback) => {
        const fileInput = document.getElementById('fileInput');
        fileInput.value = '';// 允許重新選同一檔
        fileInput.click();
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file && file.size > 10 * 1024 * 1024) { // 10MB
                modalManager.show('檔案大小超過 10MB，請選擇較小的檔案。', false);
                return;
            }
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    editor.setValue(event.target.result);
                    updateCallback();
                };
                reader.onerror = (err) => logger.error('檔案讀取失敗', err);
                reader.readAsText(file);
            }
        };
    },
    /**
     * 匯出 PDF
     */
    exportPDF: async (editor) => {
        if (!editor.getValue().trim()) {
            await modalManager.show('編輯器內容是空的，無法產生 PDF！', false);
            return;
        }
        const splitContainer = document.getElementById('split-container');
        const editorPanel = document.getElementById('editor-panel');
        const previewPanel = document.getElementById('preview-panel');
        const currentViewMode = splitContainer.classList.contains('view-mode-editor-only') ? 'editor-only' :
            splitContainer.classList.contains('view-mode-preview-only') ? 'preview-only' : 'both';
        const editorPanelWidth = editorPanel.style.flex;
        const previewPanelWidth = previewPanel.style.flex;
        splitContainer.classList.remove('view-mode-editor-only', 'view-mode-preview-only');
        splitContainer.classList.add('view-mode-preview-only');
        editorPanel.style.flex = '0';
        previewPanel.style.flex = '1';
        window.print();
        splitContainer.classList.remove('view-mode-editor-only', 'view-mode-preview-only');
        if (currentViewMode === 'editor-only') {
            splitContainer.classList.add('view-mode-editor-only');
        } else if (currentViewMode === 'both') {
            editorPanel.style.flex = editorPanelWidth;
            previewPanel.style.flex = previewPanelWidth;
        } else {
            splitContainer.classList.add('view-mode-preview-only');
        }
    },
    /**
     * 清除內容確認
     */
    confirmClear: async (editor, updateCallback) => {
        const result = await modalManager.show('確定要清除所有內容嗎？', true, false);
        if (result.confirmed) {
            editor.setValue('');
            updateCallback();
        }
    },
    /**
     * 插入範例內容
     */
    insertDemoContent: async (editor, updateCallback) => {
        try {
            const response = await fetch('./demo.md');
            if (!response.ok) throw new Error(`無法載入 demo.md (HTTP ${response.status})`);
            const demoContent = await response.text();
            editor.setValue(demoContent);
            updateCallback();
        } catch (error) {
            logger.error('載入範例內容失敗', error);
            await modalManager.show(`載入範例內容失敗，請確認檔案 'demo.md' 是否存在。`, false);
        }
    }
};