zxxconst express = require('express');
const axios = require('axios');
const app = express();

// 1. ISSO ATIVA A INTERFACE (O INDEX.HTML)
app.use(express.static('.'));

// Rota de download turbinada pelo Cobalt
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send('Por favor, envie uma URL válida.');
    }

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

// 2. PORTA DINÂMICA PARA O RAILWAY NÃO DERRUBAR O SITE
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`SummerTube voando na porta ${port}!`);
});

