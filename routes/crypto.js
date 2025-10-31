const express = require("express");
const axios = require("axios");
const router = express.Router();

// Кэш для данных
let cryptoCache = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 60000; // 1 минута

// Получение данных о криптовалютах
router.get("/prices", async (req, res) => {
  try {
    const coins =
      req.query.coins || "bitcoin,ethereum,binancecoin,cardano,solana";

    // Проверяем кэш
    const now = Date.now();
    if (cryptoCache.data && now - cryptoCache.timestamp < CACHE_DURATION) {
      return res.json(cryptoCache.data);
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
    );

    const cryptoData = response.data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      image: coin.image,
      last_updated: coin.last_updated,
    }));

    // Обновляем кэш
    cryptoCache = {
      data: cryptoData,
      timestamp: now,
    };

    res.json(cryptoData);
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    res.status(500).json({
      error: "Failed to fetch crypto data",
      details: error.message,
    });
  }
});

// Получение конкретной монеты
router.get("/price/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false`
    );

    if (response.data.length === 0) {
      return res.status(404).json({ error: "Coin not found" });
    }

    const coin = response.data[0];
    const coinData = {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      image: coin.image,
      last_updated: coin.last_updated,
    };

    res.json(coinData);
  } catch (error) {
    console.error("Error fetching coin data:", error);
    res.status(500).json({
      error: "Failed to fetch coin data",
      details: error.message,
    });
  }
});

module.exports = router;
