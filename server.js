const express = require('express');
const axios = require('axios');
const app = express();

// Rota de download turbinada pelo Cobalt
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send('Por favor, envie uma URL válida.');
    }

    try {
        // 1. Pedimos o link de download para a API do Cobalt
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: videoUrl,
            videoQuality: '720', // Você pode mudar para '1080' ou '360'
            downloadMode: 'video'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // 2. O Cobalt nos devolve um link direto para o arquivo
        const downloadUrl = response.data.url;

        if (downloadUrl) {
            // 3. Redirecionamos o usuário direto para o download seguro
            res.redirect(downloadUrl);
        } else {
            res.status(500).send('Erro: O Cobalt não conseguiu gerar o link.');
        }

    } catch (error) {
        console.error('Erro na API Cobalt:', error.message);
        res.status(500).send('Erro ao processar o vídeo. Tente outro link.');
    }
});

app.listen(3000, () => {
    console.log('SummerTube voando na porta 3000!');
});
