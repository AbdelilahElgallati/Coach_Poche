"use client";

import { useState } from "react";
import ProfileForm from "@/components/ProfileForm";
import WorkoutPlanDisplay from "@/components/WorkoutPlanDisplay";
import { UserProfile, WorkoutPlan } from "@/types";
import { Dumbbell, AlertCircle, ArrowLeft } from "lucide-react";

export default function Home() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const generatePlan = async (userProfile: UserProfile) => {
    setLoading(true);
    setError("");
    setProfile(userProfile);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: userProfile }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erreur lors de la génération");
      }

      const data = await response.json();
      setPlan(data);
    } catch (err: any) {
      setError(err.message || "Impossible de générer le programme. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const adjustPlan = async (feedback: string) => {
    if (!profile || !plan) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            profile, 
            currentPlan: plan, 
            feedback 
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajustement");

      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError("Impossible d'ajuster le programme.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 transform rotate-3 hover:rotate-6 transition-transform">
                <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Coach de Poche
            </h1>
        </div>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Votre coach personnel alimenté par l'IA. Obtenez un programme sur-mesure adapté à votre corps, vos objectifs et votre matériel.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl relative mb-8 max-w-md w-full flex items-center gap-3 animate-in shake" role="alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="block sm:inline font-medium">{error}</span>
        </div>
      )}

      {!plan ? (
        <ProfileForm onSubmit={generatePlan} isLoading={loading} initialData={profile} />
      ) : (
        <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full max-w-4xl flex justify-start mb-6">
                <button 
                    onClick={() => setPlan(null)}
                    className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-white/50"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Modifier mon profil
                </button>
            </div>
            <WorkoutPlanDisplay plan={plan} onAdjust={adjustPlan} isAdjusting={loading} />
        </div>
      )}
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Coach de Poche. Propulsé par Open Router AI.</p>
      </footer>
    </main>
  );
}
