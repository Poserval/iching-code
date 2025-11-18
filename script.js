// Базовые переменные приложения
let currentLines = []; // Здесь будем хранить результаты бросков ['yang', 'yin']

// Функция для переключения между экранами
function showScreen(screenId) {
    // Скрываем все экраны
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Если переходим на экран гадания - инициализируем случайные монеты
        if (screenId === 'divination-screen') {
            initializeRandomCoins();
            resetDivinationState();
        }
    }
}

// Функция инициализации случайного положения монет при входе в гадание
function initializeRandomCoins() {
    const coins = document.querySelectorAll('.coin');
    const coinTypes = ['ruble', 'dollar', 'yuan'];
    
    coins.forEach((coin, index) => {
        // Случайно выбираем орел или решка (50/50)
        const isHeads = Math.random() > 0.5;
        const coinType = coinTypes[index];
        
        if (isHeads) {
            coin.src = `assets/coins/${coinType}-heads.png`;
        } else {
            coin.src = `assets/coins/${coinType}-tails.png`;
        }
        
        // Убираем alt текст чтобы не показывалось при наведении
        coin.alt = 'Монета';
    });
}

// Функция сброса состояния гадания при новом входе
function resetDivinationState() {
    currentLines = [];
    
    // Очищаем область гексаграммы
    const hexagramContainer = document.getElementById('hexagram-lines');
    hexagramContainer.innerHTML = '<p>Бросьте монеты 6 раз чтобы построить гексаграмму</p>';
    
    // Обновляем кнопку
    const actionButton = document.getElementById('action-button');
    actionButton.disabled = false;
    actionButton.textContent = 'Бросить монеты (6 из 6)';
}

// ОСНОВНАЯ ФУНКЦИЯ - ОБРАБОТКА ДЕЙСТВИЯ
function handleAction() {
    if (currentLines.length < 6) {
        // Если еще не все броски сделаны - бросаем монеты
        throwCoins();
    } else {
        // Если все броски сделаны - показываем результат
        showResult();
    }
}

// Функция броска монет
function throwCoins() {
    // 1. Генерируем результат броска ('yang' или 'yin')
    const throwResult = calculateThrowResult();
    
    // 2. Добавляем результат в массив
    currentLines.push(throwResult);
    
    // 3. Визуализируем бросок монет
    animateCoinThrow();
    
    // 4. Обновляем интерфейс
    updateInterface();
    
    // 5. Через небольшую задержку рисуем линию
    setTimeout(() => {
        drawHexagramLine(throwResult);
    }, 800);
}

// Функция расчета результата броска
function calculateThrowResult() {
    let eagles = 0;
    
    // Считаем количество орлов
    for (let i = 0; i < 3; i++) {
        if (Math.random() > 0.5) {
            eagles++; // Орел
        }
    }
    
    // Упрощенная логика:
    if (eagles >= 2) {
        return 'yang'; // 2 или 3 орла = Ян
    } else {
        return 'yin';  // 0 или 1 орел = Инь
    }
}

// Функция анимации броска монет
function animateCoinThrow() {
    const coins = document.querySelectorAll('.coin');
    const actionButton = document.getElementById('action-button');
    
    // Блокируем кнопку на время анимации
    actionButton.disabled = true;
    
    // Анимируем каждую монету
    coins.forEach((coin) => {
        // Добавляем класс анимации
        coin.classList.add('animating');
        
        // После анимации убираем класс
        setTimeout(() => {
            coin.classList.remove('animating');
        }, 600);
    });
    
    // Обновляем отображение монет после анимации
    setTimeout(() => {
        updateCoinsDisplay();
        actionButton.disabled = false;
    }, 800);
}

// Функция для обновления отображения монет после броска
function updateCoinsDisplay() {
    const coins = document.querySelectorAll('.coin');
    const coinTypes = ['ruble', 'dollar', 'yuan'];
    
    coins.forEach((coin, index) => {
        // Случайно определяем орел или решка для каждой монеты
        const isHeads = Math.random() > 0.5;
        const coinType = coinTypes[index];
        
        if (isHeads) {
            coin.src = `assets/coins/${coinType}-heads.png`;
        } else {
            coin.src = `assets/coins/${coinType}-tails.png`;
        }
        
        // Убираем alt текст чтобы не показывалось при наведении
        coin.alt = 'Монета';
    });
}

// Функция отрисовки линии гексаграммы
function drawHexagramLine(lineValue) {
    const hexagramContainer = document.getElementById('hexagram-lines');
    
    // Очищаем начальный текст при первом броске
    if (currentLines.length === 1) {
        hexagramContainer.innerHTML = '';
    }
    
    // Создаем элемент для линии
    const lineElement = document.createElement('div');
    lineElement.className = `hexagram-line ${getLineType(lineValue)}`;
    
    // Определяем тип линии и символ
    const lineInfo = getLineInfo(lineValue);
    lineElement.textContent = `${lineInfo.symbol} ${lineInfo.name}`;
    
    // Добавляем линию ВНИЗУ контейнера (строим снизу вверх)
    hexagramContainer.appendChild(lineElement);
    
    // Прокручиваем вниз чтобы видеть новую линию
    hexagramContainer.scrollTop = hexagramContainer.scrollHeight;
}

// Функция определения типа линии
function getLineType(lineValue) {
    return lineValue === 'yang' ? 'yang-static' : 'yin-static';
}

// Функция получения информации о линии
function getLineInfo(lineValue) {
    if (lineValue === 'yang') {
        return { symbol: '⚊', name: 'Ян' };
    } else {
        return { symbol: '⚋', name: 'Инь' };
    }
}

// Функция обновления интерфейса
function updateInterface() {
    const actionButton = document.getElementById('action-button');
    const remainingThrows = 6 - currentLines.length;
    
    if (remainingThrows > 0) {
        actionButton.textContent = `Бросить монеты (${remainingThrows} из 6)`;
    } else {
        actionButton.textContent = 'Показать результат';
    }
}

// Функция показа результата (заглушка - будет дорабатываться)
function showResult() {
    alert(`Готово! Получены линии: ${currentLines.join(', ')}\n\nФункция показа толкования будет реализована в следующем шаге!`);
}

// Функция сброса гадания
function resetDivination() {
    showScreen('divination-screen');
}
