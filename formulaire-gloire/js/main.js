// --- GESTIONNAIRE DE SON ---
const audioSystem = {
    music: document.getElementById('bg-music'),
    click: document.getElementById('sfx-click'),
    warp: document.getElementById('sfx-warp')
};

// Fonction pour jouer un bruitage
window.playSound = (name) => {
    if (audioSystem[name]) {
        audioSystem[name].currentTime = 0; // Rembobine pour rejouer vite
        audioSystem[name].play().catch(e => console.log("Son bloqué", e));
    }
};

// Fonction pour lancer la musique de fond
window.startMusic = () => {
    if (audioSystem.music) {
        audioSystem.music.volume = 0.6; // Volume doux (60%)
        audioSystem.music.play().catch(e => console.log("Attente interaction utilisateur"));
    }
};



window.gameState = {
    name: '',
    email: '',
    subject: '',
    message: '',
    score: 0
};

document.addEventListener('DOMContentLoaded', () => {
    // Bouton Start
    document.getElementById('start-game').addEventListener('click', () => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');

        window.startMusic();      // Lance la musique de fond
        window.playSound('click'); // Bruit du bouton start

        // Lancer niveau 1
        if(window.initLevel1) window.initLevel1();
    });

    document.body.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            window.playSound('click');
        }
    });

    // Navigation
    setupNavigation();
});

window.updateScore = (points) => {
    window.gameState.score += points;
    document.getElementById('global-score').innerText = window.gameState.score;
};

window.switchLevel = (currentId, nextId) => {
    document.getElementById(currentId).classList.add('hidden');
    document.getElementById(currentId).classList.remove('active');
    
    const next = document.getElementById(nextId);
    next.classList.remove('hidden');
    next.classList.add('active');
    
    // Update progress bar
    const progressMap = { 'level-nom': 25, 'level-email': 50, 'level-sujet': 75, 'level-message': 90 };
    document.getElementById('progress-fill').style.width = (progressMap[nextId] || 100) + '%';
};

function setupNavigation() {
    // Nav gérée dans les fichiers de niveau
    document.getElementById('next-level-2').addEventListener('click', () => {
        window.switchLevel('level-nom', 'level-email');
        if(window.initLevel2) window.initLevel2();
    });
    
    document.getElementById('next-level-3').addEventListener('click', () => {
        window.gameState.email = document.getElementById('email-final').value;
        window.switchLevel('level-email', 'level-sujet');
        if(window.initLevel3) window.initLevel3();
    });

    document.getElementById('next-level-4').addEventListener('click', () => {
        window.gameState.subject = document.getElementById('sujet-final').innerText;
        window.switchLevel('level-sujet', 'level-message');
        if(window.initLevel4) window.initLevel4();
    });
    
    // Submit Final
    document.getElementById('submit-form').addEventListener('click', submitData);
}

async function submitData() {
    window.gameState.message = document.getElementById('message-input').value;
    
    // Anim Warp
    document.body.classList.add('warping');
    
    // Appel API
    try {
        const res = await fetch('/api/submit-form', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(window.gameState)
        });
        const data = await res.json();
        
        setTimeout(() => {
            document.body.classList.remove('warping');
            window.switchLevel('level-message', 'jackpot-screen');
            if(window.startJackpot) window.startJackpot(data);
        }, 2000); // Temps de l'anim warp
        
    } catch(e) {
        alert("ERREUR CRITIQUE TRANSMISSION");
        document.body.classList.remove('warping');
    }
}