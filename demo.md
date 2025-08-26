# Markdown 編輯器
## 歡迎使用這款強大的工具
這是一個支援多種進階功能的 Markdown 文件範例。
### 功能介紹
- **即時預覽**: 在右側面板即時顯示渲染結果。
- **程式碼**: 支援多種程式語言。
- **數學公式**: 支援 LaTeX 語法。
- **Mermaid 圖表**: 輕鬆繪製流程圖、序列圖等。
- **樂譜渲染**: 支援 ABC Notation 語法。
- **PDF 匯出**: 一鍵將內容轉換為 PDF。

### 程式碼範例
```javascript
function helloWorld() {
  console.log("Hello, World!");
}
```

### 數學公式
這是著名的質能等價公式： $E = mc^2$

其它數學式:
$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
$$
\\int_{-\\infty}^\\infty e^{-x^2}dx = \\sqrt{\\pi}
$$

\\[
\\cos^2 \\theta + \\sin^2 \\theta = 1
\\]

<div style="page-break-after: always;"></div>
<br><br>

### Mermaid 圖表

 - 系統架構圖 (Architecture Diagram)

```mermaid
graph TD
    subgraph View
        index.html
    end

    subgraph Controller
        main.js
    end

    subgraph Renderer
        markdownRenderer.js
    end

    subgraph Utilities
        fileHandler.js
        uiManager.js
        modalManager.js
    end

    subgraph External Libraries
        L1[marked.js]
        L2[highlight.js]
        L3[mermaid.js]
        L4[abcjs]
        L5[MathJax]
    end

    index.html --> main.js
    main.js --呼叫--> markdownRenderer.js
    main.js --呼叫--> fileHandler.js
    main.js --呼叫--> uiManager.js
    fileHandler.js --呼叫--> modalManager.js
    markdownRenderer.js --引用並呼叫--> L1
    markdownRenderer.js --引用並呼叫--> L2
    markdownRenderer.js --引用並呼叫--> L3
    markdownRenderer.js --引用並呼叫--> L4
    markdownRenderer.js --引用並呼叫--> L5

    style L1 fill:#005AB5,stroke:#333,stroke-width:2px
    style L2 fill:#005AB5,stroke:#333,stroke-width:2px
    style L3 fill:#005AB5,stroke:#333,stroke-width:2px
    style L4 fill:#D26900,stroke:#333,stroke-width:2px
    style L5 fill:#FFA042,stroke:#333,stroke-width:2px
```

 - 循序圖 (Sequence Diagram)

```mermaid
sequenceDiagram
    participant User
    participant HTML as index.html
    participant Main as main.js
    participant Renderer as markdownRenderer.js
    participant Marked as marked.js
    participant HLJS as highlight.js
    participant Mermaid as mermaid.js
    participant ABCJS as abcjs
    participant MathJax as MathJax

    User->>HTML: 鍵盤輸入或點擊「範例內容」
    HTML->>Main: 觸發 editor 'input' 事件
    Main->>Renderer: 呼叫 updateAll()，並傳入 DOM 元素和外部函式庫
    Renderer->>Marked: 呼叫 marked.parse()
    Marked->>Renderer: 回傳 HTML 內容
    Renderer->>HTML: 更新 preview.innerHTML
    Renderer->>HTML: 查詢 'pre code'、'.mermaid'、'.abc-notation'
    Renderer->>HLJS: 呼叫 highlightElement() (針對程式碼區塊)
    Renderer->>Mermaid: 呼叫 mermaid.init()
    Renderer->>ABCJS: 呼叫 renderAbc()
    Renderer->>MathJax: 呼叫 typesetPromise()
    Renderer->>Renderer: 呼叫 updateSidebar()
    Renderer->>HTML: 更新文件大綱 (nav-list)
    Renderer->>Main: 渲染結束
    Main->>HTML: 觸發 editor 'scroll' 事件 (同步捲動)
    HTML->>User: 顯示更新後的預覽
```
<div style="page-break-after: always;"></div>
<br><br>

 - 版面配置規劃 (Layout Planning)

```mermaid
graph TD
    A[整體頁面] --> B[頁首區];
    A --> C[主要內容區];

    B --> D[標題];
    B --> E[按鈕列];

    C --> F[左側面板 - 編輯區];
    C --> G[分割線];
    C --> H[右側面板 - 預覽區];

    F --> I[行號];
    F --> J[文字編輯器];

    H --> K[Markdown 預覽];
    H --> L[側邊導航];
```
 - CSS 架構圖 (CSS Architecture Diagram)

```mermaid
graph TD

    subgraph Custom Styles
        styles.css
    end

    subgraph External Styles
        S1[fa.css]
        S2[github-markdown.css]
        S3[abcjs-svg.css]
        S4[hljs-dark.css]
        S5[hljs-light.css]
    end

    index.html --> styles.css
    index.html --> S1
    index.html --> S2
    index.html --> S3
    index.html --> S4
    index.html --> S5
```
<div style="page-break-after: always;"></div>
<br><br>


 - 流程圖範例 

```mermaid
graph TD
    A[開始] --> B{判斷};
    B -- 是 --> C[動作 1];
    B -- 否 --> D[動作 2];
    C --> E[結束];
    D --> E;
```

<div style="page-break-after: always;"></div>
<br><br>

### 樂譜範例
```abc
X:1
T:愛爾蘭舞曲 (Drowsy Maggie) - 小調與裝飾音
M:4/4
L:1/8
K:Edor
E2BE dEBE|E2BE AFDF| E2BE dEBE|BABc dAFD:|
d2fd c2ec|defg afge|d2fd c2ec|BABc dAFD|
d2fd c2ec|defg afge|afge fdec|BABc dAFD||
```

```abc
X:1
T:和弦與歌詞範例
M:4/4
L:1/4
K:C
"Ｃ" C E G c | "Ｇ７" G B d f | "Ｆ" F A c' e' | "Ｃ" C E G c2 |
w: 歡-迎-來-到 | ABC-記-譜-法 | 世-界-真-奇-妙 | 音樂-真-美-妙-！
```
