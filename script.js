// Базовые переменные приложения
let currentLines = []; // Здесь будем хранить результаты бросков
let movingLines = [];  // Здесь будем хранить движущиеся линии

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
            coin.setAttribute('data-value', 'yang'); // сохраняем значение
        } else {
            coin.src = 'assets/coins/coin-tails.png';
            coin.setAttribute('data-value', 'yin'); // сохраняем значение
        }
        
        // Добавляем небольшую случайную задержку для анимации (будет позже)
        const randomDelay = Math.random() * 0.5;
        coin.style.animationDelay = `${randomDelay}s`;
    });
}

// Функция сброса состояния гадания при новом входе
function resetDivinationState() {
    currentLines = [];
    movingLines = [];
    
    // Очищаем область гексаграммы
    const hexagramContainer = document.getElementById('hexagram-lines');
    hexagramContainer.innerHTML = '';
    
    // Скрываем кнопку результата
    document.getElementById('result-button').classList.add('hidden');
    
    // Включаем кнопку броска
    document.getElementById('throw-button').disabled = false;
}

// Функция броска монет (заглушка - будет дорабатываться)
function throwCoins() {
    alert('Функция броска монет будет реализована в следующем шаге!');
    
    // После броска тоже делаем случайное положение
    setTimeout(initializeRandomCoins, 100);
}

// Функция показа результата (заглушка - будет дорабатываться)
function showResult() {
    alert('Функция показа результата будет реализована позже!');
}

// Функция сброса гадания (заглушка - будет дорабатываться)
function resetDivination() {
    showScreen('divination-screen');
}
