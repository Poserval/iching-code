// Базовые переменные приложения
let currentLines = [];
let manualLines = [];
let isManualMode = false;
let hexagramsData = {};

// Карта соответствия бинарных кодов номерам гексаграмм
const hexagramMap = {
    "111111": 1,   // Цянь
    "000000": 2,   // Кунь  
    "010001": 3,   // Чжунь
    "100010": 4,   // Мэн
    "010111": 5,   // Сюй
    "111010": 6,   // Сун
    "000010": 7,   // Ши
    "010000": 8,   // Би
    "110111": 9,   // Сяо Чу
    "111011": 10,  // Ли
    "000111": 11,  // Тай
    "111000": 12,  // Пи
    "111101": 13,  // Тун Жэнь
    "101111": 14,  // Да Ю
    "000100": 15,  // Цянь
    "001000": 16,  // Юй
    "011001": 17,  // Суй
    "100110": 18,  // Гу
    "000011": 19,  // Линь
    "110000": 20,  // Гуань
    "101001": 21,  // Ши Хэ
    "100101": 22,  // Би
    "100000": 23,  // Бо
    "000001": 24,  // Фу
    "111001": 25,  // У Ван
    "100111": 26,  // Да Чу
    "100001": 27,  // И
    "011110": 28,  // Да Го
    "010010": 29,  // Си Кань
    "101101": 30,  // Ли
    "011100": 31,  // Сянь
    "001110": 32,  // Хэн
    "111100": 33,  // Дунь
    "001111": 34,  // Да Чжуан
    "010000": 35,  // Цзинь
    "000101": 36,  // Мин И
    "110101": 37,  // Цзя Жэнь
    "101011": 38,  // Куй
    "010100": 39,  // Цзянь
    "001010": 40,  // Се
    "100011": 41,  // Сунь
    "110001": 42,  // И
    "011111": 43,  // Гуай
    "111110": 44,  // Гоу
    "011000": 45,  // Цуй
    "000110": 46,  // Шэн
    "011010": 47,  // Кунь
    "010110": 48,  // Цзин
    "011101": 49,  // Гэ
    "101110": 50,  // Дин
    "001001": 51,  // Чжэнь
    "100100": 52,  // Гэнь
    "110100": 53,  // Цзянь
    "001011": 54,  // Гуй Мэй
    "001101": 55,  // Фэн
    "101100": 56,  // Люй
    "110110": 57,  // Сунь
    "011011": 58,  // Дуй
    "110010": 59,  // Хуань
    "010011": 60,  // Цзе
    "110011": 61,  // Чжун Фу
    "001100": 62,  // Сяо Го
    "010101": 63,  // Цзи Цзи
    "101010": 64   // Вэй Цзи
};

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
        
        // Если переходим на экран толкования - показываем текст
        if (screenId === 'interpretation-screen') {
            showMeaningText();
        }
    }
}

// Функции для выбора режима
function selectAutoMode() {
    console.log('Выбран автоматический режим');
    isManualMode = false;
    showScreen('divination-screen');
}

function selectManualMode() {
    console.log('Выбран ручной режим');
    isManualMode = true;
    manualLines = [];
    showScreen('manual-input-screen');
    updateManualInterface();
}

// Функции для ручного ввода - ОБНОВЛЕННЫЕ
function addManualLine(lineType) {
    if (manualLines.length < 6) {
        manualLines.push(lineType);
        updateManualInterface();
    }
}

function clearManualLines() {
    // Удаляем только ПОСЛЕДНЮЮ линию (снизу вверх)
    if (manualLines.length > 0) {
        manualLines.pop(); // Удаляем последний элемент
        updateManualInterface();
    }
}

function updateManualInterface() {
    const container = document.querySelector('.manual-lines-container');
    const resultBtn = document.getElementById('show-result-btn');
    const clearBtn = document.querySelector('.manual-buttons button[onclick="clearManualLines()"]');
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Добавляем текущие линии
    manualLines.forEach((line, index) => {
        const lineElement = document.createElement('div');
        lineElement.className = `manual-line ${line === 'yang' ? 'manual-yang' : 'manual-yin'}`;
        lineElement.innerHTML = `
            <span class="line-number">${index + 1}</span>
            <span class="line-symbol">${line === 'yang' ? '⚊' : '⚋'}</span>
            <span class="line-name">${line === 'yang' ? 'Ян' : 'Инь'}</span>
        `;
        container.appendChild(lineElement);
    });
    
    // Активируем кнопку когда есть 6 линий
    resultBtn.disabled = manualLines.length !== 6;
    
    // Обновляем текст кнопки очистки
    if (clearBtn) {
        if (manualLines.length === 0) {
            clearBtn.textContent = 'Очистить';
            clearBtn.disabled = true;
        } else {
            clearBtn.textContent = `Удалить линию ${manualLines.length}`;
            clearBtn.disabled = false;
        }
    }
    
    // Показываем сообщение о прогрессе
    if (manualLines.length === 0) {
        container.innerHTML = '<p class="manual-placeholder">Линии появятся здесь</p>';
    }
}

function showManualResult() {
    if (manualLines.length === 6) {
        console.log('Ручной режим - линии:', manualLines);
        // Сохраняем линии в глобальную переменную
        currentLines = [...manualLines];
        showScreen('result-screen');
        // НЕМЕДЛЕННО показываем гексаграмму
        setTimeout(() => {
            showHexagram(currentLines);
        }, 100);
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
    
    if (lineValue === 'yang') {
        lineElement.innerHTML = `
            <div class="line-visual">
                <div class="full-line"></div>
            </div>
            <span class="line-label">Ян</span>
        `;
    } else {
        lineElement.innerHTML = `
            <div class="line-visual">
                <div class="broken-line">
                    <div class="line-part"></div>
                    <div class="line-part"></div>
                </div>
            </div>
            <span class="line-label">Инь</span>
        `;
    }
    
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

// Функция показа результата
function showResult() {
    console.log('Переход на экран 6, линии:', currentLines);
    showScreen('result-screen');
    showHexagram(currentLines);
}

// Функция отображения гексаграммы
function showHexagram(lines) {
    const hexagramContainer = document.getElementById('final-hexagram');
    console.log('Контейнер найден:', hexagramContainer, 'Линии для отображения:', lines);
    
    if (!lines || lines.length === 0) {
        console.error('Нет линий для отображения!');
        hexagramContainer.innerHTML = '<p>Ошибка: нет данных гексаграммы</p>';
        return;
    }
    
    hexagramContainer.innerHTML = `
        <div class="hexagram-overlay-container">
            <img src="assets/hexagrams/hexagram-1.png" alt="База гексаграммы" class="hexagram-base-image">
            <div class="hexagram-lines-overlay" id="lines-overlay">
                <!-- Линии будут добавлены сюда -->
            </div>
        </div>
        <button onclick="showInterpretationScreen()" style="margin-top: 20px;">
            Толкование
        </button>
    `;
    
    const overlay = document.getElementById('lines-overlay');
    createHexagramOverlay(lines, overlay);
}

// Функция создания линий поверх картинки
function createHexagramOverlay(lines, overlayContainer) {
    overlayContainer.innerHTML = '';
    
    console.log('Создаем overlay гексаграмму из линий:', lines);
    console.log('Количество линий:', lines.length);
    
    if (!lines || lines.length !== 6) {
        console.error('Некорректное количество линий:', lines);
        overlayContainer.innerHTML = '<p>Ошибка: должно быть 6 линий</p>';
        return;
    }
    
    for (let i = 0; i < lines.length; i++) {
        console.log(`Линия ${i}:`, lines[i]);
        const lineElement = document.createElement('div');
        lineElement.className = `overlay-line ${lines[i] === 'yang' ? 'overlay-yang' : 'overlay-yin'}`;
        overlayContainer.appendChild(lineElement);
    }
    
    console.log('Overlay создан успешно');
}

// Функция перехода на экран толкования
function showInterpretationScreen() {
    console.log('Переход на экран 7, текущие линии:', currentLines);
    showScreen('interpretation-screen');
}

// Функция загрузки данных из JSON
async function loadHexagramsData() {
    try {
        const response = await fetch('data.json');
        hexagramsData = await response.json();
        console.log('Данные гексаграмм загружены');
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        hexagramsData = {
            hexagrams: {
                "1": {
                    "name": "Цянь / Творчество",
                    "description": "Это могучий знак великого начала. Шесть сплошных черт Ян символизируют творческую энергию Неба, весенние надежды и период огромных возможностей. Вы подобны дракону, парящему в небесах, или достигли вершины горы.\n\nНо будьте осмотрительны! На вершине легко потерять бдительность. Пока вы наверху, сохраняйте ясность ума и благородство помыслов. Успех придет через упорство и мудрое руководство.\n\nВремя благоприятствует вашим начинаниям. Если желание разумно, оно непременно исполнится. В личной жизни может быть некоторая неопределенность — внесите в неё ясность. Кто-то может противостоять вам, но решительность и непреклонность принесут успех.\n\nНе позднее чем через шесть месяцев ждите значительных перемен. Помните: даже дракон не проявляет безрассудства. Испытание вы выдержите, если сохраните связь со своими истинными целями."
                }
            }
        };
    }
}

// Функция отображения текста толкования
function showMeaningText() {
    const hexagramNumber = calculateHexagramNumber(currentLines);
    const hexagramData = hexagramsData.hexagrams[hexagramNumber];
    
    console.log('Показываем толкование для гексаграммы:', hexagramNumber);
    
    if (hexagramData) {
        document.getElementById('hexagram-name').textContent = hexagramData.name;
        
        const formattedText = hexagramData.description
            .split('\n\n')
            .map(paragraph => {
                const cleanParagraph = paragraph.replace(/\n/g, ' ').trim();
                return `<p>${cleanParagraph}</p>`;
            })
            .join('');
            
        document.getElementById('hexagram-description').innerHTML = formattedText;
        document.getElementById('hexagram-description').classList.add('interpretation-content');
    } else {
        document.getElementById('hexagram-name').textContent = 'Гексаграмма ' + hexagramNumber;
        document.getElementById('hexagram-description').innerHTML = '<p>Толкование пока не готово...</p>';
        document.getElementById('hexagram-description').classList.add('interpretation-content');
    }
}

// Функция расчета номера гексаграммы
function calculateHexagramNumber(lines) {
    const binaryCode = lines.map(line => line === 'yang' ? '1' : '0').join('');
    console.log('Бинарный код гексаграммы:', binaryCode);
    
    const hexagramNumber = hexagramMap[binaryCode];
    console.log('Найдена гексаграмма №:', hexagramNumber);
    
    return hexagramNumber || 1;
}

// Загружаем данные при старте
loadHexagramsData();

// Делаем функции глобальными
window.showScreen = showScreen;
window.handleAction = handleAction;
window.showInterpretationScreen = showInterpretationScreen;
window.selectAutoMode = selectAutoMode;
window.selectManualMode = selectManualMode;
window.addManualLine = addManualLine;
window.clearManualLines = clearManualLines;
window.showManualResult = showManualResult;
window.resetDivination = function() {
    currentLines = [];
    document.getElementById('final-hexagram').innerHTML = '';
    showScreen('main-menu');
};
