// ===== AgendAI — Interactive Demo Logic =====

let selectedService = null;
let selectedPrice = 0;
let selectedDay = null;
let selectedTime = null;

function selectService(btn, name, price) {
    document.querySelectorAll('.service-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedService = name;
    selectedPrice = price;

    const cal = document.getElementById('demoCalendar');
    cal.style.display = 'block';
    cal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    generateCalendar();
    generateTimeSlots();
}

function generateCalendar() {
    const grid = document.getElementById('calGrid');
    grid.innerHTML = '';
    const today = new Date();

    for (let i = 0; i < 14; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() + i);
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-day';
        dayEl.textContent = day.getDate();

        if (day.getDay() === 0) {
            dayEl.classList.add('disabled');
        } else {
            dayEl.addEventListener('click', () => selectDay(dayEl, day));
        }

        grid.appendChild(dayEl);
    }
}

function selectDay(el, date) {
    document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    selectedDay = date;
    checkConfirm();
}

function generateTimeSlots() {
    const grid = document.getElementById('timeGrid');
    grid.innerHTML = '';
    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'];

    times.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = time;
        slot.addEventListener('click', () => selectTime(slot, time));
        grid.appendChild(slot);
    });
}

function selectTime(el, time) {
    document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    selectedTime = time;
    checkConfirm();
}

function checkConfirm() {
    if (selectedService && selectedDay && selectedTime) {
        const confirm = document.getElementById('demoConfirm');
        confirm.style.display = 'block';

        document.getElementById('confirmService').textContent = selectedService;

        const dayStr = selectedDay.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
        document.getElementById('confirmDateTime').textContent = `${dayStr} às ${selectedTime}`;
        document.getElementById('confirmPrice').textContent = `R$ ${selectedPrice},00`;

        confirm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showSuccess() {
    document.getElementById('demoConfirm').style.display = 'none';
    document.getElementById('demoCalendar').style.display = 'none';
    document.querySelector('.demo-services').style.display = 'none';
    document.getElementById('demoSuccess').style.display = 'flex';
}

function toggleFaq(btn) {
    const item = btn.parentElement;
    item.classList.toggle('open');
}

// ===== Scroll animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.problem-card, .solution-card, .price-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});
