import { modalManager } from './modalManager.js';

export const fileHandler = {
    download: async (editor) => {
        const text = editor.getValue();
        if (!text.trim()) {
            await modalManager.show('編輯器內容是空的，無法下載！', false);
            return;
        }
        const result = await modalManager.show('請輸入檔案名稱:', true, true, 'document.md');
        if (result.confirmed) {
            let filename = result.value.trim();
            if (!filename) {
                filename = 'document.md';
            } else if (!filename.toLowerCase().endsWith('.md')) {
                filename += '.md';
            }
            const blob = new Blob([text], { type: 'text/markdown' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
        }
    },
    upload: (editor, updateCallback) => {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            //檔案大小限制10MB
            if (file && file.size > 10 * 1024 * 1024) { // 10MB
                modalManager.show('檔案大小超過 10MB，請選擇較小的檔案。', false);
                return;
            }
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    editor.setValue(event.target.result);
                    updateCallback(); // 使用回調函數來更新 UI
                };
                reader.readAsText(file);
            }
        };
    },
    exportPDF: async (editor) => {
        if (!editor.getValue().trim()) {
            await modalManager.show('編輯器內容是空的，無法產生 PDF！', false);
            return;
        }

        const splitContainer = document.getElementById('split-container');
        const editorPanel = document.getElementById('editor-panel');
        const previewPanel = document.getElementById('preview-panel');

        // 儲存目前的檢視模式和面板寬度
        const currentViewMode = splitContainer.classList.contains('view-mode-editor-only') ? 'editor-only' :
                                splitContainer.classList.contains('view-mode-preview-only') ? 'preview-only' : 'both';
        const editorPanelWidth = editorPanel.style.flex;
        const previewPanelWidth = previewPanel.style.flex;

        // 暫時切換到預覽模式，確保列印時預覽內容佔滿整個區域
        splitContainer.classList.remove('view-mode-editor-only', 'view-mode-preview-only');
        splitContainer.classList.add('view-mode-preview-only');
        editorPanel.style.flex = '0';
        previewPanel.style.flex = '1';

        // 觸發列印
        window.print();

        // 列印完成後，恢復原來的檢視模式和面板寬度
        splitContainer.classList.remove('view-mode-editor-only', 'view-mode-preview-only');
        if (currentViewMode === 'editor-only') {
            splitContainer.classList.add('view-mode-editor-only');
        } else if (currentViewMode === 'both') {
            splitContainer.classList.add('view-mode-both');
            editorPanel.style.flex = editorPanelWidth;
            previewPanel.style.flex = previewPanelWidth;
        } else {
            splitContainer.classList.add('view-mode-preview-only');
        }
    },
    confirmClear: async (editor, updateCallback) => {
        // 修正：使用您提供的 modalManager 參數
        const result = await modalManager.show('確定要清除所有內容嗎？', true, false);
        if (result.confirmed) {
            editor.setValue('');
            updateCallback();
        }
    },
    insertDemoContent: async (editor, updateCallback) => {
        try {
            const response = await fetch('./demo.md');
            if (!response.ok) {
                throw new Error(`無法載入 demo.md 檔案 (HTTP 狀態碼: ${response.status})`);
            }
            let demoContent = await response.text();
            // 新增：在設定內容前，將所有單反斜線替換為雙反斜線，以避免轉義問題
            demoContent = demoContent.replace(/\\/g, '\\');
            editor.setValue(demoContent);
            updateCallback();
        } catch (error) {
            console.error("載入範例內容失敗:", error);
            // 修正：使用您提供的 modalManager 參數
            await modalManager.show(`載入範例內容失敗，請確認檔案 'demo.md' 是否存在。`, false);
        }
    }
};