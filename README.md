# Future Tech Exhibition Website

A modern web application showcasing an AI-powered robot tour guide exhibition with admin dashboard for managing exhibition details and robot status.

## Features

### Public Home Page
- **Exhibition Information**: Showcase exhibition name, detailed description, location, and contact details
- **Robot Showcase**: Display the NOVA-X1 robot tour guide with specifications and features
- **Daily Events**: List of scheduled events and activities throughout the day
- **Exhibition Highlights**: Key features and attractions of the exhibition
- **Contact Information**: Complete contact details, operating hours, and location map

### Admin Dashboard (Protected)
- **Authentication**: Secure login with admin credentials (username: `admin`, password: `123`)
- **Robot Status Panel**: Real-time display of robot battery level, temperature, uptime, and current location
- **Analytics Dashboard**: 
  - Total visitor statistics
  - Page view metrics
  - Robot-guided tours counter
  - Questions answered count
- **Robot Activity Log**: Recent robot actions and events
- **Visitor Analytics**: 7-day visitor trend chart
- **Logout**: Secure logout functionality

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── admin/
│   │   └── page.tsx        # Admin dashboard
│   ├── globals.css         # Global styles
│   └── middleware.ts       # Authentication middleware
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── HeroSection.tsx     # Main hero section
│   ├── RobotCard.tsx       # Robot display card
│   ├── RobotStatusPanel.tsx # Robot status widget
│   ├── EventCard.tsx       # Event card component
│   ├── ContactSection.tsx  # Contact information section
│   └── StatCard.tsx        # Statistics widget
├── public/
│   ├── data/
│   │   ├── exhibition.json # Exhibition data
│   │   ├── robot.json      # Robot specifications
│   │   └── analytics.json  # Analytics data
│   └── images/
│       ├── exhibition.jpg  # Exhibition hero image
│       └── robot.jpg       # Robot image
└── README.md              # This file
```

## Data Files

### exhibition.json
Contains all exhibition information:
- Exhibition name and description
- Location and address
- Contact information (phone, email, website)
- Opening hours
- List of daily events
- Exhibition highlights

### robot.json
Contains robot specifications:
- Robot name and model
- Current status and battery level
- Hardware specifications
- Features list
- Activity logs
- Operating hours
- Maintenance schedule

### analytics.json
Contains visitor analytics:
- Total visits and unique visitors
- Page view statistics
- Daily visitor counts
- Traffic source breakdown
- Robot activity statistics

## Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the home page.

### Access Admin Dashboard

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `123`
3. You'll be redirected to the admin dashboard at `/admin`

## Authentication

The website uses a simple authentication system with:
- Hardcoded credentials (admin/123) for demo purposes
- HTTP-only cookies to store authentication tokens
- Middleware to protect `/admin/*` routes
- Automatic redirect to login page for unauthenticated access

## Customization

### Edit Exhibition Data
Modify `/public/data/exhibition.json` to update:
- Exhibition name and description
- Location and contact information
- Events schedule
- Exhibition highlights

### Edit Robot Data
Modify `/public/data/robot.json` to update:
- Robot specifications
- Features
- Status information

### Edit Analytics Data
Modify `/public/data/analytics.json` to update:
- Visitor statistics
- Traffic sources
- Robot performance metrics

### Update Styling
The website uses Tailwind CSS with custom design tokens in:
- `app/globals.css` - Custom CSS variables for colors
- `tailwind.config.ts` - Theme configuration

## Design Features

- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Modern Styling**: Gradient backgrounds, smooth transitions, and hover effects
- **Color Scheme**: Blue-purple primary color with teal accent
- **Typography**: Clear hierarchy with proper font sizing
- **Accessibility**: Semantic HTML and proper ARIA attributes

## Deployment

To deploy on Vercel:

```bash
# Push to GitHub
git push origin main

# Deploy via Vercel CLI
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Future Enhancements

- [ ] Database integration for persistent data storage
- [ ] Real-time robot tracking with map visualization
- [ ] User booking system for robot-guided tours
- [ ] Email notifications for events
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Video tour integration
- [ ] Visitor feedback system

## License

This project is provided as-is for the Future Tech Exhibition.

## Support

For support or questions, contact:
- Email: info@futuretech-exhibition.vn
- Phone: +84 24 3576 0000
