### **Vite 專案指令文件**

以下是建置與運行 Vite 專案時常用的指令，主要使用 npm 套件管理工具。

-----

#### 1\. 建立新的 Vite 專案

使用此指令會啟動一個互動式介面，引導你選擇專案名稱、使用的框架（如 Vue、React）與程式語言。

```bash
npm create vite@latest
```

-----

#### 2\. 安裝專案依賴套件

進入你剛建立的專案目錄，並執行此指令來安裝專案所需的所有套件。

```bash
cd your-project-name
npm install
```

-----

#### 3\. 啟動開發伺服器

執行此指令來啟動本地開發伺服器。伺服器會提供熱更新（HMR）功能，當你儲存檔案時，頁面會自動更新。

```bash
npm run dev
```

-----

#### 4\. 建立生產版本（Production Build）

執行此指令會將你的專案編譯並打包成靜態檔案，通常會輸出到 `dist/` 資料夾中，這些檔案可用於部署到任何靜態網站伺服器。

```bash
npm run build
```

-----

#### 5\. 預覽生產版本

在專案編譯完成後，此指令可以啟動一個本地伺服器，讓你預覽 `dist/` 資料夾中的內容。

```bash
npm run preview
```

---


好的，這是一個很好的問題。Vite 不僅限於 Vue.js，它也可以作為一個非常快速的開發伺服器，用來部署和運行任何靜態 HTML 網頁專案。

要將一個現有的 HTML 專案部署到 Vite 上執行，你可以遵循以下幾個簡單的步驟。

### **步驟一：初始化 Node.js 專案**

首先，請確保你的專案資料夾內已經安裝了 Node.js 環境。如果你的專案還沒有 `package.json` 檔案，你需要初始化一個 Node.js 專案。

1.  開啟你的終端機 (Terminal 或 Command Prompt)，並進入你的專案根目錄。
    ```bash
    cd /path/to/your/project
    ```
2.  執行以下指令來初始化一個 `package.json` 檔案。你可以一路按 `Enter` 鍵使用預設值。
    ```bash
    npm init -y
    ```
    這個指令會在你的專案根目錄建立一個 `package.json` 檔案，用來管理專案的依賴套件。

### **步驟二：安裝 Vite**

接下來，你需要將 Vite 安裝為你專案的開發依賴。

1.  在終端機中，執行以下指令。
    ```bash
    npm install vite --save-dev
    ```
    這會將 Vite 安裝在專案的 `node_modules` 資料夾中，並在 `package.json` 檔案的 `devDependencies` 部分加入 Vite。

### **步驟三：設定 `package.json` 腳本**

為了方便啟動 Vite 開發伺服器，你需要在 `package.json` 中新增一個腳本。

1.  打開 `package.json` 檔案。

2.  在 `"scripts"` 區塊中，新增一個 `"dev"` 腳本。

    你的 `package.json` 檔案應該看起來像這樣：

    ```json
    {
      "name": "your-project-name",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "dev": "vite",  // <-- 在這裡新增
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "vite": "^5.0.0"
      }
    }
    ```

### **步驟四：移動你的 HTML 檔案**

Vite 預設會尋找專案根目錄下的 `index.html` 作為入口檔案。

  * 如果你的主 HTML 檔案名稱就是 `index.html`，並且它位於專案的根目錄，那就不需要做任何事。
  * 如果你的主 HTML 檔案名稱是其他的，例如 `main.html`，或者它位於子目錄，你需要將它移動到專案的根目錄並重新命名為 `index.html`。

### **步驟五：調整資產路徑 (Images, CSS, JS)**

當你運行 Vite 時，它會啟動一個本地伺服器。如果你在 HTML 或 CSS 中使用了相對路徑來引用圖片、CSS 或 JavaScript 檔案，它們應該會繼續正常工作。

例如，如果你的專案結構是這樣：

```
your-project/
├── index.html
├── styles/
│   └── main.css
└── images/
    └── background.jpg
```

你的 `index.html` 可以像這樣引用 CSS 和圖片：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Webpage</title>
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
    <h1>Hello, Vite!</h1>
    <img src="/images/background.jpg" alt="Background Image">
</body>
</html>
```

**注意：** 建議使用 `/` 開頭的絕對路徑，以確保在 Vite 伺服器上正確引用。

### **步驟六：運行你的專案**

現在，一切都設定好了，你可以啟動 Vite 開發伺服器來預覽你的專案。

1.  在終端機中，執行你剛才設定的腳本：
    ```bash
    npm run dev
    ```
2.  Vite 會立即啟動一個開發伺服器，並提供一個網址，通常是 `http://localhost:5173/`。你可以在瀏覽器中打開這個網址，看到你的 HTML 網頁已經在 Vite 的環境中運行了。

當你在開發時修改檔案，Vite 會自動進行快速的熱更新（HMR），你不需要手動重新整理頁面。這會大大提升你的開發效率。

### **總結**

將現有 HTML 專案部署到 Vite 執行是一個非常簡單且高效的過程，主要就是：

1.  初始化 Node.js 專案。
2.  安裝 Vite。
3.  設定 `package.json` 腳本。
4.  將主 HTML 檔案放到根目錄。
5.  運行 `npm run dev`。

這讓你的靜態網頁專案也能享受到現代前端工具的快速開發體驗。