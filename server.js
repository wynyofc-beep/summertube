const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();

// Serve os arquivos estáticos da pasta atual
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de download via Cobalt API
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    console.log("--> Recebi pedido para:", videoUrl);

    if (!videoUrl) {
        return res.status(400).send('URL não enviada');
    }

    try {
                const response = await axios.post('https://cobalt.tools/api/json', {
            url: videoUrl,
            videoQuality: '720',
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://cobalt.tools/',
                'Origin': 'https://cobalt.tools'
            }
        });


        // Tenta pegar o link de diferentes formas que a API retorna
        const downloadLink = response.data.url || response.data.link || (response.data.picker ? response.data.picker[0].url : null);

        if (downloadLink) {
            console.log("--> Sucesso! Redirecionando para o download.");
            res.redirect(downloadLink);
        } else {
            console.log("--> API respondeu, mas o link não foi encontrado no JSON:", response.data);
            res.status(500).send('Vídeo não encontrado ou formato não suportado.');
        }

    } catch (error) {
        if (error.response) {
            console.error('--> Erro na API Cobalt (Status):', error.response.status);
            console.error('--> Detalhes:', error.response.data);
        } else {
            console.error('--> Erro de conexão:', error.message);
        }
        res.status(500).send('Erro ao processar o vídeo. A API pode estar instável.');
    }
});

// Porta dinâmica para o Railway
const PORT = process.env.PORT || 8080;

// Escutando em 0.0.0.0 para o Railway não desligar o container
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SummerTube voando na porta ${PORT}!`);
});

