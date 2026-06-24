// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Global state
let reps = [];
let currentRep = null;

// Fetch reps from API
async function fetchReps() {
  try {
    const response = await fetch(`${API_BASE_URL}/reps/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Transform API data to match frontend format
    reps = data.map(rep => ({
      id: rep.id,
      name: rep.name,
      initials: rep.initials,
      role: rep.role,
      region: rep.region,
      pipeline: rep.pipeline,
      goal: rep.goal,
      coverage: rep.coverage,
      risk: rep.risk,
      opportunities: rep.opportunities,
      meetings: rep.meetings,
      // Add default values for fields not yet in API
      accountsAssigned: 0,
      accountsTouched: 0,
      teamAvg: 7,
      conversion: 0,
      zoomOut: {
        quantity: { score: 0, status: 'ok', label: 'N/A' },
        dealSize: { score: 0, status: 'ok', label: 'N/A' },
        mix: { score: 0, status: 'ok', label: 'N/A' },
        balance: { score: 0, status: 'ok', label: 'N/A' }
      },
      exposedArea: 'None',
      aiSummary: `${rep.name} has ${rep.opportunities} opportunities with $${(rep.pipeline/1000).toFixed(0)}K pipeline.`,
      recommendations: []
    }));
    
    return reps;
  } catch (error) {
    console.error('Error fetching reps:', error);
    // Return empty array on error
    return [];
  }
}

// Initialize dashboard
async function initDashboard() {
  // Show loading state
  document.getElementById('rep-cards').innerHTML = '<div class="loading">Loading reps...</div>';
  
  // Fetch data from API
  await fetchReps();
  
  if (reps.length === 0) {
    document.getElementById('rep-cards').innerHTML = '<div class="error">Failed to load reps. Please check if the backend is running.</div>';
    return;
  }
  
  // Set first rep as current
  currentRep = reps[0];
  
  // Render UI
  renderRepCards();
  renderRepDetail();
  updateTeamMetrics();
}

// Render rep cards
function renderRepCards() {
  const container = document.getElementById('rep-cards');
  container.innerHTML = reps.map(rep => `
    <div class="rep-card ${rep.id === currentRep.id ? 'active' : ''}" onclick="selectRep('${rep.id}')">
      <div class="rep-header">
        <div class="rep-avatar">${rep.initials}</div>
        <div class="rep-info">
          <div class="rep-name">${rep.name}</div>
          <div class="rep-role">${rep.role} • ${rep.region}</div>
        </div>
      </div>
      <div class="rep-metrics">
        <div class="metric">
          <div class="metric-label">Pipeline</div>
          <div class="metric-value">$${(rep.pipeline/1000).toFixed(0)}K</div>
        </div>
        <div class="metric">
          <div class="metric-label">Coverage</div>
          <div class="metric-value">${rep.coverage.toFixed(1)}x</div>
        </div>
        <div class="metric">
          <div class="metric-label">Risk</div>
          <div class="metric-value risk-${getRiskLevel(rep.risk)}">${rep.risk}%</div>
        </div>
      </div>
    </div>
  `).join('');
}

// Select a rep
function selectRep(repId) {
  currentRep = reps.find(r => r.id === repId);
  renderRepCards();
  renderRepDetail();
}

// Render rep detail view
function renderRepDetail() {
  if (!currentRep) return;
  
  const container = document.getElementById('rep-detail');
  const pipelinePercent = (currentRep.pipeline / currentRep.goal * 100).toFixed(0);
  
  container.innerHTML = `
    <div class="detail-header">
      <div class="detail-avatar">${currentRep.initials}</div>
      <div class="detail-info">
        <h2>${currentRep.name}</h2>
        <div class="detail-meta">${currentRep.role} • ${currentRep.region}</div>
      </div>
    </div>
    
    <div class="pipeline-section">
      <h3>Pipeline Health</h3>
      <div class="pipeline-bar">
        <div class="pipeline-fill" style="width: ${Math.min(pipelinePercent, 100)}%"></div>
      </div>
      <div class="pipeline-stats">
        <div class="stat">
          <span class="stat-label">Current</span>
          <span class="stat-value">$${(currentRep.pipeline/1000).toFixed(0)}K</span>
        </div>
        <div class="stat">
          <span class="stat-label">Goal</span>
          <span class="stat-value">$${(currentRep.goal/1000).toFixed(0)}K</span>
        </div>
        <div class="stat">
          <span class="stat-label">Coverage</span>
          <span class="stat-value">${currentRep.coverage.toFixed(1)}x</span>
        </div>
      </div>
    </div>
    
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-label">Opportunities</div>
        <div class="metric-card-value">${currentRep.opportunities}</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-label">Meetings</div>
        <div class="metric-card-value">${currentRep.meetings}</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-label">Risk Score</div>
        <div class="metric-card-value risk-${getRiskLevel(currentRep.risk)}">${currentRep.risk}%</div>
      </div>
    </div>
    
    <div class="ai-summary">
      <h3>AI Summary</h3>
      <p>${currentRep.aiSummary}</p>
    </div>
    
    ${currentRep.recommendations.length > 0 ? `
      <div class="recommendations">
        <h3>Recommendations</h3>
        ${currentRep.recommendations.map(rec => `
          <div class="recommendation">
            <div class="rec-priority">Priority ${rec.priority}</div>
            <div class="rec-title">${rec.title}</div>
            <div class="rec-reason">${rec.reason}</div>
            <div class="rec-action">${rec.action}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

// Update team metrics
function updateTeamMetrics() {
  const totalPipeline = reps.reduce((sum, rep) => sum + rep.pipeline, 0);
  const totalGoal = reps.reduce((sum, rep) => sum + rep.goal, 0);
  const avgCoverage = reps.reduce((sum, rep) => sum + rep.coverage, 0) / reps.length;
  const avgRisk = reps.reduce((sum, rep) => sum + rep.risk, 0) / reps.length;
  
  document.getElementById('team-pipeline').textContent = `$${(totalPipeline/1000000).toFixed(1)}M`;
  document.getElementById('team-goal').textContent = `$${(totalGoal/1000000).toFixed(1)}M`;
  document.getElementById('team-coverage').textContent = `${avgCoverage.toFixed(1)}x`;
  document.getElementById('team-risk').textContent = `${avgRisk.toFixed(0)}%`;
}

// Helper function to get risk level
function getRiskLevel(risk) {
  if (risk < 30) return 'low';
  if (risk < 60) return 'medium';
  return 'high';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);

// Made with Bob
