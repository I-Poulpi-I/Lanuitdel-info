window.initLevel1 = function() {
    const canvas = document.getElementById('game-canvas-nom');
    const ctx = canvas.getContext('2d');
    const overlay = document.getElementById('intro-overlay');
    const setupInput = document.getElementById('setup-name-input');
    const startBtn = document.getElementById('start-meteor-rain');
    const finalInput = document.getElementById('nom-input');
    const nextBtn = document.getElementById('next-level-2');
    const livesDisp = document.getElementById('lives-display');

    let targetName = "";
    let currentName = "";
    let lives = 5;
    let isPlaying = false;
    let meteors = [];
    
    // Le joueur
    const ship = { x: 400, y: 450 };

    startBtn.onclick = () => {
        const val = setupInput.value.toUpperCase().replace(/[^A-Z]/g, '');
        if(val.length < 3) return alert("Nom trop court !");
        
        targetName = val;
        currentName = "";
        finalInput.value = "";
        overlay.classList.add('hidden');
        isPlaying = true;
        
        document.addEventListener('keydown', handleInput);
        loop();
        setInterval(spawnMeteor, 1000);
    };

    function spawnMeteor() {
        if(!isPlaying) return;
        
        const nextChar = targetName[currentName.length];
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        // 30% Bonne lettre (Vert), 50% Ennemi (Rouge), 20% Bonus (Jaune)
        let type = 'ENEMY';
        let char = alphabet[Math.floor(Math.random() * alphabet.length)];
        let color = '#ff0055'; // Rouge

        const rand = Math.random();
        if(rand < 0.3 && nextChar) {
            type = 'TARGET';
            char = nextChar;
            color = '#00ff66'; // Vert
        } else if(rand > 0.8) {
            type = 'BONUS';
            color = '#ffee00'; // Jaune
        }

        meteors.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: -30,
            char: char,
            color: color,
            type: type,
            speed: Math.random() * 2 + 1
        });
    }

    function handleInput(e) {
        if(!isPlaying) return;
        const key = e.key.toUpperCase();
        
        // Chercher météore correspondant
        const idx = meteors.findIndex(m => m.char === key && m.y > 0);
        
        if(idx !== -1) {
            const m = meteors[idx];
            
            if(m.type === 'ENEMY') {
                // Détruire ennemi = Points + Sauve une vie potentielle
                window.updateScore(50);
                destroyMeteor(idx);
            } 
            else if(m.type === 'TARGET') {
                // Bonne lettre du nom
                if(key === targetName[currentName.length]) {
                    currentName += key;
                    finalInput.value = currentName;
                    window.updateScore(100);
                    destroyMeteor(idx);
                    
                    if(currentName === targetName) win();
                }
            }
            else if(m.type === 'BONUS') {
                window.updateScore(200);
                destroyMeteor(idx);
            }
        }
    }

    function destroyMeteor(idx) {
        // Effet particules ici si tu veux
        meteors.splice(idx, 1);
    }

    function update() {
        // Déplacement
        meteors.forEach((m, i) => {
            m.y += m.speed;
            
            // Impact sol
            if(m.y > canvas.height) {
                if(m.type === 'ENEMY') {
                    lives--;
                    livesDisp.innerText = "❤️".repeat(lives);
                    if(lives <= 0) gameOver();
                }
                meteors.splice(i, 1);
            }
        });
    }

    function draw() {
        // Clear avec traînée
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Vaisseau
        ctx.fillStyle = '#00f3ff';
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y);
        ctx.lineTo(ship.x - 20, ship.y + 40);
        ctx.lineTo(ship.x + 20, ship.y + 40);
        ctx.fill();

        // Météores
        ctx.font = "30px Courier New";
        ctx.textAlign = "center";
        meteors.forEach(m => {
            ctx.fillStyle = m.color;
            ctx.fillText(m.char, m.x, m.y);
            ctx.shadowBlur = 10;
            ctx.shadowColor = m.color;
        });
        ctx.shadowBlur = 0;
    }

    function loop() {
        if(!isPlaying) return;
        update();
        draw();
        requestAnimationFrame(loop);
    }

    function win() {
        isPlaying = false;
        window.gameState.name = targetName;
        nextBtn.classList.remove('hidden');
        alert("SÉCURITÉ DÉSACTIVÉE !");
    }

    function gameOver() {
        alert("SYSTÈME CRITIQUE ! REBOOT...");
        location.reload();
    }
};