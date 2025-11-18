/* Стили для отображения гексаграммы поверх картинки */
.hexagram-overlay-container {
    position: relative;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
}

.hexagram-base-image {
    width: 100%;
    max-height: 400px;
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hexagram-lines-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    align-items: center;
    padding: 50px 30px; /* Этот параметр можно менять для точной подгонки */
}

.overlay-line {
    width: 80%; /* Общая ширина линии */
    height: 12px;
    margin: 8px 0;
}

.overlay-yang {
    background: #000000;
    border-radius: 6px;
}

.overlay-yin {
    background: transparent;
    position: relative;
    display: flex;
    justify-content: space-between;
}

.overlay-yin::before,
.overlay-yin::after {
    content: '';
    width: 45%; /* Две короткие линии */
    height: 12px;
    background: #000000;
    border-radius: 6px;
}
