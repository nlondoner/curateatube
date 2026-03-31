
# CurateATube MVP — Implementation Plan

## Overview
A kid-safe YouTube viewer with a soft pastel, YouTube Kids-inspired interface. Parents approve videos and channels via paste-a-link; children see only approved content in a playful grid. All data stored in localStorage.

## Screens & Features

### 1. Child Home Screen
- Large rounded thumbnail grid (YouTube Kids style) with soft pastel background (light blue, mint, pink accents)
- **Videos section first** — big cards with thumbnail, title, channel name
- **Channels section second** — circular avatar tiles with channel name
- Empty state: friendly illustration + "Ask your parent to add some shows! 🎬"
- Parent settings icon (small gear/lock icon in corner)
- Tap video → Video Player; Tap channel → Channel Page

### 2. Channel Page
- Channel avatar + name header
- Grid of that channel's approved videos, newest first
- Back button to home

### 3. Video Player
- Embedded YouTube player (iframe embed)
- Title, channel name, description below
- Controls: play/pause, seek, volume, fullscreen (YouTube's built-in)
- End-of-video options: Replay, Back, Home buttons
- Large touch-friendly buttons

### 4. Parent Unlock
- Tap gear icon → random math challenge (e.g., "What is 17 × 8?")
- Harder multiplication/division to prevent kids solving it
- Correct answer → Parent Settings

### 5. Parent Settings
- Single URL input field — paste a YouTube video or channel URL
- "Add" button — validates URL format, extracts video/channel ID, fetches thumbnail via oEmbed (for videos) or constructs from known YouTube patterns
- **Allowed Videos** list — thumbnail + title + remove button
- **Allowed Channels** list — avatar + name + remove button
- "Save" button — persists to localStorage
- Changes staged until save; unsaved changes prompt on exit
- "Back to Kid Mode" button
- Invalid/duplicate URL shows inline error

### 6. Broken Content Handling
- If an embed fails to load, hide from child view
- Flag in parent settings with a warning icon

## Technical Approach
- **Routing**: Home (`/`), Channel (`/channel/:id`), Player (`/watch/:id`), Parent Settings (modal/overlay with math gate)
- **Data**: localStorage with JSON structure matching the PRD data model (videos + channels arrays with id, youtubeVideoId/youtubeChannelId, title, thumbnailUrl, etc.)
- **Metadata**: Use YouTube oEmbed (`noembed.com` as proxy) for video titles/thumbnails on paste. Channel metadata entered manually or derived from video data.
- **Video embed**: Standard YouTube iframe embed with `youtube-nocookie.com` for privacy
- **Styling**: Soft pastel palette — light blue (#E0F2FE), mint (#D1FAE5), pink (#FCE7F3), lavender (#EDE9FE) — with rounded corners, large touch targets, playful sans-serif font
- **Responsive**: CSS grid that adapts from 2 columns (tablet) to 4-5 columns (desktop), large tap targets throughout

## Design Language
- Rounded cards (16-20px radius)
- Soft drop shadows
- Large thumbnails (16:9 aspect ratio for videos, circles for channels)
- Playful but calm — no harsh colors
- Big, friendly typography
- Minimal navigation — home icon always visible
