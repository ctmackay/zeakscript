# Zeak Evolution Tree

An interactive Pokemon-style evolution tree displaying nickname forms with arrows showing evolution paths, just like a Pokemon evolution chart.

## Features

- **Drag-and-drop positioning** - Click and drag any card to reposition it anywhere on the screen
- **Tree-based layout** with cards positioned across the screen showing evolution flow
- **Tier color-coding** - S (red), A (yellow), B (tan), C (green) for visual hierarchy
- **Animated arrow connections** showing evolution paths between forms (arrows update in real-time as you drag)
- **Clickable cards** that reveal Pokemon-style stats
- **Position persistence** - Your custom layout is automatically saved in the browser
- **Interactive hover effects** with scaling and glow
- **Responsive design** for mobile and desktop
- **Modal popup** showing character stats and special abilities
- **Reset button** - Click "Reset Layout" to restore the original positions

## How to Use

1. Open `index.html` in your web browser
2. **Drag cards** to arrange the tree however you like - arrows will follow automatically
3. Click on any character card to view their Pokemon-style stats
4. Hover over cards to see them grow and highlight
5. Your custom positions are saved automatically in the browser
6. Click "Reset Layout" button (top right) to restore original positions
7. Press ESC or click outside the modal to close stat popups

## Customization Guide

### Adding Your Own Photos

1. Place your photos in the same folder as `index.html`
2. In `index.html`, find each `<img src="placeholder.jpg">` tag
3. Replace `placeholder.jpg` with your photo filename

Example:
```html
<div id="flower" class="evolution-node tier-s" style="left: 20%; top: 20%;"
     data-name="Flower" ...>
    <img src="flower-photo.jpg" alt="Flower">
    <div class="nickname">Flower</div>
</div>
```

### Repositioning Cards

**Easy way (Drag and Drop):**
Simply click and drag any card to reposition it! The arrows automatically update as you move cards around. Your positions are saved automatically.

**Manual way (Edit HTML):**
Each card uses percentage-based positioning. To manually set positions:
1. Find the card's `<div>` in `index.html`
2. Adjust the `left` and `top` percentages in the style attribute

Example:
```html
<div id="flower" ... style="left: 30%; top: 25%;">
```
- `left`: 0% is far left, 100% is far right
- `top`: 0% is top of page, 100% is bottom

**Tip:** After dragging cards to create your perfect layout, you can copy the positions from localStorage and paste them into the HTML to make them permanent.

### Customizing Evolution Arrows

Edit the `evolutionPaths` array in `script.js`:

```javascript
const evolutionPaths = [
    { from: 'cuteBabe', to: 'lion' },  // Draws arrow from Cute Babe to Lion
    { from: 'lion', to: 'onion' },      // Draws arrow from Lion to Onion
    // Add more connections...
];
```

To change arrow appearance, modify the `LeaderLine` settings in `script.js`:
```javascript
new LeaderLine(fromElement, toElement, {
    color: 'rgba(100, 100, 100, 0.4)',  // Arrow color
    size: 3,                             // Arrow thickness
    path: 'straight',                    // 'straight', 'arc', or 'grid'
    startPlug: 'disc',                   // Start point style
    endPlug: 'arrow2',                   // End point style (arrowhead)
});
```

### Customizing Stats

Each evolution node has these data attributes:
- `data-name`: The nickname
- `data-hp`: HP stat (0-100)
- `data-attack`: Attack stat (0-100)
- `data-defense`: Defense stat (0-100)
- `data-speed`: Speed stat (0-100)
- `data-special`: Special ability description

### Changing Tier Colors

Edit `style.css` to change tier background colors:
```css
.tier-s { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); }
.tier-a { background: linear-gradient(135deg, #ffd93d 0%, #f6b93b 100%); }
.tier-b { background: linear-gradient(135deg, #ffe66d 0%, #ffd93d 100%); }
.tier-c { background: linear-gradient(135deg, #6bcf7f 0%, #4ecdc4 100%); }
```

### Adding New Cards

1. Copy an existing card's HTML structure
2. Give it a unique `id` (used for arrow connections)
3. Set its position with `left` and `top` percentages
4. Add appropriate tier class (`tier-s`, `tier-a`, `tier-b`, or `tier-c`)
5. Update stats and nickname
6. Add evolution connections in `script.js`

Example:
```html
<div id="newForm" class="evolution-node tier-a" style="left: 40%; top: 50%;"
     data-name="New Form" data-hp="85" data-attack="80"
     data-defense="75" data-speed="82" data-special="New Ability">
    <img src="newform.jpg" alt="New Form">
    <div class="nickname">New Form</div>
</div>
```

Then in `script.js`:
```javascript
const evolutionPaths = [
    // ... existing paths ...
    { from: 'previousForm', to: 'newForm' },
];
```

## File Structure

```
zeakscript/
├── index.html          # Main HTML with all character cards
├── style.css           # Styling and animations
├── script.js           # Interactive features and arrow drawing
├── README.md           # This file
└── [your-photos].jpg   # Your photo files
```

## Tips

- **Drag and drop**: Just click anywhere on a card (not on the image) and drag it to reposition. The arrows will follow in real-time!
- **Persistent layout**: Your custom card positions are automatically saved in the browser's localStorage, so your layout persists across page refreshes.
- **Reset anytime**: Click the "Reset Layout" button in the top right corner to restore the original positions.
- **Photo sizing**: Images are automatically cropped to 140x140px squares. Use square photos or photos with centered subjects for best results.
- **Card positioning**: Cards use percentage-based positioning so the layout scales with screen size.
- **Evolution paths**: You can create branching evolution paths where one form evolves into multiple forms, or multiple forms converge into one.
- **Arrow customization**: The Leader Line library supports many arrow styles - see [Leader Line documentation](https://anseki.github.io/leader-line/) for more options.
- **Browser storage**: Positions are stored per-browser. If you open the page in a different browser or in incognito mode, you'll see the default layout.

## Browser Compatibility

Works on all modern browsers:
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

Requires JavaScript to be enabled for arrow drawing and interactivity.

## Dependencies

- [Leader Line](https://anseki.github.io/leader-line/) v1.0.7 - for drawing evolution arrows (loaded from CDN)

Enjoy your personalized evolution tree!
