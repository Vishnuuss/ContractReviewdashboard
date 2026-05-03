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
        <div class="kpi-card with-ripple tap-anim">
          <div class="kpi-header"><i data-lucide="file-check"></i> Total Reviewed</div>
          <div class="kpi-value" id="kpi-total">247</div>
          <div style="color:var(--color-success); font-size:12px;">↑ 12% vs last month</div>
        </div>
        <div class="kpi-card alert with-ripple tap-anim">
          <div class="kpi-header"><i data-lucide="alert-triangle"></i> Active Risks</div>
          <div class="kpi-value" style="color:var(--color-danger)" id="kpi-risks">18</div>
          <div style="color:var(--color-warning); font-size:12px;">↑ 3 new critical flags</div>
        </div>
        <div class="kpi-card with-ripple tap-anim">
          <div class="kpi-header"><i data-lucide="activity"></i> Avg Risk Score</div>
          <div class="kpi-value" id="kpi-score">63.4</div>
          <div style="color:var(--color-success); font-size:12px;">↓ 4.2 pts (Improving)</div>
        </div>
        <div class="kpi-card with-ripple tap-anim">
          <div class="kpi-header"><i data-lucide="pen-tool"></i> Signed</div>
          <div class="kpi-value" id="kpi-signed">31</div>
          <div style="color:var(--color-success); font-size:12px;">This month</div>
        </div>
      </div>

      <div class="charts-row">
        <div class="card tap-anim">
          <div class="card-title">Risk Distribution</div>
          <div class="chart-container"><canvas id="donutChart"></canvas></div>
        </div>
        <div class="card" style="overflow-y:auto; max-height:400px;">
          <div class="card-title">Recent Activity Feed</div>
          <div class="activity-feed">
            ${state.contracts.map(c => `
              <div class="with-ripple tap-anim" style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid var(--border-subtle); cursor:pointer;" onclick="window.openCompanyDetails('${c.id}')">
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
          <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
            <input type="text" id="cp-name" placeholder="Counterparty Name" style="background:var(--bg-main); border:1px solid var(--border-subtle); color:#fff; padding:12px; border-radius:6px; width:100%;">
          </div>
          <button class="btn-primary with-ripple tap-anim" id="btn-submit" style="width:100%;"><i data-lucide="zap"></i> PROCESS CONTRACT</button>
        </div>
        <div class="upload-dropzone with-ripple tap-anim" id="drop-zone">
          <i data-lucide="upload-cloud" style="font-size:48px; color:var(--accent-primary); margin-bottom:16px; display:block;"></i>
          <div class="upload-text" style="font-weight:600; font-size:18px; margin-bottom:8px;">Drop PDF or DOCX here</div>
          <div class="upload-subtext" style="color:var(--text-secondary); font-size:14px;">Or tap to browse files</div>
          <input type="file" id="file-upload" style="display:none" accept=".pdf,.docx">
        </div>
      </div>

      <div class="card" style="padding:0; overflow:hidden;">
        <div style="padding:20px; border-bottom:1px solid var(--border-subtle); font-family:var(--font-display); font-weight:700;">CONTRACT LIBRARY</div>
        <div class="table-responsive">
          <table style="width:100%; min-width:600px;">
            <thead>
              <tr><th>ID</th><th>Counterparty</th><th>Type</th><th>Score</th><th>Level</th></tr>
            </thead>
            <tbody>
              ${state.contracts.map(c => `
                <tr class="with-ripple tap-anim" style="cursor:pointer;" onclick="window.openCompanyDetails('${c.id}')">
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
        <button class="btn-primary with-ripple tap-anim" id="btn-bulk-resolve" style="padding:10px 20px; font-size:14px;" onclick="window.bulkResolve()">✅ BULK RESOLVE</button>
      </div>

      <div class="charts-row">
        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-title">Top Flagged Clauses</div>
          <div class="chart-container" style="height:250px;"><canvas id="flagsBarChart"></canvas></div>
        </div>
      </div>

      <div class="card" id="action-items-container">
        <div class="card-title">Action Items</div>
        <div id="action-item-1" class="flag-card critical-flag with-ripple tap-anim">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span class="risk-badge critical">CRITICAL</span>
            <span style="font-size:11px; color:var(--text-muted)">2 hours ago</span>
          </div>
          <div style="font-weight:700; margin-bottom:4px;">Unilateral Price Escalation — 12% Uncapped</div>
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--accent-primary); margin-bottom:8px;">CTR-2025-0047 · Section 3.3</div>
          <div style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">Vendor retains the right to increase prices annually without cap.</div>
          <button class="btn-primary tap-anim" style="padding:6px 12px; font-size:12px; width:auto; border-radius:4px;" onclick="window.resolveActionItem('action-item-1')">Mark as Resolved</button>
        </div>
        <div id="action-item-2" class="flag-card high-flag with-ripple tap-anim">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span class="risk-badge high">HIGH</span>
            <span style="font-size:11px; color:var(--text-muted)">1 day ago</span>
          </div>
          <div style="font-weight:700; margin-bottom:4px;">Missing GDPR Addendum</div>
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--accent-primary); margin-bottom:8px;">CTR-2025-0052 · Schedule B</div>
          <div style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">No specific DPA included for EU citizen data.</div>
          <button class="btn-primary tap-anim" style="padding:6px 12px; font-size:12px; width:auto; border-radius:4px;" onclick="window.resolveActionItem('action-item-2')">Generate DPA</button>
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
        <div id="pipeline-log" style="background:#000; border-radius:8px; padding:16px; font-family:var(--font-mono); font-size:12px; color:var(--color-success); height:400px; overflow-y:auto;">
          <div style="color:var(--text-secondary); margin-bottom:4px;">[14:32:11] POST → /webhook/smart-legal-intake-v2</div>
          <div style="color:var(--color-success); margin-bottom:4px;">  Response: 200 · {"message":"Workflow was started"}</div>
          <div style="color:var(--text-secondary); margin-bottom:16px;">  Latency: 241ms ✓</div>
          <div style="color:var(--accent-primary); margin-bottom:4px;">[14:32:14] SYSTEM: AI Agents Dispatched</div>
          <div style="color:var(--text-secondary); margin-bottom:4px;">  > Agent 1: Commercial (Analyzing pricing)</div>
          <div style="color:var(--text-secondary); margin-bottom:4px;">  > Agent 2: Privacy (Checking GDPR compliance)</div>
          <div style="color:var(--text-secondary); margin-bottom:16px;">  > Agent 3: Red Flags (Scanning for liabilities)</div>
          <div style="color:var(--color-warning); margin-bottom:4px;">[14:32:28] Alert: High Risk Clauses Detected</div>
          <div style="color:var(--text-secondary); margin-bottom:4px;">[14:32:29] Risk Score Calculated: 71/100</div>
          <div style="color:var(--color-success); margin-bottom:4px;">[14:32:30] Analysis completed. Data synced.</div>
        </div>
      </div>
    </div>
  `;
}

export function getSettingsPage() {
  return `
    <div class="page active" id="page-settings">
      <div style="margin-bottom:24px;">
        <div style="font-family:var(--font-display); font-size:24px; font-weight:800;">SYSTEM SETTINGS</div>
      </div>

      <div class="card">
        <div class="card-title">Integration Configuration</div>
        <div class="form-grid" style="margin-bottom:24px;">
          <div class="form-group">
            <label>N8N Webhook URL</label>
            <input type="text" id="setting-webhook-url" class="form-control tap-anim" value="http://localhost:5678/webhook/smart-legal-intake-v2">
          </div>
          <div class="form-group">
            <label>Airtable Base ID</label>
            <input type="text" class="form-control tap-anim" value="appXYZ1234567">
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; padding:16px; border:1px solid var(--border-subtle); border-radius:8px; margin-bottom:24px;">
          <div>
            <div style="font-weight:600; margin-bottom:4px;">Auto-Mock Mode (Vercel Compatibility)</div>
            <div style="font-size:12px; color:var(--text-secondary)">Enable if localhost webhooks fail due to HTTPS constraints.</div>
          </div>
          <input type="checkbox" id="setting-mock" checked style="width:20px; height:20px; cursor:pointer;" class="tap-anim">
        </div>

        <button class="btn-primary with-ripple tap-anim" style="width:100%;" onclick="window.showToast('Settings saved successfully', 'success')">💾 SAVE PREFERENCES</button>
      </div>
    </div>
  `;
}

export function getNotificationsPage() {
  return `
    <div class="page active" id="page-notifications">
      <div style="margin-bottom:24px;">
        <div style="font-family:var(--font-display); font-size:24px; font-weight:800;">NOTIFICATIONS</div>
      </div>

      <div class="card" style="padding:0; overflow:hidden;">
        <div class="with-ripple tap-anim" style="padding:16px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:12px; background:rgba(255,45,85,0.1); cursor:pointer;">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--color-danger);"></div>
          <div>
            <div style="font-weight:600; font-size:14px;">Urgent: Legal Review Required</div>
            <div style="font-size:12px; color:var(--text-secondary);">CTR-2025-0038 requires immediate attention.</div>
          </div>
          <div style="margin-left:auto; font-size:11px; color:var(--text-muted);">1 hr ago</div>
        </div>
        
        <div class="with-ripple tap-anim" style="padding:16px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:12px; background:rgba(0,255,136,0.05); cursor:pointer;">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--color-success);"></div>
          <div>
            <div style="font-weight:600; font-size:14px;">Pipeline Run Successful</div>
            <div style="font-size:12px; color:var(--text-secondary);">Processed 14 pages for TechBridge Solutions</div>
          </div>
          <div style="margin-left:auto; font-size:11px; color:var(--text-muted);">3 hrs ago</div>
        </div>
      </div>
    </div>
  `;
}
