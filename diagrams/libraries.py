from diagrams import Diagram, Cluster
from diagrams.onprem.compute import Server
from diagrams.onprem.client import Client
from diagrams.programming.language import TypeScript

# Scaffold the diagram with a visual flow using available diagram elements
with Diagram("Project Libraries and Interactions with Visual Flow", show=True, filename="project_libraries_interactions_flow"):

    # Define State Management and Schemas (Group Libraries related to state and schemas)
    with Cluster("State Management & Schemas"):
        zustand = Client("Zustand")  # State management
        zod = Client("Zod")  # Schema validation
        msal = Client("MSAL")  # Authentication

    # Define Visual Effects & Animations (Group Libraries related to UI and animations)
    with Cluster("Visual Effects & Animations"):
        framer_motion = Client("Framer Motion")  # Animation library
        emotion = Client("Emotion")  # CSS-in-JS for styling
        mui = Client("Material UI (MUI)")  # UI component library
        openseadragon = Client("OpenSeadragon")  # Image viewer with zoom


    # Define Routing and Core Frameworks (Group Libraries related to routing and core functionality)
    with Cluster("Routing & Core Frameworks"):
        vite = Server("Vite")  # Build tool and development server
        react = Server("React")  # UI library
        typescript = TypeScript("TypeScript")  # Static type checking
        tanstack_router = Client("TanStack Router")  # Type-safe router for React
        jsdom = Client("jsdom")  # Simulate DOM in Node.js (for testing)

    # Define Utility and Support Libraries (Group for miscellaneous utility libraries)
    with Cluster("Utility & Support"):
        killport = Client("kill-port")  # Utility for killing processes on ports
        axe = Client("Axe")  # Accessibility testing tool
        storybook = Client("Storybook")  # UI development environment
        lighthouse = Client("Lighthouse")  # Performance auditing tool

    with Cluster("Testing"):
        playwright = Client("Playwright")  # E2E testing framework
        vitest = Client("vitest") # testing framework
        msw = Client("MSW")  # Mock Service Worker (for API mocking)

    # Adding interactions between libraries (edges) with directional flows
    vite >> react  # Vite bundles React code
    vite >> typescript  # Vite uses TypeScript for build
    vite >> mui  # Vite compiles Material UI
    vite >> zustand  # Vite uses Zustand for state management
    vite >> tanstack_router  # Vite compiles TanStack Router for routing

    react >> mui  # React uses Material UI components
    react >> zustand  # React connects to Zustand for state management
    react >> tanstack_router  # React uses TanStack Router for navigation
    mui >> emotion  # Material UI is styled using Emotion
    zustand >> msal  # Zustand integrates with MSAL for authentication
    openseadragon >> zustand  # OpenSeadragon uses Zustand for managing image data
    msw >> playwright  # MSW is used for API mocking during Playwright tests
    playwright >> vitest  # Playwright interacts with Vitest for testing
    storybook >> react  # Storybook is used to develop React components
    storybook >> mui  # Storybook shows Material UI components
    storybook >> zustand  # Storybook can visualize Zustand-managed state
    storybook >> framer_motion  # Storybook shows Framer Motion animations
    msw >> playwright  # MSW is used to mock APIs during Playwright tests
    lighthouse >> playwright  # Lighthouse audits Playwright tests for performance
    framer_motion >> react  # Framer Motion adds animations to React components
    zod >> zustand  # Zustand can use Zod for schema validation of state
    axe >> storybook  # Axe runs accessibility checks on Storybook components
    msal >> msw  # MSAL interacts with MSW for mocking authentication APIs
