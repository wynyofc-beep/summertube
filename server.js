const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

// Rota raiz para o Railway saber que o app está vivo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL ausente');

    try {
        const response = await axios.post('https://cobalt.tools/api/json', {
            url: videoUrl,
            videoQuality: '720'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Referer': 'https://cobalt.tools/'
            }
        });

        const link = response.data.url || response.data.link;
        if (link) {
            res.redirect(link);
        } else {
            res.status(500).send('API não retornou link.');
        }
    } catch (error) {
        res.status(500).send('Erro na conexão com a API.');
    }
});

// O Railway exige que a porta seja process.env.PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SummerTube ativo na porta ${PORT}`);
});
