// Global variable for double-tap timing, shared between click and drag handlers
var bonusTimer = null;
var bonusResultTimer = null;
var activeAnimationId = null;

// Distinct colors for each economic class
const CLASS_COLORS = {
    "richest": "var(--accent-color)", // Gold
    "uppermid": "#2c3e50",            // Dark Slate
    "middle": "#2980b9",              // Blue
    "lowermid": "#27ae60",            // Green
    "poorest": "#e74c3c"              // Red
};

// Centralized Audio Manager
const AudioManager = {
    enabled: true,
    context: null,

    init() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    play(type) {
        if (!this.enabled) return;
        this.init();
        if (this.context.state === 'suspended') this.context.resume();

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.context.destination);

        const now = this.context.currentTime;

        switch (type) {
            case 'click': // "Fintech Tap" - Slightly lower for less ear fatigue
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1000, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
                break;
            case 'move': // "Soft Pluck" - Sine instead of triangle for smoothness
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'success': // "Premium Bank Ping" - Clean, sparkling arpeggio
                this.playTone(880, 0.05, now);      // A5
                this.playTone(1108.73, 0.05, now + 0.05); // C#6
                this.playTone(1318.51, 0.2, now + 0.1);  // E6
                break;
            case 'fail': // "Empty Wallet Thud" - Muted and low-fi
                osc.type = 'sine';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
                
                // Add a "noise" component for a papery rustle effect
                const noise = this.context.createBufferSource();
                const bufferSize = this.context.sampleRate * 0.2;
                const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
                noise.buffer = buffer;
                
                const noiseGain = this.context.createGain();
                noiseGain.gain.setValueAtTime(0.05, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                
                noise.connect(noiseGain);
                noiseGain.connect(this.context.destination);
                
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                noise.start(now);
                noise.stop(now + 0.2);
                break;
            case 'reveal': // "Organic Swell" - Soft, non-piercing shimmer
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 2);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
                gain.gain.linearRampToValueAtTime(0, now + 2);
                osc.start(now);
                osc.stop(now + 2);
                break;
            case 'tick': // A high-end, tiny "clock" tick for the history years
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1800, now);
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
                osc.start(now);
                osc.stop(now + 0.02);
                break;
        }
    },

    playTone(freq, dur, time, type = 'sine') {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = type;
        osc.connect(gain);
        gain.connect(this.context.destination);
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
        osc.start(time);
        osc.stop(time + dur);
    },

    unlock() {
        this.init();
        // Chrome/Safari requirement: resume context on user gesture
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    }
};

// Reactive State Management: Wrap economicClasses in a Proxy
// This automatically triggers updatePlateVisuals whenever guessedValue changes
const state = economicClasses.map(ec => new Proxy(ec, {
    set(target, key, value) {
        target[key] = value;
        if (key === 'guessedValue') {
            updatePlateVisuals();
        }
        return true;
    }
}));

// Add Event Listeners
$(document).ready(function() {
    initializeBoard();
    distributeEvenly();
    updatePlateVisuals();
    
    // Show Start Screen immediately
    showStartScreen();

    // Overlay Delegation
    $('#score-overlay').on('click', '.share-btn', function() { shareGame('#score-overlay'); });
    $('#score-overlay').on('click', '.learn-more-btn', function() { window.open('https://inequality.org/facts/wealth-inequality/', '_blank'); });
    $('#score-overlay').on('click', '.close-overlay-btn', function() { closeStatsAndShowInline(); });
    $('#score-overlay').on('click', '.try-again-btn', function() { resetGame(); });
    $('#score-overlay').on('click', '.show-answer-btn', function() { showAnswer(); });
    $(document).on('click', '.play-again-btn', function() { resetGame(); });
    $(document).on('click', '#reset-btn', function() { resetGame(); });
    $(document).on('click', '#help-btn', function() { showStartScreen(); });
    $(document).on('click', '.home-btn', function() { resetGame(); showStartScreen(); });
    $('#score-overlay').on('click', '.close-stats-and-show-inline', function() {
        closeStatsAndShowInline();
    });
    $('#score-overlay').on('click', '.share-facts-btn', shareFacts);
    $('#score-overlay').on('click', '.share-game-btn', function() { shareGame('#score-overlay'); });
    $('#slice-zone').on('click', '.cancel-move-btn', function() { 
        closeOverlay('#slice-zone');
        updatePlateVisuals(); // Restore opacity if cancelled
    });
    // Start Game button
    $('#score-overlay').on('click', '.start-game-btn', function() {
        AudioManager.unlock(); // Prime the Web Audio Context
        closeOverlay('#score-overlay');
    });
    // Bonus Question button
    $('#score-overlay').on('click', '.bonus-question-btn', function() {
        showBonusQuestion();
    });
    
    // Click outside to close logic
    $('#score-overlay').on('click', function(e) {
        if (e.target === this) {
            var closeBtn = $(this).find('.close-overlay-btn, .close-stats-and-show-inline, .start-game-btn');
            if (closeBtn.length > 0) {
                closeBtn.first().click();
            }
        }
    });

    $('#slice-zone').on('click', function(e) {
        if (e.target === this) {
            closeOverlay('#slice-zone');
            updatePlateVisuals(); // Restore opacity if cancelled
        }
    });

    // Custom Double Tap Logic
    $(document).on('touchend click', '.drag-handle', function(e) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            // Double Tap Detected
            e.preventDefault(); // Prevent default zoom or other actions
            $('.ghost-image').remove(); // Clear any ghosts from the first tap
            var targetClass = parseInt($(this).closest('.droppable').attr('eClass'));
            moveAllWealthTo(targetClass);
        }
        lastTap = currentTime;
    });

    // Global cleanup for stuck ghosts on interaction end
    $(document).on('mouseup touchend touchcancel pointercancel', function() {
        document.querySelectorAll('.ghost-image').forEach(el => el.remove());
    });


    // Aggressive cleanup on new touch start to prevent stuck ghosts
    $(document).on('touchstart mousedown', function(e) {
        document.querySelectorAll('.ghost-image').forEach(el => el.remove());
    });
});

function closeStatsAndShowInline() {
    closeOverlay('#score-overlay');
    // Add post-game controls to main page now that a final modal is closing
    if ($('#post-game-controls').length === 0) {
        var controlsTemplate = document.getElementById('template-post-game-controls').content.cloneNode(true);
        $('#post-game-placeholder').append(controlsTemplate);
    }
    // Only show answer-stats if we are in the "Show Answer" flow
    if ($('#remaining-container').text().includes('Actual')) {
        $('#answer-stats').fadeIn();
    }
}

function initializeBoard() {
    var container = $('#plate-container');

    container.empty(); // Clear any existing plates
    var template = document.getElementById('template-plate-item').content;

    economicClasses.forEach(function(ec, index) {
        var clone = template.cloneNode(true);
        $(clone).find('.label-text').text(ec.label);
        $(clone).find('.droppable').attr('eClass', index);
        $(clone).find('.droppable img').attr('alt', ec.label + ' plate');
        $(clone).find('.value-text').attr('id', 'eClass-label-' + index);
        container.append(clone);
    });
}

function distributeEvenly() {
    // Update raw data in a batch to avoid redundant Proxy-triggered renders
    economicClasses.forEach(ec => {
        ec.guessedValue = 20;
    });
    updatePlateVisuals();
}

function mainLayerPointerEvents(state){
    if (state){
        $('#game-layer').css('pointer-events', 'auto');
    }else{
        $('#game-layer').css('pointer-events', 'none');
    }
}

function showOverlay(layerName) {
    const $overlay = $(layerName);
    AudioManager.play('click');
    // Cancel any pending cleanup transitions
    $overlay.off('transitionend');
    $overlay.css({
        'opacity': '1',
        'pointer-events': 'auto'
    });
}

function clearLayer(layerName) {
    $(layerName).html('');
}

function closeOverlay(layerName) {
    const $overlay = $(layerName);
    $overlay.css({
        'opacity': '0',
        'pointer-events': 'none'
    });

    // Use transitionend for safe cleanup instead of hardcoded timers
    $overlay.off('transitionend').one('transitionend', function() {
        // Only clear if the user hasn't tried to open it again during the fade
        if ($overlay.css('opacity') === '0') {
            clearLayer(layerName);
        }
    });
    mainLayerPointerEvents(true);
}

function displayScoreOverlay(correct, score = 100) {
    
    var layerName = '#score-overlay';

    // Define value defaults
    var cardHeader = '';
    var barType = 'danger'; // Red

    // If guessed correctly...
    if (correct) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Set header of overlay to Congrats!
        cardHeader = 'Congrats!'

        // Prepare the background board: Hide slice and show controls
        if ($('#post-game-controls').length === 0) {
            var controlsTemplate = document.getElementById('template-post-game-controls').content.cloneNode(true);
            $('#post-game-placeholder').append(controlsTemplate);
        }

        // Clone Win Template
        var template = document.getElementById('template-score-win').content.cloneNode(true);
        
        clearLayer(layerName);
        $(layerName).append(template);
        mainLayerPointerEvents(false);
        showOverlay(layerName);

    // If guess was not correct...
    } else {
        // Make decision based on score
        // Set header and bar type (color)
        if (score >= 80) {
            cardHeader = 'So close!'
            barType = 'success'; //Green
        } else if (score > 60) {
            cardHeader = 'You\'re getting there!'
            barType = 'info'; // Blue
        } else if (score >= 40) {
            cardHeader = 'Give it another try!'
            barType = 'warning'; // Yellow
        } else {
            cardHeader = 'Try to change things up!'
            //Uses default barType (danger - Red)
        }
        
        // Clone Loss Template
        var template = document.getElementById('template-score-loss').content.cloneNode(true);
        
        // Populate Data
        $(template).find('.score-header').text(cardHeader);
        $(template).find('.score-text').text('Score: ' + Math.round(score));
        $(template).find('.progress-bar').addClass('bg-' + barType).css('width', score + '%').attr('aria-valuenow', score);

        clearLayer(layerName);
        $(layerName).append(template);
        mainLayerPointerEvents(false);
        showOverlay(layerName);
    }

}

function checkGuess() {
    // Defensive Check: Ensure the total wealth is exactly 100
    const totalGuessed = state.reduce((sum, ec) => sum + ec.guessedValue, 0);
    if (Math.abs(totalGuessed - 100) > 0.1) {
        console.error("Wealth Total Mismatch:", totalGuessed);
        distributeEvenly(); // Force reset if state is corrupted
        return;
    }

    const sumOfDifferences = state.reduce((sum, ec) => {
        return sum + Math.abs(ec.value - ec.guessedValue);
    }, 0);

    if (sumOfDifferences < 0.1) {
        showAnswer(true);
    } else {
        const maxSumOfDifferences = 200; // Max theoretical diff is 200
        let score = ((maxSumOfDifferences - sumOfDifferences) / maxSumOfDifferences) * 100;
        displayScoreOverlay(false, score);
    }
}

function showBonusQuestion() {
    var layerName = '#score-overlay';
    var template = document.getElementById('template-bonus-question').content.cloneNode(true);
    
    $(template).find('.question-text').text(BONUS_QUESTION.question);
    var $container = $(template).find('.options-container');
    
    BONUS_QUESTION.options.forEach(opt => {
        var btn = $('<button class="btn btn-primary m-1 flex-grow-1"></button>');
        btn.text(opt.text);
        btn.on('click', function() {
            AudioManager.play('click');
            handleBonusAnswer($(this), opt);
        });
        $container.append(btn);
    });

    clearLayer(layerName);
    $(layerName).append(template);
    mainLayerPointerEvents(false);
    showOverlay(layerName);
}

function handleBonusAnswer($btn, option) {
    // Disable all buttons
    $('.options-container button').prop('disabled', true);
    
    if (bonusResultTimer) clearTimeout(bonusResultTimer);
    bonusResultTimer = setTimeout(function() {
        var $alert = $('.feedback-alert');
            if (option.correct) {
                $btn.removeClass('btn-primary').addClass('btn-success');
                $alert.addClass('alert-success').text("Correct! " + BONUS_QUESTION.fact).fadeIn();
                AudioManager.play('success');
            } else {
                $btn.removeClass('btn-primary').addClass('btn-danger');
                $alert.addClass('alert-danger').text("Incorrect. " + BONUS_QUESTION.fact).fadeIn();
                AudioManager.play('fail');
            }
            
            // Scroll to the bottom of the card body so the alert is visible
            var $scrollBody = $('.scrollable-body');
            if ($scrollBody.length) {
                $scrollBody.animate({ scrollTop: $scrollBody[0].scrollHeight }, 500);
            }
        }, 800 );
    

    // Wait then proceed to Did You Know
    if (bonusTimer) clearTimeout(bonusTimer);
    bonusTimer = setTimeout(function() {
        showDidYouKnow();
    }, 3500);
}

function showDidYouKnow() {
    $('.history-bar').removeClass('draining');
    var layerName = '#score-overlay';
    var template = document.getElementById('template-did-you-know').content.cloneNode(true);
    
    // Setup Graph
    var $chart = $(template).find('.history-chart');
    var labels = ["Poorest", "Lower-Mid", "Middle", "Upper-Mid", "Richest"];
    const keys = ["poorest", "lowermid", "middle", "uppermid", "richest"];
    
    labels.forEach((label, index) => {
        const startVal = WEALTH_HISTORY[0][keys[index]];
        var barContainer = $('<div class="bar-container"></div>');
        var barWrapper = $('<div class="bar-wrapper"></div>');
        var bar = $('<div class="history-bar"></div>');
        var labelEl = $('<div class="bar-label small-text"></div>').text(label);
        
        var displayWidth = Math.max(startVal, 1);
        bar.css('width', displayWidth + '%');

        bar.css('background-color', CLASS_COLORS[keys[index]]);
        
        barWrapper.append(bar);
        barContainer.append(labelEl).append(barWrapper);
        $chart.append(barContainer);
    });

    clearLayer(layerName);
    $(layerName).append(template);
    mainLayerPointerEvents(false);
    showOverlay(layerName);

    // Start Animation
    const startYear = WEALTH_HISTORY[0].year;
    const endYear = WEALTH_HISTORY[WEALTH_HISTORY.length - 1].year;
    var duration = 4000;
    if (activeAnimationId) cancelAnimationFrame(activeAnimationId);
    let animStartTime = null;
    let lastTickYear = startYear;

    function animateHistory(timestamp) {
        if (!animStartTime) animStartTime = timestamp;
        var progress = Math.min((timestamp - animStartTime) / duration, 1);

        const totalSegments = WEALTH_HISTORY.length - 1;
        const scaledProgress = progress * totalSegments;
        const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
        const segmentT = scaledProgress - segmentIndex;

        const p1 = WEALTH_HISTORY[segmentIndex];
        const p2 = WEALTH_HISTORY[segmentIndex + 1];

        // Update Year
        var currentYear = Math.floor(p1.year + (p2.year - p1.year) * segmentT);
        $('.year-display').text(progress === 1 ? p2.year : currentYear);

        // Play a light tick whenever the year increments
        if (currentYear !== lastTickYear) {
            AudioManager.play('tick');
            lastTickYear = currentYear;
        }

        // Update Bars
        $('.history-bar').each(function(index) {
            const key = keys[index];
            const currentVal = p1[key] + (p2[key] - p1[key]) * segmentT;
            const displayWidth = Math.max(currentVal, 1); 
            $(this).css('width', displayWidth + '%');
        });

        if (progress < 1) {
            activeAnimationId = requestAnimationFrame(animateHistory);
        } else {
            $('.history-bar:not(:last-child)').addClass('draining');
        }
    }
    $('.history-bar:not(:last-child)').removeClass('draining');
    activeAnimationId = requestAnimationFrame(animateHistory);
}

function updatePlateVisuals() {
    // Iterate over raw data for rendering to avoid Proxy overhead
    economicClasses.forEach((ec, i) => {
        // Update Label
        $('#eClass-label-' + i).html('$' + parseFloat(ec.guessedValue.toFixed(1)) + ' trillion');
        var $wrapper = $('.plate-wrapper').eq(i);

        // Update Plate Image
        var $droppable = $('.droppable[eClass="' + i + '"]');

        var $img = $droppable.find('img');
        var val = ec.guessedValue;
        var startPrct = i * 20;
        var endPrct = startPrct + val;

        if (val > 0) {
            $droppable.addClass('has-slices');
            // Use full pie and mask it to the specific value
            $img.attr('src', 'images/Pies/pie-100.png').css('opacity', 1);
            var mask = '';
            if (endPrct <= 100) {
                mask = 'conic-gradient(rgba(0,0,0,0) 0% ' + startPrct + '%, rgba(0,0,0,1) ' + startPrct + '% ' + endPrct + '%, rgba(0,0,0,0) ' + endPrct + '% 100%)';
            } else {
                var overflow = endPrct - 100;
                mask = 'conic-gradient(rgba(0,0,0,1) 0% ' + overflow + '%, rgba(0,0,0,0) ' + overflow + '% ' + startPrct + '%, rgba(0,0,0,1) ' + startPrct + '% 100%)';
            }
            $img.css({
                '-webkit-mask-image': mask,
                'mask-image': mask
            });
        } else {
            $droppable.removeClass('has-slices');
            $img.css('opacity', 0);
            $img.css({ '-webkit-mask-image': 'none', 'mask-image': 'none' });
        }
    });
}

function showMoveOptions(sourceClass, targetClass) {
    var sourceValue = state[sourceClass].guessedValue;
    var options = [];

    // Progressive Increment Logic
    if (sourceValue > 10) {
        options.push(10);
        options.push(5);
        options.push(2.5);
    } else { // sourceValue is 10 or less
        if (sourceValue >= 2.5) options.push(2.5);
        if (sourceValue >= 5) options.push(5);
    }

    // Filter out options that are equal to the total source value (redundant with Move All)
    options = options.filter(opt => opt !== sourceValue);

    // Always allow moving everything
    options.push('All');

    // If the only option is to move everything, just do it without showing the menu.
    if (options.length === 1) {
        executeMove(sourceClass, targetClass, sourceValue);
        return;
    }

    var layerName = '#slice-zone';
    var template = document.getElementById('template-move-menu').content.cloneNode(true);
    var $list = $(template).find('.move-options-list');

    options.forEach(opt => {
        var btn = $('<button class="list-group-item list-group-item-action"></button>');
        var label = (opt === 'All') ? 'Move All ($' + sourceValue + 'T)' : '$' + opt + ' Trillion';
        var icon = (opt === 'All') ? '<i class="fas fa-exchange-alt mr-2"></i> ' : '<i class="fas fa-coins mr-2"></i> ';
        btn.html(icon + label);
        btn.on('click', function() {
            var amount = (opt === 'All') ? sourceValue : opt;
            executeMove(sourceClass, targetClass, amount);
        });
        $list.append(btn);
    });

    clearLayer(layerName);
    $(layerName).append(template);
    mainLayerPointerEvents(false);
    showOverlay(layerName);
}

function executeMove(sourceClass, targetClass, amount) {
    AudioManager.play('move');
    showFloatingValue(sourceClass, `-$${amount}T`, 'val-neg');
    showFloatingValue(targetClass, `+$${amount}T`, 'val-pos');

    // Changing the state proxy automatically triggers updatePlateVisuals
    state[sourceClass].guessedValue = Math.max(0, parseFloat((state[sourceClass].guessedValue - amount).toFixed(1)));
    state[targetClass].guessedValue = parseFloat((state[targetClass].guessedValue + amount).toFixed(1));
    
    closeOverlay('#slice-zone');
    $('#submit-btn').prop('disabled', false).addClass('btn-success');
    $('#reset-btn').prop('disabled', false).addClass('btn-secondary');
}

function showFloatingValue(targetIndex, text, className) {
    const $target = $('.plate-wrapper').eq(targetIndex);
    const $float = $(`<div class="floating-value ${className}">${text}</div>`);
    $target.append($float);
    setTimeout(() => $float.remove(), 1000);
}

interact('.droppable').dropzone({
    accept: '.drag-handle',
    // Require pointer overlap for a drop to be possible
    overlap: 'pointer',

    // When slice is droped on square
    ondrop: function (event) {
        var targetClass = parseInt(event.target.getAttribute('eClass'));
        var draggableElement = event.relatedTarget;
        
        // Find the source class from the draggable element's parent droppable
        var sourceClass = parseInt(draggableElement.getAttribute('data-source-class'));

        if (sourceClass === targetClass) {
            $(draggableElement).siblings('.pie-chart-img').css('opacity', 1);
            return;
        }

        showMoveOptions(sourceClass, targetClass);
    },
    ondragleave: function (event) {
        // Remove highlight when dragging away
        // Do NOTHING
    }
})

interact('.drag-handle')
    .draggable({
        inertia: true,
        listeners: {
            end(event) {
                var target = event.target;
                // Remove the ghost element
                if (event.interaction.ghost) {
                    event.interaction.ghost.remove();
                    event.interaction.ghost = null;
                }

                // Reset the handle's position
                target.style.transform = 'translate(0px, 0px)';
                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);

                // If the drop was not on a valid target, restore the original pie's opacity.
                if (!event.relatedTarget) {
                    $(target).siblings('.pie-chart-img').css('opacity', 1);
                }
            },

            move(event) {
                var target = event.target;
                if (!event.interaction.pointerIsDown) return;

                // If we are dragging, this is definitely not a double-tap. Reset the tap timer.
                lastTap = 0;

                // Create ghost on first move if not exists (prevents ghost on single tap)
                if (!event.interaction.ghost) {
                    document.querySelectorAll('.ghost-image').forEach(el => el.remove()); // Ensure no other ghosts exist

                    var sourceClass = parseInt(target.getAttribute('data-source-class'));
                    var ec = state[sourceClass];
                    var val = ec.guessedValue;
                    
                    // Only create ghost if there is value to move
                    if (val > 0) {
                        // Reconstruct mask logic from data to ensure ghost matches the plate exactly
                        var i = sourceClass;
                        var startPrct = i * 20;
                        var endPrct = startPrct + val;
                        var mask = (endPrct <= 100) 
                            ? 'conic-gradient(rgba(0,0,0,0) 0% ' + startPrct + '%, rgba(0,0,0,1) ' + startPrct + '% ' + endPrct + '%, rgba(0,0,0,0) ' + endPrct + '% 100%)'
                            : 'conic-gradient(rgba(0,0,0,1) 0% ' + (endPrct - 100) + '%, rgba(0,0,0,0) ' + (endPrct - 100) + '% ' + startPrct + '%, rgba(0,0,0,1) ' + startPrct + '% 100%)';

                        var ghost = document.createElement('img');
                        ghost.src = 'images/Pies/pie-100.png';
                        ghost.classList.add('ghost-image');
                        ghost.style.maskImage = mask;
                        ghost.style.webkitMaskImage = mask;
                        document.body.appendChild(ghost);
                        event.interaction.ghost = ghost;
                        
                        // Provide visual feedback on the original pie
                        $(target).siblings('.pie-chart-img').css('opacity', 0.5);
                    }
                }

                if (event.interaction.ghost) {
                    const ghost = event.interaction.ghost;
                    // move the ghost element with the cursor
                    ghost.style.left = event.pageX - (ghost.offsetWidth / 2) + 'px';
                    ghost.style.top = event.pageY - (ghost.offsetHeight / 2) + 'px';
                }
            },

            start(event) {
                // Failsafe: Remove any stuck ghosts from previous interrupted interactions
                document.querySelectorAll('.ghost-image').forEach(el => el.remove());

                var target = event.target;
                // Store source class on the handle itself for the drop event
                var sourceClass = $(target).closest('.droppable').attr('eClass');
                target.setAttribute('data-source-class', sourceClass);
                
                AudioManager.play('click'); 
            },
        }
    })

function showAnswer(isCorrect = false) {
    // We manually hide the overlay to ensure a clean slate, but without setting a clear timer
    $('#score-overlay').css({'opacity': '0', 'pointer-events': 'none'});
    if (activeAnimationId) cancelAnimationFrame(activeAnimationId);
    
    // Hide submit button
    $('#submit-btn').hide();
    $('#reset-btn').hide();
    $('#remaining-container').html('Actual Wealth Distribution');
    $('#game-instructions').hide();

    // Disable interactions
    $('.droppable').css('pointer-events', 'none');

    if (isCorrect) {
        AudioManager.play('success');
        // If correct, skip the animation. Just ensure the final state is rendered.
        state.forEach((ec, index) => {
            // Use raw object to update without triggering individual Proxy refreshes
            economicClasses[index].guessedValue = ec.value; 
            $('#eClass-label-' + index).html('$' + ec.value + ' trillion');
        });
        updatePlateVisuals(); // Manual refresh once

        // Then go straight to the modal after a delay
        setTimeout(() => {
            var layerName = '#score-overlay';
            var template = document.getElementById('template-stats-modal').content.cloneNode(true);
            $(template).find('h2').text('Congrats! You Got It Right!');
            $(template).find('.card-body').prepend('<p class="text-center text-success font-weight-bold">You correctly guessed the distribution of wealth. Here are the facts:</p>');
            clearLayer(layerName);
            $(layerName).append(template);
            mainLayerPointerEvents(false);
            showOverlay(layerName);
        }, 500); // 0.5-second delay
        return; // Exit so we don't run the animation code below
    }

    // 1. Set up animation parameters
    const duration = 3000; // 4 seconds for the animation
    let startTime = null;
    let lastTickProgress = 0;
    
    // Store initial and target values
    const animationData = state.map(ec => ({
        start: ec.guessedValue,
        target: ec.value
    }));

    // Easing function (easeOutQuad)
    const easeOutQuad = (t) => t * (2 - t);

    // 2. Animation Loop
    function animate(timestamp) {
        if (!startTime) {
            startTime = timestamp;
            AudioManager.play('reveal');
        }
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = easeOutQuad(progress);

        if (progress < 1) {
            animationData.forEach((data, index) => {
                const diff = data.target - data.start;
                // Update raw object to prevent 5x redundant UI updates per frame
                economicClasses[index].guessedValue = data.start + (diff * easedProgress);
            });
            updatePlateVisuals(); // Single UI update per frame
            activeAnimationId = requestAnimationFrame(animate);
        } else {
            // Ensure final values are exact and update labels one last time
            state.forEach((ec, index) => {
                economicClasses[index].guessedValue = animationData[index].target;
                $('#eClass-label-' + index).html('$' + ec.value + ' trillion');
            });
            updatePlateVisuals();

            // 4. Wait, then show the stats modal
            setTimeout(() => {
                var layerName = '#score-overlay';
                var template = document.getElementById('template-stats-modal').content.cloneNode(true);
                clearLayer(layerName);
                $(layerName).append(template);
                mainLayerPointerEvents(false);
                showOverlay(layerName);
            }, 1500); // 1.5-second delay
        }
    }

    activeAnimationId = requestAnimationFrame(animate);
}

function resetGame() {
    if (bonusTimer) clearTimeout(bonusTimer);
    if (bonusResultTimer) clearTimeout(bonusResultTimer);
    if (activeAnimationId) cancelAnimationFrame(activeAnimationId);

    AudioManager.play('click');

    // Tactile feedback for reset
    if (navigator.vibrate) {
        navigator.vibrate(20);
    }

    // 1. Reset Economic Classes Data
    distributeEvenly();

    // Remove post game controls if they exist
    $('#post-game-controls').remove();

    // Restore the remaining text container
    $('#remaining-container').html('Guess the distribution of $100 Trillion in wealth.');
    $('#game-instructions').show();

    // 3. Re-enable interactions and update UI
    $('.droppable').css('pointer-events', 'auto');
    closeOverlay('#score-overlay');

    // Hide statistics
    $('#answer-stats').hide();
    $('#submit-btn').prop('disabled', true).removeClass('btn-success');
    $('#reset-btn').prop('disabled', true).removeClass('btn-secondary');
    $('#submit-btn').show();
    $('#reset-btn').show();
    updatePlateVisuals();
}

function shareGame(layerName) {
    var shareData = {
        title: 'Economic Pie',
        text: 'I just played the Economic Pie game! Can you guess the wealth distribution in the US?',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch((error) => console.log('Error sharing', error));
    } else {
        // Fallback: Copy URL to clipboard
        var dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('Link copied to clipboard!');
    }
    // Overlay remains open so user can choose to Learn More or Close
}

function shareFacts() {
    const statsText = [
        "The Richest 20%: Control 90% of all household wealth in the U.S.",
        "The Upper Middle Class (Next 20%): Own 8% of the country’s wealth.",
        "The Middle Class (Middle 20%): Own just 2% of the country’s wealth.",
        "The Lower Middle Class (Next 20%): Own virtually nothing—their assets are almost entirely offset by their debts.",
        "The Poorest 20%: Have negative wealth. On average, they are $6,000 in debt, starting every day 'underwater.'"
    ].join('\n');

    const shareData = {
        title: 'Economic Pie Facts',
        text: statsText + '\n\nPlay the game: ' + window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch((error) => console.log('Error sharing', error));
    } else {
        // Fallback: Copy text to clipboard
        var dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = shareData.text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('Stats copied to clipboard!');
    }
}

function showStartScreen() {
    var layerName = '#score-overlay';
    var template = document.getElementById('template-start-screen').content.cloneNode(true);
    clearLayer(layerName);
    $(layerName).append(template);
    mainLayerPointerEvents(false);
    showOverlay(layerName);
}