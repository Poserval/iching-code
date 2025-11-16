// Базовые переменные приложения
let currentLines = []; // Здесь будем хранить результаты бросков [6,7,8,9]
let movingLines = [];  // Здесь будем хранить индексы движущихся линий

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
    
    coins.forEach(coin => {
        // Случайно выбираем орел или решка (50/50)
        const isHeads = Math.random() > 0.5;
        
        if (isHeads) {
            coin.src = 'assets/coins/coin-heads.png';
            coin.setAttribute('data-value', 'heads');
        } else {
            coin.src = 'assets/coins/coin-tails.png';
            coin.setAttribute('data-value', 'tails');
        }
    });
}

// Функция сброса состояния гадания при новом входе
function resetDivinationState() {
    currentLines = [];
    movingLines = [];
    
    // Очищаем область гексаграммы
    const hexagramContainer = document.getElementById('hexagram-lines');
    hexagramContainer.innerHTML = '<p>Бросьте монеты 6 раз чтобы построить гексаграмму</p>';
    
    // Скрываем кнопку результата
    document.getElementById('result-button').classList.add('hidden');
    
    // Включаем кнопку броска и обновляем текст
    const throwButton = document.getElementById('throw-button');
    throwButton.disabled = false;
    throwButton.textContent = `Бросить монеты (${6 - currentLines.length} из 6)`;
}

// ОСНОВНАЯ ФУНКЦИЯ - БРОСОК МОНЕТ
function throwCoins() {
    // Если уже сделали 6 бросков - выходим
    if (currentLines.length >= 6) {
        return;
    }

    // 1. Генерируем результат броска (6,7,8,9)
    const throwResult = calculateThrowResult();
    
    // 2. Добавляем результат в массив
    currentLines.push(throwResult);
    
    // 3. Визуализируем бросок монет
    animateCoinThrow(throwResult);
    
    // 4. Обновляем интерфейс
    updateInterface();
    
    // 5. Через небольшую задержку рисуем линию
    setTimeout(() => {
        drawHexagramLine(throwResult);
        
        // Если набрано 6 линий, показываем кнопку результата
        if (currentLines.length === 6) {
            document.getElementById('result-button').classList.remove('hidden');
        }
    }, 800);
}

// Функция расчета результата броска (возвращает 6,7,8,9)
function calculateThrowResult() {
    let totalValue = 0;
    
    // Бросаем 3 монеты
    for (let i = 0; i < 3; i++) {
        // Случайное значение: 2 (решка) или 3 (орел)
        const coinValue = Math.random() > 0.5 ? 3 : 2;
        totalValue += coinValue;
    }
    
    // Конвертируем в значения Ицзин:
    // 6=2+2+2 (Старая Инь), 7=2+2+3 (Молодой Ян), 
    // 8=2+3+3 (Молодая Инь), 9=3+3+3 (Старый Ян)
    return totalValue;
}

// Функция анимации броска монет
function animateCoinThrow(throwResult) {
    const coins = document.querySelectorAll('.coin');
    const throwButton = document.getElementById('throw-button');
    
    // Блокируем кнопку на время анимации
    throwButton.disabled = true;
    
    // Анимируем каждую монету
    coins.forEach((coin, index) => {
        // Добавляем класс анимации
        coin.classList.add('animating');
        
        // После анимации устанавливаем финальное положение
        setTimeout(() => {
            coin.classList.remove('animating');
            
            // Устанавливаем финальное изображение на основе результата
            // Для простоты делаем случайное, но соответствующее общему результату
            const isHeads = Math.random() > 0.5;
            if (isHeads) {
                coin.src = 'assets/coins/coin-heads.png';
            } else {
                coin.src = 'assets/coins/coin-tails.png';
            }
        }, 600);
    });
    
    // Разблокируем кнопку после анимации
    setTimeout(() => {
        throwButton.disabled = false;
    }, 800);
}

// Функция отрисовки линии гексаграммы
function drawHexagramLine(lineValue) {
    const hexagramContainer = document.getElementById('hexagram-lines');
    
    // Создаем элемент для линии
    const lineElement = document.createElement('div');
    lineElement.className = `hexagram-line ${getLineType(lineValue)}`;
    
    // Определяем тип линии и символ
    const lineInfo = getLineInfo(lineValue);
    lineElement.textContent = `${lineInfo.symbol} ${lineInfo.name}`;
    
    // Добавляем линию ВНИЗУ контейнера (строим снизу вверх)
    hexagramContainer.appendChild(lineElement);
    
    // Сохраняем движущиеся линии
    if (lineValue === 6 || lineValue === 9) {
        movingLines.push(currentLines.length - 1); // сохраняем индекс линии
    }
}

// Функция определения типа линии
function getLineType(lineValue) {
    switch(lineValue) {
        case 6: return 'yin-moving';   // Старая Инь (движущаяся)
        case 7: return 'yang-static';  // Молодой Ян (стабильный)
        case 8: return 'yin-static';   // Молодая Инь (стабильная)
        case 9: return 'yang-moving';  // Старый Ян (движущийся)
        default: return '';
    }
}

// Функция получения информации о линии
function getLineInfo(lineValue) {
    switch(lineValue) {
        case 6: return { symbol: '⚋', name: 'Старая Инь' };
        case 7: return { symbol: '⚊', name: 'Молодой Ян' };
        case 8: return { symbol: '⚋', name: 'Молодая Инь' };
        case 9: return { symbol: '⚊', name: 'Старый Ян' };
        default: return { symbol: '?', name: 'Неизвестно' };
    }
}

// Функция обновления интерфейса
function updateInterface() {
    const throwButton = document.getElementById('throw-button');
    const remainingThrows = 6 - currentLines.length;
    
    if (remainingThrows > 0) {
        throwButton.textContent = `Бросить монеты (${remainingThrows} из 6)`;
    } else {
        throwButton.textContent = 'Гадание завершено';
        throwButton.disabled = true;
    }
}

// Функция показа результата (заглушка - будет дорабатываться)
function showResult() {
    alert(`Готово! Получены линии: ${currentLines.join(', ')}\nДвижущиеся линии: ${movingLines.length > 0 ? movingLines.join(', ') : 'нет'}\n\nФункция показа толкования будет реализована в следующем шаге!`);
}

// Функция сброса гадания
function resetDivination() {
    showScreen('divination-screen');
}
