const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const path = require('path'); // Adicionado
const app = express();

app.use(cors());

// --- NOVIDADE: Esta parte faz o site aparecer ao abrir o link ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// -----------------------------------------------------------

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL) return res.status(400).send('Insira uma URL.');

        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        ytdl(videoURL, {
    format: 'mp4',
    quality: 'highestvideo',
    filter: 'audioandvideo',
    requestOptions: {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }
    }
}).pipe(res);

    } catch (err) {
        res.status(500).send('Erro no download. O YouTube pode ter bloqueado o servidor.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
