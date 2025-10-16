export function distributeDurations(totalDays, numTasks) {
  if (numTasks <= 0) return [];
  const base = Math.max(1, Math.floor(totalDays / numTasks));
  const remainder = Math.max(0, totalDays - base * numTasks);
  const durations = Array.from({ length: numTasks }, (_, i) => base + (i < remainder ? 1 : 0));
  return durations;
}

export function addDays(startDate, days) {
  const result = new Date(startDate);
  result.setDate(result.getDate() + days);
  return result;
}

export function scheduleSequential(startDate, tasks, totalDays = 14) {
  const durations = distributeDurations(totalDays, tasks.length);
  let cursor = new Date(startDate);
  return tasks.map((t, idx) => {
    const start = new Date(cursor);
    const end = addDays(start, durations[idx]);
    cursor = new Date(end);
    return { ...t, startDate: start, endDate: end };
  });
}


