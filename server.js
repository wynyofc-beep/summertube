const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();

// Middleware para processar JSON
app.use(express.json());
app.use(express.static(__dirname));

// Rota principal para o "Healthcheck" do Railway
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de download com a nova API (Plano B)
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL ausente');

    try {
        const response = await axios.get(`https://api.v02.savetube.me/info?url=${encodeURIComponent(videoUrl)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const link = response.data.data?.video_formats?.[0]?.url || response.data.data?.url;

        if (link) {
            res.redirect(link);
        } else {
            res.status(500).send('Link não encontrado nesta API.');
        }
    } catch (error) {
        res.status(500).send('Erro ao conectar com o servidor de download.');
    }
});

// CONFIGURAÇÃO CRÍTICA PARA RAILWAY
const PORT = process.env.PORT || 8080;
// Escutar em 0.0.0.0 é obrigatório para o Railway enxergar o app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SummerTube online na porta ${PORT}`);
});

