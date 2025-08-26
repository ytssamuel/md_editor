import { modalManager } from './modalManager.js';

export const fileHandler = {
    download: async (editor) => {
        const text = editor.value;
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
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    editor.value = event.target.result;
                    updateCallback(); // 使用回調函數來更新 UI
                };
                reader.readAsText(file);
            }
        };
    },
    exportPDF: async (editor) => {
        if (!editor.value.trim()) {
            await modalManager.show('編輯器內容是空的，無法產生 PDF！', false);
            return;
        }
        window.print();
    },
    confirmClear: async (editor, updateCallback) => {
        // 修正：使用您提供的 modalManager 參數
        const result = await modalManager.show('確定要清除所有內容嗎？', true, false);
        if (result.confirmed) {
            editor.value = '';
            updateCallback();
        }
    },
    insertDemoContent: async (editor, updateCallback) => {
        try {
            const response = await fetch('./demo.md');
            if (!response.ok) {
                throw new Error(`無法載入 demo.md 檔案 (HTTP 狀態碼: ${response.status})`);
            }
            const demoContent = await response.text();
            editor.value = demoContent;
            updateCallback();
        } catch (error) {
            console.error("載入範例內容失敗:", error);
            // 修正：使用您提供的 modalManager 參數
            await modalManager.show(`載入範例內容失敗，請確認檔案 'demo.md' 是否存在。`, false);
        }
    }
};