# Restaurant Inventory Management System - Design Prototype

This is a **design prototype** demonstrating the UI patterns, interactions, and user experience for a restaurant inventory management system. It's built with Next.js 15.5.0, TypeScript, Tailwind CSS v4, and Radix UI components.

## 🎯 Purpose

This prototype serves as a **design reference** for frontend developers to understand:
- UI component patterns and interactions
- User flow and navigation
- Form handling and validation
- Data display and filtering
- Responsive design implementation

## 🏗️ Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Turbopack

### Project Structure
```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── ui/                # Reusable UI components
│   └── features/          # Feature-specific components
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── lib/                   # Third-party library configurations
```

## 🎨 Design System

### Color Scheme
- **Primary Brand**: `#D8550D` (Orange) with hover `#A8420A`
- **Background**: White (`bg-white`)
- **Text**: Gray scale (`text-gray-900`, `text-gray-600`, `text-gray-500`)
- **Borders**: Light gray (`border-gray-200`, `border-gray-300`)
- **Status Colors**:
  - Success: `bg-green-100 text-green-800`
  - Warning: `bg-orange-100 text-orange-800`
  - Error: `bg-red-100 text-red-800`
  - Info: `bg-blue-100 text-blue-800`

### Typography
- **Font Family**: Inter (`font-inter`)
- **Headings**: `text-2xl font-bold text-gray-900` (H1), `text-xl font-semibold text-gray-900` (H2)
- **Body Text**: `text-sm text-gray-600`
- **Labels**: `text-sm font-medium`

### Currency & Number Formatting
- **Nepali Currency**: रु (Nepali Rupees) - `रु 1,234.56`
- **Indian Numbering**: 1,00,000 (1 Lakh), 1,00,00,000 (1 Crore)
- **Implementation**: Use `formatNepaliCurrency(amount)` utility function

## 🔧 Key Interaction Patterns

### 1. Form Patterns

#### Slide-out Forms (Sheet Component)
**Use Case**: Creation and editing forms
**Pattern**: Right-side slide-out with consistent structure

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="px-6 flex-1">
        <SheetHeader className="pl-0">
          <SheetTitle>Form Title</SheetTitle>
          <SheetDescription>Form description</SheetDescription>
        </SheetHeader>
        <div className="border-b border-gray-200 mb-6"></div>
        <div className="space-y-6 mt-6">
          {/* Form fields */}
        </div>
      </div>
      <div className="flex gap-3 px-6 py-4 border-t mt-auto">
        <Button variant="outline" className="flex-1">Cancel</Button>
        <Button className="text-white flex-1" style={{ backgroundColor: '#D8550D' }}>
          Save
        </Button>
      </div>
    </form>
  </SheetContent>
</Sheet>
```

#### Form Field Structure
```tsx
<div className="space-y-2">
  <Label htmlFor="field-name" className="text-sm font-medium">
    Field Label *
  </Label>
  <Input 
    id="field-name" 
    placeholder="Placeholder text" 
    className="w-full"
    value={value}
    onChange={(e) => handleChange(e.target.value)}
    required
  />
</div>
```

### 2. Data Display Patterns

#### Tables with Actions
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column Header</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.image} />
              <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">{item.description}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(item)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(item)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Status Badges
```tsx
<Badge 
  className={
    status === "Available" 
      ? "bg-green-100 text-green-800 hover:bg-green-100"
      : status === "Low Quantity"
      ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
      : "bg-red-100 text-red-800 hover:bg-red-100"
  }
>
  {status === "Available" && <CheckCircle className="h-3 w-3 mr-1" />}
  {status === "Low Quantity" && <AlertTriangle className="h-3 w-3 mr-1" />}
  {status}
</Badge>
```

### 3. State Management Patterns

#### Local Storage Integration
```tsx
// Custom hook for localStorage management
const [stockItems, setStockItems] = useLocalStorage<StockItem[]>('stockItems', [])

// The hook automatically handles:
// - Loading from localStorage on mount
// - Saving to localStorage on updates
// - Error handling for localStorage operations
```

#### Toast Notifications
```tsx
// Custom hook for toast management
const { toasts, addToast, removeToast } = useToast()

// Usage
addToast('success', 'Stock item created successfully')
addToast('error', 'Failed to create stock item')
addToast('warning', 'Low stock quantity detected')
```

### 4. Search and Filtering

#### Search Input with Filters
```tsx
<div className="flex gap-4 mb-6">
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input
      placeholder="Search stock items"
      className="pl-10 bg-white border-gray-200"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
    <SelectTrigger className="w-48 bg-white border-gray-200">
      <SelectValue placeholder="Filter by category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Categories</SelectItem>
      {/* More options */}
    </SelectContent>
  </Select>
</div>
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The system is designed to work across all device sizes:
- **Desktop**: Full sidebar navigation with expanded content
- **Tablet**: Collapsible sidebar with touch-friendly interactions
- **Mobile**: Stacked layout with mobile-optimized forms

## 🎯 Key Features Demonstrated

### Inventory Management
- Stock item creation and editing
- Quantity tracking with status indicators
- Purchase and usage recording
- Reorder level management

### Supplier Management
- Supplier information tracking
- Contact details and addresses
- Integration with stock items

### Data Visualization
- Status badges with color coding
- Transaction history
- Activity logs
- Search and filtering

### User Experience
- Toast notifications for feedback
- Confirmation dialogs for destructive actions
- Empty states with call-to-action
- Loading states and error handling

## 🔄 State Management

This prototype uses React hooks with localStorage for data persistence:
- **useLocalStorage**: Custom hook for localStorage management
- **useToast**: Custom hook for notification management
- **useHydration**: Custom hook for SSR/client hydration

## 🎨 Customization

### Adding New Components
1. Create component in `src/components/ui/` for reusable components
2. Create component in `src/components/features/` for feature-specific components
3. Follow the established patterns for props, styling, and interactions

### Modifying Styles
- Use Tailwind CSS classes for styling
- Follow the established color scheme and spacing patterns
- Maintain consistency with existing components

### Adding New Features
1. Define types in `src/types/index.ts`
2. Create utility functions in `src/utils/helpers.ts`
3. Add custom hooks in `src/hooks/` if needed
4. Follow the established patterns for state management

## 📋 Development Guidelines

### Code Organization
- Keep components under 400 lines
- Use TypeScript interfaces for all props
- Follow consistent naming conventions
- Add JSDoc comments for complex functions

### State Management
- Use custom hooks for reusable state logic
- Implement proper error handling
- Follow the established patterns for localStorage integration

### UI/UX Patterns
- Maintain consistent spacing and typography
- Use the established color scheme
- Follow accessibility best practices
- Implement proper loading and error states

## 🐛 Known Limitations

This is a **design prototype** with the following limitations:
- No backend integration (uses localStorage only)
- No authentication or user management
- No real-time updates
- Limited data validation
- No offline support

## 📄 License

This project is for demonstration purposes only.

---

**Note**: This prototype is designed to showcase UI patterns and interactions. For production use, additional features like proper backend integration, authentication, and comprehensive testing would be required.
