window.initLevel2 = function() {
    const gridEl = document.getElementById('grid-container');
    const overlay = document.getElementById('maze-start-overlay');
    const emailInput = document.getElementById('email-setup-input');
    const nextBtn = document.getElementById('next-level-3');
    
    // Status
    const sUser = document.getElementById('part-user');
    const sAt = document.getElementById('part-at');
    const sDomain = document.getElementById('part-domain');

    const COLS = 15, ROWS = 10;
    let player = { x: 1, y: 1 };
    let emailParts = {}; 
    let step = 0; // 0: User, 1: @, 2: Domain

    // Carte (0: Vide, 1: Mur, 9: Mine)
    // Génération simple avec murs aléatoires
    let map = [];

    document.getElementById('start-maze-btn').onclick = () => {
        const val = emailInput.value;
        if(!val.includes('@')) return alert("Email invalide");
        const split = val.split('@');
        emailParts = { user: split[0], at: '@', domain: split[1] };
        
        overlay.classList.add('hidden');
        initMap();
        draw();
        document.addEventListener('keydown', move);
    };

    function initMap() {
        // Init vide
        for(let y=0; y<ROWS; y++) {
            map[y] = [];
            for(let x=0; x<COLS; x++) {
                // Bords
                if(x===0 || x===COLS-1 || y===0 || y===ROWS-1) map[y][x] = 1;
                // Random obstacles et mines
                else if(Math.random() < 0.15) map[y][x] = 1; // Mur
                else if(Math.random() < 0.05) map[y][x] = 9; // Mine
                else map[y][x] = 0;
            }
        }
        // Zone départ safe
        map[1][1] = 0; map[1][2] = 0; map[2][1] = 0;
        
        // Placer les items (2, 3, 4 pour les étapes)
        placeItem(2); // User
    }

    function placeItem(id) {
        let placed = false;
        while(!placed) {
            let rx = Math.floor(Math.random() * (COLS-2)) + 1;
            let ry = Math.floor(Math.random() * (ROWS-2)) + 1;
            if(map[ry][rx] === 0 && (rx!==player.x || ry!==player.y)) {
                map[ry][rx] = id;
                placed = true;
            }
        }
    }

    function move(e) {
        let dx=0, dy=0;
        if(e.key === 'ArrowUp') dy=-1;
        if(e.key === 'ArrowDown') dy=1;
        if(e.key === 'ArrowLeft') dx=-1;
        if(e.key === 'ArrowRight') dx=1;

        if(dx===0 && dy===0) return;

        const nx = player.x + dx;
        const ny = player.y + dy;

        // Collision Mur
        if(map[ny][nx] === 1) return;

        // Collision Mine
        if(map[ny][nx] === 9) {
            alert("MINE DÉTECTÉE ! REINITIALISATION POSITION.");
            window.updateScore(-50);
            player = { x: 1, y: 1 };
            draw();
            return;
        }

        // Mouvement
        player.x = nx;
        player.y = ny;

        // Collision Item
        const cell = map[ny][nx];
        if(cell >= 2 && cell <= 4) {
            collect(cell);
            map[ny][nx] = 0; // Enlever item
        }

        draw();
    }

    function collect(id) {
        window.updateScore(200);
        if(id === 2) {
            sUser.classList.add('collected');
            sUser.innerText = emailParts.user;
            placeItem(3); // Spawn @
        } else if(id === 3) {
            sAt.classList.add('collected');
            placeItem(4); // Spawn Domain
        } else if(id === 4) {
            sDomain.classList.add('collected');
            sDomain.innerText = emailParts.domain;
            win();
        }
    }

    function draw() {
        const container = document.getElementById('grid-container');
        container.innerHTML = '';
        
        // Créer les divs
        for(let y=0; y<ROWS; y++) {
            for(let x=0; x<COLS; x++) {
                const cellVal = map[y][x];
                if(cellVal === 0 && (x!==player.x || y!==player.y)) continue;

                const el = document.createElement('div');
                el.className = 'entity';
                el.style.left = (x*40)+'px';
                el.style.top = (y*40)+'px';

                if(x === player.x && y === player.y) {
                    el.classList.add('player-token');
                    el.innerText = '👨‍🚀';
                } else if(cellVal === 1) {
                    el.classList.add('wall-token');
                } else if(cellVal === 9) {
                    el.classList.add('mine-token');
                    el.innerText = '☢️';
                } else if(cellVal === 2) {
                    el.classList.add('item-token'); el.innerText = '👤'; el.style.color='#0f0';
                } else if(cellVal === 3) {
                    el.classList.add('item-token'); el.innerText = '@'; el.style.color='#f0f';
                } else if(cellVal === 4) {
                    el.classList.add('item-token'); el.innerText = '🌐'; el.style.color='#0ff';
                }
                container.appendChild(el);
            }
        }
    }

    function win() {
        document.removeEventListener('keydown', move);
        document.getElementById('email-final').value = emailInput.value;
        nextBtn.classList.remove('hidden');
    }
};