import * as THREE from 'three';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';
import { createIcons, icons } from 'lucide';
import { getFlagsPage, getPrivacyPage, getCommercialPage, getWebhookPage, getPipelinePage, getSettingsPage } from './pages.js';

// --- INIT APP ---
document.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons });
  initCursor();
  initBackground();
  initNavigation();
  initClock();
  initKeyboardShortcuts();
  
  // Render Dashboard by default
  renderPage('dashboard');
});

// --- STATE ---
const state = {
  currentPage: 'dashboard',
  contracts: [
    { id: 'CTR-2025-0047', name: 'NexaCloud Technologies', type: 'SaaS', score: 71, level: 'HIGH', rec: 'Negotiate', loc: 'Delaware', val: '$240K', time: '2 hours ago' },
    { id: 'CTR-2025-0038', name: 'GlobalPay Corp', type: 'Payment Processing', score: 88, level: 'CRITICAL', rec: 'Escalate', loc: 'USA', val: '$1.2M', time: '3 hours ago' },
    { id: 'CTR-2025-0041', name: 'TechBridge Solutions', type: 'MSA', score: 55, level: 'MEDIUM', rec: 'Negotiate', loc: 'Singapore', val: '$180K', time: '4 hours ago' },
    { id: 'CTR-2025-0031', name: 'Rakesh Ventures Ltd', type: 'NDA', score: 23, level: 'LOW', rec: 'Sign As-Is', loc: 'India', val: 'N/A', time: '1 day ago' },
  ]
};

// --- CURSOR ---
function initCursor() {
  const ring = document.getElementById('cursor-ring');
  const dot = document.getElementById('cursor-dot');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  const updateRing = () => {
    ringX += (mouseX - ringX) * 0.15; // lerp
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(updateRing);
  };
  requestAnimationFrame(updateRing);

  document.addEventListener('mousedown', () => ring.classList.add('clicking'));
  document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

  document.body.addEventListener('mouseenter', (e) => {
    if (e.target.closest && e.target.closest('a, button, input, .kpi-card, .feed-row, tr, .upload-zone, .chip')) {
      ring.classList.add('active');
    }
  }, true);
  document.body.addEventListener('mouseleave', (e) => {
    if (e.target.closest && e.target.closest('a, button, input, .kpi-card, .feed-row, tr, .upload-zone, .chip')) {
      ring.classList.remove('active');
    }
  }, true);
}

// --- BACKGROUND ---
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const geometry = new THREE.BufferGeometry();
  const particlesCount = 200;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 150;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const material = new THREE.PointsMaterial({
    size: 0.5,
    color: 0x00c8ff,
    transparent: true,
    opacity: 0.4
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  let mouseX = 0; let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  const animate = () => {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    // Parallax
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
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

// --- CLOCK ---
function initClock() {
  const el = document.getElementById('live-clock');
  setInterval(() => {
    const d = new Date();
    el.textContent = d.toTimeString().split(' ')[0];
  }, 1000);
}

// --- NAVIGATION ---
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const page = link.getAttribute('data-page');
      document.getElementById('current-page-label').textContent = link.querySelector('span').textContent;
      renderPage(page);
    });
  });
}

// --- UTILS ---
function animateNumber(element, finalValue, duration = 800) {
  let start = null;
  const initValue = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    element.textContent = Math.floor(easeProgress * finalValue);
    if (progress < 1) requestAnimationFrame(step);
    else element.textContent = finalValue;
  };
  requestAnimationFrame(step);
}

window.showToast = (msg, type='success') => {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let color = type === 'success' ? '#00ff88' : type === 'error' ? '#ff2d55' : type === 'warning' ? '#ff6b35' : '#00c8ff';
  toast.style.borderLeftColor = color;
  toast.innerHTML = `<div style="font-weight:600;margin-bottom:4px;color:${color}">${type.toUpperCase()}</div><div style="font-size:13px">${msg}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// --- KEYBOARD SHORTCUTS ---
function initKeyboardShortcuts() {
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdInput = document.getElementById('cmd-input');
  
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      cmdPalette.classList.toggle('hidden');
      if (!cmdPalette.classList.contains('hidden')) cmdInput.focus();
    }
    if (e.key === 'Escape' && !cmdPalette.classList.contains('hidden')) {
      cmdPalette.classList.add('hidden');
    }
  });
  document.querySelector('.cmd-esc').addEventListener('click', () => cmdPalette.classList.add('hidden'));
}

// --- PAGE RENDERING ---
function renderPage(pageId) {
  state.currentPage = pageId;
  const container = document.getElementById('pages-container');
  
  const current = container.querySelector('.page.active');
  if (current) {
    current.classList.remove('active');
    setTimeout(() => injectPage(pageId), 150);
  } else {
    injectPage(pageId);
  }
}

function injectPage(pageId) {
  const container = document.getElementById('pages-container');
  let html = '';
  document.getElementById('page-title').textContent = pageId.toUpperCase();
  
  if (pageId === 'dashboard') {
    html = `
      <div class="page active" id="page-dashboard">
        <div class="dashboard-header">
          <div>
            <div class="greeting">Good afternoon, Vishnu.</div>
            <div class="subtitle">Here's your legal intelligence overview.</div>
          </div>
          <div style="text-align:right">
            <div style="font-family:var(--font-mono); color:var(--text-secondary)">${new Date().toDateString()}</div>
            <div style="color:var(--accent-primary); font-weight:700">Week 18 · Q2 2026</div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header"><i data-lucide="file-check"></i> Total Reviewed</div>
            <div class="kpi-value" id="kpi-total">247</div>
            <div class="kpi-trend up">↑ 12% vs last month</div>
          </div>
          <div class="kpi-card alert">
            <div class="kpi-header"><i data-lucide="alert-triangle"></i> Active Risks</div>
            <div class="kpi-value" style="color:var(--color-danger)" id="kpi-risks">18</div>
            <div class="kpi-trend down">↑ 3 new critical flags</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header"><i data-lucide="activity"></i> Avg Risk Score</div>
            <div class="kpi-value" id="kpi-score">63.4</div>
            <div class="kpi-trend up">↓ 4.2 pts (Improving)</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header"><i data-lucide="pen-tool"></i> Signed</div>
            <div class="kpi-value" id="kpi-signed">31</div>
            <div class="kpi-trend up">This month</div>
          </div>
        </div>

        <div class="charts-row">
          <div class="card">
            <div class="card-title">Risk Distribution</div>
            <div class="chart-container"><canvas id="donutChart"></canvas></div>
          </div>
          <div class="card">
            <div class="card-title">System Health & Pipeline</div>
            <div class="health-rings">
              <div class="ring-item">
                <div class="ring-circle active"><i data-lucide="cpu" style="color:var(--color-success)"></i></div>
                <div style="font-size:11px;color:var(--text-secondary)">Agents</div>
              </div>
              <div class="ring-item">
                <div class="ring-circle active"><i data-lucide="webhook" style="color:var(--color-success)"></i></div>
                <div style="font-size:11px;color:var(--text-secondary)">Webhook</div>
              </div>
              <div class="ring-item">
                <div class="ring-circle processing"><i data-lucide="loader" style="color:var(--accent-primary)"></i></div>
                <div style="font-size:11px;color:var(--text-secondary)">Pipeline</div>
              </div>
            </div>
            <div class="mini-terminal" id="terminal-log">
              <div class="log-line">[14:32:11] CTR-2025-0047 → CLASSIFIED as SaaS Agreement</div>
              <div class="log-line">[14:32:14] 3 AI agents dispatched</div>
              <div class="log-line">[14:32:28] Risk Score: 71/100 (HIGH)</div>
              <div class="log-line">[14:32:29] Airtable log written ✓</div>
              <div class="log-line">[14:32:30] Waiting for webhook payload...</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Recent Activity Feed</div>
          <div class="activity-feed">
            ${state.contracts.map(c => `
              <div class="feed-row">
                <div style="font-family:var(--font-mono); color:var(--accent-primary)">${c.id}</div>
                <div style="font-weight:600">${c.name}</div>
                <div><span class="risk-badge ${c.level.toLowerCase()}">${c.level}</span></div>
                <div class="rec-badge">${c.rec}</div>
                <div class="time-badge">${c.time}</div>
                <a href="#" class="view-link" onclick="window.showToast('Opening contract...', 'info')">→ View</a>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (pageId === 'contracts') {
    html = `
      <div class="page active" id="page-contracts">
        <div class="upload-zone" id="drop-zone">
          <i data-lucide="upload-cloud" class="upload-icon"></i>
          <div class="upload-text">Drop PDF or DOCX contract here</div>
          <div class="upload-subtext">or click to browse local files</div>
          <div class="format-chips">
            <span class="chip">.PDF</span><span class="chip">.DOCX</span>
          </div>
          <input type="file" id="file-upload" style="display:none" accept=".pdf,.docx">
          
          <div class="upload-form" id="upload-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Counterparty Name</label>
                <input type="text" class="form-control" id="cp-name" value="Meridian Healthcare PLC">
              </div>
              <div class="form-group">
                <label>Your Role</label>
                <select class="form-control" id="cp-role">
                  <option value="vendor">Vendor</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div class="form-group">
                <label>Business Context</label>
                <input type="text" class="form-control" id="cp-context" value="Enterprise AI healthcare platform">
              </div>
              <div class="form-group">
                <label>Jurisdiction Hint</label>
                <input type="text" class="form-control" id="cp-jurisdiction" value="UK">
              </div>
            </div>
            <button class="btn-primary" id="btn-submit">🚀 SEND TO WORKFLOW</button>
          </div>
        </div>

        <div class="data-table-wrapper">
          <div class="table-header">
            <div style="font-family:var(--font-display); font-weight:700">CONTRACT LIBRARY</div>
            <input type="text" class="search-input" placeholder="Search contracts...">
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Counterparty</th>
                <th>Type</th>
                <th>Score</th>
                <th>Level</th>
                <th>Rec</th>
              </tr>
            </thead>
            <tbody>
              ${state.contracts.map(c => `
                <tr>
                  <td style="font-family:var(--font-mono); color:var(--accent-primary)">${c.id}</td>
                  <td style="font-weight:600">${c.name}</td>
                  <td>${c.type}</td>
                  <td>
                    <div style="font-family:var(--font-mono)">${c.score}</div>
                    <div class="score-bar">
                      <div class="score-fill" style="width:${c.score}%; background: ${c.level === 'CRITICAL' ? 'var(--color-danger)' : c.level === 'HIGH' ? 'var(--color-warning)' : 'var(--color-success)'}"></div>
                    </div>
                  </td>
                  <td><span class="risk-badge ${c.level.toLowerCase()}">${c.level}</span></td>
                  <td class="rec-badge">${c.rec}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (pageId === 'flags') {
    html = getFlagsPage();
  } else if (pageId === 'privacy') {
    html = getPrivacyPage();
  } else if (pageId === 'commercial') {
    html = getCommercialPage();
  } else if (pageId === 'webhook') {
    html = getWebhookPage();
  } else if (pageId === 'pipeline') {
    html = getPipelinePage();
  } else if (pageId === 'settings') {
    html = getSettingsPage();
  }

  container.innerHTML = html;
  createIcons({ icons });

  // Post-render init
  if (pageId === 'dashboard') {
    animateNumber(document.getElementById('kpi-total'), 247);
    animateNumber(document.getElementById('kpi-risks'), 18);
    animateNumber(document.getElementById('kpi-signed'), 31);
    initDashboardCharts();
  }
  if (pageId === 'contracts') initUploader();
  if (pageId === 'flags') initFlagsCharts();
  if (pageId === 'privacy') initPrivacyCharts();
  if (pageId === 'commercial') initCommercialCharts();
}

// --- CHARTS ---
function initDashboardCharts() {
  const ctx = document.getElementById('donutChart');
  if (!ctx) return;
  new Chart(ctx, {
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
      plugins: { legend: { position: 'right', labels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Outfit' } } } },
      cutout: '75%', animation: { animateScale: true, animateRotate: true, duration: 1500 }
    }
  });
}

function initFlagsCharts() {
  const ctx = document.getElementById('flagsBarChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Auto-Renewal', 'Liability Cap', 'Price Escalation', 'Arbitration', 'Indemnification'],
      datasets: [{
        label: 'Flags Count',
        data: [23, 19, 17, 14, 11],
        backgroundColor: '#ff2d55',
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
        y: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.7)' } }
      }
    }
  });
}

function initPrivacyCharts() {
  const ctx = document.getElementById('privacyRadarChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['GDPR', 'DPDP', 'Residency', 'Sub-processors', 'Breach SLA', 'Deletion Rights'],
      datasets: [{
        label: 'Current Portfolio',
        data: [64, 41, 75, 50, 80, 60],
        backgroundColor: 'rgba(0, 200, 255, 0.2)',
        borderColor: '#00c8ff',
        pointBackgroundColor: '#00c8ff'
      }, {
        label: 'Benchmark',
        data: [90, 85, 95, 80, 90, 85],
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        borderColor: '#00ff88',
        borderDash: [5, 5],
        pointBackgroundColor: '#00ff88'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.1)' },
          grid: { color: 'rgba(255,255,255,0.1)' },
          pointLabels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Outfit' } },
          ticks: { display: false, max: 100, min: 0 }
        }
      },
      plugins: { legend: { labels: { color: '#fff' } } }
    }
  });
}

function initCommercialCharts() {
  const ctxScatter = document.getElementById('scatterChart');
  if (ctxScatter) {
    new Chart(ctxScatter, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Contracts',
          data: [
            { x: 1200000, y: 88, r: 15 },
            { x: 240000, y: 71, r: 8 },
            { x: 2400000, y: 91, r: 20 },
            { x: 890000, y: 83, r: 12 },
            { x: 180000, y: 55, r: 6 }
          ],
          backgroundColor: 'rgba(255, 45, 85, 0.6)',
          borderColor: '#ff2d55'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Contract Value ($)', color: '#fff' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { title: { display: true, text: 'Risk Score (0-100)', color: '#fff' }, grid: { color: 'rgba(255,255,255,0.05)' }, min: 0, max: 100 }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  const ctxBar = document.getElementById('stackedBarChart');
  if (ctxBar) {
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['Payment Risk', 'Liability Cap', 'Auto-Renewal', 'Price Esc', 'Term Penalty'],
        datasets: [
          { label: 'Critical', data: [4, 12, 5, 2, 8], backgroundColor: '#ff2d55' },
          { label: 'High', data: [8, 15, 20, 10, 12], backgroundColor: '#ff6b35' },
          { label: 'Medium', data: [15, 8, 30, 25, 10], backgroundColor: '#ffd60a' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' } }
        },
        plugins: { legend: { labels: { color: '#fff' } } }
      }
    });
  }
}

// --- UPLOADER LOGIC ---
function initUploader() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-upload');
  const form = document.getElementById('upload-form');
  const btn = document.getElementById('btn-submit');

  dropZone.addEventListener('click', (e) => {
    if (e.target.closest('.upload-form')) return;
    fileInput.click();
  });

  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      showForm(e.dataTransfer.files[0].name);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) showForm(fileInput.files[0].name);
  });

  function showForm(filename) {
    document.querySelector('.upload-text').textContent = filename;
    document.querySelector('.upload-subtext').textContent = 'Ready to analyze';
    form.style.display = 'block';
  }

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!fileInput.files.length) return;
    
    const file = fileInput.files[0];
    btn.innerHTML = '<i data-lucide="loader" class="spin"></i> TRANSMITTING...';
    btn.style.opacity = '0.7';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('counterparty_name', document.getElementById('cp-name').value);
    formData.append('your_party_role', document.getElementById('cp-role').value);
    formData.append('business_context', document.getElementById('cp-context').value);
    formData.append('jurisdiction_hint', document.getElementById('cp-jurisdiction').value);

    try {
      const res = await fetch('http://localhost:5678/webhook/contract-review-wtf', {
        method: 'POST', body: formData
      });
      if (res.ok) {
        btn.innerHTML = '<i data-lucide="check"></i> ✓ DISPATCHED';
        btn.style.background = 'var(--color-success)';
        window.showToast('Contract dispatched to workflow successfully.', 'success');
        
        state.contracts.unshift({
          id: 'CTR-NEW', name: document.getElementById('cp-name').value, type: 'Processing', score: 0, level: 'PENDING', rec: '...', loc: '...', val: '...', time: 'Just now'
        });
        
        setTimeout(() => {
          form.style.display = 'none';
          document.querySelector('.upload-text').textContent = 'Drop another PDF here';
          btn.innerHTML = '🚀 SEND TO WORKFLOW';
          btn.style.background = '';
          btn.style.opacity = '1';
        }, 3000);
      } else {
        throw new Error('Server returned ' + res.status);
      }
    } catch (err) {
      btn.innerHTML = '✗ FAILED';
      btn.style.background = 'var(--color-danger)';
      window.showToast('Failed to connect to n8n webhook: ' + err.message, 'error');
      setTimeout(() => {
        btn.innerHTML = '🚀 TRY AGAIN';
        btn.style.background = '';
        btn.style.opacity = '1';
      }, 3000);
    }
  });
}
