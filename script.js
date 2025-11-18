// Базовые переменные приложения
let currentLines = [];

// Функция переключения экранов
function showScreen(screenId) {
    console.log('Переключаем на:', screenId);
    
    // Скрываем все экраны
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Если переходим на экран гадания - инициализируем
        if (screenId === 'divination-screen') {
            initializeRandomCoins();
            resetDivinationState();
        }
    }
}

// Функция инициализации монет
function initializeRandomCoins() {
    const coins = document.querySelectorAll('.coin');
    const coinTypes = ['ruble', 'dollar', 'yuan'];
    
    coins.forEach((coin, index) => {
        const isHeads = Math.random() > 0.5;
        const coinType = coinTypes[index];
        
        if (isHeads) {
            coin.src = `assets/coins/${coinType}-heads.png`;
        } else {
            coin.src = `assets/coins/${coinType}-tails.png`;
        }
        coin.alt = 'Монета';
    });
}

// Функция сброса состояния
function resetDivinationState() {
    currentLines = [];
    const hexagramContainer = document.getElementById('hexagram-lines');
    hexagramContainer.innerHTML = '<p>Бросьте монеты 6 раз чтобы построить гексаграмму</p>';
    
    const actionButton = document.getElementById('action-button');
    actionButton.disabled = false;
    actionButton.textContent = 'Бросить монеты (6 из 6)';
}

// Функция обработки действия
function handleAction() {
    if (currentLines.length < 6) {
        throwCoins();
    } else {
        showResult();
    }
}

// Функция броска монет
function throwCoins() {
    const throwResult = calculateThrowResult();
    currentLines.push(throwResult);
    
    // Анимация
    const coins = document.querySelectorAll('.coin');
    const actionButton = document.getElementById('action-button');
    
    actionButton.disabled = true;
    coins.forEach((coin) => {
        coin.classList.add('animating');
        setTimeout(() => {
            coin.classList.remove('animating');
        }, 600);
    });
    
    // Обновляем интерфейс
    updateInterface();
    
    // Рисуем линию
    setTimeout(() => {
        drawHexagramLine(throwResult);
        actionButton.disabled = false;
    }, 800);
}

// Функция расчета результата броска
function calculateThrowResult() {
    const coinTypes = ['ruble', 'dollar', 'yuan'];
    const coins = document.querySelectorAll('.coin');
    let eagles = 0;
    
    coins.forEach((coin, index) => {
        const coinType = coinTypes[index];
        const isHeads = Math.random() > 0.5;
        
        if (isHeads) {
            coin.src = `assets/coins/${coinType}-heads.png`;
            eagles++;
        } else {
            coin.src = `assets/coins/${coinType}-tails.png`;
        }
    });
    
    return eagles >= 2 ? 'yang' : 'yin';
}

// Функция отрисовки линии
function drawHexagramLine(lineValue) {
    const hexagramContainer = document.getElementById('hexagram-lines');
    
    if (currentLines.length === 1) {
        hexagramContainer.innerHTML = '';
    }
    
    const lineElement = document.createElement('div');
    lineElement.className = `hexagram-line ${lineValue === 'yang' ? 'yang-static' : 'yin-static'}`;
    lineElement.textContent = lineValue === 'yang' ? '⚊ Ян' : '⚋ Инь';
    
    hexagramContainer.appendChild(lineElement);
    hexagramContainer.scrollTop = hexagramContainer.scrollHeight;
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

// Функция показа результата - ТОЛЬКО 5-Й ЭКРАН
function showResult() {
    // Показываем экран гексаграммы
    showScreen('result-screen');
    
    // Отображаем гексаграмму (передаем текущие линии)
    showHexagram(currentLines);
}

// Функция отображения гексаграммы - КНОПКА В ГЛАВНОЕ МЕНЮ
function showHexagram(lines) {
    const hexagramContainer = document.getElementById('final-hexagram');
    
    // Определяем номер гексаграммы по линиям
    const hexagramNumber = calculateHexagramNumber(lines);
    
    hexagramContainer.innerHTML = `
        <div class="hexagram-image-container">
            <img src="assets/hexagrams/hexagram-${hexagramNumber}.png" 
                 alt="Гексаграмма ${hexagramNumber}" class="hexagram-image">
        </div>
        <button onclick="showScreen('main-menu')" style="margin-top: 20px;">
            В главное меню
        </button>
    `;
}

// Функция расчета номера гексаграммы
function calculateHexagramNumber(lines) {
    // Преобразуем линии в бинарный код (ян = 1, инь = 0)
    const binaryCode = lines.map(line => line === 'yang' ? '1' : '0').join('');
    
    // Таблица соответствия бинарного кода номерам гексаграмм
    const binaryToDecimal = {
        '111111': 1,   // Цянь - Творчество
        '000000': 2,   // Кунь - Исполнение
        '100010': 3,   // Чжунь - Начальные трудности
        '010001': 4,   // Мэн - Неведение
        '111010': 5,   // Сюй - Необходимость ждать
        '010111': 6,   // Сун - Тяжба
        '000010': 7,   // Ши - Войско
        '010000': 8,   // Би - Приближение
        '111011': 9,   // Сяо Чу - Малое накопление
        '110111': 10,  // Ли - Наступление
        '000111': 11,  // Тай - Процветание
        '111000': 12,  // Пи - Упадок
        '101111': 13,  // Тун Жэнь - Родня
        '111101': 14,  // Да Ю - Обладание великим
        '001000': 15,  // Цянь - Смирение
        '000100': 16,  // Юй - Вольность
        '100110': 17,  // Суй - Последование
        '011001': 18,  // Гу - Исправление
        '000011': 19,  // Линь - Посещение
        '110000': 20,  // Гуань - Созерцание
        '100101': 21,  // Ши Хэ - Сближение
        '101001': 22,  // Би - Изящество
        '000001': 23,  // Бо - Разорение
        '100000': 24,  // Фу - Возврат
        '100111': 25,  // У Ван - Беспорочность
        '111001': 26,  // Да Чу - Большое накопление
        '100001': 27,  // И - Питание
        '011110': 28,  // Да Го - Большое превышение
        '010010': 29,  // Кань - Опасность
        '101101': 30,  // Ли - Свет
        '001110': 31,  // Сянь - Взаимодействие
        '011100': 32,  // Хэн - Постоянство
        '001111': 33,  // Дунь - Бегство
        '111100': 34,  // Да Чжуан - Мощь великого
        '000101': 35,  // Цзинь - Восход
        '101000': 36,  // Мин И - Поражение света
        '101011': 37,  // Цзя Жэнь - Домочадцы
        '110101': 38,  // Куй - Разлад
        '001010': 39,  // Цзянь - Препятствие
        '010100': 40,  // Се - Разрешение
        '110001': 41,  // Сунь - Убыток
        '100011': 42,  // И - Прибыток
        '111110': 43,  // Гуай - Выход
        '011111': 44,  // Гоу - Перечение
        '000110': 45,  // Цуй - Собирание
        '011000': 46,  // Шэн - Подъем
        '010110': 47,  // Кунь - Истощение
        '011010': 48,  // Цзин - Колодец
        '101110': 49,  // Гэ - Перемены
        '011101': 50,  // Дин - Жертвенник
        '100100': 51,  // Чжэнь - Гром
        '001001': 52,  // Гэнь - Остановка
        '001011': 53,  // Цзянь - Постепенность
        '110100': 54,  // Гуй Мэй - Невеста
        '101100': 55,  // Фэн - Изобилие
        '001101': 56,  // Люй - Странствие
        '011011': 57,  // Сунь - Утончение
        '110110': 58,  // Дуй - Радость
        '010011': 59,  // Хуань - Разрешение
        '110010': 60,  // Цзе - Ограничение
        '110011': 61,  // Чжун Фу - Искренность
        '001100': 62,  // Сяо Го - Малое превышение
        '101010': 63,  // Цзи Цзи - После завершения
        '010101': 64   // Вэй Цзи - До завершения
    };
    
    return binaryToDecimal[binaryCode] || 1; // По умолчанию 1-я гексаграмма
}

// Делаем функции глобальными
window.showScreen = showScreen;
window.handleAction = handleAction;
window.resetDivination = function() {
    currentLines = [];
    document.getElementById('final-hexagram').innerHTML = '';
    showScreen('main-menu');
};
