# Economic Pie Game
[![Test Status](https://github.com/trigal2012/EconomicPie/actions/workflows/test.yml/badge.svg)](https://github.com/trigal2012/EconomicPie/actions/workflows/test.yml)

Welcome to the Economic Pie Game! This is an interactive web-based game designed to educate players about wealth distribution in the United States.

## Summary

The game, called Economic Pie, challenges players to redistribute $100 trillion of private wealth, initially divided equally among five economic classes, to reflect their understanding of wealth distribution in the United States.

Players redistribute wealth by dragging from one plate to another, selecting amounts to move. Once satisfied with their distribution, players submit their guess and receive a score indicating their accuracy, followed by an opportunity to test their knowledge with a bonus question.

## Key Features and Gameplay

This application supports the following interactions:

*   **Redistribute Wealth:** Drag from one plate to another to open a transfer menu. Select an amount to move ($2.5T, $5T, $10T, or All).
*   **Dynamic Visuals:** Pie charts on the plates grow and shrink in real-time as wealth is moved.
*   **Scoring System:**
    *   **Correct Guess:** If the distribution matches reality, a "Congrats" screen appears.
    *   **Incorrect Guess:** A score is calculated based on the deviation from the actual values.
*   **Reveal & Learn:**
    *   **Show Answer:** An animation transitions the user's guess to the actual distribution.
    *   **Statistics:** A modal displays key facts about wealth inequality after the reveal.
    *   **Share:** Users can share the game link or the specific wealth statistics.
    *   **Learn More:** Directs users to external resources.
*   **Responsive Design:** Optimized layouts for Mobile Portrait, Mobile Landscape, and Desktop.
*   **Bonus Question:** A challenge after submitting the distribution for extra engagement.
*   **Wealth History Chart:** Interactive chart visualizing wealth distribution trends over the past decades.

## How to Run the Game Locally

To run this project on your local machine, you don't need any complex build steps. You just need a modern web browser.

1.  **Clone the repository or download the source code.**
    ```bash
    git clone <your-repository-url>
    ```
    Or simply download the ZIP file and extract it.

2.  **Navigate to the project directory.**
    ```bash
    cd EconomicPie
    ```

3.  **Open `index.html` in your web browser.**
    You can typically do this by double-clicking the `index.html` file, or right-clicking and selecting "Open with" your favorite browser.
    You can access the Economic Pie game and start playing.

    **Using VS Code Live Server:**
    If you are using Visual Studio Code, you can run the project with the "Live Server" extension:
    1. Install the **Live Server** extension.
    2. Right-click on `index.html` in the file explorer.
    3. Select **Open with Live Server**.
That's it! The game should now be running in your browser.

## Live Version


You can play the live version of the game here:

**[Link to live game]** - (https://economicpie.online)

## Project Details

### Technologies Used

*   **HTML5**
*   **CSS3** (with Bootstrap for styling)
*   **CSS Grid & Flexbox** for custom responsive layouts
*   **JavaScript (ES6)**
*   **jQuery**
*   **Interact.js** for drag-and-drop functionality
*   **FontAwesome** for icons
*   **Google Fonts** (Poppins)

### File Structure

*   `index.html`: The main entry point containing the game interface and templates.
*   `main.js`: Contains all the JavaScript logic for game state, user interactions, animations, and scoring.
*   `style.css`: Custom styles, including responsive layouts and glassmorphism effects.
*   `data.js`: JSON data defining the economic classes and initial values.
*   `images/`: Contains all the image assets for the pie, slices, and plates.

## How to Contribute

We welcome contributions to the Economic Pie Game! Whether you're a developer, a designer, or just have ideas for improvement, we'd love your input.

To contribute:

1. **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature-name`.
3.  **Make your changes.**
4.  **Commit your changes:** `git commit -m 'Add some feature'`.
5.  **Push to the branch:** `git push origin feature-name`.
6.  **Create a new Pull Request.**

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

This is an open-source project. You are free to use, modify, and distribute it as you see fit, as long as you include the original copyright and license notice in any copy of the software/source.

## Contact & Support

*   **Project Maintainer:** [Organization Name]
*   **Contact Email:** [your-email@example.com]

If you have any questions or encounter any issues, please open an issue on the GitHub repository.

## Test Plan (Manual QA)

Use this checklist to verify functionality before releasing updates. Copy this into a Pull Request description to track progress.

### 1. Smoke Test (Critical Path)
- [ ] **Load Index:** Open `index.html`. Verify "Play Now" button is visible.
- [ ] **Start Game:** Click "Start Game" on the modal. Verify game board is interactive.
- [ ] **Game Load:** Verify 5 Plates are visible with 20% ($20T) each.
- [ ] **Interaction:** Drag from one plate to another. Verify menu appears. Select amount. Verify plates update.
- [ ] **Reset:** Click Reset button. Verify game resets to 20/20/20/20/20.

### 2. Functional Testing
- [ ] **F01 Drag & Drop:** Drag from Plate A to Plate B. Ghost image follows cursor.
- [ ] **F02 Move Menu:** Drop on Plate B. Menu shows valid options (2.5, 5, 10, All).
- [ ] **F04 Double Tap:** Double tap a plate. It becomes 100 ($100T), others become 0.
- [ ] **F05 Submit:** Button enables after first move. Click Submit.
- [ ] **F06 Win State:** Distribute 0, 0, 5, 5, 90. Verify "Congrats!" overlay.
- [ ] **F07 Loss State:** Distribute evenly. Verify score overlay.
- [ ] **F08 Show Answer:** Click "Show Answer". Board locks. Plates show 0, 0, 5, 5, 90. "Play Again" appears.
- [ ] **F09 Undo:** Click plate with slices. Overlay opens showing slices.
- [ ] **F10 Remove Slice:** Click slice in overlay. Slice returns to pile. Plate value decreases.

### 3. Negative Testing
- [ ] **N01 Drop in Void:** Drag plate handle and drop on background. Ghost disappears, and has no change.
- [ ] **N02 Drop on Self:** Drag plate handle and drop on same plate. No change.
- [ ] **N03 Cancel Move:** Drag, Drop, then click Cancel in menu, and it will have no change.

## Operational Details (For Maintainers)

This section contains information useful for future maintainers or if the original developer is unavailable.

//TBD
*   **Hosting Provider:** [e.g., Netlify, Vercel, GitHub Pages, AWS S3] 
*   **Domain Registrar:** [Namecheap]
*   **DNS Management:** [Namecheap]
*   **Deployment Method:** [Manual upload]
*   **Analytics/Monitoring:** [TBD]
*   **Critical Accounts:** [WIX, Namecheap]