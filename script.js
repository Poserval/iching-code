// Базовые переменные приложения
let currentLines = [];
let hexagramsData = {};

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
    lineElement.textContent = `${currentLines.length} - ${lineValue === 'yang' ? '⚊ Ян' : '⚋ Инь'}`;
    
    // ДОБАВЛЯЕМ ЛИНИЮ В КОНЕЦ (снизу)
    hexagramContainer.appendChild(lineElement);
    
    // Прокручиваем к низу чтобы видеть новые линии
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
    console.log('Переход на 5 экран, линии:', currentLines);
    // Показываем экран гексаграммы
    showScreen('result-screen');
    
    // Отображаем гексаграмму (передаем текущие линии)
    showHexagram(currentLines);
}

// Функция отображения гексаграммы - КНОПКА ТОЛКОВАНИЕ
function showHexagram(lines) {
    const hexagramContainer = document.getElementById('final-hexagram');
    console.log('Контейнер найден:', hexagramContainer);
    
    // Создаем overlay-структуру с базовой картинкой
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
    
    // Добавляем линии поверх картинки
    const overlay = document.getElementById('lines-overlay');
    createHexagramOverlay(lines, overlay);
}

// Функция создания линий поверх картинки
function createHexagramOverlay(lines, overlayContainer) {
    // Очищаем контейнер
    overlayContainer.innerHTML = '';
    
    console.log('Создаем overlay гексаграмму из линий:', lines);
    
    // lines[0] - верхняя линия (первая брошенная)
    // lines[5] - нижняя линия (последняя брошенная)
    // Отображаем в правильном порядке - БЕЗ РЕВЕРСА
    for (let i = 0; i < lines.length; i++) {
        const lineElement = document.createElement('div');
        lineElement.className = `overlay-line ${lines[i] === 'yang' ? 'overlay-yang' : 'overlay-yin'}`;
        overlayContainer.appendChild(lineElement);
    }
}

// Функция перехода на экран толкования
function showInterpretationScreen() {
    console.log('Переход на 6 экран');
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
        // Создаем тестовые данные если файл не найден
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
        // Обновляем интерфейс данными из JSON
        document.getElementById('hexagram-name').textContent = hexagramData.name;
        
        // Форматируем текст с абзацами
        const formattedText = hexagramData.description
            .split('\n\n')
            .map(paragraph => `<p>${paragraph}</p>`)
            .join('');
            
        document.getElementById('hexagram-description').innerHTML = formattedText;
    } else {
        // Запасной вариант если данных нет
        document.getElementById('hexagram-name').textContent = 'Гексаграмма ' + hexagramNumber;
        document.getElementById('hexagram-description').innerHTML = '<p>Толкование пока не готово...</p>';
    }
}

// Функция расчета номера гексаграммы
function calculateHexagramNumber(lines) {
    // Преобразуем линии в бинарный код (ян = 1, инь = 0)
    const binaryCode = lines.map(line => line === 'yang' ? '1' : '0').join('');
    // Конвертируем бинарный код в десятичное число (1-64)
    const decimalNumber = parseInt(binaryCode, 2);
    return decimalNumber + 1;
}

// Загружаем данные при старте
loadHexagramsData();

// Делаем функции глобальными
window.showScreen = showScreen;
window.handleAction = handleAction;
window.showInterpretationScreen = showInterpretationScreen;
window.resetDivination = function() {
    currentLines = [];
    document.getElementById('final-hexagram').innerHTML = '';
    showScreen('main-menu');
};
