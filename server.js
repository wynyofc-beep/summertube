const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Garante que o Node encontre os arquivos na pasta correta do Railway
app.use(express.static(path.join(__dirname)));

// Rota principal para carregar a interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de download via Cobalt API
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('Por favor, envie uma URL válida.');

    try {
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: videoUrl,
            videoQuality: '720',
            downloadMode: 'video'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const downloadUrl = response.data.url;
        if (downloadUrl) {
            res.redirect(downloadUrl);
        } else {
            res.status(500).send('Erro: O Cobalt não conseguiu gerar o link.');
        }
    } catch (error) {
        console.error('Erro na API Cobalt:', error.message);
        res.status(500).send('Erro ao processar o vídeo. Tente outro link.');
    }
});

// Porta dinâmica para o Railway
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(`SummerTube voando na porta ${port}!`);
});

