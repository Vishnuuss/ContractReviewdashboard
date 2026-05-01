import * as THREE from 'three';
import Chart from 'chart.js/auto';
import { createIcons, icons } from 'lucide';
import { getDashboardPage, getLibraryPage, getFlagsPage, getPipelinePage, getSettingsPage, getNotificationsPage } from './pages.js';

// --- INIT APP ---
document.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons });
  initCursor();
  initBackground();
  initNavigation();
  initTouchRipples();
  initSearch();
  initModal();
  
  // Render Dashboard by default
  renderPage('dashboard');
});

// --- STATE & INSTANCES ---
const state = {
  currentPage: 'dashboard',
  contracts: [
    { id: 'CTR-2025-0047', name: 'NexaCloud Technologies', type: 'SaaS', score: 71, level: 'HIGH', rec: 'Negotiate', time: '2 hours ago' },
    { id: 'CTR-2025-0038', name: 'GlobalPay Corp', type: 'Payment Processing', score: 88, level: 'CRITICAL', rec: 'Escalate', time: '3 hours ago' },
    { id: 'CTR-2025-0041', name: 'TechBridge Solutions', type: 'MSA', score: 55, level: 'MEDIUM', rec: 'Negotiate', time: '4 hours ago' },
    { id: 'CTR-2025-0031', name: 'Rakesh Ventures Ltd', type: 'NDA', score: 23, level: 'LOW', rec: 'Sign', time: '1 day ago' },
  ]
};

const chartInstances = {};

// --- CURSOR ---
function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const ring = document.getElementById('cursor-ring');
  const dot = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mouseX = window.innerWidth / 2; let mouseY = window.innerHeight / 2;
  let ringX = mouseX; let ringY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  const updateRing = () => {
    ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(updateRing);
  };
  requestAnimationFrame(updateRing);

  document.addEventListener('mousedown', () => ring.classList.add('clicking'));
  document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

  document.body.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, .kpi-card, .with-ripple, tr, .upload-dropzone, .chip')) {
      ring.classList.add('active');
    }
  });
  document.body.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input, .kpi-card, .with-ripple, tr, .upload-dropzone, .chip')) {
      ring.classList.remove('active');
    }
  });
}

// --- TOUCH RIPPLES ---
function initTouchRipples() {
  document.body.addEventListener('click', function(e) {
    const target = e.target.closest('.with-ripple, .nav-item');
    if (!target) return;
    
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - rect.left - radius}px`;
    ripple.style.top = `${e.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple');
    
    const existing = target.querySelector('.ripple');
    if (existing) existing.remove();
    
    target.style.position = target.style.position || 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);
    
    setTimeout(() => { if (ripple) ripple.remove(); }, 600);
  });
}

// --- BACKGROUND ---
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const geometry = new THREE.BufferGeometry();
  const particlesCount = 150; 
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 150;
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const material = new THREE.PointsMaterial({ size: 0.6, color: 0x00c8ff, transparent: true, opacity: 0.5 });
  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  let mouseX = 0; let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5; mouseY = e.clientY / window.innerHeight - 0.5;
  });

  const animate = () => {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.0005;
    if (!window.matchMedia("(pointer: coarse)").matches) {
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    }
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- NAVIGATION ---
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const page = link.getAttribute('data-page');
      
      const titleEl = document.getElementById('page-title');
      if (titleEl) titleEl.textContent = link.querySelector('span')?.textContent || page.toUpperCase();
      
      renderPage(page);
    });
  });
}

// --- UTILS & GLOBAL FUNCTIONS ---
window.showToast = (msg, type='success') => {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let color = type === 'success' ? '#00ff88' : type === 'error' ? '#ff2d55' : type === 'warning' ? '#ff6b35' : '#00c8ff';
  toast.style.borderLeftColor = color;
  toast.innerHTML = `<div style="font-weight:600;margin-bottom:4px;color:${color}">${type.toUpperCase()}</div><div style="font-size:13px">${msg}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

window.resolveActionItem = (id) => {
  const item = document.getElementById(id);
  if (item) {
    item.style.transition = 'all 0.3s ease';
    item.style.opacity = '0';
    item.style.transform = 'translateX(100px)';
    setTimeout(() => {
      item.remove();
      window.showToast('Flag successfully resolved.', 'success');
      
      // Update badge
      const badge = document.getElementById('nav-flags-badge');
      if (badge) {
        let count = parseInt(badge.textContent);
        if (count > 0) badge.textContent = count - 1;
      }
    }, 300);
  }
};

window.openCompanyDetails = (contractId) => {
  const contract = state.contracts.find(c => c.id === contractId);
  if (!contract) return;
  
  document.getElementById('modal-company-name').textContent = contract.name;
  document.getElementById('modal-contract-id').textContent = contract.id;
  document.getElementById('modal-contract-type').textContent = contract.type;
  
  const scoreEl = document.getElementById('modal-risk-score');
  scoreEl.textContent = contract.score;
  scoreEl.style.color = contract.level === 'CRITICAL' ? 'var(--color-danger)' : contract.level === 'HIGH' ? 'var(--color-warning)' : 'var(--color-success)';
  
  document.getElementById('modal-recommendation').textContent = contract.rec;
  
  document.getElementById('company-modal').classList.remove('hidden');
};

function initModal() {
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('company-modal').classList.add('hidden');
  });
  document.getElementById('company-modal').addEventListener('click', (e) => {
    if (e.target.id === 'company-modal') document.getElementById('company-modal').classList.add('hidden');
  });
}

// --- SEARCH BAR ---
function initSearch() {
  const input = document.getElementById('global-search');
  const dropdown = document.getElementById('search-dropdown');
  
  if (!input || !dropdown) return;

  input.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if (term.length < 1) {
      dropdown.classList.remove('active');
      return;
    }
    
    const results = state.contracts.filter(c => c.name.toLowerCase().includes(term) || c.id.toLowerCase().includes(term));
    
    if (results.length > 0) {
      dropdown.innerHTML = results.map(c => `
        <div class="search-item tap-anim" onclick="window.openCompanyDetails('${c.id}'); document.getElementById('search-dropdown').classList.remove('active'); document.getElementById('global-search').value = '';">
          <div>
            <div class="search-item-name">${c.name}</div>
            <div class="search-item-type">${c.type}</div>
          </div>
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--accent-primary);">${c.id}</div>
        </div>
      `).join('');
      dropdown.classList.add('active');
    } else {
      dropdown.innerHTML = '<div style="padding:16px; color:var(--text-secondary); font-size:12px; text-align:center;">No results found</div>';
      dropdown.classList.add('active');
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#search-container')) {
      dropdown.classList.remove('active');
    }
  });
}

// --- PAGE RENDERING ---
function destroyAllCharts() {
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
      chartInstances[key] = null;
    }
  });
}

function renderPage(pageId) {
  state.currentPage = pageId;
  const container = document.getElementById('pages-container');
  if (!container) return;

  destroyAllCharts();

  let html = '';
  if (pageId === 'dashboard') html = getDashboardPage(state);
  else if (pageId === 'contracts') html = getLibraryPage(state);
  else if (pageId === 'flags') html = getFlagsPage();
  else if (pageId === 'pipeline') html = getPipelinePage();
  else if (pageId === 'settings') html = getSettingsPage();
  else if (pageId === 'notifications') html = getNotificationsPage();

  container.innerHTML = html;
  createIcons({ icons });

  if (pageId === 'dashboard') initDashboardCharts();
  if (pageId === 'contracts') initUploader();
  if (pageId === 'flags') initFlagsCharts();
}

// --- CHARTS ---
function initDashboardCharts() {
  const ctx = document.getElementById('donutChart');
  if (!ctx) return;
  chartInstances.donut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        data: [8, 31, 89, 119],
        backgroundColor: ['#ff2d55', '#ff6b35', '#ffd60a', '#00ff88'],
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { 
        legend: { position: 'right', labels: { color: '#fff', font: { family: 'Outfit' } } },
        tooltip: { callbacks: { label: function(context) { return ' ' + context.label + ': ' + context.raw + ' Contracts'; } } }
      },
      cutout: '75%', animation: { animateScale: true, duration: 1000 }
    }
  });
}

function initFlagsCharts() {
  const ctx = document.getElementById('flagsBarChart');
  if (!ctx) return;
  chartInstances.bar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Auto-Renewal', 'Liability Cap', 'Price Escalation', 'Arbitration', 'Indemnification'],
      datasets: [{
        label: 'Count', data: [23, 19, 17, 14, 11],
        backgroundColor: '#ff2d55', borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
        y: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.7)' } }
      }
    }
  });
}

// --- UPLOADER LOGIC ---
function initUploader() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-upload');
  const btn = document.getElementById('btn-submit');
  if (!dropZone || !fileInput || !btn) return;

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault(); dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      showFileReady(e.dataTransfer.files[0].name);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) showFileReady(fileInput.files[0].name);
  });

  function showFileReady(name) {
    document.querySelector('.upload-text').textContent = name;
    document.querySelector('.upload-subtext').textContent = "Ready for processing";
    dropZone.style.borderColor = "var(--color-success)";
    dropZone.querySelector('i').style.color = "var(--color-success)";
  }

  btn.addEventListener('click', async () => {
    if (!fileInput.files.length) {
      window.showToast('Please select a file first', 'warning');
      return;
    }
    
    btn.innerHTML = '<i data-lucide="loader" class="spin" style="margin-right:8px;"></i> PROCESSING...';
    btn.style.opacity = '0.7';
    createIcons({ icons });

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('counterparty_name', document.getElementById('cp-name').value || 'Unknown Entity');

    try {
      const res = await fetch('http://localhost:5678/webhook/contract-review-wtf', { method: 'POST', body: formData });
      if (res.ok) {
        btn.innerHTML = '<i data-lucide="check"></i> ✓ SUCCESS';
        btn.style.background = 'var(--color-success)';
        btn.style.color = '#000';
        window.showToast('Contract dispatched to workflow.', 'success');
        
        state.contracts.unshift({
          id: 'CTR-NEW', name: document.getElementById('cp-name').value || 'New Upload',
          type: 'Processing', score: '-', level: 'PENDING', rec: '...', time: 'Just now'
        });
        
        setTimeout(() => { renderPage('contracts'); }, 2000);
      } else throw new Error('Server ' + res.status);
    } catch (err) {
      btn.innerHTML = '✗ FAILED';
      btn.style.background = 'var(--color-danger)';
      window.showToast('Failed to reach webhook. Is n8n running?', 'error');
      setTimeout(() => {
        btn.innerHTML = '<i data-lucide="zap"></i> PROCESS CONTRACT';
        btn.style.background = ''; btn.style.opacity = '1'; createIcons({ icons });
      }, 3000);
    }
  });
}
