/**
 * Modal 管理
 * show 回傳 Promise<{confirmed:boolean,value:string}>
 * 新增：ESC 關閉、focus trap、Tab 循環。
 */
export const modalManager = {
    show: (message, isConfirmation, showInput = false, inputValue = '') => {
        const modal = document.getElementById('myModal');
        const modalText = document.getElementById('modal-text');
        const modalInput = document.getElementById('modal-input');
        const modalOk = document.getElementById('modal-ok');
        const modalCancel = document.getElementById('modal-cancel');
        const modalClose = document.getElementsByClassName('modal-close')[0];

        /** @type {HTMLElement|null} */
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        return new Promise((resolve) => {
            modalText.textContent = message;
            modalInput.value = inputValue;
            modalInput.style.display = showInput ? 'block' : 'none';
            modalOk.textContent = isConfirmation ? '確定' : '關閉';
            modalCancel.style.display = isConfirmation ? 'inline-block' : 'none';
            modal.style.display = 'flex';

            // 可聚焦元素集合
            const focusables = [modalOk, ...(isConfirmation ? [modalCancel] : []), modalClose, ...(showInput ? [modalInput] : [])];
            let trapIndex = 0;
            // 初始 focus
            (showInput ? modalInput : modalOk).focus();

            const cleanup = () => {
                modal.style.display = 'none';
                document.removeEventListener('keydown', handleKey);
                focusables.forEach(el => el.removeEventListener('keydown', handleTab));
                modalOk.removeEventListener('click', handleOk);
                modalCancel.removeEventListener('click', handleCancel);
                modalClose.removeEventListener('click', handleCancel);
                if (previouslyFocused) previouslyFocused.focus();
            };

            const finish = (confirmed, value='') => {
                cleanup();
                resolve({ confirmed, value });
            };

            const handleOk = () => finish(true, modalInput.value);
            const handleCancel = () => finish(false, '');

            const handleKey = (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancel();
                }
            };

            const handleTab = (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    trapIndex = (trapIndex + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
                    focusables[trapIndex].focus();
                } else if (e.key === 'Enter' && e.target === modalInput) {
                    handleOk();
                }
            };

            modalOk.addEventListener('click', handleOk);
            modalCancel.addEventListener('click', handleCancel);
            modalClose.addEventListener('click', handleCancel);
            document.addEventListener('keydown', handleKey);
            focusables.forEach(el => el.addEventListener('keydown', handleTab));
        });
    }
};