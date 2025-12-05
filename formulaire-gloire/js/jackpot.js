window.startJackpot = function(data) {
    // Éléments
    const lever = document.getElementById('slot-lever');
    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    const resBox = document.getElementById('jackpot-result');
    const symbols = ['🍒', '🍋', '💎', '7️⃣', '🔔'];
    
    // 1. Animation Levier
    lever.classList.add('pulled');

    // 2. Roulement Tambour (Rotation des slots)
    let spins = 0;
    const interval = setInterval(() => {
        reels.forEach(r => {
            r.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            r.style.filter = "blur(2px)"; // Effet de vitesse
        });
        spins++;
        
        // Arrêt après 20 tours (~2s)
        if(spins > 20) {
            clearInterval(interval);
            triggerWin();
        }
    }, 100);

    function triggerWin() {
        // 3. Forcer la victoire (TRUQUÉ !)
        reels.forEach(r => {
            r.innerText = '🚀'; // La Fusée !
            r.style.filter = "none";
            r.style.color = "gold";
            r.style.textShadow = "0 0 20px gold";
        });

        // 4. Affichage Résultat + Explosion
        setTimeout(() => {
            // Cacher la machine
            document.querySelector('.jackpot-container').style.display = 'none';
            
            // Afficher le message
            resBox.classList.remove('hidden');
            document.getElementById('server-msg').innerText = data.message;
            document.getElementById('final-score-val').innerText = data.finalScore;
            
            // LANCER LES CONFETTIS (CSS Hack)
            launchConfetti();
            
        }, 800);
    }

    function launchConfetti() {
        // On crée plein de divs colorées
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff'];
        
        for(let i=0; i<150; i++) {
            const c = document.createElement('div');
            c.style.position = 'fixed';
            c.style.left = Math.random() * 100 + 'vw';
            c.style.top = '-10px';
            c.style.width = '10px'; 
            c.style.height = '10px';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.zIndex = '9999';
            // Chute aléatoire
            c.style.animation = `fall ${Math.random()*2 + 2}s linear infinite`;
            
            document.body.appendChild(c);
        }
        
        // Ajout du style d'animation dynamique
        const style = document.createElement('style');
        style.innerHTML = `@keyframes fall { to { transform: translateY(100vh) rotate(720deg); } }`;
        document.head.appendChild(style);
    }
};