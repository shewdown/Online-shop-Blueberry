function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    const messageEl = notification.querySelector('.notification-message');
    
    // Устанавливаем сообщение и тип
    messageEl.textContent = message;
    
    // Показываем
    notification.classList.add('show');
    
    // Скрываем через duration миллисекунд
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay-sidebar');
    sidebar.classList.add('show');
    overlay.classList.add('show');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay-sidebar');
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    
}

document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // Barba.js
    // ============================================================
    barba.init({
        transitions: [{
            async leave(data) {
                data.current.container.style.opacity = 0;
                await new Promise(r => setTimeout(r, 300));
            },
            enter(data) {
                data.next.container.style.opacity = 0;
                setTimeout(() => {
                    data.next.container.style.opacity = 1;
                }, 0);
            }
        }]
    });

    // ============================================================
    // Функция инициализации карусели
    // ============================================================
    function initCarousel() {
        const carousel = document.querySelector(".categories");
        const cards = document.querySelectorAll(".category");
        const btnLeft = document.querySelector(".to-left");
        const btnRight = document.querySelector(".to-right");
        const dotsContainer = document.querySelector(".dots");

        if (!carousel || !cards.length || !btnLeft || !btnRight || !dotsContainer) return;

        const CARD_WIDTH = cards[0].getBoundingClientRect().width;
        const GAP = parseFloat(getComputedStyle(carousel).gap);
        const ITEM_WIDTH = CARD_WIDTH + GAP;
        const GROUP_SIZE = 3;
        const AUTO_SCROLL_DELAY = 5000;
        const INACTIVITY_DELAY = 3000;

        let autoScrollInterval = null;
        let inactivityTimeout = null;
        let dots = [];

        function scrollToIndex(index) {
            carousel.scrollTo({ left: index * ITEM_WIDTH, behavior: "smooth" });
        }

        function getCurrentIndex() {
            return Math.round(carousel.scrollLeft / ITEM_WIDTH);
        }

        function createDots() {
            dotsContainer.innerHTML = "";
            const dotsCount = Math.ceil(cards.length / GROUP_SIZE);
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (i === 0) dot.classList.add("active");

                dot.addEventListener("click", () => {
                    let targetIndex = i * GROUP_SIZE;
                    if (i === dotsCount - 1) targetIndex = cards.length - GROUP_SIZE;
                    scrollToIndex(targetIndex);
                    resetInactivityTimer();
                });

                dotsContainer.appendChild(dot);
            }
            dots = document.querySelectorAll(".dot");
        }

        function updateUI() {
            const currentIndex = getCurrentIndex();
            const dotsCount = dots.length;
            let activeDotIndex = Math.floor(currentIndex / GROUP_SIZE);
            if (currentIndex >= cards.length - GROUP_SIZE && dotsCount > 0) {
                activeDotIndex = dotsCount - 1;
            }
            dots.forEach((dot, index) => dot.classList.toggle("active", index === activeDotIndex));
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            btnLeft.classList.toggle("disabled", carousel.scrollLeft <= 5);
            btnRight.classList.toggle("disabled", carousel.scrollLeft >= maxScroll - 5);
        }

        function performAutoScroll() {
            const isEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
            scrollToIndex(isEnd ? 0 : getCurrentIndex() + 1);
        }

        function startAutoScroll() {
            stopAutoScroll();
            autoScrollInterval = setInterval(performAutoScroll, AUTO_SCROLL_DELAY);
        }

        function stopAutoScroll() {
            if (autoScrollInterval) clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }

        function resetInactivityTimer() {
            stopAutoScroll();
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(startAutoScroll, INACTIVITY_DELAY);
        }

        btnLeft.onclick = () => { scrollToIndex(Math.max(getCurrentIndex() - GROUP_SIZE, 0)); resetInactivityTimer(); };
        btnRight.onclick = () => { 
            scrollToIndex(Math.min(getCurrentIndex() + GROUP_SIZE, cards.length - GROUP_SIZE)); 
            resetInactivityTimer(); 
        };

        carousel.addEventListener("scroll", updateUI);
        ["mousedown", "wheel", "touchstart", "keydown", "click"].forEach(evt => carousel.addEventListener(evt, resetInactivityTimer, { passive: true }));
        btnLeft.addEventListener("mouseenter", resetInactivityTimer);
        btnRight.addEventListener("mouseenter", resetInactivityTimer);

        createDots();
        updateUI();
        resetInactivityTimer();
    }

    // ============================================================
    // ИНИЦИАЛИЗАЦИЯ
    // ============================================================
    function initAll() {
        initCarousel();
        if (typeof window.initAuth === 'function') window.initAuth();
    }

    // Первая загрузка
    initAll();

    // После переходов Barba
    barba.hooks.afterEnter(() => {
        initAll();
    });

});
