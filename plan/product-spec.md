# House Plants App - Product Specification

## Problem Statement
Plant parents struggle to keep track of care routines, plant-specific needs, and growth progress across multiple plants. Current solutions are either too complex (spreadsheets) or too generic (basic reminders), leading to inconsistent care and plant casualties.

## Vision
A simple, beautiful digital plant journal that helps plant parents care for their green family with confidence and joy.

## Target User
**Primary**: Urban plant enthusiasts (25-45) with 5-30 houseplants who care about plant health but aren't professional gardeners.

**User Pain Points:**
- Forgetting when I last watered each plant
- Not knowing plant-specific care requirements
- Unable to track what's working/not working
- Difficulty spotting patterns in plant health
- No visual record of plant growth over time

## Core Value Proposition
"Never kill another plant" - A personal plant care system that combines plant knowledge, care tracking, and visual progress in one beautiful, simple app.

---

## MVP Feature Set

### 1. Plant Library & Profiles
**User Story**: *"As a plant parent, I want to catalog my plants with their specific care needs so I can give each one proper care."*

**Features:**
- Add plants from botanical database (scientific + common names in multiple languages)
- Store plant-specific care requirements (light, water, soil, fertilizer)
- Upload main plant photo
- Track current location and conditions in my home
- Add personal notes and nicknames

**Success Metrics:**
- Plants added per user
- Plant profiles completed (all fields filled)
- User retention after adding first plant

### 2. Care Event Logging
**User Story**: *"As a plant parent, I want to log care activities so I can track what I've done and when."*

**Features:**
- Quick-log common activities (water, fertilizer, pruning, repotting)
- Add photos to document care events
- Free-text notes for observations
- Simple date picker (defaults to today)
- Batch actions for multiple plants

**Success Metrics:**
- Care events logged per user per week
- Photos attached to events
- Time-to-log (should be <30 seconds)

### 3. Plant Dashboard
**User Story**: *"As a plant parent, I want to see all my plants at a glance so I can quickly assess what needs attention."*

**Features:**
- Visual grid of all plants with main photos
- Health status indicators (healthy, struggling, needs attention)
- Last care activity timestamp
- Quick action buttons (water, photo)
- Filter by location, health status, or care needs

**Success Metrics:**
- Daily active usage
- Time spent on dashboard
- Actions taken from dashboard

---

## Phase 2 Features (Post-MVP)

### 4. Care Intelligence
**User Story**: *"As a plant parent, I want smart suggestions so I can improve my care routine."*

**Features:**
- Watering pattern analysis ("You typically water this every 7 days")
- Seasonal care adjustments
- Problem detection ("Brown tips might indicate overwatering")
- Care timeline visualization
- Plant health trends

### 5. Growth Documentation
**User Story**: *"As a plant parent, I want to document my plants' growth journey so I can celebrate progress and learn from experience."*

**Features:**
- Before/after photo comparisons
- Growth timelapse creation
- Milestone celebrations (first flower, new leaf, etc.)
- Plant age and growth metrics
- Propagation tracking

### 6. Plant Community (Future)
**User Story**: *"As a plant parent, I want to connect with other plant lovers to share experiences and get advice."*

**Features:**
- Plant identification help from community
- Care tips sharing
- Problem-solving discussions
- Local plant swap coordination

---

## Technical Requirements

### Performance
- Mobile-first responsive design
- <2 second load times
- Offline-capable core features
- Image optimization and compression

### Data & Privacy
- Local-first data storage
- No personal data collection beyond plant care
- Export functionality for user data ownership
- Simple backup/restore system

### Usability
- Maximum 2 taps to log common actions
- Intuitive iconography and visual hierarchy
- Accessibility compliance (WCAG 2.1 AA)
- Works well in bright light (outdoor use)

---

## Success Metrics & KPIs

### Engagement
- **Daily Active Users**: Users who log ≥1 care event
- **Retention**: 70% D7, 40% D30 retention
- **Session Frequency**: ≥3 sessions per week average

### Product-Market Fit
- **Plant Survival Rate**: Users report <10% plant casualties
- **Feature Adoption**: 80% of users use care logging within 7 days
- **User Satisfaction**: >4.5 app store rating

### Growth (Organic)
- **Word of Mouth**: 30% of new users from referrals
- **Content Sharing**: Users share plant photos externally
- **Community Building**: Active discussions and tip sharing

---

## MVP Development Phases

### Phase 1: Foundation (Weeks 1-3)
- Database setup and plant library import
- Basic CRUD for plants and care events
- Photo upload and storage
- Simple dashboard layout

### Phase 2: Polish (Weeks 4-5)
- Custom Tailwind theme implementation
- Mobile responsive design
- Care event quick-actions
- Health status system

### Phase 3: Launch Prep (Week 6)
- Performance optimization
- User testing and feedback
- Documentation and deployment
- Analytics setup

---

## Out of Scope (MVP)
- User authentication/accounts
- Social features or sharing
- Push notifications or reminders
- Advanced analytics or AI features
- Marketplace or e-commerce
- Multi-language support (beyond plant names)

---

## Risk Mitigation

**Technical Risks:**
- Photo storage costs → Use Supabase free tier limits
- Database complexity → Start simple, iterate based on usage
- Mobile performance → Optimize images, lazy loading

**Product Risks:**
- Feature creep → Strict MVP scope, user feedback-driven roadmap
- User adoption → Focus on delightful core experience first
- Maintenance burden → Simple architecture, minimal external dependencies

---

## Success Definition
**MVP is successful if:** After 6 weeks, 10 regular users are actively logging plant care and report feeling more confident about plant care.

**Product-market fit achieved when:** Users naturally share the app with fellow plant parents and report measurable improvement in plant health outcomes.