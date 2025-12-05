window.initLevel3 = function() {
    const wrapper = document.getElementById('targets-layer');
    const display = document.getElementById('sujet-final');
    const nextBtn = document.getElementById('next-level-4');
    const delorean = document.getElementById('delorean-egg');
    
    // Ajout de DELOREAN dans la liste
    const words = ["URGENT", "MISSION", "CONTACT", "BUG", "SALUT", "PROJET", "DELOREAN", "FUTUR"];
    let active = true;

    // Nettoyage des cibles (sans effacer la DeLorean qui est dans le wrapper)
    const oldTargets = wrapper.querySelectorAll('.word-target');
    oldTargets.forEach(t => t.remove());
    
    // Spawn targets
    setInterval(() => {
        if(!active) return;
        const w = words[Math.floor(Math.random()*words.length)];
        createTarget(w);
    }, 1500);

    function createTarget(text) {
        const el = document.createElement('div');
        el.className = 'word-target';
        el.innerText = text;
        
        const startY = Math.random() * 350; 
        el.style.top = startY + 'px';
        el.style.left = '-100px';
        
        wrapper.appendChild(el);
        
        let pos = -100;
        const speed = Math.random() * 2 + 1;
        
        const move = setInterval(() => {
            if(!active) { clearInterval(move); return; }
            pos += speed;
            el.style.left = pos + 'px';
            if(pos > 800) { clearInterval(move); el.remove(); }
        }, 16);

        el.onmousedown = () => {
            // --- EASTER EGG DELOREAN ---
            if (text === "DELOREAN" || text === "FUTUR") {
                window.playSound('warp'); // Son
                
                // On retire 'hidden' pour afficher la div contenant le GIF
                delorean.classList.remove('hidden');
                delorean.classList.add('drive-by');
                
                // Reset de l'anim après passage (3s pour être large)
                setTimeout(() => {
                    delorean.classList.remove('drive-by');
                    delorean.classList.add('hidden');
                }, 3000);
            }
            // ---------------------------

            window.updateScore(100);
            display.innerText = text;
            display.classList.remove('blink');
            nextBtn.classList.remove('hidden');
            el.style.transform = "scale(2)";
            el.style.opacity = 0;
            setTimeout(() => el.remove(), 200);
        };
    }

    nextBtn.onclick = () => {
        active = false;
        window.switchLevel('level-sujet', 'level-message');
        if(window.initLevel4) window.initLevel4();
    };
};