// 注意：這個檔案不再直接使用 marked、hljs、mermaid、abcjs
// 這些函式庫將從外部傳入
import { modalManager } from './modalManager.js';

/**
 * 自訂 Marked.js Renderer，用來處理特殊 Markdown 語法。
 * Marked.js 會呼叫這些函式來生成 HTML。
 */
export const customRenderer = {
    /**
     * 處理程式碼區塊。
     * @param {string} code 程式碼內容。
     * @param {string} lang 程式語言標籤。
     * @returns {string} 轉換後的 HTML 字串。
     */
    code(code, lang) {
        if (lang === 'mermaid') {
            return `<div class="mermaid">${code}</div>`;
        }
        if (lang === 'abc') {
            // 返回一個標準的 pre > code 結構，後續再手動替換
            return `<pre><code class="language-abc">${code}</code></pre>`;
        }
        // 確保程式碼被正確地放入 pre 和 code 標籤
        return `<pre><code class="language-${lang}">${code}</code></pre>`; 
    },
    /**
     * 處理標題。
     * @param {string} text 標題文本。
     * @param {number} level 標題等級 (1-6)。
     * @returns {string} 轉換後的帶有 ID 的 HTML 標題標籤。
     */
    heading(text, level) {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        return `<h${level} id="${escapedText}">${text}</h${level}>`;
    }
};

/**
 * 專門處理各種渲染和 UI 更新的模組。
 */
export const markdownRenderer = {
    /**
     * 渲染預覽區的所有內容，包括 Markdown、程式碼高亮、圖表和樂譜。
     * @param {HTMLElement} editor 編輯器元素。
     * @param {HTMLElement} preview 預覽區元素。
     * @param {HTMLElement} navList 文件大綱列表元素。
     * @param {object} marked Marked.js 函式庫。
     * @param {object} hljs Highlight.js 函式庫。
     * @param {object} mermaid Mermaid.js 函式庫。
     * @param {object} ABCJS ABCJS 函式庫。
     */
    updatePreview: (editor, preview, navList, marked, hljs, mermaid, ABCJS) => {
        console.log('--- 開始渲染預覽 ---');
        
        const markdownText = editor.getValue();
        const htmlContent = marked.parse(markdownText);
        preview.innerHTML = htmlContent;
        console.log('Markdown 已轉換為 HTML 並插入 DOM。');

        // 呼叫獨立的渲染函式
        markdownRenderer.highlightCodeBlocks(preview, hljs);
        markdownRenderer.renderMermaidCharts(mermaid);
        markdownRenderer.renderAbcBlocks(preview, ABCJS);
        markdownRenderer.renderMathFormulas(preview);
        
        // 更新文件大綱
        markdownRenderer.updateSidebar(navList, preview);
        console.log('--- 預覽渲染結束 ---');
    },

    /**
     * 處理程式碼高亮。
     * @param {HTMLElement} container 要搜尋程式碼區塊的容器。
     * @param {object} hljs Highlight.js 函式庫。
     */
    highlightCodeBlocks: (container, hljs) => {
        try {
            const codeBlocks = container.querySelectorAll('pre code');
            codeBlocks.forEach(block => {
                const lang = block.className.replace('language-', '');
                if (lang !== 'abc') { // 排除 abc 區塊，因為我們將單獨處理它
                     hljs.highlightElement(block);
                }
            });
            console.log('程式碼高亮渲染完成。');
        } catch (error) {
            console.error('程式碼高亮渲染失敗:', error);
        }
    },

    /**
     * 渲染 Mermaid 圖表。
     * @param {object} mermaid Mermaid.js 函式庫。
     */
    renderMermaidCharts: (mermaid) => {
        try {
            mermaid.init();
            console.log('Mermaid 圖表渲染完成。');
        } catch (error) {
            console.error('Mermaid 圖表渲染失敗:', error);
            modalManager.show(`Mermaid 圖表渲染失敗：\n${error.message}`, false);
        }
    },

    /**
     * 渲染 ABC 樂譜。
     * @param {HTMLElement} container 要搜尋樂譜區塊的容器。
     * @param {object} ABCJS ABCJS 函式庫。
     */
    renderAbcBlocks: (container, ABCJS) => {
        try {
            const abcCodeBlocks = container.querySelectorAll('pre code.language-abc');
            console.log(`找到 ${abcCodeBlocks.length} 個 ABC 樂譜區塊。`);

            abcCodeBlocks.forEach(block => {
                const pre = block.parentElement;
                const newDiv = document.createElement('div');
                newDiv.className = 'abc-notation';
                pre.parentNode.replaceChild(newDiv, pre);
                
                try {
                    ABCJS.renderAbc(newDiv, block.textContent, {
                        staffwidth: 600,
                        responsive: "resize"
                    });
                } catch (e) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'abc-error';
                    errorDiv.innerHTML = `<p><strong>樂譜渲染失敗</strong></p><p>請檢查樂譜語法是否正確。<br><code>${e.message}</code></p>`;
                    newDiv.innerHTML = '';
                    newDiv.appendChild(errorDiv);
                    console.error('ABCJS 渲染失敗:', e);
                    modalManager.show(`ABC 樂譜渲染失敗：\n${e.message}`, false);
                }
            });
            console.log('ABC 樂譜渲染完成。');
        } catch (error) {
            console.error('ABC 樂譜渲染失敗:', error);
        }
    },

    /**
     * 渲染 MathJax 公式。
     * @param {HTMLElement} container 要搜尋公式的容器。
     */
    renderMathFormulas: (container) => {
        try {
            if (typeof MathJax !== 'undefined') {
                MathJax.typesetPromise([container]);
                console.log('MathJax 公式渲染完成。');
            }
        } catch (error) {
            console.error('MathJax 公式渲染失敗:', error);
        }
    },

    // ------------------------------------------------------------------
    // 以下為非渲染相關的輔助函式，保持不變
    // ------------------------------------------------------------------

    updateAll: (editor, preview, navList, marked, hljs, mermaid, ABCJS) => {
        markdownRenderer.updatePreview(editor, preview, navList, marked, hljs, mermaid, ABCJS);
    },
    
    updateSidebar: (navList, preview) => {
        const headings = preview.querySelectorAll('h1, h2, h3, h4, h5, h6');
        navList.innerHTML = '';
        headings.forEach(heading => {
            const level = parseInt(heading.tagName[1]);
            const text = heading.textContent;
            const id = heading.id;
            const listItem = document.createElement('li');
            const isLightMode = document.body.classList.contains('light-mode');
            const textColor = isLightMode ? '#343a40' : '#abb2bf'; // 根據主題設定文字顏色
            listItem.innerHTML = `<a href="#${id}" style="color: ${textColor};">${text}</a>`; // 內聯樣式
            listItem.style.paddingLeft = `${(level - 1) * 15}px`;
            navList.appendChild(listItem);
        });
    }
};