const holidays = {
    "01-01": "Confraternização Universal",
    "21-04": "Tiradentes",
    "01-05": "Dia do Trabalho",
    "07-09": "Independência do Brasil",
    "12-10": "Nossa Senhora Aparecida",
    "02-11": "Finados",
    "15-11": "Proclamação da República",
    "25-12": "Natal"
};
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const reminders = {};
let selectedDay = null;

document.getElementById('prev').addEventListener('click', () => changeMonth(-1));
document.getElementById('next').addEventListener('click', () => changeMonth(1));

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function renderCalendar() {
    document.getElementById('month-name').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    const daysContainer = document.querySelector('.days');
    daysContainer.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    // Dias do mês anterior
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        daysContainer.innerHTML += `<div class="prev-month">${prevMonthDays - i}</div>`;
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
        const dateKey = `${String(i).padStart(2, '0')}-${String(currentMonth + 1).padStart(2, '0')}`;
        const isHoliday = holidays[dateKey] ? 'holiday' : '';
        const reminder = reminders[`${currentYear}-${dateKey}`] ? `<br><small>${reminders[`${currentYear}-${dateKey}`]}</small>` : '';
        const isToday = (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) ? 'today' : '';
        daysContainer.innerHTML += `<div class="${isHoliday} ${isToday}" onclick="showReminderForm(${i})">${i}${reminder}</div>`;
    }

    // Dias do próximo mês
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells; // 42 = 7 dias * 6 semanas
    for (let i = 1; i <= remainingCells; i++) {
        daysContainer.innerHTML += `<div class="next-month">${i}</div>`;
    }
}

function showReminderForm(day) {
    selectedDay = day;
    document.getElementById('reminder-form').style.display = 'block';
}

function submitReminder() {
    const email = document.getElementById('email').value;
    const reminderText = document.getElementById('reminder').value;
    const dateKey = `${String(selectedDay).padStart(2, '0')}-${String(currentMonth + 1).padStart(2, '0')}`;
    if (email && reminderText) {
        reminders[`${currentYear}-${dateKey}`] = reminderText;
        sendEmailReminder(selectedDay, reminderText, email);
        renderCalendar();
        document.getElementById('reminder-form').style.display = 'none';
    }
}

function sendEmailReminder(day, reminder, email) {
    const dateKey = `${String(day).padStart(2, '0')}-${String(currentMonth + 1).padStart(2, '0')}`;
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        date: `${day} de ${monthNames[currentMonth]} de ${currentYear}`,
        reminder: reminder,
        email: email
    }, "YOUR_USER_ID")
    .then((response) => {
        console.log("Email enviado com sucesso!", response.status, response.text);
    }, (error) => {
        console.error("Erro ao enviar email:", error);
    });
}

renderCalendar();