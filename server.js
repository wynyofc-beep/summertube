const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const path = require('path');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL) return res.status(400).send('Insira uma URL.');

        // Obtém os dados do vídeo com um "disfarce" de navegador
        const info = await ytdl.getInfo(videoURL, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Cookie': '' // Opcional: deixar vazio ajuda a evitar rastreio de bot
                }
            }
        });

        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        // Inicia o download com configurações de segurança
        ytdl(videoURL, {
    quality: 'highestaudio', // Tente baixar apenas o áudio primeiro para testar
    filter: 'audioonly'
}).pipe(res);


    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no download. Tente outro vídeo ou aguarde uns minutos.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
