export function getFlagsPage() {
  return `
    <div class="page active" id="page-flags">
      <div class="dashboard-header" style="margin-bottom: 24px;">
        <div>
          <div class="greeting" style="color:var(--color-danger); text-shadow: var(--glow-danger);">18 ACTIVE FLAGS</div>
          <div class="subtitle">12 Critical · 6 High Priority · Requires immediate legal review</div>
        </div>
        <div style="display:flex; gap:12px;">
          <button class="btn-secondary" onclick="window.showToast('Emails dispatched to Legal Team', 'success')">📧 EMAIL LEGAL TEAM</button>
          <button class="btn-secondary" onclick="window.showToast('Exporting JSON report...', 'info')">📤 EXPORT</button>
          <button class="btn-primary" style="padding: 10px 20px; font-size: 13px;" onclick="window.showToast('Select flags to resolve', 'info')">✅ BULK RESOLVE</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card alert">
          <div class="kpi-header">Critical Flags</div>
          <div class="kpi-value" style="color:var(--color-danger)">12</div>
        </div>
        <div class="kpi-card" style="border-color: rgba(255,107,53,0.4);">
          <div class="kpi-header">High Flags</div>
          <div class="kpi-value" style="color:var(--color-warning)">23</div>
        </div>
        <div class="kpi-card" style="border-color: rgba(255,214,10,0.4);">
          <div class="kpi-header">Yellow Flags</div>
          <div class="kpi-value" style="color:var(--color-gold)">67</div>
        </div>
        <div class="kpi-card" style="border-color: rgba(0,255,136,0.4);">
          <div class="kpi-header">Resolved</div>
          <div class="kpi-value" style="color:var(--color-success)">189</div>
        </div>
      </div>

      <div class="charts-row">
        <div class="card" style="grid-column: 1 / 2; overflow-y:auto; max-height:600px;">
          <div class="card-title">Flag Feed</div>
          <div class="filter-bar">
            <span class="chip active">ALL</span><span class="chip">CRITICAL</span><span class="chip">HIGH</span>
          </div>
          
          <div class="flag-card critical-flag">
            <div class="flag-header">
              <span class="risk-badge critical">CRITICAL</span>
              <span class="time-badge">2 hours ago</span>
            </div>
            <div class="flag-title">Unilateral Price Escalation — 12% Uncapped</div>
            <div class="flag-ref">CTR-2025-0047 · NexaCloud Technologies · Section 3.3</div>
            <div class="flag-desc">Vendor retains the right to increase prices annually without cap or prior mutual consent.</div>
            <div class="flag-actions">
              <button class="btn-action">Resolve</button>
              <button class="btn-action">Escalate</button>
            </div>
          </div>

          <div class="flag-card critical-flag">
            <div class="flag-header">
              <span class="risk-badge critical">CRITICAL</span>
              <span class="time-badge">4 hours ago</span>
            </div>
            <div class="flag-title">Uncapped Liability for Data Breach</div>
            <div class="flag-ref">CTR-2025-0038 · GlobalPay Corp · Section 8.2</div>
            <div class="flag-desc">The contract lacks a specific cap for data breach liability, exposing us to uncapped financial risk.</div>
            <div class="flag-actions">
              <button class="btn-action">Resolve</button>
              <button class="btn-action">Escalate</button>
            </div>
          </div>
          
          <div class="flag-card high-flag">
            <div class="flag-header">
              <span class="risk-badge high">HIGH</span>
              <span class="time-badge">1 day ago</span>
            </div>
            <div class="flag-title">Missing GDPR Data Processing Addendum</div>
            <div class="flag-ref">CTR-2025-0052 · CloudArch Inc · Schedule B</div>
            <div class="flag-desc">No specific GDPR DPA Appendix included for processing of EU citizen data.</div>
            <div class="flag-actions">
              <button class="btn-action">Resolve</button>
              <button class="btn-action">Escalate</button>
            </div>
          </div>
        </div>

        <div class="card" style="grid-column: 2 / 3;">
          <div class="card-title">Top Flagged Clauses</div>
          <div class="chart-container"><canvas id="flagsBarChart"></canvas></div>
        </div>
      </div>
    </div>
  `;
}

export function getPrivacyPage() {
  return `
    <div class="page active" id="page-privacy">
      <div class="dashboard-header">
        <div>
          <div class="greeting">Privacy & Compliance Lab</div>
          <div class="subtitle">Global regulatory exposure and sub-processor tracking.</div>
        </div>
      </div>

      <div class="charts-row">
        <div class="card" style="text-align:center;">
          <div class="card-title">Compliance Score Radar</div>
          <div class="chart-container" style="height:400px;" id="radar-container">
            <canvas id="privacyRadarChart"></canvas>
          </div>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:24px;">
          <div class="kpi-card" style="border-left: 4px solid var(--color-warning);">
            <div class="kpi-header">GDPR Status</div>
            <div class="kpi-value" style="font-size:24px; color:var(--color-warning);">PARTIALLY COMPLIANT</div>
            <div class="kpi-trend">7 open issues · 64% coverage</div>
          </div>
          <div class="kpi-card" style="border-left: 4px solid var(--color-danger);">
            <div class="kpi-header">India DPDP Act 2023</div>
            <div class="kpi-value" style="font-size:24px; color:var(--color-danger);">NEEDS REVIEW</div>
            <div class="kpi-trend">12 open issues · 41% coverage</div>
          </div>
          <div class="kpi-card" style="border-left: 4px solid var(--color-success);">
            <div class="kpi-header">CCPA/CPRA</div>
            <div class="kpi-value" style="font-size:24px; color:var(--color-success);">COMPLIANT</div>
            <div class="kpi-trend">0 open issues · 91% coverage</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 24px;">
        <div class="card-title">Sub-Processor Risk Matrix</div>
        <table>
          <thead>
            <tr><th>Sub-processor</th><th>Purpose</th><th>Data Access</th><th>Location</th><th>Risk</th><th>DPA Status</th></tr>
          </thead>
          <tbody>
            <tr><td>AWS</td><td>Infrastructure</td><td>FULL</td><td>USA</td><td><span class="risk-badge medium">MEDIUM</span></td><td style="color:var(--color-success)">✓ Covered</td></tr>
            <tr><td>Stripe</td><td>Billing</td><td>PARTIAL</td><td>USA</td><td><span class="risk-badge low">LOW</span></td><td style="color:var(--color-success)">✓ Covered</td></tr>
            <tr><td>OpenAI</td><td>AI Processing</td><td>TEXT ONLY</td><td>USA</td><td><span class="risk-badge high">HIGH</span></td><td style="color:var(--color-danger)">✗ Missing</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function getCommercialPage() {
  return `
    <div class="page active" id="page-commercial">
      <div class="dashboard-header">
        <div>
          <div class="greeting">Financial Risk Intelligence</div>
          <div class="subtitle">Liability exposure, value tracking, and commercial terms.</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">Total Value Under Review</div>
          <div class="kpi-value" style="color:var(--color-success)">$12.4M</div>
        </div>
        <div class="kpi-card alert">
          <div class="kpi-header">Highest Single Risk</div>
          <div class="kpi-value" style="color:var(--color-danger)">$2.4M</div>
          <div class="kpi-trend">DataVault Systems</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-header">Avg Liability Cap</div>
          <div class="kpi-value">$340K</div>
        </div>
        <div class="kpi-card alert">
          <div class="kpi-header">Uncapped Exposure</div>
          <div class="kpi-value" style="color:var(--color-danger)">4</div>
          <div class="kpi-trend">Contracts require immediate fix</div>
        </div>
      </div>

      <div class="charts-row">
        <div class="card">
          <div class="card-title">Liability vs Contract Value</div>
          <div class="chart-container"><canvas id="scatterChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-title">Financial Risk Categories</div>
          <div class="chart-container"><canvas id="stackedBarChart"></canvas></div>
        </div>
      </div>
    </div>
  `;
}

export function getWebhookPage() {
  return `
    <div class="page active" id="page-webhook">
      <div class="dashboard-header">
        <div>
          <div class="greeting">Live Integration Hub</div>
          <div class="subtitle">Manage n8n webhook connectivity and payloads.</div>
        </div>
      </div>

      <div class="charts-row">
        <div class="card" style="grid-column: 1 / 2;">
          <div class="card-title">n8n Workflow Connection</div>
          <div class="form-group" style="margin-bottom:16px;">
            <label>Webhook URL</label>
            <input type="text" class="form-control" value="http://localhost:5678/webhook/contract-review-wtf">
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label>API Key (X-N8N-API-KEY)</label>
            <input type="password" class="form-control" value="xxxxxxxxxxxxxxxxxxxx">
          </div>
          <button class="btn-primary" onclick="window.showToast('✓ CONNECTED · 142ms', 'success')">⚡ TEST CONNECTION</button>
        </div>

        <div class="card" style="grid-column: 2 / 3;">
          <div class="card-title">Payload Preview</div>
          <div class="mini-terminal" style="height:200px;">
{
  "counterparty_name": "Meridian Healthcare PLC",
  "your_party_role": "vendor",
  "business_context": "Enterprise AI healthcare platform",
  "jurisdiction_hint": "UK",
  "file": "[binary: PDF/DOCX]"
}
          </div>
        </div>
      </div>
      
      <div class="card" style="margin-top: 24px;">
        <div class="card-title">Live Webhook Log</div>
        <div class="mini-terminal" style="height: 250px; font-size:12px;">
          <div class="log-line" style="color:var(--text-secondary)">[2026-05-01 14:32:11] POST → http://localhost:5678/webhook/contract-review-wtf</div>
          <div class="log-line" style="color:var(--color-success)">  Response: 200 · {"message":"Workflow was started"}</div>
          <div class="log-line" style="color:var(--text-secondary); margin-bottom:16px;">  Latency: 241ms ✓</div>
          
          <div class="log-line" style="color:var(--text-secondary)">[2026-05-01 13:14:55] POST → http://localhost:5678/webhook/contract-review-wtf</div>
          <div class="log-line" style="color:var(--color-danger)">  Response: 500 · Internal Server Error</div>
          <div class="log-line" style="color:var(--text-secondary)">  Latency: timeout ✗</div>
        </div>
      </div>
    </div>
  `;
}

export function getPipelinePage() {
  return `
    <div class="page active" id="page-pipeline">
      <div class="dashboard-header">
        <div>
          <div class="greeting">Workflow Status Monitor</div>
          <div class="subtitle">Live tracking of the n8n analysis pipeline.</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:24px;">
        <div class="card-title">Pipeline Architecture Visualization</div>
        <div id="pipeline-canvas" style="display:flex; align-items:center; justify-content:center; flex-direction:column; color:var(--accent-primary); font-family:var(--font-mono);">
          <!-- Mock Pipeline render -->
          <div style="border:1px solid var(--accent-primary); padding:10px; border-radius:8px; margin-bottom:20px; box-shadow:var(--glow-primary)">[WEBHOOK TRIGGER]</div>
          <div style="height:30px; width:2px; background:var(--accent-primary);"></div>
          <div style="border:1px solid var(--accent-primary); padding:10px; border-radius:8px; margin:20px 0;">[TEXT PRE-PROCESSOR & CHUNKER]</div>
          <div style="height:30px; width:2px; background:var(--accent-primary);"></div>
          <div style="border:1px solid var(--color-success); padding:10px; border-radius:8px; margin:20px 0; color:var(--color-success); box-shadow:var(--glow-success);">[ENCRYPTION VAULT]</div>
          <div style="height:30px; width:2px; background:var(--color-success);"></div>
          <div style="display:flex; gap:20px; margin-top:20px;">
             <div style="border:1px solid var(--color-warning); padding:10px; border-radius:8px; color:var(--color-warning);">[RED FLAG AGENT]</div>
             <div style="border:1px solid var(--color-warning); padding:10px; border-radius:8px; color:var(--color-warning);">[PRIVACY AGENT]</div>
             <div style="border:1px solid var(--color-warning); padding:10px; border-radius:8px; color:var(--color-warning);">[COMMERCIAL AGENT]</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function getSettingsPage() {
  return `
    <div class="page active" id="page-settings">
      <div class="dashboard-header">
        <div>
          <div class="greeting">Configuration</div>
          <div class="subtitle">System preferences and AI rulesets.</div>
        </div>
      </div>

      <div class="card" style="max-width: 800px;">
        <div class="card-title">AI Agent Config</div>
        
        <div class="form-group" style="margin-bottom:24px;">
          <label>Primary AI Model</label>
          <select class="form-control">
            <option>Gemini 2.5 Flash (Recommended)</option>
            <option>Gemini 1.5 Pro</option>
            <option>GPT-4o</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom:24px;">
          <label>Airtable Base ID</label>
          <input type="text" class="form-control" value="appXYZ1234567">
        </div>
        
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; padding:16px; border:1px solid var(--border-subtle); border-radius:8px;">
          <div>
            <div style="font-weight:600; margin-bottom:4px;">Enable Hallucination Guard</div>
            <div style="font-size:12px; color:var(--text-secondary)">Cross-verifies generated clauses against original text.</div>
          </div>
          <input type="checkbox" checked style="width:20px; height:20px;">
        </div>
        
        <button class="btn-primary" onclick="window.showToast('Settings saved to localStorage', 'success')">💾 SAVE SETTINGS</button>
      </div>
    </div>
  `;
}
