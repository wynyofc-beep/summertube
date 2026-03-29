const axios = require('axios');
const express = require('express');
const path = require('path');
const app = express();

// Garante que o Node encontre os arquivos na pasta correta do Railway
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Rota de download via Cobalt API
            app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    console.log("--> Recebi pedido para:", videoUrl);

    if (!videoUrl) return res.status(400).send('URL não enviada');

    try {
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: videoUrl,
            videoQuality: '720'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // O Cobalt costuma retornar 'url' ou 'link'. Testamos os dois:
        const downloadLink = response.data.url || response.data.link;

        if (downloadLink) {
            console.log("--> Sucesso! Redirecionando...");
            res.redirect(downloadLink);
        } else {
            console.log("--> API respondeu, mas sem link:", response.data);
            res.status(500).send('Vídeo não encontrado ou privado.');
        }

    } catch (error) {
        console.error('--> Erro na API Cobalt:', error.message);
        res.status(500).send('Erro ao processar o vídeo. Tente outro link.');
    }
});



// Porta dinâmica para o Railway
const PORT = process.env.PORT || 8080;

// O '0.0.0.0' é o segredo para o Railway enxergar seu app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SummerTube voando na porta ${PORT}!`);
});

