const dbName = 'StudentTaskDB';
const storeName = 'tasks';

// Fungsi untuk membuka database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };

    request.onsuccess = event => {
      resolve(event.target.result);
    };

    request.onerror = event => {
      reject('Error opening database: ' + event.target.errorCode);
    };
  });
}

// Fungsi untuk mendapatkan semua tugas
async function getTasks() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = event => {
      reject('Error fetching tasks: ' + event.target.errorCode);
    };
  });
}

// Fungsi untuk menambah atau memperbarui tugas
async function saveTask(task) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(task);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = event => {
      reject('Error saving task: ' + event.target.errorCode);
    };
  });
}

// Fungsi untuk menghapus tugas
async function deleteTask(taskId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(taskId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = event => {
      reject('Error deleting task: ' + event.target.errorCode);
    };
  });
}
