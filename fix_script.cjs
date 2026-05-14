const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
let content = fs.readFileSync(file, 'utf8');

// Find the index of the first </script>
const scriptEndIdx = content.indexOf('</script>');
const scriptStartIdx = content.lastIndexOf('<script>', scriptEndIdx);

// The script tag is from scriptStartIdx to the end of the file currently, 
// because of the appended code.

const beforeScript = content.substring(0, scriptStartIdx);

const newScript = `<script>
// Counter animation
function animateCounter(el, target) {
    let current = 0;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
        current += Math.ceil(target / 100);
        if (current >= target) {
            el.innerText = target.toLocaleString();
            clearInterval(timer);
        } else {
            el.innerText = current.toLocaleString();
        }
    }, stepTime > 20 ? stepTime : 20);
}

// Sticky nav
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Scroll reveal
const obs = new IntersectionObserver(entries => {
    entries.forEach(el => { 
        if (el.isIntersecting) {
            el.target.classList.add('visible');
            obs.unobserve(el.target);
            if(el.target.classList.contains('counter')) {
                const target = parseInt(el.target.getAttribute('data-target'));
                if (!isNaN(target)) {
                    animateCounter(el.target, target);
                } else {
                    el.target.innerText = el.target.innerText || '0';
                }
            }
        }
    });
}, { threshold: 0.05 });
document.querySelectorAll('.reveal, .counter').forEach(el => obs.observe(el));

// Live Feed Logic
const feedData = [
    { city: 'São Paulo', time: 'há 2 min' },
    { city: 'Rio de Janeiro', time: 'há 5 min' },
    { city: 'Belo Horizonte', time: 'há 8 min' },
    { city: 'Curitiba', time: 'há 12 min' },
    { city: 'Salvador', time: 'há 15 min' }
];
let feedIdx = 0;
function updateFeed() {
    const feed = document.getElementById('liveFeed');
    if (!feed) return;
    feedIdx = (feedIdx + 1) % feedData.length;
    const item = feedData[feedIdx];
    feed.style.opacity = '0';
    setTimeout(() => {
        feed.innerHTML = \`
            <div class="feed-item">
                <span class="feed-dot"></span>
                <span class="feed-text">Novo agendamento em <strong>\${item.city}</strong> — \${item.time}</span>
            </div>
        \`;
        feed.style.opacity = '1';
    }, 400);
}
if(document.getElementById('liveFeed')) {
    setInterval(updateFeed, 6000);
}

// FOMO Popup Logic
const fomoData = [
    { name: 'Juliana R.', avatar: 'J', service: 'Manicure', time: 'há 1 min', color: 'var(--grad)' },
    { name: 'Carlos M.', avatar: 'C', service: 'Degradê', time: 'há 3 min', color: 'var(--grad2)' },
    { name: 'Ana Silva', avatar: 'A', service: 'Escova', time: 'há 5 min', color: 'var(--grad3)' },
    { name: 'Roberto G.', avatar: 'R', service: 'Barba', time: 'há 12 min', color: 'var(--grad)' }
];
let fomoTimer;
function showFomo() {
    const popup = document.getElementById('fomoPopup');
    if(!popup) return;
    const item = fomoData[Math.floor(Math.random() * fomoData.length)];
    const avatarEl = document.getElementById('fomoAvatar');
    if (avatarEl) {
        avatarEl.innerText = item.avatar;
        avatarEl.style.background = item.color;
    }
    const nameEl = document.getElementById('fomoName');
    if (nameEl) nameEl.innerText = item.name;
    const serviceEl = document.getElementById('fomoService');
    if (serviceEl) serviceEl.innerText = item.service;
    const timeEl = document.getElementById('fomoTime');
    if (timeEl) timeEl.innerText = item.time;
    
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 5000);
    fomoTimer = setTimeout(showFomo, Math.random() * 15000 + 10000);
}
if(document.getElementById('fomoPopup')) {
    setTimeout(showFomo, 5000);
}

// AI Chat Animation
const chatBody = document.getElementById('aiChatBody');
const typingMsg = document.getElementById('typingMsg');
if(chatBody && typingMsg) {
    setInterval(() => {
        typingMsg.style.display = 'block';
        if(document.getElementById('replyMsg')) {
            document.getElementById('replyMsg').remove();
        }
        setTimeout(() => {
            typingMsg.style.display = 'none';
            const reply = document.createElement('div');
            reply.className = 'msg bot';
            reply.id = 'replyMsg';
            reply.innerHTML = 'O Corte + Barba custa R$ 85,00. Temos horários livres hoje às 15:30 e 17:00! <br><br>👉 <a href="#" style="color:#A78BFA;text-decoration:none;font-weight:700;">Clique aqui para agendar</a>';
            chatBody.appendChild(reply);
        }, 2000);
    }, 8000);
}

// Magnetic elements with 3D Tilt
document.querySelectorAll('.btn-p, .btn-s, .nav-cta, .g-card, .price-card').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        
        const intensity = btn.classList.contains('g-card') || btn.classList.contains('price-card') ? 15 : 25;
        const rotateX = -y * Math.min(intensity, 20);
        const rotateY = x * Math.min(intensity, 20);
        
        btn.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale(1.02)\`;
        btn.style.transition = 'transform 0.1s ease-out';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    });
});

// Mouse tracking for dynamic effects
document.addEventListener('mousemove', e => {
    document.querySelectorAll('.bento-item').forEach(item => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        item.style.setProperty('--mouse-x', \`\${x}px\`);
        item.style.setProperty('--mouse-y', \`\${y}px\`);
    });

    document.querySelectorAll('.g-card, .price-card, .step-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', \`\${x}%\`);
        card.style.setProperty('--mouse-y', \`\${y}%\`);
    });
});

// Parallax effect for floating pills
let pillTicking = false;
window.addEventListener('mousemove', e => {
    if (!pillTicking) {
        window.requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            document.querySelectorAll('.hero-pill').forEach((pill, i) => {
                const factor = (i + 1) * 0.5;
                pill.style.transform = \`translate3d(\${x * factor}px, \${y * factor}px, 0)\`;
            });
            pillTicking = false;
        });
        pillTicking = true;
    }
}, { passive: true });

// FAQ toggle
function toggleFaq(btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

// Scroll progress bar
const progressEl = document.getElementById('scrollProgress');
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking && progressEl) {
        window.requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const total = document.body.scrollHeight - window.innerHeight;
            progressEl.style.width = (scrolled / total * 100) + '%';
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// ROI Calculator Logic
const roiTicket = document.getElementById('roiTicket');
const roiFaltas = document.getElementById('roiFaltas');
const roiMeses = document.getElementById('roiMeses');
const roiFaltasVal = document.getElementById('roiFaltasVal');
const roiMesesVal = document.getElementById('roiMesesVal');
const roiLostTotal = document.getElementById('roiLostTotal');
const roiSavedTotal = document.getElementById('roiSavedTotal');

function calculateROI() {
    if (!roiTicket) return;
    const ticket = parseFloat(roiTicket.value) || 0;
    const faltas = parseInt(roiFaltas.value) || 0;
    const meses = parseInt(roiMeses.value) || 0;

    roiFaltasVal.innerText = faltas + (faltas === 1 ? ' falta' : ' faltas');
    roiMesesVal.innerText = meses + (meses === 1 ? ' mês' : ' meses');

    const lostPerMonth = ticket * faltas * 4;
    const lostTotal = lostPerMonth * meses;
    
    const savedTotal = lostTotal * 0.8;

    roiLostTotal.innerText = lostTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    roiSavedTotal.innerText = savedTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

if (roiTicket) {
    roiTicket.addEventListener('input', calculateROI);
    roiFaltas.addEventListener('input', calculateROI);
    roiMeses.addEventListener('input', calculateROI);
    calculateROI();
}

// Init Lucide
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
</script>
</body>
</html>
`;

fs.writeFileSync(file, beforeScript + newScript);
console.log("Fixed!");
