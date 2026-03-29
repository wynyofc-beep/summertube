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
    console.log("Recebi pedido para:", videoUrl); // Log para você ver no Railway

    if (!videoUrl) return res.status(400).send('URL necessária');

    try {
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: videoUrl,
            videoQuality: '720',
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0' // Algumas APIs exigem isso
            }
            timeout: 30000 // Adicione esta linha aqui
        });

        if (response.data && response.data.url) {
            console.log("Link gerado com sucesso!");
            res.redirect(response.data.url);
        } else {
            console.log("Cobalt não retornou URL:", response.data);
            res.status(500).send('O serviço de download não retornou um link válido.');
        }
    } catch (error) {
        console.error('Erro detalhado:', error.response ? error.response.data : error.message);
        res.status(500).send('Erro ao falar com o servidor de download. Tente novamente mais tarde.');
    }
});


// Porta dinâmica para o Railway
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(`SummerTube voando na porta ${port}!`);
});

