export function getDashboardPage(state) {
  const totalReviewed = state.contracts.length;
  const activeRisks = state.contracts.filter(c => c.level === 'CRITICAL' || c.level === 'HIGH').length;
  const avgScore = state.contracts.length > 0 ? Math.round(state.contracts.reduce((a,c) => a + (parseInt(c.score)||0), 0) / state.contracts.length) : 0;
  const signed = state.contracts.filter(c => c.status === 'Approved').length;

  return `
    <div class="page active" id="page-dashboard">
      <div class="dashboard-header" style="margin-bottom: 24px;">
        <div>
          <div style="font-family:var(--font-display); font-size:32px; font-weight:800;">AIRA Contract Intelligence</div>
          <div style="color:var(--text-secondary); font-size:16px;">Enterprise Contract Review Engine · v2.0</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="status-dot pulse-green"></span>
          <span style="font-size:12px;color:var(--color-success);font-family:var(--font-mono);">SYSTEM ONLINE</span>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card with-ripple tap-anim">
          <div class="kpi-header"><i data-lucide="file-check"></i> Total Reviewed</div>
          <div class="kpi-value" id="kpi-total">${totalReviewed}</div>
          <div style="color:var(--color-success); font-size:12px;">All time</div>
        </div>
        <div class="kpi-card alert with-ripple tap-anim">
          <div class="kpi-header"><i data-lucide="alert-triangle"></i> Active Risks</div>
          <div class="kpi-value" style="color:var(--color-danger)" id="kpi-risks">${activeRisks}</div>
          <div style="color:var(--color-warning); font-size:12px;">CRITICAL + HIGH</div>
        </div>
        <div class="kpi-card with-ripple tap-anim">
          <div class="kpi-header"><i data-lucide="activity"></i> Avg Risk Score</div>
          <div class="kpi-value" id="kpi-score">${avgScore}</div>
          <div style="color:${avgScore > 60 ? 'var(--color-danger)' : avgScore > 40 ? 'var(--color-warning)' : 'var(--color-success)'}; font-size:12px;">${avgScore > 60 ? '⚠ High Risk Portfolio' : avgScore > 40 ? '◉ Moderate' : '✓ Healthy'}</div>
        </div>
        <div class="kpi-card with-ripple tap-anim">
          <div class="kpi-header"><i data-lucide="shield-check"></i> Approved</div>
          <div class="kpi-value" id="kpi-signed">${signed}</div>
          <div style="color:var(--color-success); font-size:12px;">Cleared contracts</div>
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
            ${state.contracts.slice(0, 8).map(c => `
              <div class="with-ripple tap-anim" style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid var(--border-subtle); cursor:pointer;" onclick="window.openCompanyDetails('${c.id}')">
                <div>
                  <div style="font-weight:600; font-size:14px;">${c.name}</div>
                  <div style="font-family:var(--font-mono); color:var(--accent-primary); font-size:12px;">${c.id}</div>
                </div>
                <div style="text-align:right">
                  <span class="risk-badge ${c.level.toLowerCase()}">${c.level}</span>
                  <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${c.time || 'N/A'}</div>
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
          <h2 style="margin-bottom:4px;">Secure Document Upload</h2>
          <p style="color:var(--text-secondary); max-width:400px; line-height:1.6; margin-bottom:16px; font-size:14px;">
            Upload any contract — PDF, DOCX, or scanned images. The AI engine will extract text, redact PII, classify the document, and run 5 specialist agents to produce a full risk report.
          </p>
          <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
            <input type="text" id="cp-name" placeholder="Counterparty Name (e.g., Acme Corp)" style="background:var(--bg-main); border:1px solid var(--border-subtle); color:#fff; padding:12px; border-radius:6px; width:100%;">
            <div style="display:flex; gap:8px;">
              <select id="cp-priority" style="background:var(--bg-main); border:1px solid var(--border-subtle); color:#fff; padding:10px; border-radius:6px; flex:1; cursor:pointer;">
                <option value="normal">Normal Priority</option>
                <option value="urgent">🔴 Urgent Review</option>
              </select>
            </div>
          </div>
          <button class="btn-primary with-ripple tap-anim" id="btn-submit" style="width:100%;"><i data-lucide="zap"></i> ANALYZE CONTRACT</button>

          <!-- Processing Tracker -->
          <div id="processing-tracker" style="display:none; margin-top:20px; background:rgba(0,0,0,0.4); border:1px solid var(--border-subtle); border-radius:10px; padding:16px;">
            <div style="font-family:var(--font-display); font-size:14px; font-weight:700; margin-bottom:12px; color:var(--accent-primary);">PROCESSING PIPELINE</div>
            <div class="tracker-step" id="track-1" data-status="pending"><span class="tracker-icon">○</span> Document received</div>
            <div class="tracker-step" id="track-2" data-status="pending"><span class="tracker-icon">○</span> PII Redacted</div>
            <div class="tracker-step" id="track-3" data-status="pending"><span class="tracker-icon">○</span> AI Classifier</div>
            <div class="tracker-step" id="track-4" data-status="pending"><span class="tracker-icon">○</span> Red Flag Agent</div>
            <div class="tracker-step" id="track-5" data-status="pending"><span class="tracker-icon">○</span> Privacy Agent</div>
            <div class="tracker-step" id="track-6" data-status="pending"><span class="tracker-icon">○</span> Commercial Agent</div>
            <div class="tracker-step" id="track-7" data-status="pending"><span class="tracker-icon">○</span> Report Generated</div>
            <div class="tracker-step" id="track-8" data-status="pending"><span class="tracker-icon">○</span> Saved to Airtable</div>
          </div>
        </div>
        <div class="upload-dropzone with-ripple tap-anim" id="drop-zone">
          <i data-lucide="upload-cloud" style="font-size:48px; color:var(--accent-primary); margin-bottom:16px; display:block;"></i>
          <div class="upload-text" style="font-weight:600; font-size:18px; margin-bottom:8px;">Drop PDF, DOCX, or Image</div>
          <div class="upload-subtext" style="color:var(--text-secondary); font-size:14px;">Supports PDF, DOCX, JPG, PNG, TIFF</div>
          <input type="file" id="file-upload" style="display:none" accept=".pdf,.docx,.jpg,.jpeg,.png,.tiff,.tif,.xlsx,.csv">
        </div>
      </div>

      <div class="card" style="padding:0; overflow:hidden;">
        <div style="padding:20px; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="font-family:var(--font-display); font-weight:700;">CONTRACT LIBRARY</div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <select id="filter-risk" style="background:var(--bg-main); border:1px solid var(--border-subtle); color:#fff; padding:6px 10px; border-radius:6px; font-size:12px; cursor:pointer;">
              <option value="all">All Risk Levels</option>
              <option value="CRITICAL">🔴 Critical</option>
              <option value="HIGH">🟠 High</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="LOW">🟢 Low</option>
            </select>
            <button class="btn-secondary tap-anim" onclick="window.exportCSV()" style="padding:6px 12px; font-size:12px;">📥 Export CSV</button>
          </div>
        </div>
        <div class="table-responsive">
          <table style="width:100%; min-width:700px;">
            <thead>
              <tr><th>ID</th><th>Counterparty</th><th>Type</th><th>Score</th><th>Level</th><th>Recommendation</th><th>Status</th></tr>
            </thead>
            <tbody id="contract-table-body">
              ${state.contracts.map(c => `
                <tr class="with-ripple tap-anim" style="cursor:pointer;" onclick="window.openCompanyDetails('${c.id}')">
                  <td style="font-family:var(--font-mono); color:var(--accent-primary)">${c.id}</td>
                  <td style="font-weight:600">${c.name}</td>
                  <td>${c.type}</td>
                  <td><div style="font-family:var(--font-mono)">${c.score}</div></td>
                  <td><span class="risk-badge ${c.level.toLowerCase()}">${c.level}</span></td>
                  <td><span style="font-size:12px; padding:4px 8px; border-radius:4px; background:${c.rec === 'WALK' ? 'rgba(255,45,85,0.2)' : c.rec === 'ESCALATE' ? 'rgba(255,107,53,0.2)' : c.rec === 'NEGOTIATE' ? 'rgba(255,214,10,0.2)' : 'rgba(0,255,136,0.2)'}; color:${c.rec === 'WALK' ? '#ff2d55' : c.rec === 'ESCALATE' ? '#ff6b35' : c.rec === 'NEGOTIATE' ? '#ffd60a' : '#00ff88'}">${c.rec || 'Pending'}</span></td>
                  <td><span style="font-size:11px; color:var(--text-secondary)">${c.status || 'Pending'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function getFlagsPage(state) {
  const criticalContracts = (state?.contracts || []).filter(c => c.level === 'CRITICAL' || c.level === 'HIGH');
  return `
    <div class="page active" id="page-flags">
      <div style="margin-bottom:24px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px;">
        <div>
          <div style="font-family:var(--font-display); font-size:24px; font-weight:800; color:var(--color-danger); text-shadow:var(--glow-danger);">RISK COMMAND CENTER</div>
          <div style="font-size:13px; color:var(--text-secondary);">${criticalContracts.length} contracts requiring attention</div>
        </div>
        <button class="btn-primary with-ripple tap-anim" id="btn-bulk-resolve" style="padding:10px 20px; font-size:14px;" onclick="window.bulkResolve()">✅ BULK RESOLVE ALL</button>
      </div>

      <div class="charts-row">
        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-title">Top Flagged Clause Categories</div>
          <div class="chart-container" style="height:250px;"><canvas id="flagsBarChart"></canvas></div>
        </div>
      </div>

      <div class="card" id="action-items-container">
        <div class="card-title" style="margin-bottom:16px;">Active Action Items</div>
        ${criticalContracts.length > 0 ? criticalContracts.map((c, i) => `
          <div id="action-item-${i}" class="flag-card ${c.level === 'CRITICAL' ? 'critical-flag' : 'high-flag'} with-ripple tap-anim" style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="risk-badge ${c.level.toLowerCase()}">${c.level}</span>
              <span style="font-size:11px; color:var(--text-muted)">${c.time || 'Recent'}</span>
            </div>
            <div style="font-weight:700; margin-bottom:4px;">${c.name} — Risk Score: ${c.score}/100</div>
            <div style="font-family:var(--font-mono); font-size:11px; color:var(--accent-primary); margin-bottom:8px;">${c.id} · ${c.type}</div>
            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">Recommendation: ${c.rec || 'Pending'}</div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button class="btn-primary tap-anim" style="padding:6px 12px; font-size:12px; width:auto; border-radius:4px;" onclick="window.openCompanyDetails('${c.id}')">📋 View Report</button>
              <button class="btn-primary tap-anim" style="padding:6px 12px; font-size:12px; width:auto; border-radius:4px; background:var(--color-success);" onclick="window.updateContractStatus('${c.id}', 'Approved'); window.resolveActionItem('action-item-${i}')">✅ Approve</button>
              <button class="btn-primary tap-anim" style="padding:6px 12px; font-size:12px; width:auto; border-radius:4px; background:var(--color-warning);" onclick="window.escalateContract('${c.id}')">⬆ Escalate</button>
              <button class="btn-primary tap-anim" style="padding:6px 12px; font-size:12px; width:auto; border-radius:4px; background:var(--color-danger);" onclick="window.updateContractStatus('${c.id}', 'Rejected'); window.resolveActionItem('action-item-${i}')">✗ Reject</button>
            </div>
          </div>
        `).join('') : '<div style="text-align:center; padding:40px; color:var(--text-secondary);"><i data-lucide="check-circle" style="display:block; margin:0 auto 12px; width:48px; height:48px; color:var(--color-success);"></i>No critical flags. Portfolio is healthy.</div>'}
      </div>
    </div>
  `;
}

export function getPipelinePage() {
  return `
    <div class="page active" id="page-pipeline">
      <div style="margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
        <div style="font-family:var(--font-display); font-size:24px; font-weight:800;">PIPELINE STATUS</div>
        <button class="btn-primary tap-anim" style="padding:8px 16px; font-size:12px;" onclick="window.refreshPipeline()"><i data-lucide="refresh-cw" style="width:14px; height:14px; margin-right:4px;"></i> Refresh</button>
      </div>

      <div class="card" style="margin-bottom:24px;">
        <div class="card-title">System Architecture</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(120px, 1fr)); gap:8px; margin-bottom:16px;">
          ${['Intake','Safety Gate','Extractor','PII Redact','Classifier','Red Flags','Privacy','Commercial','Scorer','Report','Airtable'].map((n,i) => `
            <div style="background:rgba(0,200,255,0.08); border:1px solid var(--border-subtle); border-radius:6px; padding:8px; text-align:center; font-size:11px; font-family:var(--font-mono);">
              <div style="color:var(--color-success); margin-bottom:2px;">■</div>
              ${n}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card" style="margin-bottom:24px;">
        <div class="card-title">Live Execution Log</div>
        <div id="pipeline-log" style="background:#000; border-radius:8px; padding:16px; font-family:var(--font-mono); font-size:12px; color:var(--color-success); height:400px; overflow-y:auto;">
          <div style="color:var(--text-secondary); margin-bottom:4px;">[${new Date().toLocaleTimeString()}] System ready. Waiting for contracts...</div>
          <div style="color:var(--accent-primary); margin-bottom:4px;">[INFO] 5 AI Agents: Classifier + Red Flag + Privacy + Commercial + Report</div>
          <div style="color:var(--accent-primary); margin-bottom:4px;">[INFO] PII Redaction: Active (Regex + Context-aware)</div>
          <div style="color:var(--accent-primary); margin-bottom:4px;">[INFO] Airtable: Connected (Base appG7edXS4JcW0cWD)</div>
          <div style="color:var(--color-success); margin-bottom:4px;">[OK] Engine v2.0 initialized. All systems operational.</div>
        </div>
      </div>
    </div>
  `;
}

export function getSettingsPage() {
  const savedWebhook = localStorage.getItem('cie_webhook') || 'http://localhost:5678/webhook/contract-review-wtf';
  const savedMock = localStorage.getItem('cie_mock') !== 'false';

  return `
    <div class="page active" id="page-settings">
      <div style="margin-bottom:24px;">
        <div style="font-family:var(--font-display); font-size:24px; font-weight:800;">SYSTEM SETTINGS</div>
        <div style="font-size:13px; color:var(--text-secondary);">AIRA Contract Intelligence Engine Configuration</div>
      </div>

      <div class="card" style="margin-bottom:20px;">
        <div class="card-title">Integration Configuration</div>
        <div class="form-grid" style="margin-bottom:24px;">
          <div class="form-group">
            <label>N8N Webhook URL</label>
            <input type="text" id="setting-webhook-url" class="form-control tap-anim" value="${savedWebhook}">
            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Endpoint for contract-review-wtf workflow</div>
          </div>
          <div class="form-group">
            <label>Airtable Base ID</label>
            <input type="text" id="setting-airtable-base" class="form-control tap-anim" value="${localStorage.getItem('cie_airtable_base') || 'appG7edXS4JcW0cWD'}">
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; padding:16px; border:1px solid var(--border-subtle); border-radius:8px; margin-bottom:16px;">
          <div>
            <div style="font-weight:600; margin-bottom:4px;">Auto-Mock Mode</div>
            <div style="font-size:12px; color:var(--text-secondary)">When enabled, simulates successful webhook response if localhost is unreachable from Vercel.</div>
          </div>
          <input type="checkbox" id="setting-mock" ${savedMock ? 'checked' : ''} style="width:20px; height:20px; cursor:pointer;" class="tap-anim">
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; padding:16px; border:1px solid var(--border-subtle); border-radius:8px; margin-bottom:24px;">
          <div>
            <div style="font-weight:600; margin-bottom:4px;">EU AI Act Compliance Logging</div>
            <div style="font-size:12px; color:var(--text-secondary)">Log all AI decisions with timestamps, confidence scores, and audit trail.</div>
          </div>
          <input type="checkbox" id="setting-audit" checked style="width:20px; height:20px; cursor:pointer;" class="tap-anim">
        </div>

        <button class="btn-primary with-ripple tap-anim" style="width:100%;" onclick="window.saveSettings()">💾 SAVE ALL SETTINGS</button>
      </div>

      <div class="card">
        <div class="card-title">Engine Status</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div style="background:rgba(0,255,136,0.08); padding:12px; border-radius:8px; border:1px solid rgba(0,255,136,0.2);">
            <div style="font-size:12px; color:var(--text-secondary);">Engine Version</div>
            <div style="font-weight:700; color:var(--color-success);">AIRA CIE v2.0</div>
          </div>
          <div style="background:rgba(0,200,255,0.08); padding:12px; border-radius:8px; border:1px solid rgba(0,200,255,0.2);">
            <div style="font-size:12px; color:var(--text-secondary);">AI Model</div>
            <div style="font-weight:700; color:var(--accent-primary);">Gemini 2.0 Flash</div>
          </div>
          <div style="background:rgba(0,255,136,0.08); padding:12px; border-radius:8px; border:1px solid rgba(0,255,136,0.2);">
            <div style="font-size:12px; color:var(--text-secondary);">Agents</div>
            <div style="font-weight:700; color:var(--color-success);">5 Active</div>
          </div>
          <div style="background:rgba(0,200,255,0.08); padding:12px; border-radius:8px; border:1px solid rgba(0,200,255,0.2);">
            <div style="font-size:12px; color:var(--text-secondary);">Data Safety</div>
            <div style="font-weight:700; color:var(--accent-primary);">PII Redact-First</div>
          </div>
        </div>
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
          <div style="flex:1;">
            <div style="font-weight:600; font-size:14px;">CRITICAL: Contract Requires Immediate Review</div>
            <div style="font-size:12px; color:var(--text-secondary);">Risk score exceeded 80 — auto-escalation triggered.</div>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">Just now</div>
        </div>
        
        <div class="with-ripple tap-anim" style="padding:16px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:12px; background:rgba(255,107,53,0.05); cursor:pointer;">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--color-warning);"></div>
          <div style="flex:1;">
            <div style="font-weight:600; font-size:14px;">Privacy Gap: Missing GDPR DPA</div>
            <div style="font-size:12px; color:var(--text-secondary);">Contract processes EU personal data without a Data Processing Agreement.</div>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">2 hrs ago</div>
        </div>

        <div class="with-ripple tap-anim" style="padding:16px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:12px; background:rgba(0,255,136,0.05); cursor:pointer;">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--color-success);"></div>
          <div style="flex:1;">
            <div style="font-weight:600; font-size:14px;">Pipeline Run Successful</div>
            <div style="font-size:12px; color:var(--text-secondary);">5 agents completed analysis in 45s. Report saved to Airtable.</div>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">3 hrs ago</div>
        </div>

        <div class="with-ripple tap-anim" style="padding:16px; display:flex; align-items:center; gap:12px; cursor:pointer;">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--accent-primary);"></div>
          <div style="flex:1;">
            <div style="font-weight:600; font-size:14px;">EU AI Act Reminder</div>
            <div style="font-size:12px; color:var(--text-secondary);">Full compliance deadline: August 2, 2026. All AI logging is active.</div>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">1 day ago</div>
        </div>
      </div>
    </div>
  `;
}
