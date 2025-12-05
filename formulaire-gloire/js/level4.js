window.initLevel4 = function() {
    console.log('💬 Niveau 4 : Terminal Holographique Activé');
    
    const input = document.getElementById('message-input');
    const bar = document.getElementById('signal-bar');
    const powerText = document.getElementById('power-text');
    const light = document.getElementById('status-light');
    const container = document.getElementById('level-message');
    const buzzEgg = document.getElementById('buzz-egg');
    
    // Remplacement du bouton pour clean les events
    let btn = document.getElementById('submit-form');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    btn = newBtn;

    const SECRET_PHRASE = "Félicitations, vous avez gagné !";
    const BUZZ_PHRASE = "Vers l'infini et au-delà";
    const MARIAH_PHRASE = "It's time"; // Déclencheur Mariah
    
    setTimeout(() => input.focus(), 500);

    // --- GESTION DE LA FRAPPE ---
    input.addEventListener('input', () => {
        const text = input.value;
        let perc = 0;

        // 1. BUZZ LIGHTYEAR EGG
        if (text.includes(BUZZ_PHRASE)) {
            if(buzzEgg) {
                buzzEgg.classList.remove('hidden');
                buzzEgg.classList.add('show'); // Classe CSS pour monter
            }
        } else {
            if(buzzEgg) buzzEgg.classList.remove('show');
        }

        // 2. MARIAH CAREY EGG
        // On joue le son une seule fois quand la phrase est complétée
        if (text.toLowerCase().includes(MARIAH_PHRASE.toLowerCase())) {
            // Petite astuce pour ne pas spammer le son : on vérifie si on vient de le déclencher
            if (!window.mariahTriggered) {
                window.playSound('mariah');
                window.mariahTriggered = true; // Flag global pour éviter répétition
                
                // Effet Noël visuel temporaire (Optionnel : change la couleur en rouge/blanc)
                document.body.style.filter = "hue-rotate(120deg)"; 
                setTimeout(() => document.body.style.filter = "none", 3000);
            }
        } else {
            window.mariahTriggered = false; // Reset si on efface
        }

        // Calcul Jauge
        if (text.trim() === SECRET_PHRASE) {
            perc = 100;
        } else {
            perc = Math.min(100, text.length * 3);
        }

        updateInterface(perc);
    });

    function updateInterface(perc) {
        bar.style.width = perc + '%';
        if(powerText) powerText.innerText = Math.floor(perc) + '%';
        
        const isReady = perc >= 100 || input.value.trim() === SECRET_PHRASE || input.value.length > 10;

        if(isReady) {
            if (perc >= 100) {
                bar.style.backgroundColor = '#00ff66';
                bar.style.boxShadow = '0 0 15px #00ff66';
            } else {
                bar.style.backgroundColor = '#00f3ff';
                bar.style.boxShadow = '0 0 10px #00f3ff';
            }
            if(light) {
                light.style.backgroundColor = '#00ff66';
                light.style.boxShadow = '0 0 15px #00ff66';
            }

            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
            
            // Texte Bouton
            if (input.value.trim() === SECRET_PHRASE) {
                btn.innerHTML = '<i class="fas fa-rocket"></i> ENVOYER (CODE OMEGA)';
            } else if (input.value.includes(BUZZ_PHRASE)) {
                btn.innerHTML = '🚀 VERS L\'INFINI !';
            } else {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> ENVOYER';
            }
        } else {
            bar.style.backgroundColor = '#ff0055';
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.innerHTML = '<i class="fas fa-lock"></i> SIGNAL FAIBLE';
        }
    }

    // --- CLIC ENVOYER ---
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const userMessage = input.value.trim();
        window.gameState.message = userMessage;

        input.disabled = true;
        btn.disabled = true;

        if (userMessage === SECRET_PHRASE) {
            // JACKPOT
            btn.innerHTML = "⚠️ SURCHARGE MOTEUR...";
            btn.style.backgroundColor = "#ff0055";
            btn.style.color = "#fff";
            window.playSound('warp');
            
            container.classList.add('shake-screen');
            await wait(1500);
            
            document.body.classList.add('warping');
            await wait(2000);

            document.body.classList.remove('warping');
            container.classList.remove('shake-screen');
            submitData(); 

        } else {
            // NORMAL
            btn.innerHTML = "TRANSMISSION...";
            btn.style.color = "#00f3ff";
            await wait(1000);
            submitData();
        }
    });
};

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function submitData() {
    try {
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(window.gameState || {})
        });
        const result = await response.json();
        
        if (result.jackpot) {
            window.switchLevel('level-message', 'jackpot-screen');
            if(window.startJackpot) window.startJackpot(result);
        } else {
            alert("Message envoyé avec succès !");
            location.reload();
        }
    } catch (e) {
        console.error(e);
        // Mode secours
        if (window.gameState.message === "Félicitations, vous avez gagné !") {
             window.switchLevel('level-message', 'jackpot-screen');
             if(window.startJackpot) window.startJackpot({message: "MODE HORS LIGNE: GAGNÉ!", finalScore: 999999});
        } else {
            alert("Message envoyé (Mode Secours)");
            location.reload();
        }
    }
}