# Economic Pie Game

Welcome to the Economic Pie Game! This is an interactive web-based game designed to educate players about wealth distribution in the United States.

## Summary

The game presents players with a virtual pie representing $100 trillion of private wealth in America. The objective is to distribute slices of this pie among five different economic classes, from the "Poorest 20%" to the "Richest 20%".

Players drag and drop pie slices, each representing a certain trillion-dollar value, onto the plates corresponding to the economic classes. Once all the "wealth" has been distributed, players can submit their guess to see how it compares to the actual distribution of wealth. The game provides a score based on the accuracy of the guess and encourages players to learn more about wealth inequality.

## Game Features & User Actions

This application supports the following interactions:

*   **Distribute Wealth:** Drag pie slices (representing $5T or $10T) onto the plates of different economic classes.
*   **Modify Distribution:** Click or tap on a plate to remove the last added slice if you want to change your guess.
*   **Real-time Tracking:** The game tracks the remaining wealth to be distributed in real-time.
*   **Validation:** Users must distribute exactly $100 Trillion before the game calculates the score.
*   **Scoring System:**
    *   **Correct Guess:** If the distribution matches reality, a "Congrats" screen appears.
    *   **Incorrect Guess:** A score is calculated based on the deviation from the actual values.
*   **Post-Game Options:**
    *   **Show Answer:** Reveals the true wealth distribution in the US.
    *   **Share:** Allows users to share the game via native sharing (mobile) or clipboard copy (desktop).
    *   **Learn More:** Directs users to external resources to learn about inequality.
    *   **Play Again:** Resets the board to play from the beginning.

## How to Run Locally

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

    **Using VS Code Live Server:**
    If you are using Visual Studio Code, you can run the project with the "Live Server" extension:
    1. Install the **Live Server** extension.
    2. Right-click on `index.html` in the file explorer.
    3. Select **Open with Live Server**.

That's it! The game should now be running in your browser.

## Live Version

You can play the live version of the game here:

**[Link to live game]** - (https://your-live-url.com)

## Project Details

### Technologies Used

*   **HTML5**
*   **CSS3** (with Bootstrap for styling)
*   **JavaScript (ES6)**
*   **jQuery**
*   **Interact.js** for drag-and-drop functionality
*   **AngularJS** (Note: AngularJS is included but does not appear to be actively used in the core game logic.)

### File Structure

*   `index.html`: The landing page that explains the game.
*   `game.html`: The main page where the game is played.
*   `main.js`: Contains all the JavaScript logic for the game, including game state, user interactions, and scoring.
*   `style.css`: Custom styles for the game.
*   `images/`: Contains all the image assets for the pie, slices, and plates.

## How to Contribute

We welcome contributions to the Economic Pie Game! Whether you're a developer, a designer, or just have ideas for improvement, we'd love your input.

To contribute:

1.  **Fork the repository.**
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

*   **Project Maintainer:** [Your Name/Organization]
*   **Contact Email:** [your-email@example.com]
*   **Project Link:** [Link to the repository]

If you have any questions or encounter any issues, please open an issue on the GitHub repository.

## Operational Details (For Maintainers)

This section contains information useful for future maintainers or if the original developer is unavailable.

//TBD
*   **Hosting Provider:** [e.g., Netlify, Vercel, GitHub Pages, AWS S3] 
*   **Domain Registrar:** [Namecheap]
*   **DNS Management:** [Namecheap]
*   **Deployment Method:** [Manual upload]
*   **Analytics/Monitoring:** [TBD]
*   **Critical Accounts:** [WIX, Namecheap]