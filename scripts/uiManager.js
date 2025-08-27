export const uiManager = {
    toggleTheme: () => {
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        const hljsTheme = document.getElementById('hljs-theme');
        const isLightMode = document.body.classList.toggle('light-mode');
        const editor = document.querySelector('.CodeMirror').CodeMirror;
        
        // 判斷當前是否為淺色模式，並更新 UI 顯示和 localStorage
        if (isLightMode) {
            themeToggleBtn.innerHTML = `<i class=\"fas fa-moon\"></i><span id=\"theme-text\">深色模式</span>`;
            localStorage.setItem('theme', 'light');
            hljsTheme.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/github.min.css";
            editor.setOption('theme', 'eclipse');
        } else {
            themeToggleBtn.innerHTML = `<i class=\"fas fa-sun\"></i><span id=\"theme-text\">淺色模式</span>`;
            localStorage.setItem('theme', 'dark');
            hljsTheme.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/atom-one-dark.min.css";
            editor.setOption('theme', 'material-darker');
        }
    },
    setViewMode: (mode) => {
        const splitContainer = document.getElementById('split-container');
        const viewButtons = document.querySelectorAll('#view-mode-bar button');
        const navSidebar = document.getElementById('nav-sidebar');
        
        splitContainer.classList.remove('view-mode-editor-only', 'view-mode-preview-only');
        viewButtons.forEach(btn => btn.classList.remove('active-view'));
        navSidebar.classList.remove('visible');

        if (mode === 'editor-only') {
            splitContainer.classList.add('view-mode-editor-only');
            document.getElementById('view-editor').classList.add('active-view');
        } else if (mode === 'preview-only') {
            splitContainer.classList.add('view-mode-preview-only');
            document.getElementById('view-preview').classList.add('active-view');
            navSidebar.classList.add('visible');
        } else {
            document.getElementById('view-both').classList.add('active-view');
        }
    }
};