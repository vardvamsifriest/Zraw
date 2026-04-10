# Zraw UI Documentation

> **Draw. Think. Collaborate.** – The open canvas for your best ideas.

This document provides a comprehensive guide to the UI architecture, components, and styling used in **Zraw**, a collaborative drawing application.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Core Components](#core-components)
5. [Page Architecture](#page-architecture)
6. [Styling & Design System](#styling--design-system)
7. [Color Palette](#color-palette)
8. [Typography](#typography)
9. [Component API Reference](#component-api-reference)
10. [Design Patterns](#design-patterns)
11. [Recreating the UI](#recreating-the-ui)

---

## Overview

Zraw is a **real-time collaborative drawing application** built with Next.js and React. It allows users to:
- Create and join collaborative drawing rooms
- Draw with various tools (pen, shapes, arrows, text, eraser)
- Work with multiple colors and text sizes
- Collaborate in real-time with WebSocket synchronization
- Manage rooms from a centralized dashboard

The UI is designed with a **modern dark-mode aesthetic** using slate gray and white color schemes with intuitive tool selection and drawing capabilities.

---

## Project Structure

```
apps/web/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global styles & font declarations
│   ├── layout.tsx                    # Root layout
│   ├── signin/
│   │   └── page.tsx                  # Sign-in page
│   ├── signup/
│   │   └── page.tsx                  # Sign-up page
│   ├── dashboard/
│   │   └── page.tsx                  # User dashboard (room management)
│   ├── canvas/
│   │   └── [roomId]/
│   │       ├── page.tsx              # Main canvas/drawing page
│   │       ├── useCanvas.ts          # Drawing logic hook
│   │       ├── useWebSocket.ts       # WebSocket synchronization hook
│   │       └── types.ts              # Canvas type definitions
│   └── components/
│       ├── colorbar.tsx              # Color selection component
│       ├── drawbar.tsx               # Main toolbar container
│       ├── toolbar.tsx               # Drawing tools selector
│       ├── shapedecider.tsx          # Shape fill toggle
│       └── usercard.tsx              # User profile card
│
packages/
├── ui/
│   └── src/
│       ├── button.tsx                # Button component
│       ├── card.tsx                  # Auth card component
│       ├── logo.tsx                  # Zraw logo
│       └── inputbox.tsx              # Input field component
└── ...
```

---

## Technology Stack

### Frontend Framework
- **Next.js 15+** - React framework with app router
- **React 18+** - UI library
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Fonts** - Azeret Mono, Geist (variable fonts)

### State Management
- **React Hooks** - useState, useRef, useEffect
- **WebSocket API** - Real-time synchronization

### Canvas Drawing
- **HTML5 Canvas API** - Native drawing capabilities
- **Custom drawing engine** - Pen, shapes, text, arrows, eraser

### HTTP Client
- **Axios** - API communication

### Routing
- **Next.js App Router** - File-based routing

---

## Core Components

### 1. **Button** (`packages/ui/src/button.tsx`)

A versatile button component with multiple sizes and variants.

**Props:**
```typescript
interface ButtonProps {
  size: "lg" | "md" | "sm"
  variant: "primary" | "secondary"
  text: string
  onClick?: (...args: any[]) => void
  img?: ReactElement
  active?: boolean
}
```

**Styles:**
- **Primary**: White background, black text, scale-on-hover, rounded
- **Secondary**: Slate-600 background, white text, scale-on-hover, rounded
- **Sizes**: Small (p-2), Medium (p-3), Large (p-4)

**Example:**
```tsx
<Button 
  size="md" 
  variant="primary" 
  text="Get Started" 
  img={<img src="arrow_v1.gif" className="h-6 w-6"/>} 
  onClick={handleClick}
/>
```

### 2. **Logo** (`packages/ui/src/logo.tsx`)

Zraw branding component displaying logo and text.

**Props:**
```typescript
interface LogoProps {
  size?: "sm" | "lg"
}
```

**Features:**
- Animated pen icon (pen.gif)
- Bold Azeret Mono font
- White text color
- Responsive sizing

**Example:**
```tsx
<Logo />              {/* Large (default) */}
<Logo size="sm" />    {/* Small */}
```

### 3. **Card** (`packages/ui/src/card.tsx`)

Authentication form container (Sign In / Sign Up).

**Props:**
```typescript
interface CardProps {
  size: "sm" | "md" | "lg"
  needusername: boolean
  text: string
  title: string
  link: boolean
  onClick: (email: string, password: string, username: string) => void
}
```

**Features:**
- Light zinc background with slate border
- Form validation using Zod schemas
- Error message display
- Responsive sizing
- Input fields for email, password, username

**Example:**
```tsx
<Card 
  size="md"
  title="Sign Up"
  needusername={true}
  onClick={handleSignup}
  text="Submit"
  link={true}
/>
```

### 4. **InputBox** (`packages/ui/src/inputbox.tsx`)

Controlled text input component.

**Props:**
```typescript
interface InputBoxProps {
  placeholder: string
  id: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}
```

### 5. **ToolBar** (`apps/web/app/components/toolbar.tsx`)

Drawing tool selector component.

**Available Tools:**
- Pen
- Line
- Square
- Rectangle
- Circle
- Arrow
- Eraser
- Text

**Features:**
- Icon-based selection (from `/images/tools/`)
- Active state indication (ring-2 ring-slate-700)
- Horizontal layout with gap spacing

**Example:**
```tsx
<ToolBar 
  activeTool="pen"
  setActiveTool={(tool) => setActiveTool(tool)}
/>
```

### 6. **ColorBar** (`apps/web/app/components/colorbar.tsx`)

Color palette selector component.

**Available Colors:**
- Black
- Red
- Blue
- Purple
- Pink
- Yellow
- Green
- Teal
- Orange

**Features:**
- Icon-based color selection (from `/images/colors/`)
- Selected color indication (ring-2 ring-slate-700 rounded-full)
- Light zinc background

**Example:**
```tsx
<ColorBar 
  activeColor="black"
  setActiveColor={(color) => setActiveColor(color)}
/>
```

### 7. **ShapeDecider** (`apps/web/app/components/shapedecider.tsx`)

Toggle component for shape fill (filled vs. outlined).

**Features:**
- Boolean state management
- Indicates fill/no-fill state

### 8. **DrawBar** (`apps/web/app/components/drawbar.tsx`)

Main toolbar container combining all drawing controls.

**Props:**
```typescript
interface DrawBarProps {
  filled: boolean
  setFilled: (v: boolean) => void
  activeTool: string
  setActiveTool: (tool: string) => void
  activeColor: string
  setActiveColor: (color: string) => void
  fontSize: number
  setFontSize: (size: number) => void
}
```

**Layout:**
- Slate-500 background
- Contains: ToolBar, ColorBar, ShapeDecider, FontSize buttons
- Rounded with shadow
- Responsive sizing (h-24)

**Font Size Options:**
- S (16px)
- M (24px)
- L (36px)

### 9. **UserCard** (`apps/web/app/components/usercard.tsx`)

User profile and navigation card.

**Props:**
```typescript
interface UserCardProps {
  needdashboard: boolean
}
```

**Features:**
- Displays username (fetched from API)
- Dashboard navigation button (conditional)
- Logout button
- Slate-800 background with outline
- Fixed positioning with blur overlay

---

## Page Architecture

### 1. **Landing Page** (`app/page.tsx`)

**Route:** `/`

**Features:**
- Hero section with tagline "Draw.Think.Collaborate."
- Animated screenshot carousel (3s intervals)
- Get Started button
- Navbar with logo and CTA
- Responsive design (mobile-first)

**Layout:**
```
┌─────────────────────────────┐
│  Logo    │        Get Started│
├─────────────────────────────┤
│     Hero Tagline + Button   │
│     Screenshot Carousel      │
└─────────────────────────────┘
```

### 2. **Sign In Page** (`app/signin/page.tsx`)

**Route:** `/signin`

**Features:**
- Logo header (top, full-width border)
- Centered auth card
- Email and password inputs
- Sign in button
- Dark slate background

**Layout:**
```
┌─────────────────────────┐
│       Logo Header       │
├─────────────────────────┤
│                         │
│   ┌─────────────────┐   │
│   │   Sign In       │   │
│   │ Email input     │   │
│   │ Password input  │   │
│   │ Submit button   │   │
│   └─────────────────┘   │
│                         │
└─────────────────────────┘
```

### 3. **Sign Up Page** (`app/signup/page.tsx`)

**Route:** `/signup`

**Features:**
- Logo header
- Auth card with extra username field
- Email, password, username inputs
- Sign up button
- Link to sign in page
- Form validation

### 4. **Dashboard** (`app/dashboard/page.tsx`)

**Route:** `/dashboard`

**Features:**
- User authentication check (redirects if no token)
- Create new room functionality
- Join room by code
- Display created rooms
- Display joined rooms
- User card (top-right)
- Search/filter capabilities
- Responsive grid layout

**Layout:**
```
┌────────────────────────────────────┐
│  Logo            User Avatar        │
├────────────────────────────────────┤
│ Create Room Section                 │
│ Join Room Section                   │
├────────────────────────────────────┤
│ Created Rooms Grid                  │
├────────────────────────────────────┤
│ Joined Rooms Grid                   │
└────────────────────────────────────┘
```

### 5. **Canvas/Drawing Page** (`app/canvas/[roomId]/page.tsx`)

**Route:** `/canvas/[roomId]`

**Features:**
- Full-screen HTML5 Canvas
- Real-time drawing with WebSocket sync
- Tool selection (pen, shapes, text, eraser, arrow, line)
- Color selection
- Text input overlay (absolute positioned)
- Responsive toolbar
- User card popup
- Blur overlay when user card is open

**Layout:**
```
┌─────────────────────────────────────┐
│ Logo  │    DrawBar    │  User Avatar │
├─────────────────────────────────────┤
│                                     │
│                                     │
│          Drawing Canvas              │
│       (Full Screen - z-0)           │
│                                     │
│  [Text Input Overlay - z-50]        │
│  (absolute, appears during typing)  │
│                                     │
└─────────────────────────────────────┘
```

**Canvas Event Handlers:**
- `onMouseDown` - Start drawing
- `onMouseMove` - Draw/track movement
- `onMouseUp` - End drawing
- `onMouseLeave` - Stop drawing on exit

---

## Styling & Design System

### Color Palette

#### Primary Colors
- **Slate-900** (`#0f172a`) - Dark background (primary)
- **Slate-800** (`#1e293b`) - Cards, secondary background
- **Slate-700** (`#334155`) - Borders, accents
- **Slate-600** (`#475569`) - Secondary buttons
- **Slate-500** (`#64748b`) - Toolbar background
- **Slate-400** (`#78909c`) - Text secondary
- **Slate-300** (`#cbd5e1`) - Light accents

#### Neutral Colors
- **Zinc-100** (`#f4f4f5`) - Light backgrounds, inputs
- **White** (`#ffffff`) - Primary text, primary buttons
- **Black** (`#000000`) - Dark text

#### Canvas Colors (Drawing)
- **Black, Red, Blue, Purple, Pink, Yellow, Green, Teal, Orange** - Drawing palette

### Spacing Scale
```
Gap/Padding: 1 (4px), 2 (8px), 4 (16px), 6 (24px), 8 (32px)
Heights: h-6 (24px), h-8 (32px), h-10 (40px), h-20 (80px), h-24 (96px), h-28 (112px), h-72 (288px), h-90 (360px), h-96 (384px), h-120 (480px)
Widths: w-6 (24px), w-8 (32px), w-10 (40px), w-72 (288px), w-84 (336px), w-96 (384px), w-100 (400px), w-110 (440px), full, screen
```

### Border Radius
- `rounded` - 0.25rem (4px)
- `rounded-md` - 0.375rem (6px)
- `rounded-xl` - 0.75rem (12px)
- `rounded-full` - 50%

### Shadows
- `shadow-xl` - Large shadow (0 20px 25px -5px)

### Transitions & Hover States
- **Hover Scale**: `hover:scale-110` on buttons
- **Hover Opacity**: `hover:opacity-80` on images
- **Transition**: `transition-all` for smooth animations

### Responsive Breakpoints (Tailwind Default)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

---

## Typography

### Font Families

#### 1. **Azeret Mono** (Heading/Logo)
- **Font File**: `Azeret_Mono/AzeretMono-VariableFont_wght.ttf`
- **Usage**: Logo, headings, bold text
- **Weight**: Variable (400-900)
- **Classes**: `font-azeret`

#### 2. **Geist** (Body/UI)
- **Font File**: `Geist/Geist-VariableFont_wght.ttf`
- **Usage**: Body text, inputs, buttons
- **Weight**: Variable (400-700)
- **Classes**: `font-geist`

### Typography Scale

**Landing Page & Headings:**
```
Heading 1: text-6xl md:text-5xl lg:text-6xl font-bold font-azeret
Heading 2: text-3xl md:text-5xl font-bold font-azeret
Subtitle: text-base md:text-xl text-slate-400 font-geist
```

**Buttons & UI:**
```
Button Text: font-geist (various sizes)
Card Title: text-2xl font-semibold font-geist
Card Content: text-sm/base font-geist
Error Text: text-sm text-red-500 font-geist
```

---

## Component API Reference

### Button Component

```typescript
<Button
  size="md" | "lg" | "sm"           // Required
  variant="primary" | "secondary"   // Required
  text="Button Text"                // Required
  onClick={() => {}}                // Optional
  img={<ImageElement />}            // Optional
  active={false}                    // Optional
/>
```

**Styling Matrix:**
| Size | Padding |
|------|---------|
| sm   | p-2 (8px) |
| md   | p-3 (12px) |
| lg   | p-4 (16px) |

| Variant | Background | Text | Hover |
|---------|-----------|------|-------|
| primary | white | black | scale-110 |
| secondary | slate-600 | white | scale-110 |

### Card Component

```typescript
<Card
  size="sm" | "md" | "lg"           // Required
  needusername={boolean}            // Required
  text="Button Text"                // Required
  title="Form Title"                // Required
  link={boolean}                    // Required (show link to sign in)
  onClick={(email, password, username) => {}}  // Required
/>
```

### ToolBar Component

```typescript
<ToolBar
  activeTool="pen" | "line" | "square" | "rectangle" | "circle" | "arrow" | "eraser" | "text"
  setActiveTool={(tool: string) => {}}
  fontSize?: number  // Optional
/>
```

### ColorBar Component

```typescript
<ColorBar
  activeColor="black" | "red" | "blue" | "purple" | "pink" | "yellow" | "green" | "teal" | "orange"
  setActiveColor={(color: string) => {}}
/>
```

### DrawBar Component

```typescript
<DrawBar
  filled={boolean}
  setFilled={(v: boolean) => {}}
  activeTool={string}
  setActiveTool={(tool: string) => {}}
  activeColor={string}
  setActiveColor={(color: string) => {}}
  fontSize={number}
  setFontSize={(size: number) => {}}
/>
```

### UserCard Component

```typescript
<UserCard
  needdashboard={boolean}  // Show/hide dashboard button
/>
```

---

## Design Patterns

### 1. **State Management Pattern**
```tsx
const [activeTool, setActiveTool] = useState("pen")
const [activeColor, setActiveColor] = useState("black")
const [fontSize, setFontSize] = useState(20)
```

### 2. **Conditional Rendering with Blur Overlay**
```tsx
{showUserCard && (
  <div className="fixed inset-0 z-50 flex justify-end items-start pt-24 pr-8"
    onClick={() => setShowUserCard(false)}>
    <UserCard needdashboard={true} />
  </div>
)}

<div className={showUserCard ? "blur-sm pointer-events-none" : ""}>
  {/* Page content */}
</div>
```

### 3. **Responsive Design Pattern**
```tsx
<div className="px-4 md:px-8 text-sm md:text-lg">
  {/* Content scales from mobile to desktop */}
</div>
```

### 4. **Form Validation Pattern**
```tsx
const result = CreateUserSchema.safeParse({ email, username, password })
if (!result.success) {
  setError(result.error.issues[0]!.message)
  return
}
```

### 5. **Active State Indication**
```tsx
className={`
  ${activeTool === tool.name ? "ring-2 ring-slate-700" : ""}
  h-10 w-10 cursor-pointer rounded-md
`}
```

### 6. **Icon with Text Pattern**
```tsx
<div className="flex items-center gap-2">
  {img && img}
  {text}
</div>
```

---

## Recreating the UI

### Prerequisites
```bash
Node.js 18+ or Bun
pnpm (package manager)
```

### Step 1: Initialize Project Structure

```bash
# Create Next.js app
npx create-next-app@latest zraw --typescript --tailwind

# Install dependencies
pnpm install axios
```

### Step 2: Set Up Monorepo Structure

```bash
pnpm init -w

# Create workspace packages
mkdir -p packages/{ui,common,db,eslint-config,typescript-config}
mkdir -p apps/{web,backend,ws}
```

### Step 3: Create UI Package

**File:** `packages/ui/package.json`
```json
{
  "name": "@repo/ui",
  "version": "0.0.1",
  "private": true,
  "exports": {
    "./button": "./src/button.tsx",
    "./logo": "./src/logo.tsx",
    "./card": "./src/card.tsx",
    "./inputbox": "./src/inputbox.tsx"
  },
  "devDependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

**Create Component Files:**

**`packages/ui/src/button.tsx`**
```tsx
import { ReactElement } from "react"

interface ButtonProps {
  size: "lg" | "md" | "sm"
  variant: "primary" | "secondary"
  text: string
  onClick?: (...args: any[]) => void
  img?: ReactElement
  active?: boolean
}

const SizeStyles = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4"
}

const VariantStyles = {
  primary: "bg-white text-black transition-all hover:cursor-pointer hover:scale-110 font-geist rounded-md shadow-xl",
  secondary: "bg-slate-600 text-white transition-all hover:cursor-pointer hover:scale-110 font-geist rounded-md shadow-xl"
}

export function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`${SizeStyles[props.size]} ${VariantStyles[props.variant]} ${
        props.active ? "ring-2 ring-slate-500" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {props.img && props.img}
        {props.text}
      </div>
    </button>
  )
}
```

**`packages/ui/src/logo.tsx`**
```tsx
interface LogoProps {
  size?: "sm" | "lg"
}

export function Logo({ size = "lg" }: LogoProps) {
  return (
    <div className="flex items-center">
      <img src="/pen.gif" className={size === "sm" ? "h-10 w-10" : "h-20 w-20"} />
      <p className={`text-white font-azeret font-bold ${size === "sm" ? "text-2xl" : "text-8xl"}`}>
        ZRAW
      </p>
    </div>
  )
}
```

### Step 4: Configure Fonts

**File:** `apps/web/app/globals.css`
```css
@import "tailwindcss";

@font-face {
  font-family: "azeret";
  src: url(./fonts/Azeret_Mono/AzeretMono-VariableFont_wght.ttf);
}

@font-face {
  font-family: "geist";
  src: url(./fonts/Geist/Geist-VariableFont_wght.ttf);
}

@theme {
  --font-azeret: "azeret", monospace;
  --font-geist: "geist", monospace;
}
```

### Step 5: Create Pages

**File:** `apps/web/app/page.tsx` (Landing Page)
```tsx
"use client"
import { Logo } from "@repo/ui/logo"
import { Button } from "@repo/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function Landing() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % 2)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-slate-900 min-h-screen w-full">
      <div className="relative flex items-center justify-center px-4 md:px-8 py-4 border-b border-slate-700">
        <Logo />
        <div className="absolute right-4 md:right-8">
          <Button
            img={<img src="arrow_v1.gif" className="h-6 w-6 md:h-10 md:w-10" />}
            onClick={() => router.push("/signup")}
            size="sm"
            text="Get Started"
            variant="primary"
          />
        </div>
      </div>
      <div className="flex flex-col items-center pt-10 md:pt-16 gap-4 px-4">
        <p className="text-white text-3xl md:text-5xl lg:text-6xl font-bold font-azeret tracking-tight text-center">
          Draw.Think.Collaborate.
        </p>
        <p className="text-slate-400 text-base md:text-xl font-geist text-center">
          The open canvas for your best ideas.
        </p>
      </div>
    </div>
  )
}
```

### Step 6: Create Canvas Components

**File:** `apps/web/app/components/toolbar.tsx`
```tsx
interface ToolbarProps {
  activeTool: string
  setActiveTool: (tool: string) => void
}

export function ToolBar(props: ToolbarProps) {
  const tools = [
    { name: "pen", icon: "/images/tools/tool_pen.png" },
    { name: "line", icon: "/images/tools/tool_line.png" },
    { name: "square", icon: "/images/tools/tool_square.png" },
    { name: "rectangle", icon: "/images/tools/tool_rectangle.png" },
    { name: "circle", icon: "/images/tools/tool_circle.png" },
    { name: "arrow", icon: "/images/tools/tool_arrow.png" },
    { name: "eraser", icon: "/images/tools/tool_eraser.png" },
    { name: "text", icon: "/images/tools/tool_text.png" }
  ]

  return (
    <div className="bg-zinc-100 h-20 w-100 flex items-center rounded-md shadow-xl gap-2 px-4">
      {tools.map(tool => (
        <img
          key={tool.name}
          src={tool.icon}
          onClick={() => props.setActiveTool(tool.name)}
          className={`h-10 w-10 cursor-pointer rounded-md ${
            props.activeTool === tool.name ? "ring-2 ring-slate-700" : ""
          }`}
        />
      ))}
    </div>
  )
}
```

### Step 7: Set Up Tailwind Configuration

**File:** `apps/web/tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        azeret: ['var(--font-azeret)'],
        geist: ['var(--font-geist)'],
      },
      width: {
        100: '400px',
        110: '440px',
      },
      height: {
        90: '360px',
        120: '480px',
      }
    },
  },
  plugins: [],
}
export default config
```

### Step 8: Environment Configuration

**File:** `apps/web/.env.local`
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Step 9: Asset Structure

Create directory structure for images:
```
public/
├── images/
│   ├── colors/
│   │   ├── color_black.png
│   │   ├── color_red.png
│   │   ├── color_blue.png
│   │   ├── color_purple.png
│   │   ├── color_pink.png
│   │   ├── color_yellow.png
│   │   ├── color_green.png
│   │   ├── color_teal.png
│   │   └── color_orange.png
│   ├── tools/
│   │   ├── tool_pen.png
│   │   ├── tool_line.png
│   │   ├── tool_square.png
│   │   ├── tool_rectangle.png
│   │   ├── tool_circle.png
│   │   ├── tool_arrow.png
│   │   ├── tool_eraser.png
│   │   └── tool_text.png
│   ├── user.png
│   └── screenshots/
│       ├── canvas1.png
│       └── canvas2.png
├── pen.gif
├── arrow_v1.gif
└── arrow_v2.gif
```

### Step 10: Run Application

```bash
cd apps/web
pnpm dev
```

Visit `http://localhost:3000`

---

## Best Practices

### 1. **Component Composition**
- Keep components focused on single responsibility
- Use composition over inheritance
- Pass props explicitly

### 2. **State Management**
- Use `useState` for local component state
- Use `useRef` for canvas and WebSocket references
- Lift state up when needed for data sharing

### 3. **Styling**
- Use Tailwind utility classes for consistency
- Follow the color palette
- Maintain responsive design with breakpoints

### 4. **Accessibility**
- Use semantic HTML elements
- Add proper alt text for images
- Ensure color contrast ratios
- Use proper label associations

### 5. **Performance**
- Memoize expensive computations with `useMemo`
- Use `useCallback` for event handlers
- Lazy load components when possible
- Optimize canvas rendering

### 6. **Type Safety**
- Define interfaces for all props
- Use TypeScript strict mode
- Avoid `any` types

---

## Troubleshooting

### Common Issues

**Issue:** Fonts not loading
- **Solution:** Ensure font files are in `apps/web/app/fonts/`
- Check font-face paths in `globals.css`

**Issue:** Colors not displaying correctly
- **Solution:** Verify color image paths in `public/images/colors/`
- Check z-index values for layering

**Issue:** Canvas not rendering
- **Solution:** Ensure canvas ref is properly attached
- Check z-index values (canvas should be z-0)

**Issue:** Responsive design breaking
- **Solution:** Use mobile-first approach
- Test with actual devices/DevTools

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

## License

This UI documentation is part of the Zraw project.

---

**Last Updated:** March 30, 2026
**Version:** 1.0.0
