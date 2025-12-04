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
    // Функция полной инициализации карусели
    // ============================================================
    function initCarousel() {

        // -----------------------------
        // Поиск элементов
        // -----------------------------
        const carousel = document.querySelector(".categories");
        const cards = document.querySelectorAll(".category");
        const btnLeft = document.querySelector(".to-left");
        const btnRight = document.querySelector(".to-right");
        const dotsContainer = document.querySelector(".dots");

        // Если карусели НЕТ — выходим (страница без неё)
        if (!carousel || !cards.length || !btnLeft || !btnRight || !dotsContainer) {
            return;
        }

        // -----------------------------
        // Константы
        // -----------------------------
        const CARD_WIDTH = 300;
        const GAP = 15;
        const ITEM_WIDTH = CARD_WIDTH + GAP;
        const GROUP_SIZE = 3;

        const AUTO_SCROLL_DELAY = 5000;
        const INACTIVITY_DELAY = 3000;

        let autoScrollInterval = null;
        let inactivityTimeout = null;

        let dots = [];

        // -----------------------------
        // Функции
        // -----------------------------
        function scrollToIndex(index) {
            const targetScroll = index * ITEM_WIDTH;
            carousel.scrollTo({
                left: targetScroll,
                behavior: "smooth"
            });
        }

        function getCurrentIndex() {
            return Math.round(carousel.scrollLeft / ITEM_WIDTH);
        }

        function createDots() {
            dotsContainer.innerHTML = ""; // очищаем при каждом init

            const dotsCount = Math.ceil(cards.length / GROUP_SIZE);

            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (i === 0) dot.classList.add("active");

                dot.addEventListener("click", () => {
                    let targetIndex = i * GROUP_SIZE;

                    if (i === dotsCount - 1) {
                        targetIndex = cards.length - GROUP_SIZE;
                    }

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

            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === activeDotIndex);
            });

            const maxScroll = carousel.scrollWidth - carousel.clientWidth;

            btnLeft.classList.toggle("disabled", carousel.scrollLeft <= 5);
            btnRight.classList.toggle("disabled", carousel.scrollLeft >= maxScroll - 5);
        }

        function performAutoScroll() {
            const isEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;

            if (isEnd) {
                scrollToIndex(0);
            } else {
                scrollToIndex(getCurrentIndex() + 1);
            }
        }

        function startAutoScroll() {
            stopAutoScroll();
            autoScrollInterval = setInterval(performAutoScroll, AUTO_SCROLL_DELAY);
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        function resetInactivityTimer() {
            stopAutoScroll();
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(startAutoScroll, INACTIVITY_DELAY);
        }

        // -----------------------------
        // Навешивание событий
        // -----------------------------

        btnLeft.onclick = () => {
            let newIndex = getCurrentIndex() - GROUP_SIZE;
            if (newIndex < 0) newIndex = 0;
            scrollToIndex(newIndex);
            resetInactivityTimer();
        };

        btnRight.onclick = () => {
            const currentIndex = getCurrentIndex();
            let newIndex = currentIndex + GROUP_SIZE;

            const maxScrollIndex = cards.length - GROUP_SIZE;
            if (newIndex > maxScrollIndex) newIndex = maxScrollIndex;

            scrollToIndex(newIndex);
            resetInactivityTimer();
        };

        carousel.addEventListener("scroll", updateUI);

        ["mousedown", "wheel", "touchstart", "keydown", "click"].forEach(evt => {
            carousel.addEventListener(evt, resetInactivityTimer, { passive: true });
        });

        btnLeft.addEventListener("mouseenter", resetInactivityTimer);
        btnRight.addEventListener("mouseenter", resetInactivityTimer);

        // -----------------------------
        // Стартовая инициализация
        // -----------------------------
        createDots();
        updateUI();
        resetInactivityTimer();
    }

    // ============================================================
    // ИНИЦИАЛИЗАЦИЯ: 1) стартовая, 2) при переходах Barba
    // ============================================================
    initCarousel();

    barba.hooks.afterEnter(() => {
        initCarousel();
    });
});
