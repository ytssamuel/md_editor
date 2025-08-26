export const modalManager = {
    show: (message, isConfirmation, showInput = false, inputValue = '') => {
        const modal = document.getElementById('myModal');
        const modalText = document.getElementById('modal-text');
        const modalInput = document.getElementById('modal-input');
        const modalOk = document.getElementById('modal-ok');
        const modalCancel = document.getElementById('modal-cancel');
        const modalClose = document.getElementsByClassName('modal-close')[0];

        return new Promise((resolve) => {
            modalText.textContent = message;
            modalInput.value = inputValue;
            modalInput.style.display = showInput ? 'block' : 'none';
            modalOk.textContent = isConfirmation ? '確定' : '關閉';
            modalCancel.style.display = isConfirmation ? 'inline-block' : 'none';
            modal.style.display = 'flex';
            if (showInput) {
                modalInput.focus();
            }

            const handleOk = () => {
                modal.style.display = 'none';
                const value = modalInput.value;
                modalOk.removeEventListener('click', handleOk);
                modalCancel.removeEventListener('click', handleCancel);
                modalClose.removeEventListener('click', handleCancel);
                resolve({ confirmed: true, value: value });
            };

            const handleCancel = () => {
                modal.style.display = 'none';
                modalOk.removeEventListener('click', handleOk);
                modalCancel.removeEventListener('click', handleCancel);
                modalClose.removeEventListener('click', handleCancel);
                resolve({ confirmed: false, value: '' });
            };

            modalOk.addEventListener('click', handleOk);
            modalCancel.addEventListener('click', handleCancel);
            modalClose.addEventListener('click', handleCancel);
        });
    }
};