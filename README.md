# Markdown 編輯器

## 簡介

這是一個基於 Web 的 Markdown 編輯器，具有即時預覽、程式碼高亮、數學公式渲染、Mermaid 圖表和 ABC 樂譜支援等功能。它旨在提供一個簡單而強大的工具，用於編寫和預覽 Markdown 文件。

## 功能

- **即時預覽**：在編輯時即時顯示渲染後的 Markdown 內容。
- **程式碼高亮**：使用 highlight.js 支援多種程式語言的程式碼高亮。
- **數學公式**：使用 MathJax 支援 LaTeX 語法的數學公式渲染。
- **Mermaid 圖表**：使用 mermaid.js 支援流程圖、序列圖等圖表的繪製。
- **ABC 樂譜**：使用 abcjs 支援 ABC Notation 樂譜的渲染。
- **主題切換**：提供淺色和深色兩種主題。
- **匯入/匯出**：支援 Markdown 檔案的匯入和匯出。
- **PDF 匯出**：將 Markdown 內容匯出為 PDF 檔案。
- **文件大綱**：自動生成文件大綱，方便導航。
- **鍵盤快捷鍵**：支援常用的鍵盤快捷鍵，例如粗體 (Ctrl+B) 和斜體 (Ctrl+I)。

## 技術棧

- HTML
- CSS
- JavaScript
- marked.js
- highlight.js
- mermaid.js
- abcjs
- MathJax

## 檔案結構

```
/
├── index.html          // HTML 主檔案，包含頁面結構和外部資源引用
├── favicon.svg         // 網頁標籤圖示
├── styles/
│   ├── main.css      // 主樣式檔案，匯入所有其他樣式
│   ├── variables.css // CSS 變數，定義顏色、字體等
│   ├── base.css      // 基礎樣式，設定 HTML 元素的預設樣式
│   ├── components.css// 組件樣式，定義可重用 UI 組件的樣式
│   ├── layout.css    // 佈局樣式，控制頁面整體佈局
│   └── markdown.css  // Markdown 渲染區塊的樣式
├── scripts/
│   ├── main.js         // 核心程式碼，負責初始化、事件綁定和模組導入
│   ├── uiManager.js    // UI 管理模組，處理主題切換和檢視模式
│   ├── fileHandler.js  // 檔案處理模組，處理檔案上傳、下載和清除
│   ├── markdownRenderer.js// Markdown 渲染模組，處理 Markdown 轉換和程式碼高亮
│   └── modalManager.js // 模態框管理模組，處理自定義模態框的顯示和操作
├── demo.md             // 示範用的 Markdown 檔案
└── README.md           // 專案說明文件
```

## 使用方法

1.  **下載專案**：將專案程式碼下載到本地。
2.  **開啟 index.html**：使用瀏覽器開啟 `index.html` 檔案。
3.  **編輯 Markdown**：在左側編輯器中輸入 Markdown 內容。
4.  **即時預覽**：在右側預覽區查看渲染後的結果。

