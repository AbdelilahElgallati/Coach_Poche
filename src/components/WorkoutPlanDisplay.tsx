import { WorkoutPlan as WorkoutPlanType } from "@/types";
import { useState } from "react";
import { Calendar, RefreshCw, Send, Sparkles, Clock, Flame, Battery, MessageSquare } from "lucide-react";

interface WorkoutPlanProps {
    plan: WorkoutPlanType;
    onAdjust: (feedback: string) => void;
    isAdjusting: boolean;
}

export default function WorkoutPlanDisplay({ plan, onAdjust, isAdjusting }: WorkoutPlanProps) {
    const [customFeedback, setCustomFeedback] = useState("");

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customFeedback.trim()) {
            onAdjust(customFeedback);
            setCustomFeedback("");
        }
    };

    return (
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Votre Programme Hebdomadaire</h2>
                </div>

                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line relative z-10">
                    <p>{plan.advice}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plan.weeklySchedule.map((session, index) => (
                    <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                                <h3 className="font-bold text-lg text-gray-900">{session.day}</h3>
                            </div>
                            <span className="text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                                {session.focus}
                            </span>
                        </div>

                        <ul className="space-y-4">
                            {session.exercises.map((ex, idx) => (
                                <li key={idx} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-gray-800 text-sm">{ex.name}</span>
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                                            {ex.sets} x {ex.reps}
                                        </span>
                                    </div>
                                    {ex.notes && (
                                        <p className="text-xs text-gray-500 italic pl-2 border-l-2 border-gray-100">
                                            {ex.notes}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl text-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-700/50 rounded-lg backdrop-blur-sm">
                            <RefreshCw className={`w-6 h-6 text-indigo-400 ${isAdjusting ? 'animate-spin' : ''}`} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white">Ajustement intelligent</h3>
                            <p className="text-sm text-gray-400">Adaptez la séance à votre forme du jour</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                            onClick={() => onAdjust("Je suis fatigué, fais une séance plus légère aujourd'hui")}
                            disabled={isAdjusting}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-indigo-500/50 rounded-xl text-sm font-medium transition-all group"
                        >
                            <Battery className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                            <span>Je suis fatigué</span>
                        </button>
                        <button
                            onClick={() => onAdjust("J'ai peu de temps, fais une séance courte (20 min max)")}
                            disabled={isAdjusting}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-indigo-500/50 rounded-xl text-sm font-medium transition-all group"
                        >
                            <Clock className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span>Peu de temps</span>
                        </button>
                        <button
                            onClick={() => onAdjust("Je veux augmenter l'intensité pour la prochaine séance")}
                            disabled={isAdjusting}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-indigo-500/50 rounded-xl text-sm font-medium transition-all group"
                        >
                            <Flame className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                            <span>Plus intense</span>
                        </button>
                    </div>

                    <form onSubmit={handleCustomSubmit} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MessageSquare className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={customFeedback}
                            onChange={(e) => setCustomFeedback(e.target.value)}
                            placeholder="Autre demande (ex: J'ai mal au genou aujourd'hui...)"
                            className="w-full pl-10 pr-24 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            disabled={isAdjusting}
                        />
                        <button
                            type="submit"
                            disabled={isAdjusting || !customFeedback.trim()}
                            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span>Envoyer</span>
                            <Send className="w-3 h-3" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
