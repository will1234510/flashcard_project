# Nina's Flashcards

A modern, high-performance web application designed for efficient studying and knowledge retention. Nina's Flashcards provides a streamlined, distraction-free interface for creating, organizing, and reviewing flashcards with support for both text and rich media.

## 🚀 Features

### Core Functionality
*   **Smart Folder Organization**: Create and manage multiple study sets with a unique, persistent folder system.
*   **Rich Media Support**: Seamlessly integrate images into both terms and definitions via copy-paste functionality.
*   **Interactive Study Mode**: Fluid, 3D-animated flip cards with keyboard and on-screen navigation controls.
*   **Responsive Design**: Fully responsive interface that adapts to desktop, tablet, and mobile devices.
*   **Persistent Storage**: Auto-saving mechanism using Local Storage ensures data is never lost between sessions.

### User Experience (UX)
*   **Ultra-Dark Theme**: A carefully crafted, high-contrast dark mode designed to reduce eye strain during long study sessions.
*   **Masonry Layout**: Aesthetic, Pinterest-style grid layout for efficiently browsing large collections of terms.
*   **Focus Mode**: Collapsible sidebar to maximize screen real estate for focused studying.
*   **Intuitive Controls**: Simple, accessible controls for adding, editing, and deleting content.

## 🛠️ Tech Stack

This project leverages a modern frontend stack to deliver a fast and responsive user experience.

### Core Frameworks
*   **React.js**: A JavaScript library for building user interfaces, utilized for its component-based architecture and efficient virtual DOM.
*   **React Router v6**: Implements dynamic, client-side routing for a seamless single-page application (SPA) experience.

### Styling & UI
*   **Tailwind CSS**: A utility-first CSS framework used for rapid UI development, ensuring consistent design tokens and responsive behavior.
*   **CSS3**: Custom animations and 3D transforms (preserve-3d, backface-visibility) used for the card flip interactions.

### State Management & Storage
*   **React Context API**: Centralized state management for handling global data like folders and flashcard sets.
*   **Local Storage API**: Client-side persistence layer to store user data directly in the browser.

### Development Tools
*   **Git**: Version control system for tracking changes and collaboration.
*   **npm**: Package manager for dependency handling.

## 📦 Installation & Setup

To run this project locally on your machine:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ninas-flashcards.git
    cd ninas-flashcards
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm start
    ```
    The application will launch automatically at `http://localhost:3000`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
