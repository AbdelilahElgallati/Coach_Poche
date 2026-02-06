import { useState } from "react";
import { UserProfile } from "@/types";
import { User, Weight, Ruler, Dumbbell, Activity, Target, Loader2, Calendar } from "lucide-react";

interface ProfileFormProps {
    onSubmit: (profile: UserProfile) => void;
    isLoading: boolean;
    initialData?: UserProfile | null;
}

const SPORT_OPTIONS = [
    "Musculation",
    "Fitness",
    "Yoga",
    "Running",
    "Crossfit",
    "Natation",
    "Cyclisme"
];

const EQUIPMENT_BY_SPORT: Record<string, string[]> = {
    "Musculation": ["Poids du corps", "Haltères", "Bandes élastiques", "Barre de traction", "Salle de sport complète", "Kettlebell", "Banc de musculation"],
    "Fitness": ["Poids du corps", "Tapis de sol", "Corde à sauter", "Petits haltères", "Step"],
    "Yoga": ["Poids du corps", "Tapis de sol", "Blocs de yoga", "Sangle de yoga"],
    "Running": ["Poids du corps", "Chaussures de running", "Montre GPS", "Tapis de course"],
    "Crossfit": ["Poids du corps", "Kettlebell", "Corde à sauter", "Barre d'haltérophilie", "Box jump", "Anneaux"],
    "Natation": ["Maillot de bain", "Lunettes", "Bonnet", "Planche", "Pull-buoy"],
    "Cyclisme": ["Vélo", "Casque", "Tenue de cyclisme", "Home-trainer"]
};

export default function ProfileForm({ onSubmit, isLoading, initialData }: ProfileFormProps) {
    const [profile, setProfile] = useState<UserProfile>(initialData || {
        age: "",
        gender: "Homme",
        weight: "",
        height: "",
        daysPerWeek: "3",
        equipment: [],
        injuries: "Aucune",
        goal: "Remise en forme",
        sport: "Musculation",
        fitnessLevel: "débutant",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setProfile((prev) => {
            const updated = { ...prev, [name]: value };

            if (name === "fitnessLevel") {
                if (value === "débutant") updated.daysPerWeek = "3";
                else if (value === "intermédiaire") updated.daysPerWeek = "4";
                else if (value === "avancé") updated.daysPerWeek = "5";
            }

            if (name === "sport") {
                updated.equipment = [];
            }

            return updated;
        });
    };

    const handleEquipmentChange = (item: string) => {
        setProfile((prev) => {
            const current = prev.equipment;
            if (current.includes(item)) {
                return { ...prev, equipment: current.filter((i) => i !== item) };
            } else {
                return { ...prev, equipment: [...current, item] };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(profile);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-100 transition-all hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <div className="p-3 bg-indigo-100 rounded-lg">
                    <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Votre Profil Sportif</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" /> Sexe
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="Homme"
                                checked={profile.gender === "Homme"}
                                onChange={handleChange}
                                className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-700">Homme</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="Femme"
                                checked={profile.gender === "Femme"}
                                onChange={handleChange}
                                className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-700">Femme</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" /> Jours / Semaine
                    </label>
                    <select
                        name="daysPerWeek"
                        value={profile.daysPerWeek}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all p-3 outline-none"
                    >
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                            <option key={num} value={num}>{num} jours</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" /> Âge
                    </label>
                    <input
                        type="number"
                        name="age"
                        value={profile.age}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all p-3 outline-none"
                        placeholder="Ex: 30"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Weight className="w-4 h-4 text-indigo-500" /> Poids (kg)
                    </label>
                    <input
                        type="number"
                        name="weight"
                        value={profile.weight}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all p-3 outline-none"
                        placeholder="Ex: 75"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-indigo-500" /> Taille (cm)
                    </label>
                    <input
                        type="number"
                        name="height"
                        value={profile.height}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all p-3 outline-none"
                        placeholder="Ex: 175"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-500" /> Niveau
                    </label>
                    <div className="relative">
                        <select
                            name="fitnessLevel"
                            value={profile.fitnessLevel}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all p-3 outline-none appearance-none"
                        >
                            <option value="débutant">Débutant</option>
                            <option value="intermédiaire">Intermédiaire</option>
                            <option value="avancé">Avancé</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-500" /> Sport
                    </label>
                    <div className="relative">
                        <select
                            name="sport"
                            value={profile.sport}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all p-3 outline-none appearance-none"
                        >
                            {SPORT_OPTIONS.map(sport => (
                                <option key={sport} value={sport}>{sport}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-indigo-500" /> Matériel disponible ({profile.sport})
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {(EQUIPMENT_BY_SPORT[profile.sport] || []).map((item) => (
                            <label key={item} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={profile.equipment.includes(item)}
                                    onChange={() => handleEquipmentChange(item)}
                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="text-sm text-gray-700">{item}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-500" /> Objectif principal
                    </label>
                    <input
                        type="text"
                        name="goal"
                        value={profile.goal}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all p-3 outline-none"
                        placeholder="Ex: Perdre 5kg, Prendre du muscle, Courir un marathon..."
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        🤕 Blessures / Contraintes (Optionnel)
                    </label>
                    <textarea
                        name="injuries"
                        value={profile.injuries}
                        onChange={handleChange}
                        rows={2}
                        className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all p-3 outline-none resize-none"
                        placeholder="Ex: Douleur au genou droit, pas de sauts..."
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-indigo-200 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Génération du programme en cours...
                    </>
                ) : (
                    <>
                        🚀 Générer mon programme
                    </>
                )}
            </button>
        </form>
    );
}
