// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBlJWklhzP-ys7apK3jHdNydCKiHmxfrJs",
        authDomain: "signup-37e48.firebaseapp.com",
        projectId: "signup-37e48",
        storageBucket: "signup-37e48.firebasestorage.app",
        messagingSenderId: "578490476844",
        appId: "1:578490476844:web:1bc06706e2579b833b6489",
        measurementId: "G-RBYZG1VHKR"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    const auth = firebase.auth();

    // Calendar functionality
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // DOM Elements
    const monthYearElement = document.getElementById('monthYear');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const reminderModal = document.getElementById('reminderModal');
    const addReminderBtn = document.getElementById('addReminderBtn');
    const closeModal = document.querySelector('.close');
    const reminderForm = document.getElementById('reminderForm');
    const remindersList = document.getElementById('remindersList');

    // Check if all required elements exist
    if (!monthYearElement || !calendarDays || !prevMonthBtn || !nextMonthBtn || 
        !reminderModal || !addReminderBtn || !closeModal || !reminderForm || !remindersList) {
        console.error('Required DOM elements not found');
        return;
    }

    // Event Listeners
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    addReminderBtn.addEventListener('click', () => {
        reminderModal.style.display = 'block';
        document.getElementById('reminderDate').value = formatDate(currentDate);
    });

    closeModal.addEventListener('click', () => {
        reminderModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === reminderModal) {
            reminderModal.style.display = 'none';
        }
    });

    reminderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to add reminders');
            return;
        }

        const title = document.getElementById('reminderTitle').value;
        const date = document.getElementById('reminderDate').value;
        const time = document.getElementById('reminderTime').value;
        const description = document.getElementById('reminderDescription').value;

        try {
            await db.collection('reminders').add({
                title,
                date,
                time,
                description,
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            reminderModal.style.display = 'none';
            reminderForm.reset();
            updateCalendar();
            loadReminders();
        } catch (error) {
            console.error('Error adding reminder:', error);
            alert('Failed to add reminder. Please try again.');
        }
    });

    // Functions
    function updateCalendar() {
        monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        calendarDays.innerHTML = '';

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day other-month';
            calendarDays.appendChild(dayElement);
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;

            const date = new Date(currentYear, currentMonth, day);
            if (isToday(date)) {
                dayElement.classList.add('today');
            }

            dayElement.addEventListener('click', () => {
                showRemindersForDate(date);
            });

            calendarDays.appendChild(dayElement);
        }

        loadReminders();
    }

    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    async function loadReminders() {
        const user = auth.currentUser;
        if (!user) {
            remindersList.innerHTML = '<p>Please log in to view reminders</p>';
            return;
        }

        try {
            const remindersSnapshot = await db.collection('reminders')
                .where('userId', '==', user.uid)
                .orderBy('date')
                .get();

            const reminders = [];
            remindersSnapshot.forEach(doc => {
                reminders.push({ id: doc.id, ...doc.data() });
            });

            // Update calendar days with reminder indicators
            const dayElements = document.querySelectorAll('.day:not(.other-month)');
            dayElements.forEach(dayElement => {
                const day = parseInt(dayElement.textContent);
                const date = new Date(currentYear, currentMonth, day);
                const formattedDate = formatDate(date);

                const hasReminder = reminders.some(reminder => reminder.date === formattedDate);
                if (hasReminder) {
                    dayElement.classList.add('has-reminder');
                } else {
                    dayElement.classList.remove('has-reminder');
                }
            });

            // Update reminders list
            remindersList.innerHTML = '';
            if (reminders.length === 0) {
                remindersList.innerHTML = '<p>No reminders for this month</p>';
                return;
            }

            reminders.forEach(reminder => {
                const reminderElement = document.createElement('div');
                reminderElement.className = 'reminder-item';
                reminderElement.innerHTML = `
                    <h4>${reminder.title}</h4>
                    <p class="time">${reminder.date} at ${reminder.time}</p>
                    <p>${reminder.description}</p>
                    <button onclick="deleteReminder('${reminder.id}')" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                remindersList.appendChild(reminderElement);
            });
        } catch (error) {
            console.error('Error loading reminders:', error);
            remindersList.innerHTML = '<p>Error loading reminders</p>';
        }
    }

    window.deleteReminder = async function(reminderId) {
        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to delete reminders');
            return;
        }

        try {
            await db.collection('reminders').doc(reminderId).delete();
            loadReminders();
        } catch (error) {
            console.error('Error deleting reminder:', error);
            alert('Failed to delete reminder. Please try again.');
        }
    };

    function showRemindersForDate(date) {
        const formattedDate = formatDate(date);
        reminderModal.style.display = 'block';
        document.getElementById('reminderDate').value = formattedDate;
    }

    // Initialize calendar
    updateCalendar();

    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadReminders();
        } else {
            remindersList.innerHTML = '<p>Please log in to view reminders</p>';
        }
    });
}); 