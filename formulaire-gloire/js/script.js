// Écran de chargement arcade CINÉMATIQUE
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page chargée !');
    
    let currentDialogue = 1;
    const totalDialogues = 3;
    
    function showNextDialogue() {
        document.getElementById(`dialogue-line-${currentDialogue}`).classList.remove('active');
        currentDialogue++;
        
        if (currentDialogue <= totalDialogues) {
            const nextLine = document.getElementById(`dialogue-line-${currentDialogue}`);
            nextLine.classList.add('active');
            
            const textElement = nextLine.querySelector('.typing-text');
            const fullText = textElement.textContent;
            textElement.textContent = '';
            
            let i = 0;
            const typeWriter = setInterval(() => {
                if (i < fullText.length) {
                    textElement.textContent += fullText.charAt(i);
                    i++;
                } else {
                    clearInterval(typeWriter);
                }
            }, 40);
            
            if (currentDialogue === totalDialogues) {
                document.getElementById('start-mission').classList.remove('hidden');
                document.getElementById('next-dialogue').classList.add('hidden');
            }
        }
    }
    
    document.getElementById('next-dialogue').addEventListener('click', showNextDialogue);
    
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('arcade-machine').classList.remove('hidden');
        
        setTimeout(() => {
            new NomGame();
        }, 500);
    });
    
    showNextDialogue();
});

// Fonction pour changer de niveau
function showLevel(levelName) {
    document.querySelectorAll('.game-level').forEach(level => {
        level.classList.remove('active');
    });
    document.getElementById(`level-${levelName}`).classList.add('active');
}

class NomGame {
    constructor() {
        console.log('🚀 Initialisation du jeu Nom - Version Corrigée');
        
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nomInput = document.getElementById('nom-input');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.progressElement = document.getElementById('progress');
        this.missionTargetElement = document.getElementById('mission-target');
        this.nextCharElement = document.getElementById('next-char');
        this.inputStatusElement = document.getElementById('input-status');
        this.nextButton = document.getElementById('next-level');
        
        if (!this.canvas) {
            console.error('Canvas non trouvé !');
            return;
        }
        
        this.score = 0;
        this.lives = 5;
        this.targetName = '';
        this.currentName = '';
        this.letters = [];
        this.expectedNextChar = '';
        this.currentIndex = 0;
        this.gameActive = false;
        this.bonusMode = false;
        this.letterInterval = null;
        this.congratsShown = false;
        this.currentDialogue = null;
        
        this.setupGame();
    }
    
    setupGame() {
        console.log('🔧 Setup du jeu');
        
        // Configuration du champ
        this.nomInput.readOnly = false;
        this.nomInput.style.cursor = 'text';
        
        // Écouteurs d'événements
        this.nomInput.addEventListener('input', (e) => {
            if (e.data) {
                this.handleKeyPress(e.data.toUpperCase());
            }
        });
        
        this.nomInput.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                this.currentName = this.currentName.slice(0, -1);
                this.nomInput.value = this.currentName;
                this.updateUI();
            } else if (e.key === 'Enter') {
                this.validateName();
            }
        });
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.goToNextLevel();
            });
        }
        
        // Dialogue de bienvenue
        this.showDialogue("Ravi de te connaître, Capitaine ! Préparons ta défense...");
        
        setTimeout(() => {
            this.getCaptainName();
        }, 2000);
    }
    
    showDialogue(message) {
        // Supprimer le dialogue précédent s'il existe
        if (this.currentDialogue) {
            this.currentDialogue.remove();
        }
        
        const dialogueDiv = document.createElement('div');
        dialogueDiv.className = 'game-dialogue';
        dialogueDiv.innerHTML = `
            <div class="dialogue-bubble">
                <div class="dialogue-content">
                    <p>🤖 E.V.A.: ${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialogueDiv);
        this.currentDialogue = dialogueDiv;
        
        setTimeout(() => {
            dialogueDiv.remove();
            this.currentDialogue = null;
        }, 3000);
    }
    
    getCaptainName() {
        this.showDialogue("Quel est ton nom de code, Capitaine ?");
        
        const nameInputDiv = document.createElement('div');
        nameInputDiv.className = 'name-input-container';
        nameInputDiv.innerHTML = `
            <input type="text" id="captain-name-input" placeholder="Entre ton nom ici..." maxlength="20" autofocus>
            <button id="confirm-name">✓ VALIDER</button>
        `;
        
        document.querySelector('.game-area').appendChild(nameInputDiv);
        
        document.getElementById('captain-name-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('confirm-name').click();
            }
        });
        
        document.getElementById('confirm-name').addEventListener('click', () => {
            const captainName = document.getElementById('captain-name-input').value;
            
            if (captainName && captainName.length >= 2) {
                this.targetName = captainName.toUpperCase();
                this.currentName = '';
                this.expectedNextChar = this.targetName[0];
                this.currentIndex = 0;
                
                nameInputDiv.remove();
                
                this.missionTargetElement.textContent = this.targetName;
                this.nextCharElement.textContent = this.expectedNextChar;
                this.nomInput.placeholder = `Tape "${this.targetName}" pour détruire les météorites`;
                this.nomInput.value = '';
                
                this.showDialogue(`Parfait, Capitaine ${captainName} ! Lancement de la défense...`);
                
                setTimeout(() => {
                    this.nomInput.focus();
                    this.startGame();
                }, 1500);
                
            } else {
                this.showDialogue("Un vrai capitaine a un nom ! Minimum 2 lettres.");
            }
        });
    }
    
    startGame() {
        console.log('🎮 Démarrage du jeu');
        this.gameActive = true;
        
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateUI();
        this.generateLetters();
        this.gameLoop();
        
        this.showDialogue("Des météorites arrivent ! Tape ton nom pour les détruire !");
    }
    
    generateLetters(interval = 1800) {
        if (this.letterInterval) {
            clearInterval(this.letterInterval);
        }
        
        this.letterInterval = setInterval(() => {
            if (!this.gameActive) return;
            
            let newLetter;
            const hasRequiredLetters = this.expectedNextChar && this.currentName.length < this.targetName.length;
            
            if (hasRequiredLetters) {
                // 60% lettre requise, 40% lettre aléatoire (ennemi ou bonus)
                if (Math.random() < 0.6) {
                    newLetter = {
                        char: this.expectedNextChar,
                        x: Math.random() * (this.canvas.width - 50),
                        y: -50,
                        speed: 1 + Math.random() * 0.8,
                        isEnemy: false,
                        isRequired: true
                    };
                } else {
                    // Lettre aléatoire (30% ennemi, 70% bonus)
                    const isEnemy = Math.random() < 0.3;
                    newLetter = {
                        char: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
                        x: Math.random() * (this.canvas.width - 50),
                        y: -50,
                        speed: 1.2 + Math.random() * 1,
                        isEnemy: isEnemy,
                        isRequired: false
                    };
                }
            } else {
                // Mode bonus - toutes les lettres aléatoires
                const isEnemy = Math.random() < 0.4;
                newLetter = {
                    char: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
                    x: Math.random() * (this.canvas.width - 50),
                    y: -50,
                    speed: 1 + Math.random() * 1,
                    isEnemy: isEnemy,
                    isRequired: false
                };
            }
            
            if (newLetter) {
                this.letters.push(newLetter);
            }
            
        }, interval);
    }
    
    handleKeyPress(typedChar) {
        if (typedChar === 'Backspace' || typedChar === 'Enter' || typedChar.length !== 1) return;
        
        this.checkLetterHit(typedChar);
    }
    
    checkLetterHit(typedChar) {
        const normalizedTyped = this.normalizeLetter(typedChar);
        let letterHit = false;
        let points = 0;
        let message = '';
        
        for (let i = this.letters.length - 1; i >= 0; i--) {
            const letter = this.letters[i];
            const normalizedLetter = this.normalizeLetter(letter.char);
            
            if (normalizedTyped === normalizedLetter) {
                letterHit = true;
                const normalizedExpected = this.expectedNextChar ? this.normalizeLetter(this.expectedNextChar) : null;
                
                if (normalizedTyped === normalizedExpected) {
                    points = 50;
                    this.currentName += typedChar;
                    this.currentIndex++;
                    
                    if (this.currentIndex < this.targetName.length) {
                        this.expectedNextChar = this.targetName[this.currentIndex];
                        message = 'Lettre parfaite !';
                    } else {
                        this.expectedNextChar = null;
                        message = 'Nom complet ! Mode bonus activé';
                        this.activateBonusMode();
                    }
                    
                    this.nomInput.value = this.currentName;
                    
                } else if (this.normalizeLetter(this.targetName).includes(normalizedTyped)) {
                    points = 20;
                    message = 'Bonne lettre !';
                    if (!this.normalizeLetter(this.currentName).includes(normalizedTyped)) {
                        this.currentName += typedChar;
                        this.nomInput.value = this.currentName;
                    }
                } else {
                    points = letter.isEnemy ? 5 : 10;
                    message = letter.isEnemy ? 'Ennemi détruit !' : 'Bonus !';
                }
                
                this.score += points;
                this.letters.splice(i, 1);
                this.createLaserExplosion(letter.x, letter.y, points, letter.isEnemy ? '#f00' : '#0f0');
                break;
            }
        }
        
        if (!letterHit) {
            this.score = Math.max(0, this.score - 2);
        }
        
        this.inputStatusElement.textContent = letterHit ? `✅ ${message} +${points}` : '❌ Lettre manquée';
        setTimeout(() => {
            this.inputStatusElement.textContent = '';
        }, 1000);
        
        this.updateUI();
    }
    
    normalizeLetter(letter) {
        if (!letter) return '';
        return letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    }
    
    createLaserExplosion(x, y, points, color) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                
                for (let j = 0; j < 6; j++) {
                    const angle = (j / 6) * Math.PI * 2;
                    const length = i * 10;
                    this.ctx.moveTo(x + 25, y + 25);
                    this.ctx.lineTo(x + 25 + Math.cos(angle) * length, y + 25 + Math.sin(angle) * length);
                }
                this.ctx.stroke();
                
                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(x + 25, y + 25, i * 8, 0, Math.PI * 2);
                this.ctx.fill();
                
            }, i * 80);
        }
    }
    
    updateUI() {
        // Mettre à jour les éléments d'interface
        this.scoreElement.textContent = this.score.toString().padStart(5, '0');
        this.livesElement.textContent = '♥'.repeat(this.lives);
        
        const progress = Math.min(100, Math.floor((this.currentName.length / this.targetName.length) * 100));
        this.progressElement.textContent = `${progress}%`;
        
        this.nextCharElement.textContent = this.expectedNextChar || '-';
        
        // Effets visuels sur le champ
        this.nomInput.classList.remove('nearly-complete', 'complete');
        if (progress >= 80 && progress < 100) {
            this.nomInput.classList.add('nearly-complete');
        } else if (progress >= 100) {
            this.nomInput.classList.add('complete');
        }
        
        // Activer le bouton niveau suivant si le nom est complet
        const normalizedCurrent = this.normalizeLetter(this.currentName);
        const normalizedTarget = this.normalizeLetter(this.targetName);
        const hasAllLetters = normalizedTarget.split('').every(letter => 
            normalizedCurrent.includes(letter)
        );
        
        const canAdvance = hasAllLetters && this.currentName.length >= this.targetName.length;
        this.nextButton.disabled = !canAdvance;
        
        if (canAdvance && !this.congratsShown) {
            this.showDialogue("FÉLICITATIONS ! Identité reconstruite. Prêt pour la transmission ?");
            this.congratsShown = true;
        }
    }
    
    validateName() {
        const normalizedCurrent = this.normalizeLetter(this.currentName);
        const normalizedTarget = this.normalizeLetter(this.targetName);
        const hasAllLetters = normalizedTarget.split('').every(letter => 
            normalizedCurrent.includes(letter)
        );
        
        if (hasAllLetters) {
            this.showDialogue("🎉 Mission réussie ! Identité sécurisée.");
        } else {
            const missing = normalizedTarget.split('').filter(l => !normalizedCurrent.includes(l));
            this.showDialogue(`Il manque: ${missing.join(', ')}`);
        }
    }
    
    activateBonusMode() {
        this.bonusMode = true;
        this.showDialogue("🚀 Mode bonus activé ! Continue à scorer !");
        this.generateLetters(1200); // Plus rapide en mode bonus
    }
    
    goToNextLevel() {
        const normalizedCurrent = this.normalizeLetter(this.currentName);
        const normalizedTarget = this.normalizeLetter(this.targetName);
        const hasAllLetters = normalizedTarget.split('').every(letter => 
            normalizedCurrent.includes(letter)
        );
        
        if (hasAllLetters) {
            this.gameActive = false;
            localStorage.setItem('playerName', this.currentName);
            localStorage.setItem('playerScore', this.score);
            
            this.showDialogue(`Transmission vers le niveau 2... Score: ${this.score}`);
            
            setTimeout(() => {
                showLevel('email');
            }, 2000);
        }
    }
    
    gameLoop() {
        if (!this.gameActive) return;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Infos HUD
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '16px Courier New';
        this.ctx.fillText(`MISSION: ${this.targetName}`, 20, 30);
        this.ctx.fillText(`PROGRÈS: ${this.currentName}`, 20, 50);
        
        if (this.bonusMode) {
            this.ctx.fillStyle = '#ff0';
            this.ctx.fillText('🚀 MODE BONUS', 20, 70);
        }
        
        // Vaisseau
        this.ctx.fillStyle = '#0f0';
        this.ctx.fillRect(this.canvas.width/2 - 30, this.canvas.height - 50, 60, 25);
        this.ctx.fillRect(this.canvas.width/2 - 15, this.canvas.height - 75, 30, 25);
        
        // Lettres
        this.updateLetters();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateLetters() {
        for (let i = this.letters.length - 1; i >= 0; i--) {
            const letter = this.letters[i];
            letter.y += letter.speed;
            
            this.ctx.fillStyle = letter.isEnemy ? '#f00' : (letter.isRequired ? '#0f0' : '#0ff');
            this.ctx.font = 'bold 26px Courier New';
            this.ctx.fillText(letter.char, letter.x, letter.y);
            
            if (letter.isRequired) {
                this.ctx.shadowColor = '#0f0';
                this.ctx.shadowBlur = 10;
                this.ctx.fillText(letter.char, letter.x, letter.y);
                this.ctx.shadowBlur = 0;
            }
            
            if (letter.y > this.canvas.height) {
                this.letters.splice(i, 1);
                if (letter.isEnemy) {
                    this.lives--;
                    this.updateUI();
                    if (this.lives <= 0) this.gameOver();
                }
            }
        }
    }
    
    gameOver() {
        this.gameActive = false;
        this.showDialogue("💀 Mission échouée ! Recommence ?");
        setTimeout(() => location.reload(), 3000);
    }
}
