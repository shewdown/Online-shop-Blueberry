/* =============================
   Переменные
============================= */

const loginForm = document.getElementById('form-log');
const registerForm = document.getElementById('form-reg');
const linkToLog = document.getElementById('link-to-log')
const linkToReg = document.getElementById('link-to-reg')


/* =============================
   События
============================= */

linkToLog.addEventListener('click', () => {
    
    // Логин активен
    loginForm.classList.add('active');

    registerForm.classList.remove('active');
});

linkToReg.addEventListener('click', () => {

    // Регистрация активна
    registerForm.classList.add('active');

    loginForm.classList.remove('active');
});


/* ---- Toggle-иконка ---- */
function togglePassword(inputId, toggleEl) {
    const input = document.getElementById(inputId);
    const eye_opened = toggleEl.querySelector('.eye-opened');
    const eye_closed = toggleEl.querySelector('.eye-closed');

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
