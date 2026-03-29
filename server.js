const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.static('.'));

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL necessária');

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
            res.status(500).send('Erro no Cobalt');
        }
    } catch (error) {
        res.status(500).send('Erro ao processar');
    }
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(`SummerTube voando na porta ${port}!`);
});

