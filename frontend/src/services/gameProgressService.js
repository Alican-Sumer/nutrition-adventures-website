export function saveScenarioComplete(userId, scenarioId) {
  const key = `progress_${userId}`;
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  data[scenarioId] = true;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getProgress(userId) {
  return JSON.parse(localStorage.getItem(`progress_${userId}`) || '{}');
}
