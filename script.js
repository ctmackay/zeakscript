// Get modal elements
const modal = document.getElementById('statsModal');
const closeBtn = document.querySelector('.close');

// Get all evolution nodes
const evolutionNodes = document.querySelectorAll('.evolution-node');

// Store LeaderLine objects for updating
const lines = [];
let isDragging = false;
let draggedElement = null;
let dragStartX = 0;
let dragStartY = 0;
let clickStartX = 0;
let clickStartY = 0;

// Evolution paths - define connections based on the diagram
const evolutionPaths = [
    // From C Tier to B Tier
    { from: 'cuteBabe', to: 'lion' },
    { from: 'jlo', to: 'lion' },
    { from: 'cuteBabe', to: 'gooooodZeak' },
    { from: 'cuteBabe', to: 'sideZeak' },
    { from: 'ilianaBabe', to: 'buckZeak' },
    { from: 'demon', to: 'popcornDemon' },
    { from: 'demon', to: 'crochetDemon' },
    { from: 'crochetDemon', to: 'dutchBabe' },

    // From B Tier to A Tier
    { from: 'gooooodZeak', to: 'onion' },
    { from: 'lion', to: 'onion' },
    { from: 'sideZeak', to: 'shortZeak' },
    { from: 'tinyZeak', to: 'drunkZeak' },
    { from: 'buckZeak', to: 'drunkZeak' },
    { from: 'popcornDemon', to: 'eZeak' },
    { from: 'seaDevil', to: 'sillyZeak' },
    { from: 'dutchBabe', to: 'seaZeak' },
    { from: 'seaBrat', to: 'seaSerpent' },
    { from: 'youngBabe', to: 'seaFossil' },
    { from: 'rockZeak', to: 'ancientBabe' },

    // From A Tier to S Tier
    { from: 'onion', to: 'frog' },
    { from: 'shortZeak', to: 'frog' },
    { from: 'canadianAngel', to: 'flower' },
    { from: 'ecoZeak', to: 'grassEvol' },
    { from: 'drunkZeak', to: 'grassEvol' },
    { from: 'eZeak', to: 'angel' },
    { from: 'sillyZeak', to: 'windyEvol' },
    { from: 'seaZeak', to: 'seaAngel' },
    { from: 'seaSerpent', to: 'yuzuBabe' },
    { from: 'ancientBabe', to: 'seaBabe' },
    { from: 'seaFossil', to: 'seaBabe' },

    // Additional cross-tier connections
    { from: 'shortZeak', to: 'canadianAngel' },
    { from: 'tinyZeak', to: 'sideZeak' },
    { from: 'seaDevil', to: 'seaZeak' },
];

// Load saved positions from localStorage
function loadPositions() {
    const savedPositions = localStorage.getItem('zeakPositions');
    if (savedPositions) {
        const positions = JSON.parse(savedPositions);
        Object.keys(positions).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.left = positions[id].left;
                element.style.top = positions[id].top;
            }
        });
    }
}

// Save positions to localStorage
function savePositions() {
    const positions = {};
    evolutionNodes.forEach(node => {
        positions[node.id] = {
            left: node.style.left,
            top: node.style.top
        };
    });
    localStorage.setItem('zeakPositions', JSON.stringify(positions));
}

// Add drag and click functionality to each node
evolutionNodes.forEach(node => {
    node.addEventListener('mousedown', function(e) {
        // Don't drag if clicking on the image (reserve for stats)
        if (e.target.tagName === 'IMG' || e.target.classList.contains('nickname')) {
            return;
        }

        isDragging = false;
        draggedElement = this;
        clickStartX = e.clientX;
        clickStartY = e.clientY;

        const rect = this.getBoundingClientRect();
        dragStartX = e.clientX - rect.left + (this.offsetWidth / 2);
        dragStartY = e.clientY - rect.top + (this.offsetHeight / 2);

        this.style.cursor = 'grabbing';
        this.style.zIndex = '1000';

        e.preventDefault();
    });

    // Click event for showing stats (only if not dragged)
    node.addEventListener('click', function(e) {
        if (isDragging) {
            return; // Don't show modal if we just dragged
        }

        const name = this.getAttribute('data-name');
        const hp = this.getAttribute('data-hp');
        const attack = this.getAttribute('data-attack');
        const defense = this.getAttribute('data-defense');
        const speed = this.getAttribute('data-speed');
        const special = this.getAttribute('data-special');

        // Update modal content
        document.getElementById('pokemonName').textContent = name;
        document.getElementById('hpValue').textContent = hp;
        document.getElementById('attackValue').textContent = attack;
        document.getElementById('defenseValue').textContent = defense;
        document.getElementById('speedValue').textContent = speed;
        document.getElementById('specialAbility').textContent = special;

        // Update stat bars
        document.querySelector('.hp-fill').style.width = hp + '%';
        document.querySelector('.attack-fill').style.width = attack + '%';
        document.querySelector('.defense-fill').style.width = defense + '%';
        document.querySelector('.speed-fill').style.width = speed + '%';

        // Show modal
        modal.style.display = 'block';
    });
});

// Mouse move event
document.addEventListener('mousemove', function(e) {
    if (draggedElement) {
        // Check if we've moved enough to consider it a drag
        const moveDistance = Math.sqrt(
            Math.pow(e.clientX - clickStartX, 2) +
            Math.pow(e.clientY - clickStartY, 2)
        );

        if (moveDistance > 5) {
            isDragging = true;
        }

        if (isDragging) {
            const container = document.querySelector('.tree-container');
            const containerRect = container.getBoundingClientRect();

            // Calculate new position as percentage
            const leftPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            const topPercent = ((e.clientY - containerRect.top) / containerRect.height) * 100;

            // Constrain to container bounds
            const constrainedLeft = Math.max(5, Math.min(95, leftPercent));
            const constrainedTop = Math.max(5, Math.min(95, topPercent));

            draggedElement.style.left = constrainedLeft + '%';
            draggedElement.style.top = constrainedTop + '%';

            // Update all lines connected to this element
            updateLines();
        }
    }
});

// Mouse up event
document.addEventListener('mouseup', function() {
    if (draggedElement) {
        draggedElement.style.cursor = 'pointer';
        draggedElement.style.zIndex = '10';

        if (isDragging) {
            savePositions();
        }

        // Reset drag state after a tiny delay to prevent click event
        setTimeout(() => {
            draggedElement = null;
            // Keep isDragging true briefly to prevent modal from opening
            setTimeout(() => {
                isDragging = false;
            }, 10);
        }, 10);
    }
});

// Close modal when X is clicked
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

// Draw evolution lines after page loads
window.addEventListener('load', function() {
    // Load saved positions first
    loadPositions();

    // Small delay to ensure all elements are positioned
    setTimeout(() => {
        drawEvolutionLines();
    }, 100);
});

// Redraw lines on window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Remove existing lines
        lines.forEach(line => {
            if (line && line.remove) {
                line.remove();
            }
        });
        lines.length = 0;
        drawEvolutionLines();
    }, 250);
});

function drawEvolutionLines() {
    // Clear existing lines
    lines.forEach(line => {
        if (line && line.remove) {
            line.remove();
        }
    });
    lines.length = 0;

    evolutionPaths.forEach(path => {
        const fromElement = document.getElementById(path.from);
        const toElement = document.getElementById(path.to);

        if (fromElement && toElement) {
            try {
                const line = new LeaderLine(
                    fromElement,
                    toElement,
                    {
                        color: 'rgba(100, 100, 100, 0.4)',
                        size: 3,
                        path: 'straight',
                        startPlug: 'disc',
                        endPlug: 'arrow2',
                        startPlugSize: 2,
                        endPlugSize: 2.5,
                        gradient: true,
                        startPlugColor: 'rgba(100, 100, 100, 0.6)',
                        endPlugColor: 'rgba(50, 50, 50, 0.8)'
                    }
                );
                lines.push(line);
            } catch (error) {
                console.warn('Could not draw line from', path.from, 'to', path.to, error);
            }
        }
    });
}

function updateLines() {
    // LeaderLine automatically updates when elements move
    lines.forEach(line => {
        if (line && line.position) {
            line.position();
        }
    });
}

// Add reset button functionality (optional - you can add a button in HTML)
window.resetPositions = function() {
    localStorage.removeItem('zeakPositions');
    location.reload();
};
