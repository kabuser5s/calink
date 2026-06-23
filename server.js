const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = 3000;

const views = path.join(__dirname, 'views');

const ALLOWED_COUNTRIES = ['FR', 'CI'];

function getClientIp(req) {
    // Cloudflare expose l'IP réelle ici, même si l'IP proxy est masquée
    if (req.headers['cf-connecting-ip']) return req.headers['cf-connecting-ip'];
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) return forwarded.split(',')[0].trim();
    return req.socket.remoteAddress;
}

function checkCountry(ip) {
    return new Promise((resolve) => {
        // Fallback permissif pour les IPs locales/privées
        if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return resolve(true);
        }
        const url = `https://ip-api.com/json/${ip}?fields=countryCode`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(ALLOWED_COUNTRIES.includes(json.countryCode));
                } catch {
                    resolve(false);
                }
            });
        }).on('error', () => resolve(false));
    });
}

async function geoBlock(req, res, next) {
    const ip = getClientIp(req);
    const allowed = await checkCountry(ip);
    if (!allowed) return res.status(403).send('Accès non autorisé depuis votre région.');
    next();
}

app.use(geoBlock);

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));
app.use('/others', express.static(path.join(__dirname, 'others')));
app.use('/font', express.static(path.join(__dirname, 'font')));
app.use('/settings.js', express.static(path.join(__dirname, 'settings.js')));

app.get('/', (req, res) => res.sendFile(path.join(views, 'index.html')));
app.get('/compte', (req, res) => res.sendFile(path.join(views, 'compte.html')));
app.get('/historique', (req, res) => res.sendFile(path.join(views, 'historique.html')));
app.get('/virement', (req, res) => res.sendFile(path.join(views, 'virement.html')));
app.get('/ajouter', (req, res) => res.sendFile(path.join(views, 'ajouter.html')));
app.get('/pages', (req, res) => res.sendFile(path.join(views, 'pages.html')));

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
