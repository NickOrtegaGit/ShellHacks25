# Brain Boost - Educational Content Detector

**A Chrome extension that transforms social media consumption by detecting and celebrating educational content across platforms.**

_Developed for ShellHacks 2025_

## What It Does

Brain Boost revolutionizes how we consume social media by using AI to analyze content for educational value in real-time. Instead of mindlessly scrolling, users can now identify and celebrate learning opportunities across Instagram, TikTok, YouTube, and Twitter/X.

## Key Features

- **Real-Time Educational Analysis**: Uses Google Gemini AI to score content 0-100 for educational value
- **Interactive Billy Mascot**: Animated mascot reactions change based on content quality:
  - **KawaiiBilly.gif**: High educational value (80-100) - celebrates learning!
  - **BillyMedium.gif**: Moderate educational value (60-79) - cautiously optimistic
  - **BillyRIP.gif**: Low educational value (0-59) - disappointed but honest
- **Multi-Platform Support**: Works seamlessly on Instagram, TikTok, YouTube, and Twitter/X
- **Retro Gaming Aesthetic**: Complete with pixelated Press Start 2P fonts and retro styling
- **One-Click Analysis**: Toggle button or Ctrl+Shift+B hotkey for instant analysis

## The Problem We Solve

Social media platforms are designed to be addictive, often promoting mindless consumption over meaningful learning. Users struggle to:

- Identify educational content among entertainment
- Make conscious decisions about content consumption
- Break the cycle of endless, valueless scrolling
- Find learning opportunities in their feeds

## Our Solution

Brain Boost empowers users to:

- **Discover**: Instantly identify educational content with AI analysis
- **Celebrate**: Positive reinforcement for engaging with valuable content
- **Reflect**: Make conscious choices about what content to consume
- **Learn**: Turn social media time into learning opportunities

## Technical Implementation

- **Frontend**: Chrome Extension (Manifest V3) with content scripts
- **AI Integration**: Google Gemini 2.5 Flash for content analysis
- **Platform Detection**: Dynamic platform recognition and adaptation
- **Visual Feedback**: Animated GIF system with mascot reactions
- **Typography**: Custom retro gaming font integration (Press Start 2P)

## Installation for Judges

1. Download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The Brain Boost extension will appear in your toolbar

## How to Use

1. **Visit any supported platform** (Instagram, TikTok, YouTube, Twitter/X)
2. **Look for the blue floating button** in the bottom right corner
3. **Click the button** or press `Ctrl+Shift+B` to analyze content
4. **Watch Billy's reaction** and see the educational value score!

## Why This Matters

In an age of information overload, Brain Boost represents a paradigm shift toward **conscious consumption**. By gamifying the discovery of educational content, we're not just building an extension - we're fostering a culture of lifelong learning and mindful social media use.

## Visual Examples

- **High Educational Value**: Green border, happy Billy, "HIGHLY EDUCATIONAL" message
- **Moderate Educational Value**: Orange border, medium Billy, "SOMEWHAT EDUCATIONAL" message
- **Low Educational Value**: Red border, sad Billy, "LOW EDUCATIONAL VALUE" message

## Technical Specifications

- **Platforms**: Chrome Browser (Manifest V3 compatible)
- **Supported Sites**: Instagram, TikTok, YouTube, Twitter/X
- **AI Model**: Google Gemini 2.5 Flash
- **Languages**: JavaScript, HTML, CSS
- **Fonts**: Press Start 2P (Google Fonts)

## Team

_Built with passion for educational technology and meaningful social media experiences._

---

**Brain Boost: Making social media smarter, one scroll at a time.**
