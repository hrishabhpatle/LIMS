<<<<<<< HEAD
# Electronics Lab Inventory Management System (LIMS)

A comprehensive web-based inventory management system designed specifically for electronics R&D and manufacturing laboratories. This system helps manage electronic components efficiently with real-time tracking, automated notifications, and detailed analytics.

## 🚀 Features

### Core Functionality
- **Component Management**: Add, view, edit, and search electronic components with detailed specifications
- **Inventory Tracking**: Real-time inward/outward movement tracking with user attribution and timestamps
- **Advanced Search & Filtering**: Multi-criteria search by name, part number, category, location, and quantity ranges
- **User Authentication**: Role-based access control (Admin/User) with secure login system
- **Automated Notifications**: Smart alerts for low stock and old inventory items
- **Interactive Dashboard**: Visual analytics with charts and key performance indicators

### Technical Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Instant data synchronization across all components
- **Data Persistence**: Local storage with automatic backup and recovery
- **Modern UI/UX**: Clean, intuitive interface with smooth animations and transitions

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for responsive styling and design system
- **React Router DOM** for client-side routing
- **Chart.js & React-ChartJS-2** for data visualization
- **Lucide React** for consistent iconography
- **Date-fns** for date manipulation and formatting

### Development Tools
- **Vite** for fast development and building
- **ESLint** for code quality and consistency
- **TypeScript** for static type checking
- **PostCSS & Autoprefixer** for CSS processing

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd electronics-lab-inventory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the application

### Build for Production

```bash
npm run build
npm run preview
```

## 👥 User Roles & Access

### Demo Accounts
The system comes with pre-configured demo accounts:

**Administrator Account**
- Username: `admin`
- Password: `admin123`
- Permissions: Full system access including user management, component CRUD operations, and system configuration

**Standard User Account**
- Username: `user`
- Password: `user123`
- Permissions: Component viewing, inventory transactions (inward/outward), and personal dashboard access

**Lab Technician Account**
- Username: `lab_tech`
- Password: `tech123`
- Permissions: Component viewing, adding new components, inventory transactions, and dashboard access

**Researcher Account**
- Username: `researcher`
- Password: `research123`
- Permissions: Component viewing, searching, inventory transactions, and dashboard access

**Manufacturing Engineer Account**
- Username: `mfg_engineer`
- Password: `mfg123`
- Permissions: Component viewing, inventory transactions, transaction history viewing, and dashboard access
### Role Permissions

| Feature | Admin | User | Lab Technician | Researcher | Manufacturing Engineer |
|---------|-------|------|----------------|------------|----------------------|
| View Components | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add New Components | ✅ | ❌ | ✅ | ❌ | ❌ |
| Edit Components | ✅ | ❌ | ❌ | ❌ | ❌ |
| Inward/Outward Transactions | ✅ | ✅ | ✅ | ✅ | ✅ |
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Transactions | ✅ | ❌ | ❌ | ❌ | ✅ |
| Dashboard Analytics | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ |

## 📊 System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   State Mgmt    │    │   Data Layer    │
│   (React/TS)    │◄──►│   (Context API) │◄──►│ (LocalStorage)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   Business      │    │   Data Models   │
│   & Routing     │    │   Logic         │    │   & Validation  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Models

#### Component Model
```typescript
interface Component {
  id: string;
  name: string;
  manufacturer: string;
  partNumber: string;
  description: string;
  quantity: number;
  location: string;
  unitPrice: number;
  datasheetLink: string;
  category: string;
  criticalLowThreshold: number;
  createdAt: string;
  lastOutwardDate?: string;
}
```

#### Transaction Model
```typescript
interface Transaction {
  id: string;
  componentId: string;
  type: 'inward' | 'outward';
  quantity: number;
  userId: string;
  userName: string;
  reason: string;
  project?: string;
  timestamp: string;
}
```

#### User Model
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'User';
  password: string;
  createdAt: string;
}
```

## 🔔 Notification System

### Automated Triggers
1. **Low Stock Alert**: Triggered when component quantity falls below the configured critical threshold
2. **Old Stock Alert**: Activated for components with no outward movement for 3+ months

### Notification Features
- Real-time in-app notifications
- Unread notification counter
- Mark as read/unread functionality
- Notification history and management
- Category-based notification filtering

## 📈 Dashboard Analytics

### Key Metrics
- Total component count and inventory value
- Low stock and old stock item counts
- Monthly inward/outward movement trends
- Component distribution by category

### Visualizations
- **Bar Charts**: Monthly component movement (inward vs outward)
- **Doughnut Charts**: Component distribution by category
- **Trend Analysis**: 6-month historical data visualization
- **Alert Summaries**: Critical items requiring attention

## 🔍 Search & Filtering

### Search Capabilities
- **Text Search**: Component name, part number, and manufacturer
- **Category Filtering**: Filter by component categories
- **Location Filtering**: Search by storage location/bin
- **Advanced Filters**: Quantity ranges and stock status

### Sorting Options
- Alphabetical (A-Z, Z-A)
- Quantity (Low to High, High to Low)
- Date Added (Newest, Oldest)
- Price (Low to High, High to Low)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (Single column layout, collapsible navigation)
- **Tablet**: 768px - 1024px (Two column layout, touch-optimized)
- **Desktop**: > 1024px (Multi-column layout, full feature set)

### Mobile Optimizations
- Touch-friendly interface elements
- Swipe gestures for navigation
- Optimized form layouts
- Compressed data views
- Fast loading and smooth animations

## 🔐 Security Features

### Authentication
- Secure password-based authentication
- Session management with automatic logout
- Role-based access control (RBAC)
- Protected routes and API endpoints

### Data Protection
- Input validation and sanitization
- XSS protection through React's built-in security
- Secure local storage implementation
- Error handling without information leakage

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN Deployment**: AWS CloudFront, Azure CDN
- **Container Deployment**: Docker with Nginx

### Environment Configuration
Create a `.env` file for environment-specific settings:
```env
VITE_APP_NAME=Electronics Lab Inventory
VITE_APP_VERSION=1.0.0
```

## 📝 Sample Data

The system comes pre-loaded with comprehensive sample data including:

### Component Categories (32 components total)
- **Resistors**: Various values and power ratings
- **Capacitors**: Ceramic, electrolytic, and tantalum types
- **Inductors**: Different inductance values
- **Diodes**: Rectifier and Zener diodes
- **Transistors**: BJT and MOSFET varieties
- **Integrated Circuits**: Timers, op-amps, and microcontrollers
- **Connectors**: Headers and specialized connectors
- **Sensors**: Temperature, humidity, and light sensors
- **Development Boards**: Arduino and Raspberry Pi
- **Switches/Buttons**: Tactile and slide switches
- **LEDs/Displays**: Various colors and display modules
- **Cables/Wires**: Jumper wires and hook-up wire
- **Mechanical Parts**: Screws and standoffs
- **Lab Supplies**: Solder and breadboards

## 🔧 Development

### Code Structure
```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Dashboard.tsx   # Analytics dashboard
│   ├── Components.tsx  # Component management
│   ├── Login.tsx       # Authentication
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── types/              # TypeScript definitions
│   └── index.ts        # Data models
├── utils/              # Utility functions
│   └── storage.ts      # Data persistence
└── App.tsx             # Main application
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Known Limitations

1. **Data Persistence**: Currently uses localStorage; production deployment would benefit from a backend database
2. **Real-time Collaboration**: No multi-user real-time updates (would require WebSocket implementation)
3. **File Uploads**: Datasheet uploads not implemented (currently supports links only)
4. **Advanced Reporting**: Limited to basic charts (could be extended with more detailed analytics)
5. **Backup/Restore**: No automated backup system (manual export/import would be beneficial)

## 🔮 Future Enhancements

### Short-term Improvements
- **Barcode Scanning**: QR/barcode integration for quick component lookup
- **Export Functionality**: CSV/Excel export for inventory reports
- **Advanced Search**: Fuzzy search and saved search queries
- **Bulk Operations**: Mass update and import capabilities

### Long-term Roadmap
- **Backend Integration**: REST API with database persistence
- **Real-time Collaboration**: Multi-user synchronization
- **Mobile App**: Native iOS/Android applications
- **Advanced Analytics**: Predictive analytics and trend forecasting
- **Integration APIs**: ERP and procurement system integration

## 📞 Support & Documentation

### Getting Help
- Check the README for common setup issues
- Review the code comments for implementation details
- Test with the provided demo accounts
- Verify all dependencies are correctly installed

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes with proper testing
4. Submit a pull request with detailed description

## 📄 License

This project is developed as a case study demonstration. Please refer to the specific license terms provided with the assignment.

---

**Developed for Electronics Lab Inventory Management System Case Study**

*This system demonstrates full-stack development capabilities including React/TypeScript frontend, responsive design, data visualization, and comprehensive inventory management features.*
=======
# LIMS
Electronics Lab Inventory  Management System 
>>>>>>> 43358c23968ae501dd29b438ca60d12a09b2ec74
