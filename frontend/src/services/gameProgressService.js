export async function saveScenarioComplete(userId, scenarioId) {
  // Save to localStorage immediately
  const key = `progress_${userId}`;
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  data[scenarioId] = true;
  localStorage.setItem(key, JSON.stringify(data));

  // Persist to backend
  try {
    await fetch(`/api/users/${userId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId }),
    });
  } catch (e) {
    console.error('Failed to save progress to backend:', e);
  }
}

export async function getProgress(userId) {
  // Try backend first
  try {
    const res = await fetch(`/api/users/${userId}/progress`);
    if (res.ok) {
      const scenarioIds = await res.json();
      const progress = {};
      scenarioIds.forEach((id) => { progress[id] = true; });
      // Sync to localStorage
      localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
      return progress;
    }
  } catch (e) {
    console.error('Failed to load progress from backend:', e);
  }

  // Fallback to localStorage
  return JSON.parse(localStorage.getItem(`progress_${userId}`) || '{}');
}
