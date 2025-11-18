// Базовые переменные приложения
let currentLines = [];

// Делаем функции глобальными
window.showScreen = function(screenId) {
    console.log('Переключаем на экран:', screenId);
    
    // Скрываем все экраны
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('Успешно переключено на:', screenId);
    }
}

window.handleAction = function() {
    console.log('Кнопка действия нажата');
    if (currentLines.length < 6) {
        throwCoins();
    } else {
        showResult();
    }
}

// Остальные функции...
window.initializeRandomCoins = function() {
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

window.resetDivinationState = function() {
    currentLines = [];
    const hexagramContainer = document.getElementById('hexagram-lines');
    hexagramContainer.innerHTML = '<p>Бросьте монеты 6 раз чтобы построить гексаграмму</p>';
    
    const actionButton = document.getElementById('action-button');
    actionButton.disabled = false;
    actionButton.textContent = 'Бросить монеты (6 из 6)';
}

// Остальной код...
function throwCoins() {
    const throwResult = calculateThrowResult();
    currentLines.push(throwResult);
    animateCoinThrow();
    updateInterface();
    
    setTimeout(() => {
        drawHexagramLine(throwResult);
    }, 800);
}

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
        coin.alt = 'Монета';
    });
    
    return eagles >= 2 ? 'yang' : 'yin';
}

function animateCoinThrow() {
    const coins = document.querySelectorAll('.coin');
    const actionButton = document.getElementById('action-button');
    
    actionButton.disabled = true;
    
    coins.forEach((coin) => {
        coin.classList.add('animating');
        setTimeout(() => {
            coin.classList.remove('animating');
        }, 600);
    });
    
    setTimeout(() => {
        actionButton.disabled = false;
    }, 800);
}

function drawHexagramLine(lineValue) {
    const hexagramContainer = document.getElementById('hexagram-lines');
    
    if (currentLines.length === 1) {
        hexagramContainer.innerHTML = '';
    }
    
    const lineElement = document.createElement('div');
    lineElement.className = `hexagram-line ${getLineType(lineValue)}`;
    
    const lineInfo = getLineInfo(lineValue);
    lineElement.textContent = `${lineInfo.symbol} ${lineInfo.name}`;
    
    hexagramContainer.appendChild(lineElement);
    hexagramContainer.scrollTop = hexagramContainer.scrollHeight;
}

function getLineType(lineValue) {
    return lineValue === 'yang' ? 'yang-static' : 'yin-static';
}

function getLineInfo(lineValue) {
    if (lineValue === 'yang') {
        return { symbol: '⚊', name: 'Ян' };
    } else {
        return { symbol: '⚋', name: 'Инь' };
    }
}

function updateInterface() {
    const actionButton = document.getElementById('action-button');
    const remainingThrows = 6 - currentLines.length;
    
    if (remainingThrows > 0) {
        actionButton.textContent = `Бросить монеты (${remainingThrows} из 6)`;
    } else {
        actionButton.textContent = 'Показать результат';
    }
}

window.showResult = function() {
    const hexagramNumber = 1;
    showScreen('result-screen');
    showHexagram(hexagramNumber);
    
    setTimeout(() => {
        showInterpretationScreen(hexagramNumber);
    }, 3000);
}

function showHexagram(hexagramNumber) {
    const hexagramContainer = document.getElementById('final-hexagram');
    hexagramContainer.innerHTML = `
        <div class="hexagram-image-container">
            <img src="assets/hexagrams/hexagram-${hexagramNumber}.png" 
                 alt="Гексаграмма ${hexagramNumber}" class="hexagram-image">
        </div>
    `;
}

function showInterpretationScreen(hexagramNumber) {
    showScreen('interpretation-screen');
    showMeaning(hexagramNumber);
}

function showMeaning(hexagramNumber) {
    const interpretationContainer = document.getElementById('interpretation-content');
    interpretationContainer.innerHTML = `
        <div class="meaning-image-container">
            <img src="assets/meanings/meaning-${hexagramNumber}.png" 
                 alt="Толкование ${hexagramNumber}" class="meaning-image">
        </div>
    `;
}

window.resetDivination = function() {
    currentLines = [];
    document.getElementById('final-hexagram').innerHTML = '';
    document.getElementById('interpretation-content').innerHTML = '';
    showScreen('main-menu');
}
