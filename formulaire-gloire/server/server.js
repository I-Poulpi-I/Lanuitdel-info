// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'submissions.json');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Route Highscores (TOP 5)
app.get('/api/highscores', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.json([]);
        
        try {
            const submissions = JSON.parse(data);
            // Trier par score décroissant
            submissions.sort((a, b) => b.finalScore - a.finalScore);
            // Garder le top 5
            const top5 = submissions.slice(0, 5).map(s => ({
                name: s.name,
                score: s.finalScore
            }));
            res.json(top5);
        } catch (e) {
            res.json([]);
        }
    });
});

// Route Envoi Formulaire
app.post('/api/submit-form', (req, res) => {
    const newData = req.body;
    newData.timestamp = new Date().toISOString();
    
    // Détection Phrase Secrète
    const secretPhrase = "Félicitations, vous avez gagné !";
    const isJackpot = newData.message && newData.message.trim() === secretPhrase;
    
    // Bonus Jackpot
    if (isJackpot) {
        newData.score += 1000000;
    }
    newData.finalScore = newData.score; // Stocker le score final

    // Sauvegarde
    fs.readFile(DATA_FILE, 'utf8', (err, fileData) => {
        let submissions = [];
        if (!err && fileData) {
            try { submissions = JSON.parse(fileData); } catch (e) {}
        }
        submissions.push(newData);
        
        fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), (err) => {
            setTimeout(() => {
                if (isJackpot) {
                    res.json({
                        success: true,
                        jackpot: true,
                        message: "🔓 CODE OMEGA DÉTECTÉ ! ACCÈS AUTORISÉ.",
                        finalScore: newData.finalScore
                    });
                } else {
                    res.json({
                        success: true,
                        jackpot: false,
                        message: "Transmission enregistrée.",
                        finalScore: newData.finalScore
                    });
                }
            }, 1500);
        });
    });
});

app.listen(PORT, () => {
    console.log(`🛸 Serveur actif sur http://localhost:${PORT}`);
});