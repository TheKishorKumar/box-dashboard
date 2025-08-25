# Design System Patterns & UI Structure Documentation

## Overview

This document outlines the established design patterns, component usage, and UI structure for the restaurant inventory management system built with Next.js, TypeScript, Tailwind CSS, and Radix UI components.

## Tech Stack

- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React useState/useEffect with localStorage
- **Build Tool**: Turbopack

## Design System Principles

### 1. Color Scheme

- **Primary Brand Color**: `#D8550D` (Orange) with hover state `#A8420A`
- **Background**: White (`bg-white`)
- **Text**: Gray scale (`text-gray-900`, `text-gray-600`, `text-gray-500`)
- **Borders**: Light gray (`border-gray-200`, `border-gray-300`)
- **Status Colors**:
  - Success: Green (`bg-green-100 text-green-800`)
  - Warning: Orange (`bg-orange-100 text-orange-800`)
  - Error: Red (`bg-red-100 text-red-800`)
  - Info: Blue (`bg-blue-100 text-blue-800`)

### 2. Typography

- **Font Family**: Inter (font-inter)
- **Headings**:
  - H1: `text-2xl font-bold text-gray-900`
  - H2: `text-xl font-semibold text-gray-900`
  - H3: `text-lg font-semibold text-gray-900`
- **Body Text**: `text-sm text-gray-600`
- **Labels**: `text-sm font-medium`

### 3. Spacing & Layout

- **Container Padding**: `px-6 py-4` or `p-6`
- **Component Spacing**: `space-y-6` for sections, `space-y-4` for forms
- **Gap Between Elements**: `gap-3`, `gap-4`
- **Border Radius**: `rounded-lg`, `rounded-md`

### 4. Currency & Number Formatting

#### Nepali Currency Format

- **Currency Symbol**: रु (Nepali Rupees)
- **Format**: `रु 1,234.56` (with commas for thousands)
- **Usage**: All monetary values throughout the application
- **Implementation**: Use `formatNepaliCurrency(amount)` utility function

#### Indian Numbering System

- **Large Numbers**: Use Lakhs and Crores instead of millions/billions
- **Format**:
  - 1,00,000 = 1 Lakh
  - 1,00,00,000 = 1 Crore
- **Implementation**: Use `formatIndianNumber(num)` utility function
- **Comma Placement**: Every 3 digits from right, except for the last 3 digits of Lakhs/Crores

#### Examples

- **Small Amounts**: रु 120, रु 1,250
- **Large Amounts**: रु 1,00,000 (1 Lakh), रु 1,00,00,000 (1 Crore)
- **Decimal Values**: रु 1,234.56

## Component Usage Patterns

### 1. Layout Structure

#### Sidebar Navigation

```tsx
// Collapsible sidebar with localStorage persistence
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
  if (typeof window !== 'undefined') {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed')
    return savedSidebarState ? JSON.parse(savedSidebarState) : false
  }
  return false
})

// Sidebar structure
<div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-screen z-10 transition-all duration-300 ease-in-out`}>
  {/* Header with toggle */}
  {/* Navigation items */}
  {/* User profile */}
</div>
```

#### Main Content Area

```tsx
<div
  className={`flex-1 flex flex-col ${
    isSidebarCollapsed ? "ml-16" : "ml-64"
  } transition-all duration-300 ease-in-out`}
>
  {/* Page content */}
</div>
```

### 2. Form Patterns

#### Slide-out Forms (Sheet Component)

**Use Case**: Creation and editing forms
**Pattern**: Right-side slide-out with consistent structure and proper overflow handling

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent
    side="right"
    className="w-full sm:max-w-md flex flex-col h-full"
  >
    <div className="flex flex-col h-full">
      {/* Header section - fixed */}
      <div className="px-6 flex-shrink-0">
        <SheetHeader className="pl-0">
          <SheetTitle className="text-[#171717] font-inter text-[20px] font-semibold leading-[30px]">
            Form Title
          </SheetTitle>
          <SheetDescription>Form description</SheetDescription>
        </SheetHeader>

        {/* Separator line */}
        <div className="border-b border-gray-200 mb-6"></div>
      </div>

      {/* Content section - scrollable */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="space-y-6">{/* Form fields */}</div>
      </div>

      {/* Footer section - fixed at bottom */}
      <div className="flex-shrink-0 border-t bg-white">
        <div className="flex gap-3 px-6 py-4">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            className="text-white flex-1"
            style={{ backgroundColor: "#D8550D" }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  </SheetContent>
</Sheet>
```

#### Nested Forms (NestedFormSheet Component)

**Use Case**: Creating related entities from within another form
**Pattern**: Slide-out form with back button for nested workflows

```tsx
<NestedFormSheet
  open={isNestedFormOpen}
  onOpenChange={setIsNestedFormOpen}
  onBack={() => setIsNestedFormOpen(false)}
  title="Create Entity"
  description="Add a new entity to continue."
>
  <EntityForm
    onSubmit={handleNestedSubmit}
    onCancel={() => setIsNestedFormOpen(false)}
    submitLabel="Save Entity"
    cancelLabel="Back"
  />
</NestedFormSheet>
```

**Key Features**:

- Back button in header for navigation
- Proper z-index management for nested overlays
- State preservation in parent form
- Automatic data flow back to parent form

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

#### Dropdown Fields with Search

```tsx
<div className="relative dropdown-container">
  <Input
    placeholder="Search or select option"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    onFocus={() => setIsOpen(true)}
    className="w-full"
  />

  {isOpen && (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
      <div className="max-h-[200px] overflow-y-auto">
        {filteredOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            className="w-full px-3 py-2 text-left hover:bg-gray-100"
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
```

### 3. Data Display Patterns

#### Tables

**Use Case**: Displaying lists of data with actions
**Pattern**: Consistent table structure with hover states and action menus

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column Header</TableHead>
      {/* More headers */}
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
        <TableCell>
          {/* Cell content with avatar/icon + text */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.image} />
              <AvatarFallback>
                {item.icon || item.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">{item.description}</div>
            </div>
          </div>
        </TableCell>
        {/* More cells */}
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

### 4. Empty States

**Use Case**: When no data exists
**Pattern**: Centered layout with illustration, title, description, and action button

```tsx
<EmptyState
  image="/illustration.png"
  title="No items added yet"
  description="Start by adding your first item"
  actionLabel="Add First Item"
  onAction={handleAdd}
  actionIcon={<Plus className="h-4 w-4" />}
  variant="centered"
/>
```

### 5. Modal Patterns

#### Confirmation Modals

**Use Case**: Delete confirmations and destructive actions
**Pattern**: Centered modal with icon, title, description, and action buttons

```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
    {/* Close button */}
    <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
      <X className="w-5 h-5" />
    </button>

    {/* Icon and title */}
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
        <Trash2 className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Delete Item?</h3>
    </div>

    {/* Description */}
    <p className="text-gray-600 mb-6 leading-relaxed">
      This action cannot be undone.
    </p>

    {/* Actions */}
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={onConfirm}>
        Delete
      </Button>
    </div>
  </div>
</div>
```

### 6. Toast Notifications

**Use Case**: Success, error, and warning messages
**Pattern**: Fixed position top-right with auto-dismiss

```tsx
<div className="fixed top-4 right-4 z-50 space-y-2">
  {toasts.map((toast) => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm flex items-start gap-3">
      {/* Icon based on type */}
      <div className="flex-shrink-0">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            toast.type === "success"
              ? "bg-green-100"
              : toast.type === "error"
              ? "bg-red-100"
              : "bg-yellow-100"
          }`}
        >
          {/* Icon */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{toast.message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ))}
</div>
```

## Page Structure Patterns

### 1. Tab-based Navigation

**Use Case**: Organizing related functionality
**Pattern**: Horizontal tabs with content switching

```tsx
<Tabs defaultValue="tab1" className="w-full">
  <div className="border-b border-gray-200 mb-6 sticky top-0 bg-white z-20">
    <TabsList className="flex justify-start bg-white h-auto p-0 border-b-0 shadow-none">
      <TabsTrigger
        value="tab1"
        className="tabs-trigger relative px-3 py-3 text-sm font-medium"
      >
        Tab 1
      </TabsTrigger>
      {/* More tabs */}
    </TabsList>
  </div>

  <TabsContent value="tab1" className="space-y-6">
    {/* Tab content */}
  </TabsContent>
</Tabs>
```

### 2. Page Headers

**Pattern**: Title, description, and action button

```tsx
<div className="flex justify-between items-start">
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
    <p className="text-gray-600 mt-1">Page description</p>
  </div>
  <Button
    onClick={handleAction}
    className="text-white"
    style={{ backgroundColor: "#D8550D" }}
  >
    <Plus className="h-4 w-4 mr-2" />
    Action Button
  </Button>
</div>
```

### 3. Search and Filters

**Pattern**: Search input + filter dropdowns

```tsx
<div className="flex gap-4 mb-6">
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input
      placeholder="Search items"
      className="pl-10 bg-white border-gray-200"
    />
  </div>
  <Select>
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

## State Management Patterns

### 1. Local Storage Integration

```tsx
// Custom setter with localStorage persistence
const updateItems = (newItems: Item[]) => {
  setItems(newItems);
  if (typeof window !== "undefined") {
    localStorage.setItem("items", JSON.stringify(newItems));
  }
};

// Load from localStorage on mount
useEffect(() => {
  const saved = localStorage.getItem("items");
  if (saved) {
    setItems(JSON.parse(saved));
  }
  setIsHydrated(true);
}, []);
```

### 2. Form State Management

```tsx
const [formData, setFormData] = useState({
  name: "",
  category: "",
  // ... other fields
});

const handleInputChange = (field: string, value: string) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};
```

## Component Hierarchy

### 1. Layout Components

- `Sidebar` - Collapsible navigation
- `MainContent` - Content area with sidebar offset
- `PageHeader` - Title and actions
- `TabsContainer` - Tab navigation wrapper

### 2. Form Components

- `Sheet` - Slide-out form container
- `NestedFormSheet` - Nested form container with back button
- `FormField` - Individual form field wrapper
- `DropdownField` - Searchable dropdown
- `FormFooter` - Form action buttons
- `SupplierForm` - Reusable supplier creation form

### 3. Data Components

- `DataTable` - Table with actions
- `EmptyState` - No data illustration
- `StatusBadge` - Status indicator
- `ActionMenu` - Dropdown actions

### 4. Feedback Components

- `Toast` - Notification messages
- `ConfirmationModal` - Action confirmations
- `LoadingState` - Loading indicators

## Accessibility Patterns

### 1. Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus management in modals and dropdowns
- Escape key to close modals

### 2. Screen Reader Support

- Proper ARIA labels on form fields
- Descriptive alt text for images
- Status announcements for dynamic content

### 3. Color Contrast

- High contrast text on backgrounds
- Status indicators use both color and icons
- Hover states provide additional feedback

## Performance Patterns

### 1. Lazy Loading

- Components load only when needed
- Images use Next.js Image optimization
- Code splitting with dynamic imports

### 2. State Optimization

- Local state for UI interactions
- localStorage for persistence
- Minimal re-renders with proper dependencies

### 3. Search and Filtering

- Client-side filtering for small datasets
- Debounced search inputs
- Virtual scrolling for large lists (future enhancement)

## Future Enhancements

### 1. Component Library

- Extract reusable components to a separate package
- Add Storybook for component documentation
- Implement design tokens for consistent theming

### 2. Advanced Patterns

- Virtual scrolling for large datasets
- Infinite scroll for pagination
- Drag and drop for reordering
- Bulk actions for multiple selections

### 3. Accessibility Improvements

- Focus trap implementation
- Screen reader testing
- Keyboard shortcut support
- High contrast mode

## Best Practices

### 1. Component Design

- Single responsibility principle
- Props interface for type safety
- Default props for optional values
- Consistent naming conventions

### 2. State Management

- Local state for UI interactions
- localStorage for persistence
- Proper cleanup in useEffect
- Error boundaries for error handling

### 3. Performance

- Memoization for expensive calculations
- Proper dependency arrays
- Lazy loading for heavy components
- Image optimization

### 4. Code Organization

- Feature-based folder structure
- Shared components in ui/ directory
- Type definitions in separate files
- Consistent import ordering

## Copywriting Patterns & Content Guidelines

### 1. Page Headers & Titles

#### Page Titles

- **Format**: Clear, concise, descriptive
- **Examples**:
  - "Stock item"
  - "Measuring Units"
  - "Stock Groups"
  - "Stock item - {itemName}" (for detail pages)

#### Page Descriptions

- **Format**: Brief, informative, action-oriented
- **Examples**:
  - "Manage all ingredients and supplies your restaurant keeps in stock."
  - "Manage measurement units used for tracking stock items in your inventory."
  - "Organize your inventory into logical groups for better management."
  - "Transaction history and stock movements"

### 2. Form & Modal Copy

#### Form Titles

- **Format**: Action + Entity
- **Examples**:
  - "Create stock item"
  - "Edit stock item"
  - "New Measuring Unit"
  - "Edit Measuring Unit"
  - "New Stock Group"
  - "Edit Stock Group"

#### Form Descriptions

- **Format**: Clear purpose + benefit
- **Examples**:
  - "Add a new stock item to your inventory with initial stock quantity."
  - "Update the stock item details."
  - "Add a new measurement unit to your inventory system."
  - "Update the measuring unit details."
  - "Add a new stock group to organize your inventory."
  - "Update the stock group details."

#### Sheet/Modal Descriptions

- **Format**: Action + outcome
- **Examples**:
  - "Record stock purchased from supplier. This increases your available inventory."
  - "Record stock used in operations. This reduces your available inventory."

### 3. Button & Action Text

#### Primary Action Buttons

- **Format**: Action + Entity (when creating)
- **Examples**:
  - "New stock item"
  - "New Measuring Unit"
  - "New Stock Group"
  - "Save Stock item"
  - "Create Unit"
  - "Create Group"
  - "Update Unit"
  - "Update Group"

#### Secondary Actions

- **Format**: Simple action verbs
- **Examples**:
  - "Cancel"
  - "Add another"
  - "Edit"
  - "Delete"

#### Menu Actions

- **Format**: Action + Entity
- **Examples**:
  - "Edit stock item"
  - "Delete stock item"
  - "Record Purchase"
  - "Record Usage"
  - "Edit measuring unit"
  - "Delete measuring unit"
  - "Edit stock group"
  - "Delete stock group"

### 4. Form Field Labels & Placeholders

#### Field Labels

- **Format**: Clear, descriptive + required indicator
- **Examples**:
  - "Item name \*"
  - "Stock group \*"
  - "Initial stock \*"
  - "Measuring unit \*"
  - "Price per unit \*"
  - "Supplier"
  - "Re-order level"
  - "Description (Optional)"
  - "Unit Name \*"
  - "Short Name \*"
  - "Group Name \*"
  - "Description"

#### Placeholder Text

- **Format**: "E.g." + specific examples
- **Examples**:
  - "E.g. Tomatoes, Beer, Cheese"
  - "E.g. 50"
  - "E.g. रु 120"
  - "E.g. 10"
  - "E.g. Handpicked dishes for a quick and satisfying lunch."
  - "E.g. Kilograms, Liters, Pieces"
  - "E.g. kg, L, pcs"
  - "E.g. Groceries, Vegetables, Meat"
  - "Brief description of what this group contains"

#### Search Placeholders

- **Format**: "Search" + entity type
- **Examples**:
  - "Search stock items"
  - "Search measuring units"
  - "Search stock groups"
  - "Search or select a stock group"
  - "Search or select measuring unit"
  - "Search or select supplier"

### 5. Empty States & Messages

#### Empty State Titles

- **Format**: "No" + entity + "added yet"
- **Examples**:
  - "No stock items added yet"
  - "No measuring units added yet"
  - "No stock groups added yet"

#### Empty State Descriptions

- **Format**: Action-oriented + benefit
- **Examples**:
  - "Start managing your inventory by adding your first stock item"
  - "Start managing your measurement units by adding your first unit."
  - "Start organizing your inventory by adding your first stock group."

#### Empty State Action Buttons

- **Format**: "Add First" + Entity
- **Examples**:
  - "Add First Stock Item"
  - "Add First Measuring Unit"
  - "Add First Stock Group"

### 6. Status & Feedback Messages

#### Success Messages

- **Format**: Entity + action + "successfully"
- **Examples**:
  - "Stock item created successfully"
  - "Stock item updated successfully"
  - "Stock item deleted successfully"
  - "Measuring unit 'Kilograms' created successfully"
  - "Stock group 'Groceries' created successfully"

#### Toast Messages

- **Format**: Action + entity + details
- **Examples**:
  - "Recorded purchase of 50 kg for Tomatoes"
  - "Recorded usage of 25 kg for Tomatoes"

### 7. Table Headers & Data Display

#### Table Column Headers

- **Format**: Clear, concise, capitalized
- **Examples**:
  - "Item"
  - "Category"
  - "Quantity"
  - "Status"
  - "Last Updated"
  - "Actions"
  - "Unit Name"
  - "Short Name"
  - "Group Name"
  - "Description"
  - "Items"

#### Status Text

- **Format**: Clear status indicators
- **Examples**:
  - "Available"
  - "Low Quantity"
  - "Out of Stock"
  - "Purchase"
  - "Usage"
  - "Opening Stock"

### 8. Confirmation Dialogs

#### Delete Confirmations

- **Format**: "Delete" + Entity + "?"
- **Examples**:
  - "Delete Stock Item?"
  - "Delete Measuring Unit?"
  - "Delete Stock Group?"
  - "Delete Record?"

#### Confirmation Descriptions

- **Format**: Warning + consequence
- **Examples**:
  - "This will permanently remove '{itemName}' from your inventory. This action cannot be undone."
  - "This will permanently remove '{unitName}' from your measuring units. This action cannot be undone."
  - "This will permanently remove '{groupName}' from your stock groups. This action cannot be undone."

### 9. Navigation & Tab Labels

#### Tab Names

- **Format**: Clear, concise, lowercase
- **Examples**:
  - "Stock item"
  - "Suppliers"
  - "Measuring unit"
  - "Stock group"
  - "Activity Logs"

#### Navigation Labels

- **Format**: Clear, descriptive
- **Examples**:
  - "Home"
  - "Menu manager"
  - "Inventory"
  - "Areas and Tables"
  - "Members"
  - "Order history"
  - "Sales"
  - "Activity"
  - "Profile and settings"

### 10. Content Guidelines

#### Tone & Voice

- **Professional but approachable**
- **Clear and concise**
- **Action-oriented**
- **Consistent terminology**

#### Writing Principles

1. **Use consistent terminology** (e.g., "stock item" not "ingredient" or "supply")
2. **Be specific and descriptive**
3. **Use action verbs for buttons**
4. **Provide helpful examples in placeholders**
5. **Keep messages concise but informative**
6. **Use proper capitalization**
7. **Include required field indicators (\*)**
8. **Provide clear feedback for user actions**

#### Common Phrases

- "Manage" for main sections
- "Add" for creation actions
- "Edit" for modification actions
- "Delete" for removal actions
- "Record" for transaction actions
- "Search" for filtering actions
- "Filter by" for categorization

This copywriting guide ensures consistent, professional, and user-friendly content across the entire application.

This documentation serves as a comprehensive guide for maintaining consistency and implementing new features following the established patterns.
