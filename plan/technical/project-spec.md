# House Plants App - Project Structure

## Tech Stack
- **Runtime**: Bun (preferred) / Node.js 20+
- **Package Manager**: pnpm
- **Framework**: Next.js 14 (App Router) with Vite
- **ORM**: Drizzle ORM + Drizzle Kit
- **UI**: shadcn/ui + Tailwind CSS with custom theme
- **Database**: Supabase PostgreSQL (via DATABASE_URL)
- **File Storage**: Supabase Storage
- **API**: Supabase auto-generated REST API + RLS

## Project Structure
```
house-plants/
├── app/
│   ├── page.tsx              # Home - plant grid
│   ├── plants/
│   │   ├── page.tsx          # All plants list
│   │   ├── new/page.tsx      # Add new plant
│   │   └── [id]/
│   │       ├── page.tsx      # Plant detail
│   │       └── edit/page.tsx # Edit plant
│   ├── care-log/
│   │   ├── page.tsx          # Care events log
│   │   └── new/page.tsx      # Log new care event
│   └── api/                  # Custom endpoints only (rare)
│       └── upload/route.ts   # File upload handling
├── components/
│   ├── ui/                   # shadcn components
│   ├── PlantCard.tsx
│   ├── PlantForm.tsx
│   └── CareEventForm.tsx
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── config.ts            # Environment config (extend existing)
│   ├── utils.ts
│   └── sdk/                 # SDK Layer - ALL server-side actions
│       ├── index.ts         # SDK exports
│       ├── plants.ts        # Plants SDK
│       ├── instances.ts     # Plant instances SDK
│       ├── care-events.ts   # Care events SDK
│       └── photos.ts        # Photos SDK
├── db/                      # ALL DATABASE CODE HERE
│   ├── migrations/          # Drizzle migrations - for example:
│   │   ├── 0001_create_db.sql
│   │   ├── 0002_create_db_tables.sql
│   ├── schema.ts           # Drizzle table schemas
│   ├── types.ts            # TypeScript types
│   ├── queries.ts          # Database queries
│   └── index.ts            # DB exports
├── .env                     # Environment variables (single file)
├── drizzle.config.ts
├── tailwind.config.ts       # Custom Tailwind theme
├── package.json
└── pnpm-lock.yaml
```

## Environment Variables (.env)
```
APP_ENV=development
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_API_SECRET_KEY=your-secret-key
SUPABASE_DATA_API_URL=https://your-project-id.supabase.co
```

## Routing Plan
- `/` - Home dashboard (plant overview)
- `/plants` - All plants grid
- `/plants/new` - Add new plant
- `/plants/[id]` - Plant details + photos
- `/plants/[id]/edit` - Edit plant
- `/care-log` - Recent care events
- `/care-log/new` - Log care event
- `/styleguide` - Live component reference and design system

## Database Structure
- **`/db` folder contains ALL database code:**
  - `schema.ts` - Drizzle table schemas  
  - `types.ts` - TypeScript types derived from schemas
  - `queries.ts` - Database query functions
  - `migrations/` - Auto-generated SQL migration files
  - `index.ts` - Exports all DB functionality
- **Full folder scanning** - All schemas and types auto-discovered from `/db`
- **Type safety** - TypeScript types generated from Drizzle schemas
- **Migration management** - `drizzle-kit` handles schema changes

## SDK Layer Architecture
- **Centralized Data Access** - All components/API endpoints use SDK, never direct DB access
- **Business Logic Layer** - SDK contains all business logic and data transformations
- **Lean Development** - Only build SDK methods as needed, no over-engineering
- **Type-Safe Interface** - SDK provides strongly-typed methods for all operations

### SDK Usage Examples:
```typescript
// Components use SDK instead of direct Supabase calls
const plants = PlantsSDK
const instances = PlantInstancesSDK

// Get plants by location
const balconyPlants = await instances.getBy({location: 'big balcony'})

// Log care event with business logic
await careEvents.log(plantId, {type: 'water', amount: '200ml'})

// Get plant with care history
const plantWithHistory = await plants.getWithHistory(plantId)
```

## API Strategy
- **No custom API routes needed** - Use Supabase out-of-the-box CRUD API
- **CRUD operations** via Supabase client through SDK layer
- **Real-time subscriptions** available out of the box
- **Row Level Security** for data access control
- **Custom endpoints** only for file uploads or complex operations

## Key Dependencies
```json
{
  "drizzle-orm": "latest",
  "drizzle-kit": "latest", 
  "@supabase/supabase-js": "latest",
  "next": "14.x",
  "vite": "latest",
  "tailwindcss": "latest",
  "@tailwindcss/forms": "latest"
}
```

## Data Flow
- **Frontend**: React components use Supabase client
- **API**: Supabase auto-generated REST API (GET/POST/PUT/DELETE)
- **Database**: Drizzle schemas → PostgreSQL via DATABASE_URL
- **Types**: Auto-generated from `/db` schema files
- **Files**: Direct upload to Supabase Storage buckets
- **Styling**: Custom Tailwind theme with plant-focused design tokens

## Design System
- **Color Scheme**: Plant-themed custom colors (greens, earth tones)
- **Typography**: Clean, modern font stack optimized for plant care data
- **Components**: shadcn/ui base components with plant-specific customizations
- **Theme**: Custom Tailwind theme in `tailwind.config.ts`
- **Responsive**: Mobile-first design for easy care logging on-the-go

## Tailwind Theme
- **Primary Colors**: Nature-inspired green palette
- **Secondary Colors**: Earth tones (browns, tans) for warmth
- **Accent Colors**: Bright colors for health status indicators
- **Spacing**: Custom spacing scale for plant cards and forms
- **Borders**: Organic border radius values
- **Shadows**: Subtle shadows mimicking natural lighting