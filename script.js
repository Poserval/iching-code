// Базовые переменные приложения
let currentLines = [];
let manualLines = [];
let isManualMode = false;
let hexagramsData = {};
let sacredProtectionActive = false;
let interpretationShown = false;

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

// 🔒 САКРАЛЬНАЯ ЗАЩИТА - инициализация
function initializeSacredProtection() {
    // Блокировка контекстного меню
    document.addEventListener('contextmenu', (e) => {
        if (sacredProtectionActive) {
            e.preventDefault();
            showSacredWarning();
            return false;
        }
    });
    
    // Блокировка клавиш Print Screen и скриншотов
    document.addEventListener('keydown', (e) => {
        if (sacredProtectionActive && (e.key === 'PrintScreen' || e.keyCode === 44 || 
            (e.ctrlKey && e.key === 'p') || (e.metaKey && e.key === 'p'))) {
            e.preventDefault();
            showSacredWarning();
            return false;
        }
    });
    
    // Блокировка DevTools
    document.addEventListener('keydown', (e) => {
        if (sacredProtectionActive && (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.metaKey && e.altKey && e.key === 'I'))) {
            e.preventDefault();
            showSacredWarning();
            return false;
        }
    });
    
    // Запрет выделения текста на экране толкования
    const style = document.createElement('style');
    style.textContent = `
        .sacred-protection * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        .sacred-protection {
            pointer-events: all !important;
        }
        .sacred-protection img {
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Блокировка жестов масштабирования
    document.addEventListener('gesturestart', (e) => {
        if (sacredProtectionActive) e.preventDefault();
    });
    document.addEventListener('gesturechange', (e) => {
        if (sacredProtectionActive) e.preventDefault();
    });
    document.addEventListener('gestureend', (e) => {
        if (sacredProtectionActive) e.preventDefault();
    });
}

// 🔒 Предупреждение о сакральности
function showSacredWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 26, 46, 0.95);
        color: white;
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #8B4513;
        text-align: center;
        z-index: 9999;
        font-family: 'Caveat', cursive;
        font-size: 18px;
        max-width: 300px;
    `;
    warning.innerHTML = `
        <div style="margin-bottom: 10px;">🗝️</div>
        <div>Мудрость Ицзин открывается лишь однажды</div>
        <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">Доверься интуиции, а не памяти устройства</div>
    `;
    document.body.appendChild(warning);
    
    setTimeout(() => {
        if (document.body.contains(warning)) {
            document.body.removeChild(warning);
        }
    }, 3000);
}

// 🔒 Активация защиты при показе толкования
function activateSacredProtection() {
    sacredProtectionActive = true;
    const interpretationScreen = document.getElementById('interpretation-screen');
    interpretationScreen.classList.add('sacred-protection');
    
    // Добавляем затемнение для затруднения скриншотов
    const overlay = document.createElement('div');
    overlay.id = 'sacred-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, 
            rgba(26, 26, 46, 0.1) 0%, 
            rgba(139, 69, 19, 0.05) 50%, 
            rgba(26, 26, 46, 0.1) 100%);
        pointer-events: none;
        z-index: 998;
        animation: sacredPulse 3s infinite;
    `;
    
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes sacredPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.1; }
        }
    `;
    document.head.appendChild(pulseStyle);
    
    interpretationScreen.appendChild(overlay);
}

// 🔒 Деактивация защиты
function deactivateSacredProtection() {
    sacredProtectionActive = false;
    const interpretationScreen = document.getElementById('interpretation-screen');
    interpretationScreen.classList.remove('sacred-protection');
    
    const overlay = document.getElementById('sacred-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// 🔒 Очистка толкования при выходе
function clearInterpretation() {
    if (interpretationShown) {
        // Мгновенно очищаем содержимое с анимацией
        const description = document.getElementById('hexagram-description');
        const name = document.getElementById('hexagram-name');
        
        if (description && name) {
            description.style.opacity = '0';
            name.style.opacity = '0';
            
            setTimeout(() => {
                description.textContent = '';
                name.textContent = '';
                description.style.opacity = '1';
                name.style.opacity = '1';
                interpretationShown = false;
            }, 300);
        }
    }
}

// 🔒 Модифицированная функция переключения экранов
function showScreen(screenId) {
    console.log('Переключаем на:', screenId);
    
    // 🔒 ЕСЛИ ВЫХОДИМ С ЭКРАНА ТОЛКОВАНИЯ - ОЧИЩАЕМ И ДЕАКТИВИРУЕМ ЗАЩИТУ
    if (screenId !== 'interpretation-screen' && sacredProtectionActive) {
        clearInterpretation();
        deactivateSacredProtection();
    }
    
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
            // 🔒 АКТИВИРУЕМ ЗАЩИТУ ПРИ ПОКАЗЕ ТОЛКОВАНИЯ
            setTimeout(() => {
                activateSacredProtection();
                showSacredWarning();
            }, 500);
        } else if (screenId === 'manual-input-screen') {
            manualLines = [];
            updateManualInterface();
        }
    }
}

// 🔒 Модифицированная функция показа толкования
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
        
        // 🔒 ПОМЕЧАЕМ ЧТО ТОЛКОВАНИЕ БЫЛО ПОКАЗАНО
        interpretationShown = true;
        
        // 🔒 ТАЙМЕР АВТООЧИСТКИ (5 минут)
        setTimeout(() => {
            if (sacredProtectionActive) {
                showSacredWarning();
                setTimeout(() => {
                    showScreen('main-menu');
                }, 2000);
            }
        }, 300000); // 5 минут
        
    } else {
        document.getElementById('hexagram-name').textContent = 'Гексаграмма ' + hexagramNumber;
        document.getElementById('hexagram-description').innerHTML = '<p>Толкование пока не готово...</p>';
    }
}

// ОСТАЛЬНЫЕ ФУНКЦИИ БЕЗ ИЗМЕНЕНИЙ (они работают как надо)

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
    
    container.innerHTML = '';
    
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
    
    resultBtn.disabled = manualLines.length !== 6;
    
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

function resetDivinationState() {
    currentLines = [];
    const hexagramContainer = document.getElementById('hexagram-lines');
    hexagramContainer.innerHTML = '<p>Бросьте монеты 6 раз чтобы построить гексаграмму</p>';
    
    const actionButton = document.getElementById('action-button');
    actionButton.disabled = false;
    actionButton.textContent = 'Бросить монеты (6 из 6)';
}

function handleAction() {
    if (currentLines.length < 6) {
        throwCoins();
    } else {
        showResult();
    }
}

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

function updateInterface() {
    const actionButton = document.getElementById('action-button');
    const remainingThrows = 6 - currentLines.length;
    
    actionButton.textContent = remainingThrows > 0 ? 
        `Бросить монеты (${remainingThrows} из 6)` : 
        'Показать результат';
}

function showResult() {
    showScreen('result-screen');
    showHexagram(currentLines);
}

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

function showInterpretationScreen() {
    showScreen('interpretation-screen');
}

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
                    "description": "Это могучий знак великого начала. Шесть сплошных черт Ян символизируют творческую энергию Неба, весенние надежды и период огромных возможностей."
                }
            }
        };
    }
}

function calculateHexagramNumber(lines) {
    const binaryCode = lines.map(line => line === 'yang' ? '1' : '0').join('');
    return hexagramMap[binaryCode] || 1;
}

// 🔒 ИНИЦИАЛИЗАЦИЯ ЗАЩИТЫ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', function() {
    initializeSacredProtection();
    loadHexagramsData();
});

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
