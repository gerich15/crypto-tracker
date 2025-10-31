console.log('🔧 1. Script started executing');

const http = require('http');

console.log('🔧 2. HTTP module loaded');

const server = http.createServer((req, res) => {
    console.log('📨 Received request:', req.method, req.url);
    
    // Разрешаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/test' && req.method === 'GET') {
        console.log('✅ Handling /test request');
        res.statusCode = 200;
        res.end(JSON.stringify({
            success: true,
            message: 'Server is working! 🚀',
            timestamp: new Date().toISOString()
        }));
    } else if (req.url === '/api/crypto/prices') {
        console.log('✅ Handling /api/crypto/prices request');
        res.statusCode = 200;
        res.end(JSON.stringify([
            { id: 'bitcoin', name: 'Bitcoin', price: 45000, change: 2.5 },
            { id: 'ethereum', name: 'Ethereum', price: 2500, change: 1.8 }
        ]));
    } else {
        console.log('❌ Unknown route:', req.url);
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

console.log('🔧 3. Server created');

const PORT = 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 4. SERVER STARTED SUCCESSFULLY!');
    console.log('📍 http://localhost:' + PORT);
    console.log('🌐 http://0.0.0.0:' + PORT);
    console.log('✅ Test: http://localhost:3000/test');
    console.log('💰 Crypto: http://localhost:3000/api/crypto/prices');
});

console.log('🔧 5. Server listening setup complete');

// Обработка ошибок
server.on('error', (error) => {
    console.log('❌ Server error:', error);
});

console.log('🔧 6. Error handler attached');
