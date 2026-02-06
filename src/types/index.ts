export interface UserProfile {
    age: string;
    gender: 'Homme' | 'Femme';
    weight: string;
    height: string;
    daysPerWeek: string;
    equipment: string[];
    injuries: string;
    goal: string;
    sport: string;
    fitnessLevel: 'débutant' | 'intermédiaire' | 'avancé';
}

export interface WorkoutSession {
    day: string;
    focus: string;
    exercises: {
        name: string;
        sets: string;
        reps: string;
        notes?: string;
    }[];
}

export interface WorkoutPlan {
    weeklySchedule: WorkoutSession[];
    advice: string;
}
