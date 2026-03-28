const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

// Permite que seu HTML acesse o servidor sem bloqueios de segurança
app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;

        if (!videoURL) {
            return res.status(400).send('Por favor, insira uma URL válida.');
        }

        // Obtém informações do vídeo (título, duração, etc)
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Limpa o título de caracteres especiais

        // Configura o navegador para entender que é um download de arquivo
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        // Faz o "streaming" do vídeo direto para o usuário
        ytdl(videoURL, {
            format: 'mp4',
            quality: 'highestvideo',
            filter: 'audioandvideo'
        }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao processar o vídeo. O YouTube pode ter bloqueado a requisição.');
    }
});

// O Render.com define a porta automaticamente, ou usa a 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
          
