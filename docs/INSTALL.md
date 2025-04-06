# Setup Instructions

## System Requirements

- Node.js v14+ (tested on v16+)
- npm v6+ or Yarn
- Git

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/my-react-app.git
   ```
2. Navigate to the project directory and install dependencies:
   ```bash
    cd search-site
   npm i
    ```
# Scripts
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser and go to `http://localhost:5173` to see the app in action.
4. Build the project for production:
   ```bash
   npm run build
   ```
   This will create an optimized build in the `dist` directory.
5. Preview the production build locally:
   ```bash
   npm run preview
   ```
   This will start a local server to preview the production build. Open your browser and go to `http://localhost:4173` to see the built app.
6. Run tests:
   ```bash
   npm run test
   ```
   This will execute the tests defined in your project. Make sure to write tests for your components and features to ensure code quality.
   ```
7. Lint the code:
   ```bash