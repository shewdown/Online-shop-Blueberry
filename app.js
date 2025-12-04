// ------------------------------
// ГЛАВНАЯ ТОЧКА ИНИЦИАЛИЗАЦИИ
// ------------------------------

function initAll(namespace) {
    console.log("initAll запущен на странице:", namespace);

    // Инициализация только для catalog
    if (namespace === "catalog") {
        initCarousel();
        initProductsPreview();
    }

    // Инициализация только для auth
    if (namespace === "auth") {
        initAuthForms();
    }
}

// -----------------------------------------
// ИНИЦИАЛИЗАЦИЯ КАРУСЕЛИ (catalog)
// -----------------------------------------
function initCarousel() {
    const carousel = document.querySelector(".categories");
    if (!carousel) return;

    console.log("Инициализация карусели...");

    // Добавь свою логику карусели здесь ↓
    // (Если нужна — перенесу твою из script.js)
}


// -----------------------------------------
// ИНИЦИАЛИЗАЦИЯ ПРОДУКТОВ (catalog)
// -----------------------------------------
function initProductsPreview() {
    console.log("Инициализация превью товаров...");

    // Твоя логика
}


// -----------------------------------------
// ИНИЦИАЛИЗАЦИЯ AUTH (auth)
// -----------------------------------------
function initAuthForms() {
    console.log("Инициализация формы логина/регистрации");

    const logForm = document.getElementById("form-log");
    const regForm = document.getElementById("form-reg");
    const toReg = document.getElementById("link-to-reg");
    const toLog = document.getElementById("link-to-log");

    if (toReg) {
        toReg.onclick = () => {
            logForm.classList.remove("active");
            regForm.classList.add("active");
        };
    }

    if (toLog) {
        toLog.onclick = () => {
            regForm.classList.remove("active");
            logForm.classList.add("active");
        };
    }

    // Переключение пароля
    const toggles = document.querySelectorAll(".toggle-eye");
    toggles.forEach(toggle => {
        toggle.onclick = () => {
            const input = toggle.parentElement.querySelector("input");
            const opened = toggle.querySelector(".eye-opened");
            const closed = toggle.querySelector(".eye-closed");

            if (input.type === "password") {
                input.type = "text";
                opened.classList.add("active");
                closed.classList.remove("active");
            } else {
                input.type = "password";
                opened.classList.remove("active");
                closed.classList.add("active");
            }
        };
    });
}



// -----------------------------------------
// BARBA.JS
// -----------------------------------------
barba.init({
    transitions: [{
        name: 'default-transition',

        leave(data) {
            return gsap.to(data.current.container, {
                opacity: 0,
                duration: 0.3
            });
        },

        enter(data) {
            window.scrollTo(0, 0);

            return gsap.from(data.next.container, {
                opacity: 0,
                duration: 0.3
            });
        }
    }]
});


// Запуск initAll() при каждом переходе
barba.hooks.afterEnter((data) => {
    const ns = data.next.namespace;
    initAll(ns);
});

// Запуск при первой загрузке
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("[data-barba='container']");
    initAll(container.dataset.barbaNamespace);
});
