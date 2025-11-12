# Design Guidelines: GitHub Repository Editor & Publisher

## Design Approach
**System**: VS Code / Developer Tools Pattern
**Justification**: This is a code-editing productivity application requiring maximum content visibility, familiar developer patterns, and efficient information density. Drawing from VS Code, GitHub Desktop, and Linear for clean, functional interfaces.

## Core Layout Architecture

### Split-Panel System
- **Three-column layout**: File navigator (20%) | Code editor (50%) | Live preview (30%)
- Resizable panels with drag handles between sections
- Collapsible sidebar for maximum editor space
- Full-height panels (100vh minus header)

### Header Bar
- Repository selector dropdown (left)
- Current branch indicator with switch capability
- Commit/Push action buttons (right)
- Save status indicator
- Fixed height: 14 (h-14)

## Typography System

### Font Families
- **UI Text**: Inter (Google Fonts) - all interface elements
- **Code**: JetBrains Mono (Google Fonts) - editor content only

### Type Scale
- **Header/Nav**: text-sm font-medium
- **File names**: text-xs
- **Code editor**: text-sm leading-relaxed
- **Buttons**: text-sm font-semibold
- **Status text**: text-xs

## Spacing System
**Tailwind units**: 2, 3, 4, 6, 8, 12, 14
- Component padding: p-4
- Section gaps: gap-4
- Button padding: px-4 py-2
- Panel padding: p-6
- Header height: h-14

## Component Library

### File Navigator
- Hierarchical tree structure with indent levels (pl-4 per level)
- File/folder icons from Heroicons (DocumentIcon, FolderIcon)
- Expandable folders with chevron indicators
- Current file highlight treatment
- File type badges (.html, .css, .js)

### Code Editor Area
- Line numbers in gutter (w-12)
- Syntax highlighting zones (use Prism.js or similar)
- Current line highlight
- Breadcrumb path at top (text-xs)
- Modified indicator (dot) for unsaved changes

### Live Preview Panel
- iframe container for rendered website
- Device size toggles (desktop/tablet/mobile icons)
- Refresh button
- URL bar showing current page
- Responsive viewport sizing

### Repository Selector
- Dropdown with search capability
- Repository name + owner format
- Last updated timestamp
- Star count display
- Recent repositories list

### Action Buttons
- **Primary**: Commit & Push (prominent, right-aligned)
- **Secondary**: Save, Discard Changes
- **Icon buttons**: Refresh preview, Toggle sidebar, Settings
- Use Heroicons for all button icons

### Status Bar (Footer)
- File encoding, line/column position (left)
- Git status: branch, changes count (center)
- Preview status: loading/ready (right)
- Fixed height: h-8, text-xs

### Commit Dialog (Modal)
- Centered overlay (max-w-lg)
- Commit message textarea (rows-3)
- Changed files list with checkboxes
- Commit author info
- Cancel/Commit button pair

## Navigation Patterns
- Click file to open in editor
- Cmd/Ctrl+S to save
- Tab system for multiple open files (above editor)
- Keyboard shortcuts visible in tooltips

## Layout Behavior
- Maintain panel proportions on resize
- Minimum panel widths enforced (file nav: 200px, editor: 400px)
- Preview updates on save or after 2s pause in typing
- Sidebar collapse icon when width < 1024px

## Interaction States
- Hover: Subtle background shift on clickable items
- Active file: Border accent on left edge
- Loading: Skeleton screens for repository content
- Error states: Inline error messages in panels

## Accessibility
- Keyboard navigation for file tree (arrow keys, enter)
- Focus indicators on all interactive elements
- ARIA labels for icon buttons
- Screen reader announcements for save/commit actions

## Critical Constraints
- No forced animations - this is a productivity tool
- Maximize content area, minimize decorative elements  
- All panels must be functional from first load
- Clear visual hierarchy: content over chrome
- Fast, responsive interactions (no animation delays)

This is a **utility-first application** - every pixel serves a functional purpose. The design prioritizes speed, clarity, and familiar developer patterns over visual flourish.