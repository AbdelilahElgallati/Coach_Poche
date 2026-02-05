import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { profile, currentPlan, feedback } = await req.json();

    if (!GROQ_API_KEY) {
      console.log("No Groq API Key found, returning mock data.");
      return NextResponse.json(mockPlan(profile, feedback));
    }

    let prompt = "";
    if (currentPlan && feedback) {
      prompt = `
        Tu es un coach sportif expert. 
        Ajuste le programme d'entraînement hebdomadaire suivant en fonction des commentaires de l'utilisateur : "${feedback}".
        
        Programme actuel : ${JSON.stringify(currentPlan)}
        Profil de l'utilisateur : ${JSON.stringify(profile)}

        Le programme doit couvrir toute la semaine (7 jours, du Lundi au Dimanche).
        Si un jour n'est pas un jour d'entraînement (basé sur ${profile.daysPerWeek} jours par semaine), marque-le comme "Repos" ou "Récupération active".

        Retourne le plan mis à jour sous forme de JSON valide correspondant à cette structure :
        {
          "weeklySchedule": [
            {
              "day": "Lundi",
              "focus": "Légende / Focus",
              "exercises": [{ "name": "Exercice", "sets": "3", "reps": "12", "notes": "..." }]
            },
            ... (pour les 7 jours)
          ],
          "advice": "Conseils mis à jour..."
        }
        IMPORTANT : Retourne UNIQUEMENT la chaîne JSON brute. Ne pas inclure de blocs de code markdown.
        Langue : Français.
        `;
    } else {
      prompt = `
        Tu es un coach sportif expert en ${profile.sport}. Crée un programme d'entraînement hebdomadaire personnalisé pour cet utilisateur :
        ${JSON.stringify(profile)}

        Le programme doit être adapté à son niveau (${profile.fitnessLevel}), à son matériel (${profile.equipment.join(", ")}), et à ses blessures (${profile.injuries}).
        Genre : ${profile.gender}.
        Objectif : ${profile.goal}.
        Nombre de jours d'entraînement souhaités : ${profile.daysPerWeek} par semaine.
        
        Génère exactement 7 jours (Lundi à Dimanche) dans le weeklySchedule.
        Pour les jours où il n'y a pas d'entraînement (car il en veut ${profile.daysPerWeek}), indique "Repos" ou "Récupération active" dans le focus et laisse la liste des exercices vide ou suggère des étirements légers.

        Retourne UNIQUEMENT un JSON valide correspondant à cette structure :
        {
          "weeklySchedule": [
            {
              "day": "Lundi",
              "focus": "Focus du jour",
              "exercises": [{ "name": "Nom de l'exercice", "sets": "nombre de séries", "reps": "nombre de répétitions", "notes": "conseils optionnels" }]
            }
          ],
          "advice": "Conseils généraux pour la semaine."
        }
        IMPORTANT : Retourne UNIQUEMENT la chaîne JSON brute. Ne pas inclure de blocs de code markdown.
        Langue : Français.
        `;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "llama-3.3-70b-versatile",
        "messages": [
          { "role": "system", "content": "Tu es un coach sportif expert. Tu réponds uniquement en JSON." },
          { "role": "user", "content": prompt }
        ],
        "temperature": 0.7,
        "max_tokens": 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Groq API Error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || "";

    // Clean up markdown if present
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const plan = JSON.parse(cleanJson);
      return NextResponse.json(plan);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw Text:", text);
      return NextResponse.json({ error: "Invalid response from AI" }, { status: 500 });
    }

  } catch (error) {
    console.error("API Error:", error);

    // Fallback to mock plan on error instead of failing
    const reqJson = await req.json().catch(() => ({ profile: {}, feedback: "" }));
    const profile = reqJson.profile || {};
    const feedback = reqJson.feedback || "";

    console.log("Falling back to Mock Plan due to API error.");

    const fallbackPlan = mockPlan(profile, feedback);
    fallbackPlan.advice = `⚠️ Note : L'IA n'a pas pu répondre (Erreur API). Voici un plan par défaut.\n\n` + fallbackPlan.advice.replace("Mode Démo (API Key manquante)", "Mode Secours");

    return NextResponse.json(fallbackPlan);
  }
}

function mockPlan(profile: any, feedback?: string) {
  const adjustment = feedback ? ` (Ajusté : ${feedback})` : "";
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  const schedule = days.map((day, index) => {
    if (index === 0 || index === 2 || index === 4) { // Lundi, Mercredi, Vendredi
      return {
        day,
        focus: `${profile.sport || "Entraînement"} - Full Body`,
        exercises: [
          { name: "Pompes", sets: "3", reps: "10", notes: "Sur les genoux si besoin" },
          { name: "Squats", sets: "3", reps: "15", notes: "Dos droit" }
        ]
      };
    }
    return {
      day,
      focus: "Repos / Récupération",
      exercises: []
    };
  });

  return {
    advice: `Mode Démo (API Key manquante). Pour utiliser l'IA Groq, ajoutez GROQ_API_KEY dans .env.local.\n\nVoici un plan exemple de 7 jours pour ${profile.goal || "votre objectif"}.${adjustment}`,
    weeklySchedule: schedule
  };
}
