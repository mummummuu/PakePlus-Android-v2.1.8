# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**班主任模拟器** (Class Teacher Simulator) is a web-based simulation strategy game where players act as a high school class teacher managing a class through three years, culminating in the college entrance exam (Gaokao). The game is implemented as a pure frontend static web application with no build system or dependencies.

## Common Development Tasks

### Running the Game

Since this is a static web application, you can run it in several ways:

1. **Direct file opening** (some browser restrictions may apply):
   ```
   open index.html
   ```

2. **Python HTTP server** (recommended for full functionality):
   ```
   python -m http.server 8000
   ```
   Then visit http://localhost:8000

3. **Node.js HTTP server**:
   ```
   npx http-server -p 8000
   ```
   Then visit http://localhost:8000

### Testing

No automated test suite exists. Manual testing in the browser is required. The game uses browser developer tools for debugging.

### Code Style

- **HTML**: Standard HTML5 with Chinese language (`lang="zh-CN"`)
- **CSS**: Modern CSS3 with Flexbox, Grid, animations, and responsive design
- **JavaScript**: ES6+ with modular organization, no external libraries
- **Naming**: Uses camelCase for JavaScript, kebab-case for CSS classes

## Architecture

### File Structure

- **`index.html`** (≈300 lines): Main menu, game interface, dialogs, and end screens
- **`game.js`** (≈3263 lines): Complete game logic, data models, UI rendering, and event handling
- **`style.css`** (≈2286 lines): All styling, animations, and responsive layouts
- **`core.py`** (≈2191 lines): Original Python implementation (reference only)
- **`name_generate.py`** (≈50 lines): Python name generation (reference only)
- **`tip.txt`**: Original project requirements document
- **`AGENTS.md`**: Comprehensive project documentation (in Chinese)

### Game Systems

The game consists of several interconnected systems:

1. **Student Attribute System**: Each student has learning capacity (`learnCap`), energy (`energy`), enthusiasm (`enthusiasm`), IQ, and character traits
2. **Relationship System**: Six relationship levels (Normal → Better → Friend → Loving → Disliking → Hating) that affect student stats
3. **Teacher Operations**: Counseling, treating students, seat management, organizing activities, holding class meetings, instigating conflicts, buying medicine, expelling students
4. **Exam System**: Mid-term and final exams each semester, plus the final Gaokao
5. **Time Progression**: 6 semesters × 10 weeks = 60 weeks total
6. **UI Layout**: Status bar (top), log panel (left), seating chart (center), control console (right), info display (bottom-right)

### Key Code Locations

- **Constants configuration**: Top of `game.js` (lines 1-200) - all game balance parameters
- **Enums**: `GameMode`, `ClassType`, `Subject`, `Relationship`, `Gender`, `Character` in `game.js`
- **Data models**: `Student`, `Teacher`, `Class`, `University`, `ExamLog` classes in `game.js`
- **University database**: `getUniversityDatabase()` function (contains 985/211/First-tier university data)
- **Name generation**: `generateName(gender)` function with Chinese name pools
- **Main game loop**: `nextWeek()` function handles weekly progression
- **UI rendering**: `renderSeats()`, `renderStatusBar()`, `renderLog()`, `renderInfoPanel()` functions
- **Event handlers**: Button click handlers in the console section

### Game Balance Tuning

All game balance constants are at the top of `game.js`. Key parameters to adjust:

- `SEMESTER_LENGTH`: Weeks per semester (default 10)
- `STUDENT_ENERGY_RECOVER_NORMAL`: Weekly energy recovery (default 2.0)
- `SCORE_WEIGHT_CAPACITY`: Learning capacity weight in score calculation (default 0.60)
- `RELATION_NEIGHBOR_FRIEND`: Neighbor friendship improvement probability (default 0.03)
- `LEAVE_REQUEST_PROB`: Weekly probability of leave request (default 0.1)

### Adding Features

- **New subjects**: Add to `Subject` enum and update `Student.validSubjects`
- **New universities**: Add `University` objects to `getUniversityDatabase()`
- **New teacher operations**: Add button to console, implement handler function
- **Styling changes**: All CSS is in `style.css` with clear section comments

## Development Notes

### Browser Compatibility

Uses modern ES6+ features and CSS3. Compatible with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

No Internet Explorer support.

### Performance Considerations

- Large classes (>80 students) may have rendering performance issues in the seating chart
- Browser localStorage has ~5MB limit for game saves
- Mobile touch interactions are supported but desktop-optimized

### Known Limitations

1. **Large class performance**: Seat rendering slows with >80 students
2. **Local storage limits**: Large saves may exceed browser quota
3. **Mobile experience**: Functional but not optimized for touch

### Reference Documentation

- **`AGENTS.md`**: Complete project documentation in Chinese
- **`tip.txt`**: Original requirements for the web port
- **`core.py`**: Original Python implementation for reference

## Workflow Tips

1. **Quick testing**: Use Python's HTTP server for full functionality
2. **Debugging**: Use browser DevTools to inspect game state in `window.currentClass`
3. **Balance adjustments**: Modify constants at the top of `game.js` and refresh
4. **UI changes**: CSS is well-organized with section comments for easy navigation
5. **Adding events**: Follow existing patterns in `game.js` event handlers