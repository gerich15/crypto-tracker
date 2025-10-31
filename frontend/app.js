// Конфигурация
const CONFIG = {
  BACKEND_URL: "http://localhost:3000", // Замените на ваш URL в продакшене
  REFRESH_INTERVAL: 30000, // 30 секунд
};

// Глобальные переменные
let tg;
let portfolio = [];
let marketData = [];

// Инициализация приложения
function initTelegramApp() {
  tg = window.Telegram.WebApp;
  tg.expand();
  tg.enableClosingConfirmation();

  // Устанавливаем цветовую схему Telegram
  document.documentElement.style.setProperty(
    "--tg-theme-bg-color",
    tg.themeParams.bg_color || "#ffffff"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-text-color",
    tg.themeParams.text_color || "#000000"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-hint-color",
    tg.themeParams.hint_color || "#999999"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-button-color",
    tg.themeParams.button_color || "#2481cc"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-button-text-color",
    tg.themeParams.button_text_color || "#ffffff"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-secondary-bg-color",
    tg.themeParams.secondary_bg_color || "#f0f0f0"
  );

  loadPortfolio();
  loadMarketData();

  // Автообновление данных
  setInterval(loadMarketData, CONFIG.REFRESH_INTERVAL);
}

// Загрузка портфеля из localStorage
function loadPortfolio() {
  const savedPortfolio = localStorage.getItem("cryptoPortfolio");
  if (savedPortfolio) {
    portfolio = JSON.parse(savedPortfolio);
    updatePortfolioDisplay();
  }
}

// Сохранение портфеля в localStorage
function savePortfolio() {
  localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
  updatePortfolioDisplay();
}

// Загрузка рыночных данных
async function loadMarketData() {
  try {
    const response = await fetch(`${CONFIG.BACKEND_URL}/api/crypto/prices`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    marketData = await response.json();
    updateMarketDisplay();
    updatePortfolioDisplay();
  } catch (error) {
    console.error("Error loading market data:", error);
    showError("Failed to load market data. Please try again.");
  }
}

// Обновление отображения портфеля
function updatePortfolioDisplay() {
  const portfolioList = document.getElementById("portfolioList");

  if (portfolio.length === 0) {
    portfolioList.innerHTML = `
            <div class="loading">
                <p>No coins in portfolio yet.</p>
                <p>Click "Add Coin" to get started!</p>
            </div>
        `;
    updateTotalBalance(0, 0);
    return;
  }

  let totalBalance = 0;
  let totalChange = 0;

  const portfolioHTML = portfolio
    .map((coin) => {
      const marketCoin = marketData.find((m) => m.id === coin.id);

      if (!marketCoin) {
        return `
                <div class="portfolio-item">
                    <div class="coin-info">
                        <div class="coin-details">
                            <div class="coin-name">${
                              coin.name
                            } (${coin.symbol?.toUpperCase()})</div>
                            <div class="coin-amount">${
                              coin.amount
                            } ${coin.symbol?.toUpperCase()}</div>
                        </div>
                    </div>
                    <div class="coin-price">
                        <div class="current-price">Data unavailable</div>
                        <button class="delete-btn" onclick="removeFromPortfolio('${
                          coin.id
                        }')">🗑️</button>
                    </div>
                </div>
            `;
      }

      const currentValue = coin.amount * marketCoin.current_price;
      const priceChange = marketCoin.price_change_percentage_24h || 0;
      const changeClass = priceChange >= 0 ? "positive" : "negative";

      totalBalance += currentValue;

      portfolio.push({
        ...coin,
        currentPrice: marketCoin.current_price,
        priceChange: priceChange,
      });

      return `
            <div class="portfolio-item">
                <div class="coin-info">
                    <img src="${marketCoin.image}" alt="${
        coin.name
      }" class="coin-icon" onerror="this.style.display='none'">
                    <div class="coin-details">
                        <div class="coin-name">${
                          coin.name
                        } (${coin.symbol?.toUpperCase()})</div>
                        <div class="coin-amount">${
                          coin.amount
                        } ${coin.symbol?.toUpperCase()}</div>
                    </div>
                </div>
                <div class="coin-price">
                    <div class="current-price">$${marketCoin.current_price.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 6 }
                    )}</div>
                    <div class="price-change ${changeClass}">${
        priceChange >= 0 ? "+" : ""
      }${priceChange.toFixed(2)}%</div>
                    <div class="coin-value">$${currentValue.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</div>
                    <button class="delete-btn" onclick="removeFromPortfolio('${
                      coin.id
                    }')">🗑️</button>
                </div>
            </div>
        `;
    })
    .join("");

  portfolioList.innerHTML = portfolioHTML;
  updateTotalBalance(totalBalance, totalChange);
}

// Обновление общего баланса
function updateTotalBalance(balance, change) {
  const totalBalanceElement = document.getElementById("totalBalance");
  const totalChangeElement = document.getElementById("totalChange");

  totalBalanceElement.textContent = `$${balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Рассчитываем общее изменение на основе разницы с ценой покупки
  let totalProfitLoss = 0;
  let totalInvestment = 0;

  portfolio.forEach((coin) => {
    const marketCoin = marketData.find((m) => m.id === coin.id);
    if (marketCoin && coin.buyPrice) {
      const currentValue = coin.amount * marketCoin.current_price;
      const investment = coin.amount * coin.buyPrice;
      totalProfitLoss += currentValue - investment;
      totalInvestment += investment;
    }
  });

  if (totalInvestment > 0) {
    const totalChangePercent = (totalProfitLoss / totalInvestment) * 100;
    totalChangeElement.textContent = `${
      totalProfitLoss >= 0 ? "+" : ""
    }${totalChangePercent.toFixed(2)}%`;
    totalChangeElement.className = `balance-change ${
      totalProfitLoss >= 0 ? "positive" : "negative"
    }`;
  } else {
    totalChangeElement.textContent = "+0.00%";
    totalChangeElement.className = "balance-change positive";
  }
}

// Обновление отображения рыночных данных
function updateMarketDisplay() {
  const marketList = document.getElementById("marketList");

  if (!marketData || marketData.length === 0) {
    marketList.innerHTML = '<div class="loading">Loading market data...</div>';
    return;
  }

  const marketHTML = marketData
    .map((coin) => {
      const changeClass =
        coin.price_change_percentage_24h >= 0 ? "positive" : "negative";

      return `
            <div class="market-item" onclick="prefillAddCoin('${coin.id}')">
                <div class="coin-info">
                    <img src="${coin.image}" alt="${
        coin.name
      }" class="coin-icon" onerror="this.style.display='none'">
                    <div class="coin-details">
                        <div class="coin-name">${
                          coin.name
                        } (${coin.symbol.toUpperCase()})</div>
                    </div>
                </div>
                <div class="coin-price">
                    <div class="current-price">$${coin.current_price.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 6 }
                    )}</div>
                    <div class="price-change ${changeClass}">${
        coin.price_change_percentage_24h >= 0 ? "+" : ""
      }${coin.price_change_percentage_24h.toFixed(2)}%</div>
                </div>
            </div>
        `;
    })
    .join("");

  marketList.innerHTML = marketHTML;
}

// Модальное окно добавления монеты
function showAddCoinModal() {
  document.getElementById("addCoinModal").style.display = "block";
}

function closeAddCoinModal() {
  document.getElementById("addCoinModal").style.display = "none";
  // Сброс формы
  document.getElementById("coinAmount").value = "";
  document.getElementById("buyPrice").value = "";
}

function prefillAddCoin(coinId) {
  const coin = marketData.find((c) => c.id === coinId);
  if (coin) {
    document.getElementById("coinSelect").value = coinId;
    document.getElementById(
      "buyPrice"
    ).placeholder = `Current: $${coin.current_price}`;
    showAddCoinModal();
  }
}

// Добавление монеты в портфель
function addCoinToPortfolio() {
  const coinSelect = document.getElementById("coinSelect");
  const amountInput = document.getElementById("coinAmount");
  const buyPriceInput = document.getElementById("buyPrice");

  const coinId = coinSelect.value;
  const amount = parseFloat(amountInput.value);
  const buyPrice = buyPriceInput.value ? parseFloat(buyPriceInput.value) : null;

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  const coin = marketData.find((c) => c.id === coinId);
  if (!coin) {
    alert("Coin not found");
    return;
  }

  // Проверяем, есть ли уже такая монета в портфеле
  const existingCoinIndex = portfolio.findIndex((c) => c.id === coinId);

  if (existingCoinIndex !== -1) {
    // Обновляем существующую запись
    portfolio[existingCoinIndex].amount += amount;
    if (buyPrice) {
      // Пересчитываем среднюю цену покупки
      const totalValue =
        portfolio[existingCoinIndex].amount *
        portfolio[existingCoinIndex].buyPrice;
      const newValue = amount * buyPrice;
      portfolio[existingCoinIndex].buyPrice =
        (totalValue + newValue) /
        (portfolio[existingCoinIndex].amount + amount);
    }
  } else {
    // Добавляем новую монету
    portfolio.push({
      id: coinId,
      symbol: coin.symbol,
      name: coin.name,
      amount: amount,
      buyPrice: buyPrice || coin.current_price,
    });
  }

  savePortfolio();
  closeAddCoinModal();

  // Показываем подтверждение
  if (tg && tg.showPopup) {
    tg.showPopup({
      title: "Success!",
      message: `${amount} ${coin.symbol.toUpperCase()} added to portfolio`,
      buttons: [{ type: "ok" }],
    });
  }
}

// Удаление монеты из портфеля
function removeFromPortfolio(coinId) {
  if (
    confirm("Are you sure you want to remove this coin from your portfolio?")
  ) {
    portfolio = portfolio.filter((coin) => coin.id !== coinId);
    savePortfolio();
  }
}

// Обновление данных
function refreshData() {
  loadMarketData();

  // Показываем индикатор обновления
  const refreshBtn = document.querySelector(".btn-secondary");
  refreshBtn.textContent = "🔄 Updating...";
  refreshBtn.disabled = true;

  setTimeout(() => {
    refreshBtn.textContent = "🔄 Refresh";
    refreshBtn.disabled = false;
  }, 2000);
}

// Показать ошибку
function showError(message) {
  const marketList = document.getElementById("marketList");
  marketList.innerHTML = `<div class="error">${message}</div>`;
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", initTelegramApp);

// Закрытие модального окна при клике вне его
window.onclick = function (event) {
  const modal = document.getElementById("addCoinModal");
  if (event.target === modal) {
    closeAddCoinModal();
  }
};
