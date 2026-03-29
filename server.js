const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL ausente');

    console.log("--> Tentando nova rota de escape para:", videoUrl);

    try {
        // Tentando uma URL de processamento alternativa
        const response = await axios.get(`https://api.v02.savetube.me/info?url=${encodeURIComponent(videoUrl)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            }
        });

        // Essa API retorna formatos diferentes, vamos pegar o melhor vídeo
        const link = response.data.data?.video_formats?.[0]?.url || response.data.data?.url;

        if (link) {
            console.log("--> SUCESSO COM NOVA API!");
            res.redirect(link);
        } else {
            console.log("--> Sem link na resposta:", response.data);
            res.status(500).send('Não encontramos um link de download para este vídeo.');
        }

    } catch (error) {
        console.error('--> Erro na nova API:', error.message);
        res.status(500).send('O servidor de download está ocupado. Tente novamente em instantes.');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SummerTube voando com novo motor na porta ${PORT}`);
});

