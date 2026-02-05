# Coach_Poche 🏋️‍♂️

**Coach_Poche** is a personal AI fitness coach designed to generate tailored weekly workout plans based on your profile, goals, and available equipment.

## ✨ Key Features

- **Personalized Training Plans**: High-quality plans generated specifically for your body and goals.
- **Sport-Specific Programs**: Choose from various sports (Musculation, Fitness, Yoga, Running, Crossfit, etc.).
- **Dynamic Equipment Mapping**: Equipment options adapt automatically to the selected sport.
- **7-Day Weekly Schedule**: Get a complete view of your week, including workout and rest days.
- **Smart Default Days**: Automatic training frequency recommendations based on your fitness level:
  - **Débutant**: 3 days
  - **Intermédiaire**: 4 days
  - **Avancé**: 5 days
- **AI-Powered by Groq**: Lightning-fast plan generation using Llama 3.

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- A [Groq API Key](https://console.groq.com/keys)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

### Running the App

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠 Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Backend**: Groq (Llama 3.3 70B)
- **Language**: TypeScript
