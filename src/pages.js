export function getDashboardPage(state) {
  return `
    <div class="page active" id="page-dashboard">
      <div class="dashboard-header" style="margin-bottom: 24px;">
        <div>
          <div style="font-family:var(--font-display); font-size:32px; font-weight:800;">Good afternoon, Vishnu.</div>
          <div style="color:var(--text-secondary); font-size:16px;">Here's your legal intelligence overview.</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card with-ripple">
          <div class="kpi-header"><i data-lucide="file-check"></i> Total Reviewed</div>
          <div class="kpi-value" id="kpi-total">247</div>
          <div style="color:var(--color-success); font-size:12px;">↑ 12% vs last month</div>
        </div>
        <div class="kpi-card alert with-ripple">
          <div class="kpi-header"><i data-lucide="alert-triangle"></i> Active Risks</div>
          <div class="kpi-value" style="color:var(--color-danger)" id="kpi-risks">18</div>
          <div style="color:var(--color-warning); font-size:12px;">↑ 3 new critical flags</div>
        </div>
        <div class="kpi-card with-ripple">
          <div class="kpi-header"><i data-lucide="activity"></i> Avg Risk Score</div>
          <div class="kpi-value" id="kpi-score">63.4</div>
          <div style="color:var(--color-success); font-size:12px;">↓ 4.2 pts (Improving)</div>
        </div>
        <div class="kpi-card with-ripple">
          <div class="kpi-header"><i data-lucide="pen-tool"></i> Signed</div>
          <div class="kpi-value" id="kpi-signed">31</div>
          <div style="color:var(--color-success); font-size:12px;">This month</div>
        </div>
      </div>

      <div class="charts-row">
        <div class="card">
          <div class="card-title">Risk Distribution</div>
          <div class="chart-container"><canvas id="donutChart"></canvas></div>
        </div>
        <div class="card" style="overflow-y:auto; max-height:400px;">
          <div class="card-title">Recent Activity Feed</div>
          <div class="activity-feed">
            ${state.contracts.map(c => `
              <div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:600; font-size:14px;">${c.name}</div>
                  <div style="font-family:var(--font-mono); color:var(--accent-primary); font-size:12px;">${c.id}</div>
                </div>
                <div style="text-align:right">
                  <span class="risk-badge ${c.level.toLowerCase()}">${c.level}</span>
                  <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${c.time}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function getLibraryPage(state) {
  return `
    <div class="page active" id="page-contracts">
      <div class="upload-hero">
        <div class="upload-info">
          <h2>Secure Document Upload</h2>
          <p style="color:var(--text-secondary); max-width:400px; line-height:1.6; margin-bottom:24px;">
            Drag and drop NDAs, MSAs, or Enterprise Agreements. The AI will chunk, redact PII, and analyze risk against your playbook.
          </p>
          <div style="display:flex; gap:12px; margin-bottom:16px;">
            <input type="text" id="cp-name" placeholder="Counterparty Name" style="background:var(--bg-main); border:1px solid var(--border-subtle); color:#fff; padding:12px; border-radius:6px; flex:1;">
          </div>
          <button class="btn-primary with-ripple" id="btn-submit" style="width:100%;"><i data-lucide="zap"></i> PROCESS CONTRACT</button>
        </div>
        <div class="upload-dropzone with-ripple" id="drop-zone">
          <i data-lucide="upload-cloud" style="font-size:48px; color:var(--accent-primary); margin-bottom:16px; display:block;"></i>
          <div class="upload-text" style="font-weight:600; font-size:18px; margin-bottom:8px;">Drop PDF or DOCX here</div>
          <div class="upload-subtext" style="color:var(--text-secondary); font-size:14px;">Or click to browse</div>
          <input type="file" id="file-upload" style="display:none" accept=".pdf,.docx">
        </div>
      </div>

      <div class="card" style="padding:0; overflow:hidden;">
        <div style="padding:20px; border-bottom:1px solid var(--border-subtle); font-family:var(--font-display); font-weight:700;">CONTRACT LIBRARY</div>
        <div style="overflow-x:auto;">
          <table style="width:100%; min-width:600px;">
            <thead>
              <tr><th>ID</th><th>Counterparty</th><th>Type</th><th>Score</th><th>Level</th></tr>
            </thead>
            <tbody>
              ${state.contracts.map(c => `
                <tr class="with-ripple">
                  <td style="font-family:var(--font-mono); color:var(--accent-primary)">${c.id}</td>
                  <td style="font-weight:600">${c.name}</td>
                  <td>${c.type}</td>
                  <td><div style="font-family:var(--font-mono)">${c.score}</div></td>
                  <td><span class="risk-badge ${c.level.toLowerCase()}">${c.level}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function getFlagsPage() {
  return `
    <div class="page active" id="page-flags">
      <div style="margin-bottom:24px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px;">
        <div style="font-family:var(--font-display); font-size:24px; font-weight:800; color:var(--color-danger); text-shadow:var(--glow-danger);">COMMAND CENTER</div>
        <button class="btn-primary with-ripple" style="padding:10px 20px; font-size:14px;" onclick="window.showToast('Resolved all flags', 'success')">✅ BULK RESOLVE</button>
      </div>

      <div class="charts-row">
        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-title">Top Flagged Clauses</div>
          <div class="chart-container" style="height:250px;"><canvas id="flagsBarChart"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Action Items</div>
        <div class="flag-card critical-flag with-ripple">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span class="risk-badge critical">CRITICAL</span>
            <span style="font-size:11px; color:var(--text-muted)">2 hours ago</span>
          </div>
          <div style="font-weight:700; margin-bottom:4px;">Unilateral Price Escalation — 12% Uncapped</div>
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--accent-primary); margin-bottom:8px;">CTR-2025-0047 · Section 3.3</div>
          <div style="font-size:13px; color:var(--text-secondary);">Vendor retains the right to increase prices annually without cap.</div>
        </div>
        <div class="flag-card high-flag with-ripple">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span class="risk-badge high">HIGH</span>
            <span style="font-size:11px; color:var(--text-muted)">1 day ago</span>
          </div>
          <div style="font-weight:700; margin-bottom:4px;">Missing GDPR Addendum</div>
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--accent-primary); margin-bottom:8px;">CTR-2025-0052 · Schedule B</div>
          <div style="font-size:13px; color:var(--text-secondary);">No specific DPA included for EU citizen data.</div>
        </div>
      </div>
    </div>
  `;
}

export function getPipelinePage() {
  return `
    <div class="page active" id="page-pipeline">
      <div style="margin-bottom:24px;">
        <div style="font-family:var(--font-display); font-size:24px; font-weight:800;">PIPELINE STATUS</div>
      </div>

      <div class="card" style="margin-bottom:24px;">
        <div class="card-title">Live Webhook Log</div>
        <div style="background:#000; border-radius:8px; padding:16px; font-family:var(--font-mono); font-size:12px; color:var(--color-success); height:200px; overflow-y:auto;">
          <div style="color:var(--text-secondary); margin-bottom:4px;">[14:32:11] POST → http://localhost:5678/webhook/contract-review-wtf</div>
          <div style="color:var(--color-success); margin-bottom:4px;">  Response: 200 · {"message":"Workflow was started"}</div>
          <div style="color:var(--text-secondary); margin-bottom:16px;">  Latency: 241ms ✓</div>
          <div style="color:var(--text-secondary); margin-bottom:4px;">[14:32:14] 3 AI agents dispatched in parallel...</div>
          <div style="color:var(--text-secondary); margin-bottom:4px;">[14:32:28] Risk Score Calculated: 71/100</div>
        </div>
      </div>
    </div>
  `;
}
