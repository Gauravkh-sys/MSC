# Modern Study Center Dashboard

A modern, responsive Angular 20 application for managing a study center. Built with standalone components, Angular signals, and Tailwind CSS.

## Features

- **Dashboard**: Overview of statistics, recent enrollments, and class schedules
- **Student Management**: Complete student directory with status tracking
- **Course Management**: Browse available courses with instructor details and fees
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Modern Angular**: Uses Angular 20 with:
  - Standalone components
  - Angular signals for reactive state
  - Computed properties
  - Control flow syntax (@if, @for)

## Project Structure

```
MSC/
├── src/
│   ├── app/
│   │   └── app.component.ts        # Main application component
│   ├── environments/
│   │   ├── environment.ts          # Development environment
│   │   └── environment.prod.ts     # Production environment
│   ├── index.html                  # Root HTML file
│   ├── main.ts                     # Application bootstrap
│   └── styles.css                  # Global styles with Tailwind
├── angular.json                    # Angular CLI configuration
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── postcss.config.js               # PostCSS configuration
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200/`

## Available Scripts

- `npm start` - Run the development server
- `npm run build` - Build the project for production
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint

## Technology Stack

- **Angular 20**: Modern web framework
- **TypeScript**: Typed JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **RxJS**: Reactive programming library
- **PostCSS**: CSS transformation tool

## Component Architecture

The application uses a single standalone component (`AppComponent`) with:

### Interfaces
- `Student`: Student enrollment data
- `Course`: Course information
- `Batch`: Class batch details

### Signals
- `activeTab`: Current navigation tab
- `stats`: Dashboard statistics
- `allStudents`: Student list
- `courses`: Course catalog
- `batches`: Class schedules

### Computed Properties
- `recentStudents`: Latest 5 student enrollments

## Navigation

- **Dashboard**: View statistics and recent activities
- **Students**: Manage student directory
- **Grades**: Browse course offerings
- **Classes**: View class schedules
- **Fees**: Financial management (UI ready)

## Styling

The project uses Tailwind CSS for styling with a custom color scheme featuring:
- Slate colors for neutral tones
- Indigo as the primary brand color
- Responsive breakpoints (sm, md, lg, xl)
- Custom scrollbar styling

## Browser Support

- Chrome/Chromium
- Firefox
- Safari
- Edge

## License

MIT

## Author

Created with Angular 20 and modern web technologies
