# Personal Portfolio Website

A sophisticated personal portfolio website showcasing advanced CSS techniques and modern web design principles.

## Features

- **Deep CSS Knowledge**: Utilizes advanced CSS features including:
  - CSS Custom Properties (Variables)
  - Complex Grid and Flexbox layouts
  - CSS Transforms (3D transforms, rotations, skews)
  - Advanced animations and transitions
  - Clip-path and geometric shapes
  - Pseudo-elements and pseudo-classes
  - CSS Filters and effects
  - Aspect ratios and container queries concepts

- **Sections**:
  - Personal Bio
  - Projects showcase
  - Tech Stack
  - Hobbies & Interests
  - Contact form

- **Interactive Elements**:
  - Smooth scroll navigation
  - Custom cursor trail
  - Scroll-triggered animations
  - Hover effects and micro-interactions
  - Responsive mobile menu

## Getting Started

### Prerequisites

- Node.js and npm (recommended for dev server, but optional)
- Or any static file server (Python, npx http-server, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/eeshan-bhatia/eeshb.com.git
cd eeshb.com
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit the URL shown in the terminal (typically `http://localhost:5173`)

### Alternative: Static Server

If you prefer not to use npm, you can also serve the site with:
```bash
# Using Python (if installed)
python -m http.server 8000

# Or using Node.js http-server (if installed)
npx http-server

# Or simply double-click index.html to open in your default browser
```

## Customization

### Personal Information

Edit `index.html` to update:
- Name and title in the hero section
- Bio content in the bio section
- Project details in the projects section
- Tech stack items
- Hobbies and interests
- Contact information and social links

### Colors

The color scheme can be customized in `styles.css` by modifying the CSS custom properties in the `:root` selector:

```css
:root {
    --color-primary: #00d4aa;    /* Main accent color */
    --color-secondary: #ff6b35;  /* Secondary accent */
    --color-accent: #00a8cc;     /* Additional accent */
    --color-dark: #0a0e27;       /* Main background */
    /* ... */
}
```

### Content Updates

- Replace project placeholders with your actual projects
- Update tech stack icons and names
- Customize hobbies section with your interests
- Update contact links (email, GitHub, LinkedIn, Twitter)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Design Philosophy

This portfolio avoids:
- CSS frameworks (Tailwind, Bootstrap, etc.)
- Component libraries (shadCN, etc.)
- Purple color palette
- Gradients (minimal use)
- Generic templates

Instead, it focuses on:
- Pure, custom CSS implementations
- Unique geometric and architectural design
- Advanced CSS techniques and animations
- Sophisticated interactions
- Clean, modern aesthetics

## File Structure

```
eeshb.com/
├── index.html      # Main HTML structure
├── styles.css      # Advanced CSS styling
├── script.js       # JavaScript interactions
├── README.md       # This file
└── LICENSE         # MIT License
```

## License

MIT License - See LICENSE file for details

## Author

Eeshan Bhatia

---

Built with pure CSS mastery ✨

