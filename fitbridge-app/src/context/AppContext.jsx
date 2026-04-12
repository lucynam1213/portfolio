import { createContext, useContext, useState, useEffect } from 'react';
import {
  users as initialUsers,
  workouts as initialWorkouts,
  clients as initialClients,
  workoutHistory as initialHistory,
  meals as initialMeals,
  bodyMetrics as initialMetrics,
  notifications as initialNotifications,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('fitbridge_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [workouts, setWorkouts] = useState(() => {
    try {
      const stored = localStorage.getItem('fitbridge_workouts');
      return stored ? JSON.parse(stored) : initialWorkouts;
    } catch {
      return initialWorkouts;
    }
  });

  const [meals, setMeals] = useState(() => {
    try {
      const stored = localStorage.getItem('fitbridge_meals');
      return stored ? JSON.parse(stored) : initialMeals;
    } catch {
      return initialMeals;
    }
  });

  const [metrics, setMetrics] = useState(() => {
    try {
      const stored = localStorage.getItem('fitbridge_metrics');
      return stored ? JSON.parse(stored) : initialMetrics;
    } catch {
      return initialMetrics;
    }
  });

  const [workoutHistory, setWorkoutHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('fitbridge_history');
      return stored ? JSON.parse(stored) : initialHistory;
    } catch {
      return initialHistory;
    }
  });

  const [notifications, setNotifications] = useState(initialNotifications);
  const [clients] = useState(initialClients);

  // Persist to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fitbridge_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fitbridge_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fitbridge_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fitbridge_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('fitbridge_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('fitbridge_history', JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  function login(email, password) {
    const user = initialUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  function signup(name, email, password, role) {
    const exists = initialUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { success: false, error: 'Email already in use' };
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password,
      role,
      avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      streak: 0,
      totalWorkouts: 0,
    };
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('fitbridge_user');
  }

  function addMeal(meal) {
    const newMeal = { ...meal, id: `ml_${Date.now()}` };
    setMeals((prev) => [newMeal, ...prev]);
  }

  function addMetric(metric) {
    setMetrics((prev) => [metric, ...prev]);
  }

  function addWorkoutLog(log) {
    setWorkoutHistory((prev) => [log, ...prev]);
    setCurrentUser((prev) => prev ? { ...prev, totalWorkouts: (prev.totalWorkouts || 0) + 1, streak: (prev.streak || 0) + 1 } : prev);
  }

  function createWorkout(workout) {
    const newWorkout = { ...workout, id: `wkt_${Date.now()}`, assignedClients: 0 };
    setWorkouts((prev) => [...prev, newWorkout]);
    return newWorkout;
  }

  function assignWorkout(workoutId) {
    setWorkouts((prev) =>
      prev.map((w) => w.id === workoutId ? { ...w, assignedClients: (w.assignedClients || 0) + 1 } : w)
    );
  }

  function markNotificationRead(id) {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const totalCalories = meals
    .filter((m) => m.date === 'Today')
    .reduce((sum, m) => sum + m.calories, 0);

  const totalProtein = meals
    .filter((m) => m.date === 'Today')
    .reduce((sum, m) => sum + m.protein, 0);

  const totalCarbs = meals
    .filter((m) => m.date === 'Today')
    .reduce((sum, m) => sum + m.carbs, 0);

  const totalFat = meals
    .filter((m) => m.date === 'Today')
    .reduce((sum, m) => sum + m.fat, 0);

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      signup,
      logout,
      workouts,
      clients,
      workoutHistory,
      meals,
      metrics,
      notifications,
      unreadCount,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      addMeal,
      addMetric,
      addWorkoutLog,
      createWorkout,
      assignWorkout,
      markNotificationRead,
      markAllNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
