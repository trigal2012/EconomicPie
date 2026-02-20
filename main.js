// Add Event Listeners
$(document).ready(function() {
    initializeBoard();
    distributeEvenly();
    updateSlice();
    
    // Show Start Screen immediately
    showStartScreen();

    // Score Overlay Delegation
    $('#score-overlay').on('click', '.share-btn', function() { shareGame('#score-overlay'); });
    $('#score-overlay').on('click', '.learn-more-btn', function() { window.open('https://inequality.org/facts/income-inequality/', '_blank'); });
    $('#score-overlay').on('click', '.close-overlay-btn', function() { closeOverlay('#score-overlay'); });
    $('#score-overlay').on('click', '.try-again-btn', function() { resetGame(); });
    $('#score-overlay').on('click', '.show-answer-btn', function() { showAnswer(); });
    $(document).on('click', '.play-again-btn', function() { resetGame(); });
    $(document).on('click', '#reset-btn', function() { resetGame(); });
    $(document).on('click', '#help-btn', function() { showStartScreen(); });
    $(document).on('click', '.home-btn', function() { resetGame(); showStartScreen(); });
    $('#score-overlay').on('click', '.close-stats-and-show-inline', function() {
        closeOverlay('#score-overlay');
        // Add post-game controls to main page now that modal is closing
        if ($('#post-game-controls').length === 0) {
            var controlsTemplate = document.getElementById('template-post-game-controls').content.cloneNode(true);
            $('#post-game-placeholder').append(controlsTemplate);
        }
        $('#answer-stats').fadeIn();
    });
    $('#score-overlay').on('click', '.share-facts-btn', shareFacts);
    $('#score-overlay').on('click', '.share-game-btn', function() { shareGame('#score-overlay'); });
    $('#slice-zone').on('click', '.cancel-move-btn', function() { closeOverlay('#slice-zone'); });
    // Start Game button
    $('#score-overlay').on('click', '.start-game-btn', function() {
        closeOverlay('#score-overlay');
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
        }
    });
});

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
    // Reset state before distributing
    economicClasses.forEach(ec => {
        ec.guessedValue = 20;
    });
}

function mainLayerPointerEvents(state){
    if (state){
        $('#game-layer').css('pointer-events', 'auto');
    }else{
        $('#game-layer').css('pointer-events', 'none');
    }
}

function showOverlay(layerName){
    $(layerName).css({
        'opacity': '1',
        'pointer-events': 'auto'
    });
}

function clearLayer(layerName){
    $(layerName).html('');
}

function setLayerContents(layerName, html){
    $(layerName).html(html);
}

var closeOverlayTimer = null;

// Guess check overlay
function closeOverlay(layerName) {
    var overlayLayer = $(layerName);
    overlayLayer.css({
        'opacity': '0',
        'pointer-events': 'none'
    });
    if (closeOverlayTimer) clearTimeout(closeOverlayTimer);
    closeOverlayTimer = setTimeout(() => {
        clearLayer(layerName);
    }, 1500); // Match CSS transition duration
    mainLayerPointerEvents(true);
}

function displayScoreOverlay(correct, score = 100) {
    
    var layerName = '#score-overlay';

    // Define value defaults
    var cardHeader = '';
    var barType = 'danger'; // Red

    // If guessed correctly...
    if (correct) {
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
    const sumOfDifferences = economicClasses.reduce((sum, ec) => {
        return sum + Math.abs(ec.value - ec.guessedValue);
    }, 0);
    // Calculate the maximum possible sum of absolute differences
    const maxSumOfDifferences = 100;
    // Calculate the score
    var score = ((maxSumOfDifferences - sumOfDifferences) / maxSumOfDifferences) * 50;

    if (score > 0) {
        score += 50;
    } else {
        score = 50 + score;
    }
    if (score == 100) {
        showAnswer(true);
    } else {
        displayScoreOverlay(false, score);
        //alert('You guessed in-correct: ' + averageDifference);
    }
}

function updateSlice() {
    updatePlateVisuals();
}

function updatePlateVisuals() {
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
    var sourceValue = economicClasses[sourceClass].guessedValue;
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
    economicClasses[sourceClass].guessedValue -= amount;
    economicClasses[targetClass].guessedValue += amount;
    updatePlateVisuals();
    closeOverlay('#slice-zone');
    $('#submit-btn').prop('disabled', false).addClass('btn-success');
    $('#reset-btn').prop('disabled', false).addClass('btn-secondary');
    // Haptic feedback for a successful move
    if (navigator.vibrate) {
        navigator.vibrate(50); // Vibrate for 50ms
    }
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
                if (event.interaction.ghost) {
                    const ghost = event.interaction.ghost;
                    // move the ghost element with the cursor
                    ghost.style.left = event.pageX - (ghost.offsetWidth / 2) + 'px';
                    ghost.style.top = event.pageY - (ghost.offsetHeight / 2) + 'px';
                }
            },

            start(event) {
                var target = event.target;
                var originalPie = $(target).siblings('.pie-chart-img')[0];

                // Create a ghost element
                const ghost = originalPie.cloneNode(true);
                ghost.classList.add('ghost-image');
                document.body.appendChild(ghost);

                // Store the ghost on the interaction
                event.interaction.ghost = ghost;

                // Store source class on the handle itself for the drop event
                var sourceClass = $(target).closest('.droppable').attr('eClass');
                target.setAttribute('data-source-class', sourceClass);

                // Provide visual feedback on the original pie
                originalPie.style.opacity = 0.5;
            },
        }
    })

function showAnswer(isCorrect = false) {
    // Ensure we don't have a pending clear from a previous close
    if (closeOverlayTimer) clearTimeout(closeOverlayTimer);
    
    // We manually hide the overlay to ensure a clean slate, but without setting a clear timer
    $('#score-overlay').css({'opacity': '0', 'pointer-events': 'none'});
    
    // Hide submit button
    $('#submit-btn').hide();
    $('#reset-btn').hide();
    $('#remaining-container').html('Actual Wealth Distribution');
    $('#game-instructions').hide();

    // Disable interactions
    $('.droppable').css('pointer-events', 'none');

    if (isCorrect) {
        // If correct, skip the animation. Just ensure the final state is rendered.
        economicClasses.forEach((ec, index) => {
            ec.guessedValue = ec.value; // Ensure it's the final value
            $('#eClass-label-' + index).html('$' + ec.value + ' trillion');
        });
        updatePlateVisuals();

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
    
    // Store initial and target values
    const animationData = economicClasses.map(ec => ({
        start: ec.guessedValue,
        target: ec.value
    }));

    // Easing function (easeOutQuad)
    const easeOutQuad = (t) => t * (2 - t);

    // 2. Animation Loop
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = easeOutQuad(progress);

        if (progress < 1) {
            animationData.forEach((data, index) => {
                const diff = data.target - data.start;
                economicClasses[index].guessedValue = data.start + (diff * easedProgress);
            });
            updatePlateVisuals();
            requestAnimationFrame(animate);
        } else {
            // Ensure final values are exact and update labels one last time
            economicClasses.forEach((ec, index) => {
                ec.guessedValue = animationData[index].target;
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

    requestAnimationFrame(animate);
}

function resetGame() {
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
    updateSlice();
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
    // Ensure we don't have a pending clear from a previous close (like from resetGame)
    if (closeOverlayTimer) clearTimeout(closeOverlayTimer);

    var layerName = '#score-overlay';
    var template = document.getElementById('template-start-screen').content.cloneNode(true);
    clearLayer(layerName);
    $(layerName).append(template);
    mainLayerPointerEvents(false);
    showOverlay(layerName);
}