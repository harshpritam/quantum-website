// Application state
let currentSection = 'home';
let completedSections = new Set();
let quizData = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let quizScore = 0;

// Quiz questions data
const quizQuestions = [
    {
        question: "What makes quantum computing different from classical computing?",
        options: [
            "Quantum computers are just faster versions of classical computers",
            "Quantum computers use qubits that can exist in superposition",
            "Quantum computers only work at room temperature",
            "Quantum computers use different programming languages"
        ],
        correct: 1,
        explanation: "The key difference is that quantum computers use qubits that can exist in superposition (multiple states simultaneously), unlike classical bits that are either 0 or 1."
    },
    {
        question: "What happens when you measure a qubit in superposition?",
        options: [
            "Nothing changes",
            "The qubit becomes entangled",
            "The superposition collapses to either 0 or 1",
            "The qubit multiplies"
        ],
        correct: 2,
        explanation: "Measurement causes the quantum superposition to collapse, forcing the qubit to 'choose' either 0 or 1 based on probability amplitudes."
    },
    {
        question: "What did Einstein call quantum entanglement?",
        options: [
            "Quantum magic",
            "Spooky action at a distance",
            "Impossible physics",
            "Parallel processing"
        ],
        correct: 1,
        explanation: "Einstein famously referred to quantum entanglement as 'spooky action at a distance' because he was uncomfortable with the instantaneous correlation between entangled particles."
    },
    {
        question: "Which quantum gate creates superposition?",
        options: [
            "X Gate",
            "Z Gate",
            "Hadamard Gate",
            "CNOT Gate"
        ],
        correct: 2,
        explanation: "The Hadamard gate creates superposition by putting a qubit into an equal probability of being 0 or 1."
    },
    {
        question: "What is Shor's algorithm famous for?",
        options: [
            "Creating quantum superposition",
            "Factoring large numbers efficiently",
            "Generating random numbers",
            "Measuring quantum states"
        ],
        correct: 1,
        explanation: "Shor's algorithm can efficiently factor large integers, which has major implications for breaking current cryptographic systems."
    }
];

// Game states
let bitState = 0;
let qubitInSuperposition = true;
let qubitMeasuredState = 0;
let coinInSuperposition = true;
let coinMeasuredState = null;
let particle1State = 'up';
let particle2State = 'up';
let circuit = { qubit0: [], qubit1: [] };
let matcherScore = 0;
let draggedElement = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing application...');
    initializeNavigation();
    initializeProgressTracking();
    initializeDragAndDrop();
    initializeQuiz();
    updateProgress();
    
    // Initialize superposition animation
    const coin = document.getElementById('quantumCoin');
    if (coin) {
        coin.classList.add('spinning');
    }
    
    // Set initial section to home
    navigateToSection('home');
});

// Navigation functionality
function initializeNavigation() {
    console.log('Initializing navigation...');
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            console.log('Navigation clicked:', section);
            navigateToSection(section);
        });
    });
    
    // Add click handler for brand/logo
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToSection('home');
        });
        navBrand.style.cursor = 'pointer';
    }
}

function navigateToSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    
    // Hide current section
    const currentSectionElement = document.querySelector('.section.active');
    if (currentSectionElement) {
        currentSectionElement.classList.remove('active');
    }

    // Show new section
    const newSection = document.getElementById(sectionId);
    if (newSection) {
        newSection.classList.add('active');
        currentSection = sectionId;
        
        // Update navigation
        updateNavigation();
        updateProgress();
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        console.log('Successfully navigated to:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
    }
}

function updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

function startJourney() {
    console.log('Starting journey...');
    navigateToSection('introduction');
}

function nextSection(section) {
    console.log('Moving to next section:', section);
    // Mark current section as completed
    completedSections.add(currentSection);
    updateProgressItems();
    
    navigateToSection(section);
}

function goHome() {
    navigateToSection('home');
}

// Progress tracking
function initializeProgressTracking() {
    const progressItems = document.querySelectorAll('.progress-item');
    progressItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            navigateToSection(section);
        });
    });
}

function updateProgress() {
    const sections = ['home', 'introduction', 'superposition', 'entanglement', 'gates', 'applications', 'quiz'];
    const currentIndex = sections.indexOf(currentSection);
    const progressPercent = Math.max(0, (currentIndex / (sections.length - 1)) * 100);
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
}

function updateProgressItems() {
    const progressItems = document.querySelectorAll('.progress-item');
    progressItems.forEach(item => {
        const section = item.getAttribute('data-section');
        if (completedSections.has(section)) {
            item.classList.add('completed');
        }
    });
}

// Bit vs Qubit Game
function flipBit() {
    bitState = bitState === 0 ? 1 : 0;
    const bitDisplay = document.getElementById('classicalBit');
    if (bitDisplay) {
        bitDisplay.textContent = bitState;
        bitDisplay.style.transform = 'scale(1.2)';
        setTimeout(() => {
            bitDisplay.style.transform = 'scale(1)';
        }, 200);
    }
}

function measureQubit() {
    if (qubitInSuperposition) {
        qubitMeasuredState = Math.random() < 0.5 ? 0 : 1;
        qubitInSuperposition = false;
        
        const qubitDisplay = document.getElementById('quantumQubit');
        const superpositionText = qubitDisplay.querySelector('.superposition-text');
        
        qubitDisplay.classList.add('measured');
        superpositionText.textContent = `|${qubitMeasuredState}⟩`;
        
        // Add visual feedback
        qubitDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => {
            qubitDisplay.style.transform = 'scale(1)';
        }, 300);
    }
}

function resetQubit() {
    qubitInSuperposition = true;
    const qubitDisplay = document.getElementById('quantumQubit');
    const superpositionText = qubitDisplay.querySelector('.superposition-text');
    
    qubitDisplay.classList.remove('measured');
    superpositionText.textContent = '|0⟩ + |1⟩';
}

// Superposition Simulator
function measureSuperposition() {
    if (coinInSuperposition) {
        coinMeasuredState = Math.random() < 0.5 ? 'heads' : 'tails';
        coinInSuperposition = false;
        
        const coin = document.getElementById('quantumCoin');
        const result = document.getElementById('measurementResult');
        
        coin.classList.remove('spinning');
        coin.classList.add('measured');
        
        if (coinMeasuredState === 'heads') {
            coin.style.transform = 'rotateY(0deg)';
        } else {
            coin.style.transform = 'rotateY(180deg)';
        }
        
        result.textContent = `Measured: ${coinMeasuredState.toUpperCase()}!`;
        result.classList.add('measured');
        
        // Update probability display
        updateProbabilityDisplay(coinMeasuredState === 'heads' ? '100% |0⟩' : '0% |0⟩', 
                                coinMeasuredState === 'heads' ? '0% |1⟩' : '100% |1⟩');
    }
}

function resetSuperposition() {
    coinInSuperposition = true;
    coinMeasuredState = null;
    
    const coin = document.getElementById('quantumCoin');
    const result = document.getElementById('measurementResult');
    
    coin.classList.add('spinning');
    coin.classList.remove('measured');
    coin.style.transform = '';
    
    result.textContent = '';
    result.classList.remove('measured');
    
    updateProbabilityDisplay('50% |0⟩', '50% |1⟩');
}

function updateProbabilityDisplay(headsText, tailsText) {
    const probHeads = document.querySelector('.prob-heads');
    const probTails = document.querySelector('.prob-tails');
    
    if (probHeads) probHeads.textContent = headsText;
    if (probTails) probTails.textContent = tailsText;
}

// Entanglement Game
function interactParticle(particleNum) {
    // Flip the state of both particles (they're entangled)
    particle1State = particle1State === 'up' ? 'down' : 'up';
    particle2State = particle2State === 'up' ? 'down' : 'up';
    
    const particle1 = document.getElementById('particle1');
    const particle2 = document.getElementById('particle2');
    
    // Update visual states
    particle1.className = `entangled-particle spin-${particle1State}`;
    particle2.className = `entangled-particle spin-${particle2State}`;
    
    // Add interaction animation
    particle1.style.transform = 'scale(1.2)';
    particle2.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        particle1.style.transform = 'scale(1)';
        particle2.style.transform = 'scale(1)';
    }, 300);
}

function resetEntanglement() {
    particle1State = 'up';
    particle2State = 'up';
    
    const particle1 = document.getElementById('particle1');
    const particle2 = document.getElementById('particle2');
    
    particle1.className = 'entangled-particle spin-up';
    particle2.className = 'entangled-particle spin-up';
}

// Gate Builder
function initializeDragAndDrop() {
    // Initialize gate drag and drop
    setTimeout(() => {
        const gates = document.querySelectorAll('.gate');
        gates.forEach(gate => {
            gate.addEventListener('dragstart', handleGateDragStart);
            gate.addEventListener('dragend', handleGateDragEnd);
        });
        
        const gateSlots = document.querySelectorAll('.gate-slot');
        gateSlots.forEach(slot => {
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('dragenter', handleDragEnter);
            slot.addEventListener('dragleave', handleDragLeave);
            slot.addEventListener('drop', handleGateDrop);
        });
    }, 100);
    
    // Initialize matcher drag and drop
    setTimeout(() => {
        initializeMatcherDragDrop();
    }, 100);
}

function handleGateDragStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
}

function handleGateDragEnd(e) {
    e.target.style.opacity = '1';
    draggedElement = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleGateDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    if (draggedElement && e.target.classList.contains('gate-slot')) {
        const gateType = draggedElement.getAttribute('data-gate');
        const qubit = e.target.getAttribute('data-qubit');
        const position = e.target.getAttribute('data-position');
        
        // Clear existing gate in slot
        e.target.innerHTML = '';
        
        // Add new gate
        const newGate = draggedElement.cloneNode(true);
        newGate.removeAttribute('draggable');
        newGate.addEventListener('click', function() {
            this.parentNode.innerHTML = '';
            updateCircuitState();
        });
        
        e.target.appendChild(newGate);
        updateCircuitState();
    }
}

function updateCircuitState() {
    // Simple circuit state tracking
    const slots = document.querySelectorAll('.gate-slot');
    circuit = { qubit0: [], qubit1: [] };
    
    slots.forEach(slot => {
        const gate = slot.querySelector('.gate');
        if (gate) {
            const gateType = gate.getAttribute('data-gate');
            const qubit = slot.getAttribute('data-qubit');
            const position = parseInt(slot.getAttribute('data-position'));
            
            if (qubit === '0') {
                circuit.qubit0[position] = gateType;
            } else {
                circuit.qubit1[position] = gateType;
            }
        }
    });
}

function runCircuit() {
    // Simple simulation - just show different outputs based on gates
    const output0 = document.getElementById('output0');
    const output1 = document.getElementById('output1');
    
    let state0 = '|0⟩';
    let state1 = '|0⟩';
    
    // Apply gates for qubit 0
    if (circuit.qubit0) {
        circuit.qubit0.forEach(gate => {
            if (gate === 'X') {
                state0 = state0 === '|0⟩' ? '|1⟩' : '|0⟩';
            } else if (gate === 'H') {
                state0 = '|+⟩'; // Superposition
            }
        });
    }
    
    // Apply gates for qubit 1
    if (circuit.qubit1) {
        circuit.qubit1.forEach(gate => {
            if (gate === 'X') {
                state1 = state1 === '|0⟩' ? '|1⟩' : '|0⟩';
            } else if (gate === 'H') {
                state1 = '|+⟩'; // Superposition
            }
        });
    }
    
    if (output0) output0.textContent = state0;
    if (output1) output1.textContent = state1;
    
    // Add animation
    if (output0) {
        output0.style.color = 'var(--color-teal-300)';
        setTimeout(() => {
            output0.style.color = '';
        }, 1000);
    }
    if (output1) {
        output1.style.color = 'var(--color-teal-300)';
        setTimeout(() => {
            output1.style.color = '';
        }, 1000);
    }
}

function clearCircuit() {
    const slots = document.querySelectorAll('.gate-slot');
    slots.forEach(slot => {
        slot.innerHTML = '';
    });
    
    const output0 = document.getElementById('output0');
    const output1 = document.getElementById('output1');
    if (output0) output0.textContent = '|0⟩';
    if (output1) output1.textContent = '|0⟩';
    
    circuit = { qubit0: [], qubit1: [] };
}

// Application Matcher Game
function initializeMatcherDragDrop() {
    const matchItems = document.querySelectorAll('.match-item');
    const matchTargets = document.querySelectorAll('.match-target');
    
    matchItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedElement = e.target;
            e.target.style.opacity = '0.5';
        });
        
        item.addEventListener('dragend', function(e) {
            e.target.style.opacity = '1';
        });
    });
    
    matchTargets.forEach(target => {
        target.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        target.addEventListener('dragenter', function(e) {
            e.preventDefault();
            e.target.classList.add('drag-over');
        });
        
        target.addEventListener('dragleave', function(e) {
            e.target.classList.remove('drag-over');
        });
        
        target.addEventListener('drop', function(e) {
            e.preventDefault();
            e.target.classList.remove('drag-over');
            
            if (draggedElement) {
                const appType = draggedElement.getAttribute('data-app');
                const targetType = e.target.getAttribute('data-target');
                
                if (appType === targetType && !e.target.classList.contains('matched')) {
                    e.target.innerHTML = draggedElement.innerHTML + ' → ' + e.target.textContent;
                    e.target.classList.add('matched');
                    draggedElement.style.display = 'none';
                    matcherScore++;
                    updateMatcherScore();
                    
                    if (matcherScore === 4) {
                        setTimeout(() => {
                            alert('Congratulations! You matched all applications correctly!');
                        }, 500);
                    }
                }
            }
        });
    });
}

function updateMatcherScore() {
    const scoreElement = document.getElementById('matchScore');
    if (scoreElement) {
        scoreElement.textContent = `${matcherScore}/4`;
    }
}

function resetMatcher() {
    matcherScore = 0;
    updateMatcherScore();
    
    const matchItems = document.querySelectorAll('.match-item');
    const matchTargets = document.querySelectorAll('.match-target');
    
    matchItems.forEach(item => {
        item.style.display = 'block';
    });
    
    matchTargets.forEach(target => {
        target.classList.remove('matched');
        const targetData = target.getAttribute('data-target');
        const targetTexts = {
            'cryptography': 'Shor\'s Algorithm',
            'optimization': 'Quantum Annealing',
            'drug-discovery': 'VQE Algorithm',
            'machine-learning': 'QML Algorithms'
        };
        target.innerHTML = targetTexts[targetData];
    });
}

// Quiz functionality
function initializeQuiz() {
    quizData = [...quizQuestions];
    const totalQuestionsElement = document.getElementById('totalQuestions');
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = quizData.length;
    }
}

function showQuestion() {
    if (currentQuestionIndex >= quizData.length) return;
    
    const question = quizData[currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('quizOptions');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    
    if (currentQuestionSpan) currentQuestionSpan.textContent = currentQuestionIndex + 1;
    if (questionText) questionText.textContent = question.question;
    
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
    }
    
    updateQuizControls();
    hideFeedback();
}

function selectOption(optionIndex) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, index) => {
        option.classList.remove('selected');
        if (index === optionIndex) {
            option.classList.add('selected');
        }
    });
    
    selectedAnswers[currentQuestionIndex] = optionIndex;
    showFeedback(optionIndex);
}

function showFeedback(selectedIndex) {
    const question = quizData[currentQuestionIndex];
    const feedback = document.getElementById('quizFeedback');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackExplanation = document.getElementById('feedbackExplanation');
    const options = document.querySelectorAll('.quiz-option');
    
    const isCorrect = selectedIndex === question.correct;
    
    // Update option styles
    options.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Show feedback
    if (feedback) {
        feedback.classList.remove('hidden');
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    }
    
    if (feedbackIcon) feedbackIcon.textContent = isCorrect ? '✅' : '❌';
    if (feedbackText) feedbackText.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
    if (feedbackExplanation) feedbackExplanation.textContent = question.explanation;
    
    if (isCorrect) {
        quizScore++;
    }
}

function hideFeedback() {
    const feedback = document.getElementById('quizFeedback');
    if (feedback) {
        feedback.classList.add('hidden');
    }
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showQuizResults();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function updateQuizControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
    if (nextBtn) nextBtn.textContent = currentQuestionIndex === quizData.length - 1 ? 'Finish' : 'Next';
}

function showQuizResults() {
    const quizContainer = document.querySelector('.quiz-container');
    const resultsContainer = document.getElementById('quizResults');
    const finalScore = document.getElementById('finalScore');
    
    if (quizContainer) quizContainer.classList.add('hidden');
    if (resultsContainer) resultsContainer.classList.remove('hidden');
    if (finalScore) finalScore.textContent = quizScore;
    
    // Mark quiz as completed
    completedSections.add('quiz');
    updateProgressItems();
}

function restartQuiz() {
    currentQuestionIndex = 0;
    selectedAnswers = [];
    quizScore = 0;
    
    const quizContainer = document.querySelector('.quiz-container');
    const resultsContainer = document.getElementById('quizResults');
    
    if (quizContainer) quizContainer.classList.remove('hidden');
    if (resultsContainer) resultsContainer.classList.add('hidden');
    
    showQuestion();
}

// Make sure quiz loads when navigating to quiz section
document.addEventListener('DOMContentLoaded', function() {
    // Add observer to initialize quiz when quiz section becomes active
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'quiz' && target.classList.contains('active')) {
                    setTimeout(() => {
                        showQuestion();
                    }, 100);
                }
            }
        });
    });
    
    const quizSection = document.getElementById('quiz');
    if (quizSection) {
        observer.observe(quizSection, { attributes: true });
    }
});