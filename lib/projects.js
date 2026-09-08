// All portfolio content lives in this one file on purpose — edit the text
// here and it flows through to both the homepage and the project pages
// without touching any layout/markup code.

export const profile = {
  name: 'Martyn Orchard',
  role: 'Software Engineer',
  tagline:
    'Software Engineering graduate who builds working tools for real businesses — from embedded telemetry hardware to internal forecasting systems.',
  location: 'Wellington / Palmerston North, New Zealand',
  email: 'martorchard@gmail.com',
  github: 'https://github.com/MartynOrchard1',
  linkedin: 'https://www.linkedin.com/in/martyn-orchard-61aa1b25a/',
  summary: [
    'Bachelor of Information and Communications Technology (BICT), majoring in Software Engineering, UCOL — graduated 2026.',
    'Currently a Purchasing Assistant at Steelfort Engineering, where I built and maintain an internal Python/Streamlit application used daily to forecast and manage purchasing across 10,000+ spare parts.',
    'Comfortable across the stack: React/Next.js and Vue on the frontend, Python (Django) and Node/Express on the backend, C#/.NET on desktop, and embedded C/C++ on microcontrollers.',
  ],
};

export const skills = {
  Languages: ['C#', 'Python', 'TypeScript', 'JavaScript', 'PHP', 'SQL', 'C/C++ (embedded)'],
  'Frameworks & Libraries': [
    'React',
    'Next.js',
    'Vue.js',
    'Node.js / Express',
    'Django / DRF',
    '.NET / .NET MAUI',
    'WPF',
  ],
  'Tools & Platforms': ['Streamlit', 'WordPress', 'Docker', 'REST APIs', 'Git/GitHub'],
  'Embedded & Hardware': ['ESP32', 'ESP-NOW', 'CAN-bus telemetry', 'GPS integration (u-blox)', 'Arduino'],
};

// The featured project gets its own deep-dive page at /projects/data-logger.
export const featuredProject = {
  slug: 'data-logger',
  title: 'BMW S1000RR Motorsport Telemetry & Lap Analysis System',
  short: 'racing-data-logger',
  blurb:
    'A ground-up hardware and software telemetry system for a 2015 BMW S1000RR: a dual-ESP32 data logger that captures OBD/CAN telemetry and GPS in real time, plus a Streamlit analysis application built to read the logged sessions like a professional motorsport data tool.',
  tags: ['Embedded Systems', 'ESP32', 'GPS / GNSS', 'Python', 'Streamlit', 'Data Analysis'],
};

// Everything else shows up as a card on the homepage. Add `href` to link out
// to a live site or GitHub repo once one exists for that project.
export const otherProjects = [
  {
    title: 'Steelfort Stock Forecasting & Purchasing System',
    period: '2026 — in active use',
    blurb:
      'An internal Python/Streamlit application that replaced a purchasing process previously split across four people. Merges inventory, forecast and supplier data to recommend what to order, review, or leave alone across 10,000+ parts, with a reasoned explanation attached to every recommendation.',
    tags: ['Python', 'Streamlit', 'Pandas', 'Forecasting'],
    href: '',
  },
  {
    title: 'RowanIKM Website & Booking Platform',
    period: '2026 — industry project',
    blurb:
      'A client-facing WordPress rebuild for an information-management consultancy ahead of a service launch: responsive design, SEO and security groundwork, service/package pages, consultation requests, and a blog/insights area, delivered against a 12-week client timeline.',
    tags: ['WordPress', 'Client Project', 'SEO'],
    href: '',
  },
  {
    title: 'Welsh Dragon Bar — Quiz Night Management System',
    period: 'Full-stack client project',
    blurb:
      'Sole developer on a full-stack quiz-night system for a Wellington bar: public interface plus an admin backend built into the site so staff manage questions without touching phpMyAdmin — auth, hashed passwords, and bulk CSV import/export of question sets.',
    tags: ['Node.js', 'Express', 'MySQL', 'Vue.js'],
    href: '',
  },
  {
    title: 'Nutrition Analysis Application',
    period: 'Group project — Scrum Master',
    blurb:
      'A Next.js/TypeScript app for logging dietary intake against recommended nutritional targets, run as a proper Scrum project: two-week sprints, a GitHub-board backlog, sprint demos, and a written testing strategy.',
    tags: ['Next.js', 'TypeScript', 'React', 'Scrum'],
    href: '',
  },
  {
    title: 'IoT Temperature Sensor Monitoring System',
    period: 'UCOL group project — graded A',
    blurb:
      'A simulated sensor-to-dashboard pipeline built with Python, Django and Django Channels for live updates, backed by automated tests. Stack choices were adapted mid-project to bring a teammate across from Python smoothly.',
    tags: ['Python', 'Django', 'Django Channels', 'Testing'],
    href: '',
  },
  {
    title: 'Movie Library Management System',
    period: 'Advanced Programming assignment',
    blurb:
      'A C# WPF desktop app built around hand-written data structures rather than off-the-shelf collections — a custom queue drives the waiting-list feature, alongside add/search/sort/borrow/return flows and a full code-walkthrough presentation.',
    tags: ['C#', 'WPF', 'Data Structures'],
    href: '',
  },
  {
    title: 'TuckBox',
    period: '.NET MAUI app',
    blurb:
      'A cross-platform .NET MAUI app with Google OAuth sign-in, including a custom OAuth redirect bridge hosted on GitHub Pages to work around MAUI’s mobile redirect limitations.',
    tags: ['.NET MAUI', 'OAuth', 'C#'],
    href: '',
  },
];
