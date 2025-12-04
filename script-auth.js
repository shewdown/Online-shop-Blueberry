/* =============================
   Переменные и функции
============================= */

function initAuth() {
    const loginForm = document.getElementById('form-log');
    const registerForm = document.getElementById('form-reg');
    const linkToLog = document.getElementById('link-to-log');
    const linkToReg = document.getElementById('link-to-reg');

    if (!loginForm || !registerForm || !linkToLog || !linkToReg) return;

    // Очистка старых обработчиков (без дублирования)
    linkToLog.replaceWith(linkToLog.cloneNode(true));
    linkToReg.replaceWith(linkToReg.cloneNode(true));

    const newLinkToLog = document.getElementById('link-to-log');
    const newLinkToReg = document.getElementById('link-to-reg');

    newLinkToLog.addEventListener('click', () => {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    newLinkToReg.addEventListener('click', () => {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });
}

/* ---- Toggle-иконка ---- */
function togglePassword(inputId, toggleEl) {
    const input = document.getElementById(inputId);
    const eye_opened = toggleEl.querySelector('.eye-opened');
    const eye_closed = toggleEl.querySelector('.eye-closed');

    if (!input || !eye_opened || !eye_closed) return;

    if (input.type === "password") {
        input.type = "text";
        eye_opened.style.display = "block";
        eye_closed.style.display = "none";
        eye_opened.classList.add('active')
        eye_closed.classList.remove('active')
    } else {
        input.type = "password";
        eye_opened.style.display = "none";
        eye_closed.style.display = "block";
        eye_opened.classList.remove('active')
        eye_closed.classList.add('active')
    }
}

// Делаем доступным глобально
window.initAuth = initAuth;
window.togglePassword = togglePassword;
