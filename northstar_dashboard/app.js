// Coaching questions framework - contextual based on performance issues
const coachingQuestions = {
  pipelineGap: {
    category: 'Pipeline Gap Analysis',
    icon: '📊',
    questions: [
      'Walk me through how you got to this pipeline position. What changed?',
      'Which deals in your pipeline are honestly not likely to close this quarter?',
      'If you had to remove the weakest 20% of your pipeline, what would remain?',
      'What is the true gap we need to close, accounting for realistic win rates?',
      'Which lever are you pulling this month to close the gap - new opportunities, deal acceleration, or deal size?'
    ]
  },
  lowActivity: {
    category: 'Activity & Engagement',
    icon: '⚡',
    questions: [
      'What is preventing you from reaching your activity targets?',
      'Walk me through your typical day. Where is time being lost?',
      'How many accounts have you touched in the last two weeks?',
      'What percentage of your assigned territory are you actively working?',
      'What changes are you making tomorrow to increase your activity level?'
    ]
  },
  opportunityCreation: {
    category: 'Opportunity Creation',
    icon: '🎯',
    questions: [
      'Why is opportunity creation down compared to previous months?',
      'What is your current meeting-to-opportunity conversion rate?',
      'Are you currently on pace to hit your creation targets?',
      'Which accounts have the highest potential for new opportunities?',
      'What is blocking you from generating more qualified meetings?'
    ]
  },
  conversionIssues: {
    category: 'Conversion & Deal Progression',
    icon: '🔄',
    questions: [
      'Why are deals stalling at this stage?',
      'What objections are you hearing most frequently?',
      'Who are the key stakeholders you haven\'t engaged yet?',
      'What accelerator can speed up your top opportunity?',
      'Which deals need executive involvement to move forward?'
    ]
  },
  accountCoverage: {
    category: 'Territory & Account Management',
    icon: '🗺️',
    questions: [
      'Why are so many accounts in your territory untouched?',
      'Which accounts should be your top priority this week?',
      'What is your strategy for penetrating your largest accounts?',
      'Are you focusing on the right accounts, or spreading too thin?',
      'Which accounts have buying signals you haven\'t acted on?'
    ]
  },
  skillDevelopment: {
    category: 'Skills & Capability',
    icon: '📚',
    questions: [
      'What skill would have the biggest impact on your performance?',
      'Where do you need additional product knowledge or training?',
      'What are you learning from your most successful deals?',
      'Who on the team could you shadow to improve your approach?',
      'What support or resources do you need that you don\'t have?'
    ]
  }
};

// Rep data with IBM coaching metrics
const reps = [
  {
    id: 'priya',
    name: 'Priya Shah',
    initials: 'PS',
    role: 'Enterprise AE',
    region: 'East',
    pipeline: 318000,
    goal: 300000,
    coverage: 4.2,
    risk: 18,
    opportunities: 9,
    meetings: 24,
    accountsAssigned: 82,
    accountsTouched: 67,
    teamAvg: 7,
    conversion: 38,
    zoomOut: {
      quantity: { score: 85, status: 'ok', label: 'Strong' },
      dealSize: { score: 88, status: 'ok', label: 'Excellent' },
      mix: { score: 82, status: 'ok', label: 'Balanced' },
      balance: { score: 90, status: 'ok', label: 'Good' }
    },
    exposedArea: 'None',
    aiSummary: 'Priya is on track to exceed quota. Pipeline is healthy with strong coverage and balanced opportunity mix.',
    recommendations: [
      { priority: 1, title: 'Maintain momentum', reason: 'All metrics trending positively', action: 'Continue current strategy and share best practices with team' },
      { priority: 2, title: 'Expand into new accounts', reason: 'High win rate in current accounts', action: 'Target 5 new strategic accounts this quarter' }
    ]
  },
  {
    id: 'maya',
    name: 'Maya Chen',
    initials: 'MC',
    role: 'Enterprise AE',
    region: 'West',
    pipeline: 286000,
    goal: 260000,
    coverage: 4.0,
    risk: 38,
    opportunities: 3,
    meetings: 14,
    accountsAssigned: 76,
    accountsTouched: 58,
    teamAvg: 7,
    conversion: 21,
    zoomOut: {
      quantity: { score: 42, status: 'exposed', label: 'Critical' },
      dealSize: { score: 85, status: 'ok', label: 'Strong' },
      mix: { score: 78, status: 'ok', label: 'Good' },
      balance: { score: 72, status: 'ok', label: 'Balanced' }
    },
    exposedArea: 'Quantity',
    aiSummary: 'Maya has strong pipeline today but opportunity creation is down 38%. Future quarters at risk without immediate action.',
    recommendations: [
      { priority: 1, title: 'Rebuild opportunity creation', reason: 'Only 3 opportunities created vs team average of 7', action: 'Generate 10 additional meetings this week' },
      { priority: 2, title: 'Protect current pipeline', reason: 'Strong deals in progress', action: 'Advance top 3 opportunities to next stage' }
    ]
  },
  {
    id: 'sam',
    name: 'Sam Rivera',
    initials: 'SR',
    role: 'Commercial AE',
    region: 'South',
    pipeline: 224000,
    goal: 240000,
    coverage: 3.1,
    risk: 45,
    opportunities: 7,
    meetings: 21,
    accountsAssigned: 68,
    accountsTouched: 52,
    teamAvg: 7,
    conversion: 33,
    zoomOut: {
      quantity: { score: 68, status: 'ok', label: 'Adequate' },
      dealSize: { score: 58, status: 'exposed', label: 'Below avg' },
      mix: { score: 75, status: 'ok', label: 'Good' },
      balance: { score: 70, status: 'ok', label: 'Balanced' }
    },
    exposedArea: 'Deal Size',
    aiSummary: 'Sam is creating opportunities but deal sizes are below target. Focus on upselling and cross-selling.',
    recommendations: [
      { priority: 1, title: 'Increase deal size', reason: 'Average deal 30% below target', action: 'Bundle products and target larger accounts' },
      { priority: 2, title: 'Maintain activity level', reason: 'Meeting volume is strong', action: 'Continue current prospecting pace' }
    ]
  },
  {
    id: 'jordan',
    name: 'Jordan Lee',
    initials: 'JL',
    role: 'Enterprise AE',
    region: 'Central',
    pipeline: 182000,
    goal: 240000,
    coverage: 2.6,
    risk: 72,
    opportunities: 4,
    meetings: 16,
    accountsAssigned: 74,
    accountsTouched: 19,
    teamAvg: 7,
    conversion: 28,
    zoomOut: {
      quantity: { score: 38, status: 'exposed', label: 'Critical' },
      dealSize: { score: 72, status: 'ok', label: 'Adequate' },
      mix: { score: 55, status: 'exposed', label: 'Limited' },
      balance: { score: 45, status: 'exposed', label: 'Uneven' }
    },
    exposedArea: 'Quantity',
    aiSummary: 'Jordan is unlikely to hit quota without creating 5 additional opportunities. Account engagement and meeting-to-opportunity conversion are the primary constraints.',
    recommendations: [
      { priority: 1, title: 'Increase account coverage', reason: 'Only 26% of territory engaged', action: 'Touch 15 additional accounts this week' },
      { priority: 2, title: 'Rebuild opportunity creation pace', reason: 'Below team average', action: 'Audit sequence conversion and add second outbound block' }
    ]
  },
  {
    id: 'noah',
    name: 'Noah Williams',
    initials: 'NW',
    role: 'Commercial AE',
    region: 'East',
    pipeline: 164000,
    goal: 220000,
    coverage: 2.3,
    risk: 81,
    opportunities: 3,
    meetings: 11,
    accountsAssigned: 62,
    accountsTouched: 18,
    teamAvg: 7,
    conversion: 27,
    zoomOut: {
      quantity: { score: 32, status: 'exposed', label: 'Critical' },
      dealSize: { score: 65, status: 'ok', label: 'Adequate' },
      mix: { score: 48, status: 'exposed', label: 'Limited' },
      balance: { score: 38, status: 'exposed', label: 'Uneven' }
    },
    exposedArea: 'Quantity',
    aiSummary: 'Noah is significantly behind quota with critical gaps in activity and account coverage. Immediate intervention required.',
    recommendations: [
      { priority: 1, title: 'Emergency activity increase', reason: 'All metrics below target', action: 'Double daily prospecting blocks and generate 20 meetings' },
      { priority: 2, title: 'Territory coverage audit', reason: 'Only 29% of accounts touched', action: 'Review account list and prioritize top 30 accounts' }
    ]
  },
  {
    id: 'elena',
    name: 'Elena Garcia',
    initials: 'EG',
    role: 'Commercial AE',
    region: 'West',
    pipeline: 198000,
    goal: 220000,
    coverage: 2.9,
    risk: 57,
    opportunities: 8,
    meetings: 23,
    accountsAssigned: 70,
    accountsTouched: 54,
    teamAvg: 7,
    conversion: 35,
    zoomOut: {
      quantity: { score: 72, status: 'ok', label: 'Good' },
      dealSize: { score: 68, status: 'ok', label: 'Adequate' },
      mix: { score: 65, status: 'ok', label: 'Fair' },
      balance: { score: 58, status: 'exposed', label: 'Uneven' }
    },
    exposedArea: 'Balance',
    aiSummary: 'Elena is close to quota but pipeline is concentrated in few accounts. Diversification needed to reduce risk.',
    recommendations: [
      { priority: 1, title: 'Diversify pipeline', reason: 'Too concentrated in 3 accounts', action: 'Develop 5 new opportunities in different accounts' },
      { priority: 2, title: 'Maintain activity', reason: 'Meeting volume is strong', action: 'Continue current prospecting strategy' }
    ]
  }
];

// Sample accounts data
const accounts = [
  { id: 'acc1', name: 'Acme Corporation', industry: 'Technology', revenue: 50000000, owner: 'Priya Shah', status: 'Active', lastContact: '2026-06-15' },
  { id: 'acc2', name: 'Global Industries Inc', industry: 'Manufacturing', revenue: 120000000, owner: 'Maya Chen', status: 'Active', lastContact: '2026-06-10' },
  { id: 'acc3', name: 'TechStart Solutions', industry: 'Technology', revenue: 25000000, owner: 'Sam Rivera', status: 'Prospect', lastContact: '2026-06-12' },
  { id: 'acc4', name: 'Enterprise Systems Ltd', industry: 'Financial Services', revenue: 200000000, owner: 'Jordan Lee', status: 'Active', lastContact: '2026-06-08' },
  { id: 'acc5', name: 'Retail Dynamics Corp', industry: 'Retail', revenue: 75000000, owner: 'Noah Williams', status: 'Active', lastContact: '2026-06-05' },
  { id: 'acc6', name: 'Healthcare Partners', industry: 'Healthcare', revenue: 150000000, owner: 'Elena Garcia', status: 'Active', lastContact: '2026-06-16' },
  { id: 'acc7', name: 'Innovation Labs', industry: 'Technology', revenue: 30000000, owner: 'Priya Shah', status: 'Prospect', lastContact: '2026-06-14' },
  { id: 'acc8', name: 'Financial Group LLC', industry: 'Financial Services', revenue: 180000000, owner: 'Maya Chen', status: 'Active', lastContact: '2026-06-11' },
  { id: 'acc9', name: 'Manufacturing Plus', industry: 'Manufacturing', revenue: 95000000, owner: 'Sam Rivera', status: 'Active', lastContact: '2026-06-13' },
  { id: 'acc10', name: 'Digital Commerce Co', industry: 'Retail', revenue: 60000000, owner: 'Jordan Lee', status: 'Prospect', lastContact: '2026-06-09' },
  { id: 'acc11', name: 'MedTech Innovations', industry: 'Healthcare', revenue: 110000000, owner: 'Noah Williams', status: 'Active', lastContact: '2026-06-07' },
  { id: 'acc12', name: 'Cloud Services Inc', industry: 'Technology', revenue: 85000000, owner: 'Elena Garcia', status: 'Active', lastContact: '2026-06-17' }
];

// Sample opportunities data
const opportunities = [
  { id: 'opp1', name: 'Acme - Cloud Migration', account: 'Acme Corporation', value: 45000, stage: 'Proposal', owner: 'Priya Shah', closeDate: '2026-07-15', probability: 70 },
  { id: 'opp2', name: 'Global Industries - ERP Upgrade', account: 'Global Industries Inc', value: 120000, stage: 'Negotiation', owner: 'Maya Chen', closeDate: '2026-08-01', probability: 80 },
  { id: 'opp3', name: 'TechStart - Security Suite', account: 'TechStart Solutions', value: 28000, stage: 'Discovery', owner: 'Sam Rivera', closeDate: '2026-07-30', probability: 40 },
  { id: 'opp4', name: 'Enterprise Systems - Data Analytics', account: 'Enterprise Systems Ltd', value: 95000, stage: 'Proposal', owner: 'Jordan Lee', closeDate: '2026-08-15', probability: 60 },
  { id: 'opp5', name: 'Retail Dynamics - POS System', account: 'Retail Dynamics Corp', value: 52000, stage: 'Qualification', owner: 'Noah Williams', closeDate: '2026-09-01', probability: 30 },
  { id: 'opp6', name: 'Healthcare Partners - Integration Platform', account: 'Healthcare Partners', value: 78000, stage: 'Negotiation', owner: 'Elena Garcia', closeDate: '2026-07-20', probability: 75 },
  { id: 'opp7', name: 'Innovation Labs - AI Platform', account: 'Innovation Labs', value: 35000, stage: 'Discovery', owner: 'Priya Shah', closeDate: '2026-08-10', probability: 50 },
  { id: 'opp8', name: 'Financial Group - Compliance Software', account: 'Financial Group LLC', value: 110000, stage: 'Proposal', owner: 'Maya Chen', closeDate: '2026-07-25', probability: 65 },
  { id: 'opp9', name: 'Manufacturing Plus - IoT Solution', account: 'Manufacturing Plus', value: 42000, stage: 'Negotiation', owner: 'Sam Rivera', closeDate: '2026-08-05', probability: 70 },
  { id: 'opp10', name: 'Digital Commerce - E-commerce Platform', account: 'Digital Commerce Co', value: 67000, stage: 'Discovery', owner: 'Jordan Lee', closeDate: '2026-09-15', probability: 45 },
  { id: 'opp11', name: 'MedTech - Patient Management System', account: 'MedTech Innovations', value: 88000, stage: 'Qualification', owner: 'Noah Williams', closeDate: '2026-08-20', probability: 55 },
  { id: 'opp12', name: 'Cloud Services - Infrastructure Upgrade', account: 'Cloud Services Inc', value: 72000, stage: 'Proposal', owner: 'Elena Garcia', closeDate: '2026-07-28', probability: 68 }
];

// Search functionality
let searchResults = [];
let selectedSearchIndex = -1;

function performSearch(query) {
  if (!query || query.length < 2) {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  // Search sales reps
  reps.forEach(rep => {
    if (rep.name.toLowerCase().includes(lowerQuery) || 
        rep.role.toLowerCase().includes(lowerQuery) ||
        rep.region.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'rep',
        category: 'Sales Rep',
        title: rep.name,
        subtitle: `${rep.role} · ${rep.region}`,
        data: rep,
        action: () => openCoaching(rep.id)
      });
    }
  });
  
  // Search accounts
  accounts.forEach(account => {
    if (account.name.toLowerCase().includes(lowerQuery) ||
        account.industry.toLowerCase().includes(lowerQuery) ||
        account.owner.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'account',
        category: 'Account',
        title: account.name,
        subtitle: `${account.industry} · Owner: ${account.owner}`,
        data: account,
        action: () => showAccountDetails(account)
      });
    }
  });
  
  // Search opportunities
  opportunities.forEach(opp => {
    if (opp.name.toLowerCase().includes(lowerQuery) ||
        opp.account.toLowerCase().includes(lowerQuery) ||
        opp.stage.toLowerCase().includes(lowerQuery) ||
        opp.owner.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'opportunity',
        category: 'Opportunity',
        title: opp.name,
        subtitle: `${opp.stage} · ${formatCurrency(opp.value)} · ${opp.owner}`,
        data: opp,
        action: () => showOpportunityDetails(opp)
      });
    }
  });
  
  return results;
}

function showAccountDetails(account) {
  alert(`Account: ${account.name}\nIndustry: ${account.industry}\nRevenue: ${formatCurrency(account.revenue)}\nOwner: ${account.owner}\nStatus: ${account.status}`);
  closeSearch();
}

function showOpportunityDetails(opp) {
  alert(`Opportunity: ${opp.name}\nAccount: ${opp.account}\nValue: ${formatCurrency(opp.value)}\nStage: ${opp.stage}\nOwner: ${opp.owner}\nClose Date: ${opp.closeDate}\nProbability: ${opp.probability}%`);
  closeSearch();
}

function renderSearchResults(results) {
  const searchModal = document.getElementById('search-modal');
  const searchResultsContainer = document.getElementById('search-results');
  
  if (results.length === 0) {
    searchResultsContainer.innerHTML = '<div class="search-empty">No results found</div>';
    return;
  }
  
  // Group results by category
  const grouped = {};
  results.forEach(result => {
    if (!grouped[result.category]) {
      grouped[result.category] = [];
    }
    grouped[result.category].push(result);
  });
  
  let html = '';
  Object.keys(grouped).forEach(category => {
    html += `<div class="search-category">${category}</div>`;
    grouped[category].forEach((result, index) => {
      const globalIndex = results.indexOf(result);
      html += `
        <div class="search-result-item ${globalIndex === selectedSearchIndex ? 'selected' : ''}" data-index="${globalIndex}">
          <div class="search-result-icon">${result.type === 'rep' ? '👤' : result.type === 'account' ? '🏢' : '💼'}</div>
          <div class="search-result-content">
            <div class="search-result-title">${highlightMatch(result.title, document.getElementById('search-input').value)}</div>
            <div class="search-result-subtitle">${result.subtitle}</div>
          </div>
          <div class="search-result-badge">${result.category}</div>
        </div>
      `;
    });
  });
  
  searchResultsContainer.innerHTML = html;
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function openSearch() {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  searchModal.classList.add('active');
  searchInput.focus();
  selectedSearchIndex = -1;
}

function closeSearch() {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  searchModal.classList.remove('active');
  searchInput.value = '';
  document.getElementById('search-results').innerHTML = '';
  searchResults = [];
  selectedSearchIndex = -1;
}

function handleSearchInput(e) {
  const query = e.target.value;
  searchResults = performSearch(query);
  renderSearchResults(searchResults);
  selectedSearchIndex = -1;
}

function handleSearchKeydown(e) {
  if (e.key === 'Escape') {
    closeSearch();
    return;
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedSearchIndex = Math.min(selectedSearchIndex + 1, searchResults.length - 1);
    renderSearchResults(searchResults);
    scrollToSelected();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedSearchIndex = Math.max(selectedSearchIndex - 1, -1);
    renderSearchResults(searchResults);
    scrollToSelected();
  } else if (e.key === 'Enter' && selectedSearchIndex >= 0) {
    e.preventDefault();
    searchResults[selectedSearchIndex].action();
  }
}

function scrollToSelected() {
  const selected = document.querySelector('.search-result-item.selected');
  if (selected) {
    selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}


let currentRep = reps[3]; // Default to Jordan Lee

// Utility functions
function formatCurrency(value) {
  const abs = Math.abs(value);
  if (abs >= 1000000) return (value >= 0 ? '$' : '-$') + (abs / 1000000).toFixed(1) + 'M';
  return (value >= 0 ? '$' : '-$') + (abs / 1000).toFixed(0) + 'K';
}

function getRiskClass(risk) {
  if (risk >= 70) return 'high';
  if (risk >= 40) return 'medium';
  return 'low';
}

function getAvatarClass(index) {
  const classes = ['', 'peach', 'blue', 'purple', 'peach', 'blue'];
  return classes[index % classes.length];
}

// Initialize dashboard
function init() {
  renderOverview();
  renderCoaching();
  setupEventListeners();
}

// Render Manager Overview
function renderOverview() {
  renderKPIs();
  renderPipelineTable();
  renderRiskMatrix();
  renderInsightList();
}

function renderKPIs() {
  const totalPipeline = reps.reduce((sum, r) => sum + r.pipeline, 0);
  const totalGoal = reps.reduce((sum, r) => sum + r.goal, 0);
  const totalOpps = reps.reduce((sum, r) => sum + r.opportunities, 0);
  const atRiskCount = reps.filter(r => r.risk >= 50).length;
  const untouchedAccounts = reps.reduce((sum, r) => sum + (r.accountsAssigned - r.accountsTouched), 0);
  const pipelineGap = reps.filter(r => r.pipeline < r.goal).reduce((sum, r) => sum + (r.goal - r.pipeline), 0);

  const kpis = [
    { label: 'TEAM PIPELINE', value: formatCurrency(totalPipeline), change: '↗ 8.2%', up: true },
    { label: 'TEAM QUOTA', value: formatCurrency(totalGoal), change: 'Pacing 82%', up: false },
    { label: 'PIPELINE COVERAGE', value: '3.2×', change: 'Target 3.5×', up: false },
    { label: 'OPPORTUNITIES CREATED', value: totalOpps, change: '↘ 14%', up: false, attention: true },
    { label: 'AT-RISK REPS', value: atRiskCount, change: 'Need coaching', up: false, attention: true },
    { label: 'UNTOUCHED ACCOUNTS', value: untouchedAccounts, change: '28% of assigned', up: false },
    { label: 'PIPELINE GAP', value: formatCurrency(pipelineGap), change: 'Across 3 reps', up: false, attention: true }
  ];

  document.getElementById('kpi-grid').innerHTML = kpis.map(kpi => `
    <div class="kpi${kpi.attention ? ' attention' : ''}">
      <small>${kpi.label}</small>
      <strong>${kpi.value}</strong>
      <span class="${kpi.up ? 'up' : 'down'}">${kpi.change}</span>
    </div>
  `).join('');
}

function renderPipelineTable() {
  const tableHead = `
    <div class="table-head">
      <div>REP</div>
      <div>PIPELINE PROGRESS</div>
      <div>PIPELINE GAP</div>
      <div>COVERAGE</div>
      <div>QUOTA RISK</div>
    </div>
  `;

  const rows = reps.map((rep, index) => {
    const gap = rep.pipeline - rep.goal;
    const percent = (rep.pipeline / rep.goal) * 100;
    const goalPercent = 100;

    return `
      <div class="rep-row" data-rep="${rep.id}">
        <div class="rep-ident">
          <span class="avatar ${getAvatarClass(index)}">${rep.initials}</span>
          <div>
            <strong>${rep.name}</strong>
            <small>${rep.role} · ${rep.region}</small>
          </div>
        </div>
        <div class="bar-wrap">
          <div class="bar-labels">
            <strong>${formatCurrency(rep.pipeline)}</strong>
            <span>${formatCurrency(rep.goal)}</span>
          </div>
          <div class="bar">
            <span style="width: ${Math.min(percent, 100)}%"></span>
            <i style="left: ${goalPercent}%"></i>
          </div>
        </div>
        <div class="metric-cell">
          <strong style="color: ${gap >= 0 ? '#19806c' : '#bd4d2d'}">${formatCurrency(gap)}</strong>
          <small>${gap >= 0 ? 'Above goal' : 'Below goal'}</small>
        </div>
        <div class="metric-cell">
          <strong class="${rep.coverage < 3 ? 'coverage low' : ''}">${rep.coverage.toFixed(1)}×</strong>
        </div>
        <div>
          <span class="risk ${getRiskClass(rep.risk)}">${rep.risk}%</span>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('pipeline-table').innerHTML = tableHead + rows;
}

function renderRiskMatrix() {
  const matrix = document.getElementById('risk-matrix');
  
  // Clear existing dots
  const existingDots = matrix.querySelectorAll('.matrix-dot');
  existingDots.forEach(dot => dot.remove());

  reps.forEach((rep, index) => {
    const pipelineHealth = (rep.pipeline / rep.goal) * 100;
    const oppCreation = (rep.opportunities / rep.teamAvg) * 100;
    
    // Map to matrix coordinates (0-100% for each axis)
    const x = Math.min(Math.max(pipelineHealth, 0), 200) / 2;
    const y = 100 - (Math.min(Math.max(oppCreation, 0), 200) / 2);
    
    const dot = document.createElement('div');
    dot.className = 'matrix-dot';
    dot.textContent = rep.initials;
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    dot.style.background = rep.risk >= 70 ? '#e06842' : rep.risk >= 40 ? '#daa529' : '#3aaf92';
    dot.dataset.rep = rep.id;
    dot.onclick = () => openCoaching(rep.id);
    
    matrix.appendChild(dot);
  });
}

function renderInsightList() {
  const insights = [
    { rep: reps[1], text: 'Strong pipeline · creation down 38%', tag: 'watch', tagText: 'Future risk' },
    { rep: reps[3], text: 'Creation up but conversion lagging', tag: 'coach', tagText: 'Coach' },
    { rep: reps[0], text: 'Pipeline and creation on pace', tag: 'healthy', tagText: 'Healthy' }
  ];

  document.getElementById('insight-list').innerHTML = insights.map((insight, index) => `
    <button class="insight-row" data-rep="${insight.rep.id}">
      <span class="avatar ${getAvatarClass(index)}">${insight.rep.initials}</span>
      <span>
        <strong>${insight.rep.name}</strong>
        <small>${insight.text}</small>
      </span>
      <span class="risk-tag ${insight.tag}">${insight.tagText}</span>
    </button>
  `).join('');
}

// Render Rep Coaching
function renderCoaching() {
  const rep = currentRep;
  const gap = rep.goal - rep.pipeline;
  const percent = (rep.pipeline / rep.goal) * 100;
  
  // Update header
  document.getElementById('rep-avatar').textContent = rep.initials;
  document.getElementById('rep-avatar').className = `avatar large ${getAvatarClass(reps.indexOf(rep))}`;
  document.getElementById('rep-name').textContent = rep.name;
  document.getElementById('rep-meta').textContent = `${rep.role} · ${rep.region} region`;
  document.getElementById('crumb-label').textContent = 'Rep coaching';
  
  // Update AI summary
  document.getElementById('ai-summary').textContent = rep.aiSummary;
  document.getElementById('risk-score').textContent = `${rep.risk}%`;
  
  // Update KPIs
  const untouched = rep.accountsAssigned - rep.accountsTouched;
  document.getElementById('rep-kpis').innerHTML = `
    <div class="rep-kpi"><small>CURRENT PIPELINE</small><strong>${formatCurrency(rep.pipeline)}</strong></div>
    <div class="rep-kpi"><small>GOAL</small><strong>${formatCurrency(rep.goal)}</strong></div>
    <div class="rep-kpi"><small>GAP TO QUOTA</small><strong class="${gap > 0 ? 'danger' : ''}">${formatCurrency(-gap)}</strong></div>
    <div class="rep-kpi"><small>COVERAGE</small><strong>${rep.coverage.toFixed(1)}×</strong></div>
    <div class="rep-kpi"><small>OPPORTUNITIES</small><strong>${rep.opportunities}</strong></div>
    <div class="rep-kpi"><small>MEETINGS</small><strong>${rep.meetings}</strong></div>
    <div class="rep-kpi"><small>ACCOUNTS ASSIGNED</small><strong>${rep.accountsAssigned}</strong></div>
    <div class="rep-kpi"><small>ACCOUNTS TOUCHED</small><strong>${rep.accountsTouched}</strong></div>
    <div class="rep-kpi"><small>UNTOUCHED ACCOUNTS</small><strong class="${untouched > 20 ? 'danger' : ''}">${untouched}</strong></div>
  `;
  
  // Update pipeline analysis
  document.getElementById('deep-current').textContent = formatCurrency(rep.pipeline);
  document.getElementById('deep-goal').textContent = formatCurrency(rep.goal);
  document.getElementById('deep-gap').textContent = formatCurrency(-gap);
  document.getElementById('deep-progress').style.width = `${Math.min(percent, 100)}%`;
  document.getElementById('pipeline-status').textContent = gap > 0 ? 'Needs attention' : 'On track';
  document.getElementById('pipeline-status').className = `status-pill ${gap > 0 ? 'danger' : 'warning'}`;
  
  // Update Zoom Out
  renderZoomOut(rep);
  
  // Update Sales Formula
  const oppGap = rep.teamAvg - rep.opportunities;
  const meetingsNeeded = Math.ceil(oppGap / (rep.conversion / 100));
  
  document.getElementById('formula-metrics').innerHTML = `
    <div><small>OPPORTUNITIES CREATED</small><strong>${rep.opportunities}</strong></div>
    <div><small>TEAM AVERAGE</small><strong>${rep.teamAvg}</strong></div>
    <div><small>OPPORTUNITY GAP</small><strong style="color: ${oppGap > 0 ? '#d8653b' : '#087f75'}">${oppGap > 0 ? '-' : '+'}${Math.abs(oppGap)}</strong></div>
    <div><small>MEETINGS NEEDED</small><strong>${meetingsNeeded}</strong></div>
  `;
  
  document.getElementById('meetings-needed').textContent = `${meetingsNeeded} more meetings needed`;
  document.getElementById('conversion-note').textContent = `Based on ${rep.name.split(' ')[0]}'s ${rep.conversion}% meeting-to-opportunity conversion`;
  document.getElementById('formula-status').textContent = oppGap > 0 ? 'Below pace' : 'On pace';
  
  // Update Recovery Plan
  const avgDeal = rep.pipeline / rep.opportunities;
  const oppsNeeded = Math.ceil(gap / avgDeal);
  const largeOppsNeeded = Math.ceil(gap / (avgDeal * 1.5));
  
  document.getElementById('recovery-gap').textContent = formatCurrency(gap);
  document.getElementById('option-a').textContent = `${oppsNeeded} opportunities`;
  document.getElementById('option-a').nextElementSibling.textContent = `at ${formatCurrency(avgDeal)} average`;
  document.getElementById('option-b').textContent = `${largeOppsNeeded} opportunities`;
  document.getElementById('option-b').nextElementSibling.textContent = `at ${formatCurrency(avgDeal * 1.5)} average`;
  
  document.getElementById('action-accounts').textContent = Math.ceil(untouched * 0.3);
  document.getElementById('action-meetings').textContent = meetingsNeeded;
  document.getElementById('action-stalled').textContent = Math.min(rep.opportunities, 2);
  
  // Update Recommendations
  renderRecommendations(rep);
  
  // Update Coaching Questions
  const coachingQuestionsContainer = document.getElementById('coaching-questions-container');
  if (coachingQuestionsContainer) {
    coachingQuestionsContainer.innerHTML = renderCoachingQuestions(rep);
  }
  
  // Update rep menu
  renderRepMenu();
}

function renderZoomOut(rep) {
  const exposures = [
    { label: 'Quantity', ...rep.zoomOut.quantity },
    { label: 'Deal size', ...rep.zoomOut.dealSize },
    { label: 'Mix', ...rep.zoomOut.mix },
    { label: 'Balance', ...rep.zoomOut.balance }
  ];
  
  document.getElementById('exposure-grid').innerHTML = exposures.map(exp => `
    <div class="exposure ${exp.status === 'exposed' ? 'exposed' : ''}">
      <div class="exposure-head">
        <strong>${exp.label}</strong>
        <span>${exp.score}/100</span>
      </div>
      <div class="mini-track">
        <span style="width: ${exp.score}%"></span>
      </div>
      <small>${exp.label === 'Quantity' ? 'Number of opportunities in pipeline' : 
              exp.label === 'Deal size' ? 'Average deal value vs target' :
              exp.label === 'Mix' ? 'Product and segment diversity' :
              'Distribution across accounts'}</small>
    </div>
  `).join('');
  
  document.getElementById('exposed-label').textContent = rep.exposedArea;
}

function getContextualCoachingQuestions(rep) {
  const questions = [];
  
  // Pipeline gap - if below goal
  if (rep.pipeline < rep.goal) {
    questions.push(coachingQuestions.pipelineGap);
  }
  
  // Low activity - if untouched accounts > 30% or meetings below average
  const untouchedPercent = ((rep.accountsAssigned - rep.accountsTouched) / rep.accountsAssigned) * 100;
  if (untouchedPercent > 30 || rep.meetings < 18) {
    questions.push(coachingQuestions.lowActivity);
  }
  
  // Opportunity creation - if below team average
  if (rep.opportunities < rep.teamAvg) {
    questions.push(coachingQuestions.opportunityCreation);
  }
  
  // Conversion issues - if conversion rate is low
  if (rep.conversion < 30) {
    questions.push(coachingQuestions.conversionIssues);
  }
  
  // Account coverage - if untouched accounts > 25%
  if (untouchedPercent > 25) {
    questions.push(coachingQuestions.accountCoverage);
  }
  
  // Always include skill development for high-risk reps
  if (rep.risk >= 60) {
    questions.push(coachingQuestions.skillDevelopment);
  }
  
  return questions;
}

function renderRecommendations(rep) {
  document.getElementById('recommendation-list').innerHTML = rep.recommendations.map(rec => `
    <div class="rec">
      <div class="rec-head">
        <strong>Priority #${rec.priority}: ${rec.title}</strong>
        <span>PRIORITY ${rec.priority}</span>
      </div>
      <p><strong>Reason:</strong> ${rec.reason}</p>
      <div class="rec-action"><strong>Action:</strong> ${rec.action}</div>
    </div>
  `).join('');
}

function renderCoachingQuestions(rep) {
  const questions = getContextualCoachingQuestions(rep);
  
  if (questions.length === 0) {
    return '<div class="no-questions">No specific coaching questions needed - rep is performing well!</div>';
  }
  
  return questions.map(section => `
    <div class="coaching-question-section">
      <div class="question-section-head">
        <span class="question-icon">${section.icon}</span>
        <strong>${section.category}</strong>
      </div>
      <ol class="coaching-questions-list">
        ${section.questions.map(q => `<li>${q}</li>`).join('')}
      </ol>
    </div>
  `).join('');
}

function renderRepMenu() {
  document.getElementById('rep-menu').innerHTML = reps.map(rep => `
    <button data-rep="${rep.id}">${rep.name}</button>
  `).join('');
}

// Event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });
  
  // Mobile menu
  document.getElementById('mobile-menu').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  
  // Open coaching buttons
  document.getElementById('open-coaching').addEventListener('click', () => switchView('coaching'));
  document.getElementById('view-risk').addEventListener('click', () => switchView('coaching'));
  document.getElementById('pipeline-coaching').addEventListener('click', () => switchView('coaching'));
  
  // Back button
  document.getElementById('back-overview').addEventListener('click', () => switchView('overview'));
  
  // Rep selection
  document.getElementById('rep-select').addEventListener('click', () => {
    document.getElementById('rep-menu').classList.toggle('open');
  });
  
  // Rep menu items
  document.addEventListener('click', (e) => {
    if (e.target.closest('#rep-menu button')) {
      const repId = e.target.closest('button').dataset.rep;
      selectRep(repId);
      document.getElementById('rep-menu').classList.remove('open');
    }
    
    // Close menu when clicking outside
    if (!e.target.closest('#rep-select') && !e.target.closest('#rep-menu')) {
      document.getElementById('rep-menu').classList.remove('open');
    }
  });
  
  // Pipeline table rows
  document.addEventListener('click', (e) => {
    const row = e.target.closest('.rep-row');
    if (row) {
      openCoaching(row.dataset.rep);
    }
  });
  
  // Insight rows
  document.addEventListener('click', (e) => {
    const row = e.target.closest('.insight-row');
    if (row) {
      openCoaching(row.dataset.rep);
    }
  });
  
  // Action plan checkboxes
  document.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox' && e.target.closest('#action-plan')) {
      const label = e.target.closest('label');
      if (e.target.checked) {
        label.classList.add('completed');
      } else {
        label.classList.remove('completed');
      }
    }
  });
  
  // Search functionality
  const searchBtn = document.querySelector('.icon-btn[aria-label="Search"]');
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
  }
  
  // Search result clicks
  document.addEventListener('click', (e) => {
    const resultItem = e.target.closest('.search-result-item');
    if (resultItem) {
      const index = parseInt(resultItem.dataset.index);
      if (searchResults[index]) {
        searchResults[index].action();
      }
    }
    
    // Close search when clicking outside
    if (e.target.closest('#search-modal') && !e.target.closest('.search-container')) {
      closeSearch();
    }
  });
  
  // Close search button
  const searchClose = document.getElementById('search-close');
  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }
  
  // Global keyboard shortcut for search (Cmd/Ctrl + K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
}

function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  
  const viewConfig = {
    'overview': { id: 'overview', label: 'Manager overview' },
    'coaching': { id: 'coaching', label: 'Rep coaching' },
    'opportunities': { id: 'opportunities', label: 'Opportunities' },
    'activity': { id: 'activity', label: 'Activity intelligence' },
    'reports': { id: 'reports', label: 'Reports' }
  };
  
  if (viewConfig[view]) {
    const config = viewConfig[view];
    const viewElement = document.getElementById(config.id);
    const navElement = document.querySelector(`[data-view="${view}"]`);
    
    if (viewElement) viewElement.classList.add('active');
    if (navElement) navElement.classList.add('active');
    document.getElementById('crumb-label').textContent = config.label;
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCoaching(repId) {
  selectRep(repId);
  switchView('coaching');
}

function selectRep(repId) {
  const rep = reps.find(r => r.id === repId);
  if (rep) {
    currentRep = rep;
    renderCoaching();
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// Made with Bob
