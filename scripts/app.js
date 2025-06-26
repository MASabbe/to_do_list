document.addEventListener('DOMContentLoaded', async () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const themeSwitcher = document.getElementById('theme-switcher');
  const notificationsBtn = document.getElementById('notifications-btn');
  const sortPriorityBtn = document.getElementById('sort-by-priority');
  const sortDateBtn = document.getElementById('sort-by-date');

  // Elemen untuk Modal Statistik
  const statsBtn = document.getElementById('stats-btn');
  const statsModal = document.getElementById('stats-modal');
  const closeBtn = document.querySelector('.close-btn');
  let statsChart = null; // Variabel untuk menyimpan instance chart

  // Cek tema yang tersimpan (localStorage masih cocok untuk ini)
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Ganti tema
  themeSwitcher.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
      theme = 'dark';
    } else {
      theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });

  // --- LOGIKA MODAL STATISTIK ---
  statsBtn.addEventListener('click', async () => {
    await updateStats();
    statsModal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    statsModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == statsModal) {
      statsModal.style.display = 'none';
    }
  });

  async function updateStats() {
    const tasks = await getTasks();
    const completed = tasks.filter(t => t.done).length;
    const active = tasks.length - completed;

    const ctx = document.getElementById('stats-chart').getContext('2d');

    if(statsChart) {
      statsChart.destroy(); // Hancurkan chart lama sebelum membuat yang baru
    }

    statsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Selesai', 'Aktif'],
        datasets: [{
          label: 'Status Tugas',
          data: [completed, active],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      }
    });

    document.getElementById('stats-summary').innerText = `Total Tugas: ${tasks.length}`;
  }
  // --- AKHIR LOGIKA STATISTIK ---

  // --- LOGIKA NOTIFIKASI ---
  notificationsBtn.addEventListener('click', async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Izin notifikasi diberikan.');
      notificationsBtn.style.display = 'none'; // Sembunyikan tombol
      new Notification('Notifikasi diaktifkan!', {
        body: 'Anda akan menerima pengingat untuk tugas Anda.',
        icon: 'images/icon-192x192.png'
      });
    } else {
      console.log('Izin notifikasi ditolak.');
    }
  });

  function scheduleNotification(task) {
    if (!task.dueDate || Notification.permission !== 'granted') return;

    const dueDate = new Date(`${task.dueDate}T00:00:00`);
    const now = new Date();
    // Pengingat 1 hari sebelum deadline
    const reminderTime = dueDate.getTime() - (24 * 60 * 60 * 1000);

    if (reminderTime > now.getTime()) {
      const delay = reminderTime - now.getTime();
      setTimeout(() => {
        showNotification(task);
      }, delay);
    }
  }

  function showNotification(task) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(`Pengingat Tugas: ${task.title}`, {
        body: `Tugas "${task.title}" akan jatuh tempo besok!`,
        icon: 'images/icon-192x192.png',
        tag: `task-${task.id}`
      });
    });
  }
  // --- AKHIR LOGIKA NOTIFIKASI ---

  // Fungsi untuk render tugas, bisa menerima array tugas tertentu
  const renderTasks = (tasksToRender) => {
    // Jika tidak ada tugas yang diberikan, ambil dari DB (ini akan terjadi saat load awal)
    if (!tasksToRender) {
      getTasks().then(tasks => renderTasks(tasks));
      return;
    }

    taskList.innerHTML = '';
    tasksToRender.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = `task-item ${task.done ? 'done' : ''}`;
      taskItem.dataset.id = task.id; // Gunakan ID unik

      taskItem.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
                <div class="details">
                    <span>Tanggal: ${task.dueDate || 'N/A'}</span> |
                    <span>Prioritas: ${task.priority}</span> |
                    <span>Kategori: ${task.category || 'N/A'}</span>
                </div>
                <div class="actions">
                    <button class="done-btn">${task.done ? 'Batal' : 'Selesai'}</button>
                    <button class="delete-btn">Hapus</button>
                </div>
            `;
      taskList.appendChild(taskItem);
    });
  };

  // Tambah tugas
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(), // Tambahkan ID unik
      title: document.getElementById('task-title').value,
      description: document.getElementById('task-desc').value,
      dueDate: document.getElementById('task-due-date').value,
      priority: document.getElementById('task-priority').value,
      category: document.getElementById('task-category').value,
      done: false
    };
    await saveTask(newTask);
    scheduleNotification(newTask); // Jadwalkan notifikasi untuk tugas baru
    taskForm.reset();
    renderTasks();
  });

  // Aksi pada tugas (selesai/hapus) menggunakan event delegation dan ID
  taskList.addEventListener('click', async (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;

    const taskId = Number(taskItem.dataset.id);
    const tasks = await getTasks();
    const taskToUpdate = tasks.find(t => t.id === taskId);

    if (!taskToUpdate) return;

    if (e.target.classList.contains('done-btn')) {
      taskToUpdate.done = !taskToUpdate.done;
      await saveTask(taskToUpdate);
    }

    if (e.target.classList.contains('delete-btn')) {
      await deleteTask(taskId);
    }

    renderTasks(); // Render ulang dari state terbaru di DB
  });

  // Logika Pengurutan
  sortPriorityBtn.addEventListener('click', async () => {
    const tasks = await getTasks();
    const priorityMap = { 'high': 3, 'medium': 2, 'low': 1 };
    tasks.sort((a, b) => (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0));
    renderTasks(tasks);
  });

  sortDateBtn.addEventListener('click', async () => {
    const tasks = await getTasks();
    tasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    renderTasks(tasks);
  });

  // Registrasi Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('Service Worker terdaftar:', registration))
        .catch(error => console.log('Registrasi Service Worker gagal:', error));
    });
  }

  renderTasks();
});
