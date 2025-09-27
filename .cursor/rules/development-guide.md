# Plants App Development Guide

This document helps developers understand the project structure and perform common tasks.

## Project Overview

This is a Next.js 14 plant management app with TypeScript, Supabase backend, and shadcn/ui components.

## 1. Component Development & Styleguide

### Styleguide
- **Location**: `/app/styleguide/page.tsx`
- **Purpose**: View all UI components, colors, typography, and examples
- **URL**: `http://localhost:3100/styleguide`
- **Usage**: Always check the styleguide when building new components to maintain consistency

### Building Components
- **UI Components**: `/components/ui/` - shadcn/ui base components (Button, Card, Input, etc.)
- **Feature Components**: `/components/plants/` - app-specific components (PlantCard, PlantForm, etc.)
- **Pattern**: Follow existing component patterns, use TypeScript interfaces, and add to styleguide when appropriate

```typescript
// Example component structure
interface MyComponentProps {
  plant: PlantInstance
  onAction: (id: string) => void
}

export function MyComponent({ plant, onAction }: MyComponentProps) {
  return <Card>...</Card>
}
```

## 2. Themes & Colors

### Theme System
- **Colors**: Defined in `tailwind.config.js`
- **Primary**: Green shades (`primary-50` to `primary-800`)
- **Earth**: Brown/tan shades (`earth-50` to `earth-800`)
- **Usage**: `bg-primary-600`, `text-earth-700`, etc.

### Tailwind Classes
- Prefer Tailwind utility classes over custom CSS
- Use semantic color names: `bg-primary-600` instead of `bg-green-600`
- Responsive: `md:grid-cols-2`, `lg:text-xl`

## 3. Routing

### App Router (Next.js 14)
- **Structure**: `/app/` directory
- **Pages**: `page.tsx` files
- **Layouts**: `layout.tsx` files
- **Dynamic Routes**: `[id]/page.tsx`

### Common Routes
- `/` - Home page
- `/plants` - Plant collection
- `/plants/new` - Add plant form
- `/plants/[id]` - Plant detail page
- `/plants/[id]/photos` - Photo management
- `/library` - Plant library
- `/styleguide` - Component reference

### Navigation
- **Desktop**: TopNav component (`/components/ui/top-nav.tsx`)
- **Mobile**: BottomNav component (`/components/ui/bottom-nav.tsx`)
- **Usage**: Add new routes to both navigation components

## 4. Database & Types

### Database Schema
- **Provider**: Supabase PostgreSQL
- **Tables**: `plants`, `plant_instances`, `plant_care_events`, `plant_photos`
- **Relationships**: Foreign keys with cascade deletes

### Type System
- **Types**: `/db/types.ts` - Generated from Supabase schema
- **Naming**: Database uses `snake_case`, TypeScript uses `camelCase`
- **Transformation**: SDK handles conversion between formats

### Adding a New Field

1. **Add to Supabase** (via Supabase Dashboard):
   ```sql
   ALTER TABLE plant_instances ADD COLUMN my_new_field TEXT;
   ```

2. **Update Types** (`/db/types.ts`):
   ```typescript
   export interface PlantInstance {
     // ... existing fields
     myNewField?: string
   }
   ```

3. **Update SDK** (e.g., `/lib/sdk/instances.ts`):
   ```typescript
   private static transformToDatabase(instance: any): any {
     // ... existing transforms
     if (instance.myNewField !== undefined) result.my_new_field = instance.myNewField
   }

   private static transformFromDatabase(instance: any): any {
     return {
       // ... existing fields
       myNewField: instance.my_new_field,
     }
   }
   ```

4. **Use in Components**:
   ```typescript
   <Input
     value={plant.myNewField || ''}
     onChange={(e) => setPlant({...plant, myNewField: e.target.value})}
   />
   ```

## 5. Environment Variables

### Required Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_API_SECRET_KEY=your_service_role_key

# Add new env vars here as needed
```

### Usage
- **Client-side**: `NEXT_PUBLIC_` prefix required
- **Server-side**: No prefix needed
- **Access**: `process.env.VARIABLE_NAME`

## 6. Storage

### Supabase Storage
- **Bucket**: `plant-photos`
- **Upload**: Via server-side API route (`/app/api/photos/upload/route.ts`)
- **Access**: Public URLs for images
- **SDK**: `PhotosSDK.upload()` handles file uploads

### File Upload Pattern
```typescript
// Client side
const file = event.target.files[0]
const photo = await PhotosSDK.upload(plantId, file, { caption: 'My photo' })

// Server side API route handles storage + database
```

## 7. SDK (Software Development Kit)

### Purpose
Our SDK provides a clean interface to the database, handling:
- Data transformation (snake_case ↔ camelCase)
- Type safety
- Error handling
- Business logic

### SDK Structure
- **Location**: `/lib/sdk/`
- **Files**:
  - `plants.ts` - Plant species data
  - `instances.ts` - User's plant instances
  - `care-events.ts` - Watering, fertilizing, etc.
  - `photos.ts` - Photo management
  - `index.ts` - Exports all SDKs

### Using the SDK
```typescript
// Import
import { PlantInstancesSDK, CareEventsSDK } from '@/lib/sdk'

// Get data
const plants = await PlantInstancesSDK.getAll()
const plant = await PlantInstancesSDK.getById('uuid')

// Create/Update
const newPlant = await PlantInstancesSDK.create(plantData)
const updated = await PlantInstancesSDK.update('uuid', updates)

// Care events
await CareEventsSDK.log(plantId, { type: 'water', notes: 'Watered well' })
```

### SDK Pattern
Each SDK follows this pattern:
- `transformToDatabase()` - Convert camelCase to snake_case
- `transformFromDatabase()` - Convert snake_case to camelCase
- Static methods for CRUD operations
- Error handling with try/catch

## 8. Common Tasks

### Adding a New Page
1. Create `/app/my-page/page.tsx`
2. Add route to navigation components
3. Add to this guide if it's a major feature

### Adding a New Component
1. Create in appropriate directory (`/components/ui/` or `/components/plants/`)
2. Add TypeScript interface
3. Add to styleguide if reusable
4. Follow existing patterns

### Adding a New Database Table
1. Create table in Supabase
2. Add types to `/db/types.ts`
3. Create SDK in `/lib/sdk/`
4. Add to SDK index exports
5. Update this guide

### Debugging
- **Database**: Check Supabase logs
- **API**: Check browser network tab
- **Types**: Use TypeScript errors as guide
- **Styles**: Use browser dev tools

## File Structure Quick Reference

```
/app/                 # Next.js pages
/components/          # React components
  /ui/               # Base UI components
  /plants/           # Feature components
/lib/                # Utilities
  /sdk/              # Database SDK
/db/                 # Types and schemas
/.cursor/            # Development docs
/public/             # Static assets
```

## Getting Help

1. Check this guide first
2. Look at existing similar code
3. Check the styleguide
4. Review TypeScript errors
5. Check Supabase dashboard for data issues

Remember: Follow existing patterns, use TypeScript, and keep components simple and focused.