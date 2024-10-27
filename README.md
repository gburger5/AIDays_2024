# Run frontend
1. Create .env file in root directory
    * *Windows*: `copy .env.example .env`, then fill in your Google Maps API Key
    * _Mac_: `cp .env.example .env`, then fill in your Google Maps API Key
1. `cd frontend`
1. `npm install`
1. Download **Expo Go** for mobile
1. `npx expo start -c` and scan the QR code

# Rescue Radar : AI DAYS 2024 Hackathon

**Slogan:** Aid made easy

## Inspiration
As Floridians, we know the chaos of natural disasters like hurricanes. During these events, finding essentials like fresh water or safe routes becomes challenging. Inspired by the spirit of community support seen during Hurricane Irma, we built Rescue Radar to help communities share real-time information when emergency services are overwhelmed.

## What It Does
Rescue Radar displays an interactive map with real-time community reports, such as road hazards or available resources. Each marker provides verified photos, descriptions, and timestamps, helping users find what they need or assist neighbors in trouble.

## How We Built It
Using React-Native and Expo, we created a cross-platform app for iOS and Android. ExpressJS manages server-side routing, MongoDB stores reports, and Firebase holds images. WatsonXAI generates report titles and groups similar incidents to avoid duplicates.

## Challenges
Integrating Firebase and Watson.AI during a hackathon was challenging, especially while syncing the API with our database. After overcoming errors, we built a smooth user-report pipeline.

## Accomplishments
We implemented offline functionality through data caching, ensuring users can access critical information even when internet access is limited. Balancing advanced features with disaster-specific needs was key to our success.

## What We Learned
Our team learned how to integrate IBM’s LLM tools and manage data flow between models and our database, expanding our full-stack skills.

## What's Next
- AI sanitization of user reports
- Auto-deletion of expired posts
- AI validation of report content
- Bug fixes and optimizations

Rescue Radar is poised to become a valuable tool for communities during emergencies.
