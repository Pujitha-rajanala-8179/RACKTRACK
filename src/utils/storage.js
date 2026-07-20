// Persists warehouse data to the browser's localStorage so inventory
// and order history survive refreshes and restarts of the dev server.
const PREFIX = "racktrack:";

export async function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("Storage load failed", key, e);
    return fallback;
  }
}

export async function saveKey(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save failed", key, e);
  }
}
