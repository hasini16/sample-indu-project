# Company Portal - React Application

A comprehensive React application with user authentication, form management, and role-based access control. The application features three types of users: regular users, CSC (Customer Service Center), and lab technicians, each with their own dashboard and functionality.

## Features

### 🎯 Authentication System
- **Multi-role login system** (Users, CSC, Lab Technicians)
- **User registration** for new users
- **Session persistence** with localStorage
- **Role-based routing** and access control

### 👥 User Dashboard
- **Form creation** with comprehensive input fields
- **Form submission tracking** with status updates
- **PDF download** for completed forms
- **Real-time form status** (submitted, re-submitted, under process, action needed, completed)

### 🛠️ CSC Dashboard
- **Form management** for all submitted forms
- **Form editing** capabilities with status updates
- **Pending and completed form tables**
- **Modal view** for detailed form inspection
- **Status updates** and comments system

### 🔬 Lab Technician Dashboard
- **Dedicated workspace** for laboratory technicians
- **Equipment management** interface
- **Quality control** features
- **System status** monitoring

### 🎨 User Interface
- **Responsive design** with Tailwind CSS
- **Modern UI components** with Lucide React icons
- **Interactive forms** with validation
- **Loading states** and error handling
- **Professional landing page** with company information

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Database**: LocalForage (browser-based storage)
- **PDF Generation**: jsPDF with html2canvas
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
essjay/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Navbar.tsx       # Navigation component
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── pages/               # Application pages
│   │   ├── LandingPage.tsx  # Home page with login options
│   │   ├── LoginPage.tsx    # Login for all user types
│   │   ├── SignupPage.tsx   # User registration
│   │   ├── UserDashboard.tsx    # User dashboard
│   │   ├── CreateFormPage.tsx   # Form creation
│   │   ├── CSCDashboard.tsx     # CSC management interface
│   │   ├── EditFormPage.tsx     # Form editing for CSC
│   │   └── TechnicianDashboard.tsx  # Technician interface
│   ├── services/            # External services
│   │   └── database.ts      # LocalForage database service
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Application types
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── dist/                    # Build output
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd essjay
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Usage

### Default Login Credentials

The application comes with pre-configured demo accounts:

#### User Account
- **Username**: `testuser`
- **Password**: `test123`

#### CSC Account
- **Username**: `csc_admin`
- **Password**: `admin123`

#### Lab Technician Account
- **Username**: `tech_admin`
- **Password**: `tech123`

### Application Flow

1. **Landing Page**: Choose your user type and access the appropriate login
2. **Authentication**: Login with credentials or sign up as a new user
3. **Dashboard**: Access role-specific features and functionality
4. **Form Management**: Create, view, edit, and track forms based on your role
5. **PDF Generation**: Download completed forms as PDF documents

### User Roles and Permissions

#### Regular Users
- Create and submit service request forms
- View their own form submissions
- Track form status and comments
- Download completed forms as PDFs

#### CSC (Customer Service Center)
- View all submitted forms from users
- Edit form details and update status
- Add comments and manage form workflow
- Access both pending and completed forms

#### Lab Technicians
- Access dedicated laboratory workspace
- Monitor system and equipment status
- Coordinate with research teams

## Form Features

### Personal Information
- Full name, email, phone number
- Complete address
- Optional date of birth and ID number

### Service Details
- Service type selection (Technical Support, Laboratory Testing, etc.)
- Detailed description with validation
- Urgency level (Low, Medium, High)

### Additional Information
- Optional notes and requirements
- Communication preferences

### Status Tracking
- **Submitted**: Initial form submission
- **Re-submitted**: Form resubmitted after changes
- **Under Process**: Form being processed
- **Action Needed**: Requires user action
- **Completed**: Form processing finished

## Database

The application uses **LocalForage** for client-side storage, providing:
- **Persistent storage** across browser sessions
- **Multiple stores** for different data types (users, forms, etc.)
- **Asynchronous operations** with Promise-based API
- **Cross-browser compatibility**

### Data Structure

- **Users**: Regular user accounts with authentication
- **CSC**: Customer service representative accounts
- **Technicians**: Laboratory technician accounts
- **Forms**: Service request forms with full metadata

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project follows modern React patterns:
- Functional components with hooks
- TypeScript for type safety
- Custom hooks for state management
- Context API for global state
- Clean component architecture

## Security

- **Client-side authentication** (demo purposes)
- **Session persistence** with localStorage
- **Role-based access control**
- **Input validation** on forms
- **Type safety** with TypeScript

## Browser Support

- Modern browsers supporting ES6+
- Chrome, Firefox, Safari, Edge
- Mobile browsers (responsive design)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please contact the development team or create an issue in the repository.
