### Crypto Tracker - Telegram Mini App

<div align="center">
💰 Отслеживание криптовалют в реальном времени прямо в Telegram 💰

https://img.shields.io/badge/Telegram-Mini%2520App-blue?logo=telegram
https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs
https://img.shields.io/badge/Express-4.x-lightgrey?logo=express

</div>
📋 Оглавление
🌟 Возможности

🚀 Быстрый старт

🛠 Установка и запуск

📁 Структура проекта

🔧 API Endpoints

🤖 Настройка Telegram бота

💡 Монетизация

🛠 Технологии

🌟 Возможности
📊 Real-time данные - Актуальные цены криптовалют с CoinGecko API

💼 Портфель - Отслеживание личных инвестиций

📱 Telegram Mini App - Работа прямо в мессенджере

🎨 Адаптивный дизайн - Красивый интерфейс под все устройства

⚡ Быстрый запуск - Не требует установки дополнительных приложений

🚀 Быстрый старт
Предварительные требования
Node.js 16+

npm или yarn

Аккаунт Telegram

Установка за 5 минут
bash

# Клонируйте репозиторий

git clone <your-repo-url>
cd crypto-tracker

# Установите зависимости бэкенда

cd backend
npm install

# Запустите сервер

npm start
🛠 Установка и запуск
Бэкенд (Backend)
bash
cd backend

# Установка зависимостей

npm install

# Запуск в development режиме

npm run dev

# Запуск в production режиме

npm start
Сервер будет доступен по адресу: http://localhost:3000

Фронтенд (Frontend)
Фронтенд готов к использованию! Просто откройте frontend/index.html в браузере или разместите на хостинге.

📁 Структура проекта
text
crypto-tracker/
├── 📂 backend/ # Node.js сервер
│ ├── 🗂️ routes/ # API маршруты
│ │ └── crypto.js # Крипто-эндпоинты
│ ├── ⚙️ package.json # Зависимости
│ └── 🚀 server.js # Главный сервер
├── 📂 frontend/ # Telegram Mini App
│ ├── 🎨 index.html # Главная страница
│ ├── 🎨 style.css # Стили
│ ├── ⚡ app.js # Логика приложения
│ └── 📄 manifest.json # Конфиг для Telegram
└── 📖 README.md # Документация
🔧 API Endpoints
Основные endpoints:
Метод Endpoint Описание
GET /health Проверка работы сервера
GET /test Тестовый endpoint
GET /api/crypto/prices Получение цен криптовалют
Пример запроса:
bash
curl http://localhost:3000/api/crypto/prices
Ответ:
json
[
{
"id": "bitcoin",
"name": "Bitcoin",
"symbol": "BTC",
"price": 45000,
"change": 2.5,
"image": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
}
]
🤖 Настройка Telegram бота

1. Создание бота через @BotFather
   text
   /newbot → crypto_tracker_bot → Получите API токен
2. Настройка Mini App
   text
   /setdomain → Выберите бота → Укажите URL вашего хостинга
3. Конфигурация manifest.json
   Убедитесь, что frontend/manifest.json содержит:

json
{
"url": "https://your-domain.com",
"name": "Crypto Tracker",
"iconUrl": "https://your-domain.com/icon.png",
"description": "Track cryptocurrency prices in real-time"
}
💰 Монетизация
Возможные способы заработка:
💎 Премиум функции

Расширенная аналитика

Оповещения о ценах

Неограниченное количество отслеживаемых монет

🤝 Партнерские программы

Ссылки на криптобиржи (Binance, Bybit)

Партнерские программы обменников

📱 Реклама

Баннерная реклама

Нативная интеграция

🛒 In-app покупки

Кастомные темы

Дополнительные функции

🛠 Технологии
Backend:
Node.js - Серверная платформа

Express.js - Веб-фреймворк

Axios - HTTP клиент

CORS - Междоменные запросы

Frontend:
HTML5 - Разметка

CSS3 - Стили и анимации

Vanilla JavaScript - Логика приложения

Telegram WebApp API - Интеграция с Telegram

API:
CoinGecko API - Данные о криптовалютах

Telegram Bot API - Управление ботом

🚀 Деплой
Варианты хостинга:
Провайдер Бесплатный тариф Простота настройки
Heroku ✅ ⭐⭐⭐⭐⭐
Railway ✅ ⭐⭐⭐⭐⭐
DigitalOcean ❌ ⭐⭐⭐⭐
VPS ❌ ⭐⭐⭐
Пример деплоя на Heroku:
bash

# Создаем приложение

heroku create your-crypto-tracker

# Деплоим

git push heroku main

# Настраиваем переменные окружения

heroku config:set NODE_ENV=production
🤝 Разработка
Как внести вклад:
Форкните репозиторий

Создайте feature ветку: git checkout -b feature/amazing-feature

Закоммитьте изменения: git commit -m 'Add amazing feature'

Запушьте ветку: git push origin feature/amazing-feature

Откройте Pull Request

📄 Лицензия
Этот проект распространяется под MIT License - смотрите файл LICENSE для деталей.

📞 Поддержка
Если у вас есть вопросы или предложения:

📧 Email: your-email@example.com

💬 Telegram: @your_username

🐛 Issues: Создать issue

<div align="center">
⭐ Не забудьте поставить звезду репозиторию если проект вам понравился!
Happy coding! 🚀

</div>
🎯 Быстрая команда для запуска
bash
# Полная установка и запуск
cd backend && npm install && npm start
