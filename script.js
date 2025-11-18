/* Стили для изображений гексаграмм и толкований */
.hexagram-image-container, 
.meaning-image-container {
    text-align: center;
    margin: 20px 0;
}

.hexagram-image,
.meaning-image {
    max-width: 90%;
    max-height: 300px;
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 215, 0, 0.3);
}

.meaning-image-container {
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.meaning-image-container:hover {
    opacity: 0.9;
}
