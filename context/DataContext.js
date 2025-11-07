"use client"; // CRITICAL for Context with hooks

import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

// --- HELPER FUNCTION: Default Events ---
const newChallengeEvent = {
  title: "!! NEW CHALLENGE !!",
  start_date: "YYYY-MM-DD",
  end_date: "YYYY-MM-DD"
};

const newOnlineEvent = {
  title: "!! NEW SEASON !!",
  details: "Edit me",
  start_date: "YYYY-MM-DD",
  end_date: "YYYY-MM-DD",
  cycle_week: 0 // Will be recalculated
};

// --- HELPER FUNCTION: Renumbering ---
// This function re-calculates week and cycle_week for an entire list
const renumberList = (list, type) => {
  return list.map((event, index) => {
    const newWeek = index + 1;
    const newEvent = { ...event, week: newWeek };

    if (type === 'online') {
      // Recalculate cycle_week based on the 32-week cycle
      // (1-1) % 32 + 1 = 1
      // (32-1) % 32 + 1 = 32
      // (33-1) % 32 + 1 = 1
      const newCycleWeek = ((newWeek - 1) % 32) + 1;
      newEvent.cycle_week = newCycleWeek;
    }
    return newEvent;
  });
};


export const DataProvider = ({ children }) => {
  const [challenges, setChallenges] = useState([]);
  const [onlineSeasons, setOnlineSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... (useEffect for loading data remains the same) ...
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        // Do not call setLoading synchronously here; loading is initialized to true.
        // Load Challenges
        const storedChallenges = localStorage.getItem('challenges');
        if (storedChallenges) {
          setChallenges(JSON.parse(storedChallenges));
        } else {
          const res = await fetch('/challenge_cycle_54.json');
          const data = await res.json();
          if (!cancelled) setChallenges(data);
        }

        // Load Online Seasons
        const storedOnline = localStorage.getItem('onlineSeasons');
        if (storedOnline) {
          setOnlineSeasons(JSON.parse(storedOnline));
        } else {
          const res2 = await fetch('/online_cycle_52.json');
          const data2 = await res2.json();
          if (!cancelled) setOnlineSeasons(data2);
        }
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ... (useEffect for persisting data remains the same) ...
  useEffect(() => {
    if (!loading && challenges.length > 0) {
      localStorage.setItem('challenges', JSON.stringify(challenges));
    }
  }, [challenges, loading]);

  useEffect(() => {
    if (!loading && onlineSeasons.length > 0) {
      localStorage.setItem('onlineSeasons', JSON.stringify(onlineSeasons));
    }
  }, [onlineSeasons, loading]);


  // --- CRUD Functions ---

  const updateEvent = (type, updatedEvent) => {
    // ... (this function remains the same) ...
    if (type === 'challenge') {
      setChallenges(
        challenges.map((event) =>
          event.week === updatedEvent.week ? updatedEvent : event
        )
      );
    } else if (type === 'online') {
      setOnlineSeasons(
        onlineSeasons.map((event) =>
          event.week === updatedEvent.week ? updatedEvent : event
        )
      );
    }
  };
  
  const reorderChallenges = (reorderedList) => {
    // Re-number the list after reordering
    const renumbered = renumberList(reorderedList, 'challenge');
    setChallenges(renumbered);
  };
  
  const reorderOnline = (reorderedList) => {
    // Re-number the list after reordering
    const renumbered = renumberList(reorderedList, 'online');
    setOnlineSeasons(renumbered);
  };

  // --- NEW FUNCTIONS ---

  /**
   * Deletes an event and re-numbers the entire list.
   */
  const deleteAndShift = (type, weekToDelete) => {
    const [list, setList] = type === 'challenge'
      ? [challenges, setChallenges]
      : [onlineSeasons, setOnlineSeasons];
    
    let newList = list.filter(e => e.week !== weekToDelete);
    let renumberedList = renumberList(newList, type);
    setList(renumberedList);
  };

  /**
   * Inserts a new blank event and re-numbers the entire list.
   */
  const insertAndShift = (type, weekToInsertAt) => {
    const [list, setList, defaultEvent] = type === 'challenge'
      ? [challenges, setChallenges, newChallengeEvent]
      : [onlineSeasons, setOnlineSeasons, newOnlineEvent];
    
    const indexToInsertAt = list.findIndex(e => e.week === weekToInsertAt);
    if (indexToInsertAt === -1) return; // Should not happen

    let newList = [...list];
    newList.splice(indexToInsertAt, 0, defaultEvent); // Insert new event

    let renumberedList = renumberList(newList, type);
    setList(renumberedList);
  };


  const value = {
    challenges,
    onlineSeasons,
    loading,
    updateEvent,
    reorderChallenges,
    reorderOnline,
    deleteAndShift,    // <-- Add to context
    insertAndShift,  // <-- Add to context
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};