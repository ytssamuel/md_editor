/**
 * 簡易日誌抽象層，可後續改寫為將錯誤送往遠端。
 * 可用 localStorage.setItem('log:level','debug') 來開啟較多輸出。
 */
const levelRank = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevelKey = (localStorage.getItem('log:level') || 'info').toLowerCase();
const currentLevel = levelRank[currentLevelKey] ?? 2;

const formatTime = () => new Date().toISOString();
const base = (tag, color, args) => {
    // 使用 console 對應函式保留堆疊
    // eslint-disable-next-line no-console
    console.log(`%c${formatTime()} [${tag}]`, `color:${color};font-weight:bold`, ...args);
};

export const logger = {
    /** @param {...any} args */
    error: (...args) => { if (currentLevel >= levelRank.error) base('ERROR', '#e06c75', args); },
    /** @param {...any} args */
    warn: (...args) => { if (currentLevel >= levelRank.warn) base('WARN', '#d19a66', args); },
    /** @param {...any} args */
    info: (...args) => { if (currentLevel >= levelRank.info) base('INFO', '#61afef', args); },
    /** @param {...any} args */
    debug: (...args) => { if (currentLevel >= levelRank.debug) base('DEBUG', '#98c379', args); }
};

export default logger;
