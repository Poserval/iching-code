// Базовые переменные приложения
let currentLines = [];
let manualLines = [];
let isManualMode = false;
let hexagramsData = {};

// Карта соответствия бинарных кодов номерам гексаграмм
const hexagramMap = {
    "111111": 1,   "000000": 2,   "010001": 3,   "100010": 4,
    "010111": 5,   "111010": 6,   "000010": 7,   "010000": 8,
    "110111": 9,   "111011": 10,  "000111": 11,  "111000": 12,
    "111101": 13,  "101111": 14,  "000100": 15,  "001000": 16,
    "011001": 17,  "100110": 18,  "000011": 19,  "110000": 20,
    "101001": 21,  "100101": 22,  "100000": 23,  "000001": 24,
    "111001": 25,  "100111": 26,  "100001": 27,  "011110": 28,
    "010010": 29,  "101101": 30,  "011100": 31,  "001110": 32,
    "111100": 33,  "001111": 34,  "010000": 35,  "000101": 36,
    "110101": 37,  "101011": 38,  "010100": 39,  "001010": 40,
    "100011": 41,  "110001": 42,  "011111": 43,  "111110": 44,
    "011000": 45,  "000110": 46,  "011010": 47,  "010110": 48,
    "011101": 49,  "101110": 50,  "001001": 51,  "100100": 52,
    "110100": 53,  "001011": 54,  "001101": 55,  "101100": 56,
    "110110": 57,  "011011": 58,  "110010": 59,  "010011": 60,
    "110011": 61,  "001100": 62,  "010101": 63,  "101010": 64
};

// Функция переключения экранов
function showScreen(screenId) {
    console.log('Переключаем на:', screenId);
    
    // Скрываем все экраны
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Инициализация экранов
        if (screenId === 'divination-screen') {
            initializeRandomCoins();
            resetDivinationState();
        } else if (screenId === 'interpretation-screen') {
            showMeaningText();
        } else if (screenId === 'manual-input-screen') {
            manualLines = [];
            updateManualInterface();
        }
    }
}

// Функции для выбора режима
function selectAutoMode() {
    isManualMode = false;
    showScreen('divination-screen');
}

function selectManualMode() {
    isManualMode = true;
    showScreen('manual-input-screen');
}

// Функции для ручного ввода
function addManualLine(lineType) {
    if (manualLines.length < 6) {
        manualLines.push(lineType);
        updateManualInterface();
    }
}

function clearManualLines() {
    if (manualLines.length > 0) {
        manualLines.pop();
        updateManualInterface();
    }
}

function updateManualInterface() {
    const container = document.querySelector('.manual-lines-container');
    const resultBtn = document.getElementById('show-result-btn');
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Добавляем текущие линии
    manualLines.forEach((line, index) => {
        const lineElement = document.createElement('div');
        lineElement.className = `manual-line ${line === 'yang' ? 'manual-yang' : 'manual-yin'}`;
        lineElement.innerHTML = `
            <span class="line-number">${index + 1}</span>
            <div class="line-visual">
                ${line === 'yang' ? 
                    '<div class="full-line"></div>' : 
                    '<div class="broken-line"><div class="line-part"></div><div class="line-part"></div></div>'
                }
            </div>
            <span class="line-name">${line === 'yang' ? 'Ян' : 'Инь'}</span>
        `;
        container.appendChild(lineElement);
    });
    
    // Активируем кнопку когда есть 6 линий
    resultBtn.disabled = manualLines.length !== 6;
    
    // Показываем сообщение о прогрессе
    if (manualLines.length === 0) {
        container.innerHTML = '<p class="manual-placeholder">Линии появятся здесь</p>';
    }
}

function showManualResult() {
    if (manualLines.length === 6) {
        currentLines = [...manualLines];
        showScreen('result-screen');
        setTimeout(() => showHexagram(currentLines), 100);
    }
}

// Функция инициализации монет
function initializeRandomCoins() {
    const coins = document.querySelectorAll('.coin');
    const coinTypes = ['ruble', 'dollar', 'yuan'];
    
    coins.forEach((coin, index) => {
        const isHeads = Math.random() > 0.5;
        const coinType = coinTypes[index];
        coin.src = `assets/coins/${coinType}-${isHeads ? 'heads' : 'tails'}.png`;
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
    
    const coins = document.querySelectorAll('.coin');
    const actionButton = document.getElementById('action-button');
    
    actionButton.disabled = true;
    coins.forEach(coin => {
        coin.classList.add('animating');
        setTimeout(() => coin.classList.remove('animating'), 600);
    });
    
    updateInterface();
    
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
        
        coin.src = `assets/coins/${coinType}-${isHeads ? 'heads' : 'tails'}.png`;
        if (isHeads) eagles++;
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
    
    lineElement.innerHTML = lineValue === 'yang' ? 
        `<div class="line-visual"><div class="full-line"></div></div><span class="line-label">Ян</span>` :
        `<div class="line-visual"><div class="broken-line"><div class="line-part"></div><div class="line-part"></div></div></div><span class="line-label">Инь</span>`;
    
    hexagramContainer.appendChild(lineElement);
    hexagramContainer.scrollTop = hexagramContainer.scrollHeight;
}

// Функция обновления интерфейса
function updateInterface() {
    const actionButton = document.getElementById('action-button');
    const remainingThrows = 6 - currentLines.length;
    
    actionButton.textContent = remainingThrows > 0 ? 
        `Бросить монеты (${remainingThrows} из 6)` : 
        'Показать результат';
}

// Функция показа результата
function showResult() {
    showScreen('result-screen');
    showHexagram(currentLines);
}

// Функция отображения гексаграммы
function showHexagram(lines) {
    const hexagramContainer = document.getElementById('final-hexagram');
    
    if (!lines || lines.length === 0) {
        hexagramContainer.innerHTML = '<p>Ошибка: нет данных гексаграммы</p>';
        return;
    }
    
    hexagramContainer.innerHTML = `
        <div class="hexagram-overlay-container">
            <img src="assets/hexagrams/hexagram-1.png" alt="База гексаграммы" class="hexagram-base-image">
            <div class="hexagram-lines-overlay" id="lines-overlay"></div>
        </div>
        <button onclick="showInterpretationScreen()" style="margin-top: 20px;">Толкование</button>
    `;
    
    createHexagramOverlay(lines, document.getElementById('lines-overlay'));
}

// Функция создания линий поверх картинки
function createHexagramOverlay(lines, overlayContainer) {
    overlayContainer.innerHTML = '';
    
    if (!lines || lines.length !== 6) {
        overlayContainer.innerHTML = '<p>Ошибка: должно быть 6 линий</p>';
        return;
    }
    
    lines.forEach(line => {
        const lineElement = document.createElement('div');
        lineElement.className = `overlay-line ${line === 'yang' ? 'overlay-yang' : 'overlay-yin'}`;
        overlayContainer.appendChild(lineElement);
    });
}

// Функция перехода на экран толкования
function showInterpretationScreen() {
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
        // Резервные данные
        hexagramsData = {
            hexagrams: {
                "1": {
                    "name": "Цянь / Творчество",
                    "description": "Это могучий знак великого начала. Шесть сплошных черт Ян символизируют творческую энергию Неба, весенние надежды и период огромных возможностей."
                }
            }
        };
    }
}

// Функция отображения текста толкования
function showMeaningText() {
    const hexagramNumber = calculateHexagramNumber(currentLines);
    const hexagramData = hexagramsData.hexagrams[hexagramNumber];
    
    if (hexagramData) {
        document.getElementById('hexagram-name').textContent = hexagramData.name;
        
        const formattedText = hexagramData.description
            .split('\n\n')
            .map(paragraph => `<p>${paragraph.replace(/\n/g, ' ').trim()}</p>`)
            .join('');
            
        document.getElementById('hexagram-description').innerHTML = formattedText;
        document.getElementById('hexagram-description').classList.add('interpretation-content');
    } else {
        document.getElementById('hexagram-name').textContent = 'Гексаграмма ' + hexagramNumber;
        document.getElementById('hexagram-description').innerHTML = '<p>Толкование пока не готово...</p>';
    }
}

// Функция расчета номера гексаграммы
function calculateHexagramNumber(lines) {
    const binaryCode = lines.map(line => line === 'yang' ? '1' : '0').join('');
    return hexagramMap[binaryCode] || 1;
}

// Загружаем данные при старте
loadHexagramsData();

// Глобальные функции
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
