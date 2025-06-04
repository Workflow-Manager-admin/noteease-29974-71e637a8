# NoteEase - Simple Note Taking App

NoteEase is a clean, intuitive web application for managing personal notes. Built with Astro and JavaScript, it provides a straightforward way to create, organize, and find your notes.

## Features

- **Create Notes**: Add new notes with a title and detailed content
- **Edit Notes**: Update your existing notes easily
- **Delete Notes**: Remove notes you no longer need
- **Search**: Quickly find notes by searching through titles and content
- **Categorize**: Organize notes with categories for better management
- **Responsive Design**: Works well on both desktop and mobile devices
- **Light/Dark Theme**: Toggle between light and dark modes

## Technology Stack

- **Frontend Framework**: Astro
- **Language**: JavaScript (ES6+)
- **CSS**: Custom CSS with variables for theming
- **Storage**: Client-side storage (localStorage) for data persistence
- **Icons**: Font Awesome

## Project Structure

```
note_app/
├── public/               # Static assets
│   ├── favicon.svg       # App favicon
│   ├── styles/           # Global styles
│   └── scripts/          # Client-side JavaScript
├── src/
│   ├── components/       # UI components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Astro pages
│   └── styles/           # Component styles
├── astro.config.mjs      # Astro configuration
└── package.json          # Project dependencies
```

## Getting Started

1. Clone the repository
2. Navigate to the project directory: `cd noteease`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open your browser and navigate to `http://localhost:3000`

## Usage

- **Creating a Note**: Click the "+" button in the bottom right corner
- **Editing a Note**: Click the pencil icon on any note
- **Deleting a Note**: Click the trash icon on any note
- **Searching**: Type in the search box at the top of the page
- **Filtering by Category**: Click on a category chip to filter notes

## Color Scheme

- Primary: `#1976D2` (Blue)
- Secondary: `#FFFFFF` (White)
- Accent: `#FFC107` (Amber)

## License

This project is available as open source under the terms of the MIT License.
