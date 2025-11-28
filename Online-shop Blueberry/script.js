document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. Инициализация переменных и констант
    // =================================================================
    const carousel = document.querySelector('.categories');
    const cards = document.querySelectorAll('.category');
    const btnLeft = document.querySelector('.to-left');
    const btnRight = document.querySelector('.to-right');
    const dotsContainer = document.querySelector('.dots');

    // Размеры и группировка (должны совпадать с CSS)
    const cardWidth = 300;
    const gap = 15;
    const itemWidth = cardWidth + gap; // 315px
    const groupSize = 3;   // Количество карточек на один шаг/точку

    // Параметры таймеров
    let autoScrollInterval;
    let inactivityTimeout;
    const AUTO_SCROLL_DELAY = 5000;
    const INACTIVITY_DELAY = 3000;
    
    let dots; // Будет инициализирована после создания точек

    // =================================================================
    // 2. Вспомогательные функции
    // =================================================================

    // Функция скролла: гарантирует smooth-переход к ровной позиции
    const scrollToIndex = (index) => {
        const targetScroll = index * itemWidth;
        carousel.scrollTo({
            left: targetScroll,
            behavior: 'smooth' 
        });
    };

    // Вычисление текущего индекса карточки, округленного до целого (для сетки)
    const getCurrentIndex = () => {
        return Math.round(carousel.scrollLeft / itemWidth);
    };

    // =================================================================
    // 3. Создание точек (ДОЛЖНО ИДТИ ПЕРЕД updateUI!)
    // =================================================================
    const dotsCount = Math.ceil(cards.length / groupSize);

    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            let targetIndex = i * groupSize;
            
            // --- ЛОГИКА КОРРЕКТИВКИ ПОСЛЕДНЕЙ ТОЧКИ (ДЛЯ ПОЛНОГО ВИДА) ---
            if (i === dotsCount - 1) { 
                // Целевой индекс должен быть cards.length - groupSize (например, 12 - 3 = 9)
                targetIndex = cards.length - groupSize;
            }
            
            scrollToIndex(targetIndex);
            resetInactivityTimer();
        });
        
        dotsContainer.appendChild(dot);
    }
    
    // Инициализация переменной dots после создания элементов в DOM
    dots = document.querySelectorAll('.dot');


    // =================================================================
    // 4. Обновление интерфейса (Кнопки и Точки)
    // =================================================================
    const updateUI = () => {
        const currentIndex = getCurrentIndex();
        
        // --- Обновление Точек ---
        // Используем Math.floor, чтобы первые 3 карточки (индексы 0, 1, 2)
        // соответствовали dot index 0.
        let activeDotIndex = Math.floor(currentIndex / groupSize);

        // Коррекция для последней точки: если мы видим последнюю карточку (index 11),
        // активной должна быть последняя точка.
        if (currentIndex >= cards.length - groupSize && dotsCount > 0) {
            activeDotIndex = dotsCount - 1;
        }

        dots.forEach((dot, index) => {
            if (index === activeDotIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });

        // --- Обновление Кнопок ---
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        
        if (carousel.scrollLeft <= 5) btnLeft.classList.add('disabled');
        else btnLeft.classList.remove('disabled');

        if (carousel.scrollLeft >= maxScroll - 5) btnRight.classList.add('disabled');
        else btnRight.classList.remove('disabled');
    };

    // =================================================================
    // 5. Логика Автопрокрутки
    // =================================================================
    const performAutoScroll = () => {
        const isEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
        
        if (isEnd) {
            // Если конец - прокручиваем в начало
            scrollToIndex(0);
        } else {
            // Иначе - прокручиваем на 1 карточку вперед, выравниваясь по сетке
            const currentIndex = getCurrentIndex();
            scrollToIndex(currentIndex + 1);
        }
    };

    const startAutoScroll = () => {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(performAutoScroll, AUTO_SCROLL_DELAY);
    };

    const stopAutoScroll = () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    };

    const resetInactivityTimer = () => {
        stopAutoScroll();
        if (inactivityTimeout) clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(startAutoScroll, INACTIVITY_DELAY);
    };

    // =================================================================
    // 6. Обработчики Кнопок
    // =================================================================
    btnLeft.addEventListener('click', () => {
        let newIndex = getCurrentIndex() - groupSize;
        if (newIndex < 0) newIndex = 0;
        scrollToIndex(newIndex);
        resetInactivityTimer();
    });

    btnRight.addEventListener('click', () => {
        const currentIndex = getCurrentIndex();
        let newIndex = currentIndex + groupSize;
        
        // --- ИСПРАВЛЕНИЕ: Ограничитель для последней страницы ---
        // Прокрутка должна остановиться так, чтобы было видно cards.length - groupSize (10, 11, 12)
        const maxScrollIndex = cards.length - groupSize; 
        
        if (newIndex > maxScrollIndex) {
            newIndex = maxScrollIndex;
        }
        
        scrollToIndex(newIndex);
        resetInactivityTimer();
    });

    // =================================================================
    // 7. Общие обработчики
    // =================================================================
    carousel.addEventListener('scroll', () => {
        updateUI(); 
    });

    // Любое вмешательство пользователя сбрасывает таймер
    ['mousedown', 'wheel', 'touchstart', 'keydown', 'click'].forEach(evt => {
        carousel.addEventListener(evt, resetInactivityTimer, { passive: true });
    });
    btnLeft.addEventListener('mouseenter', resetInactivityTimer);
    btnRight.addEventListener('mouseenter', resetInactivityTimer);

    // =================================================================
    // 8. Старт
    // =================================================================
    updateUI();
    resetInactivityTimer();
});