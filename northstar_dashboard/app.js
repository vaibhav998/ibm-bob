// AI Insights Panel Toggle
function toggleAIInsights(event) {
  // Find the closest parent panel from the clicked button
  const button = event.target;
  const panel = button.closest('.ai-insights-panel');
  if (panel) {

// ROI Calculator
const roiCalculator = {
  products: {
    'watsonx.ai': {
      baseCost: 50000,
      costPerTB: 200,
      efficiencyGain: 0.35,
      timeToValue: 6
    },
    'watsonx.data': {
      baseCost: 40000,
      costPerTB: 150,
      efficiencyGain: 0.60,
      timeToValue: 4
    },
    'Db2 Warehouse': {
      baseCost: 35000,
      costPerTB: 180,
      efficiencyGain: 0.40,
      timeToValue: 5
    },
    'Instana': {
      baseCost: 25000,
      costPerTB: 100,
      efficiencyGain: 0.45,
      timeToValue: 3
    },
    'Guardium': {
      baseCost: 30000,
      costPerTB: 120,
      efficiencyGain: 0.30,
      timeToValue: 4
    },
    'Turbonomic': {
      baseCost: 28000,
      costPerTB: 110,
      efficiencyGain: 0.50,
      timeToValue: 3
    }
  },
  
  sizeMultipliers: {
    'Enterprise (1000+)': 1.5,
    'Mid-Market (100-999)': 1.0,
    'SMB (<100)': 0.6
  },
  
  industryMultipliers: {
    'Financial Services': 1.3,
    'Healthcare': 1.2,
    'Retail': 1.0,
    'Manufacturing': 1.1,
    'Technology': 0.9
  },
  
  calculate: function(productName, companySize, industry, dataVolume, growthRate, currentCost) {
    const product = this.products[productName];
    if (!product) return null;
    
    const sizeMultiplier = this.sizeMultipliers[companySize] || 1.0;
    const industryMultiplier = this.industryMultipliers[industry] || 1.0;
    
    // Calculate IBM solution cost
    const yearOneCost = (product.baseCost + (dataVolume * product.costPerTB)) * sizeMultiplier * industryMultiplier;
    
    // Calculate 3-year costs with growth
    const year2Volume = dataVolume * (1 + growthRate / 100);
    const year3Volume = year2Volume * (1 + growthRate / 100);
    
    const year2Cost = yearOneCost * 1.05; // 5% annual increase
    const year3Cost = year2Cost * 1.05;
    
    const totalIBMCost = yearOneCost + year2Cost + year3Cost;
    
    // Calculate current solution 3-year cost with growth
    const currentYear2Cost = currentCost * (1 + growthRate / 100) * 1.08; // 8% annual increase
    const currentYear3Cost = currentYear2Cost * (1 + growthRate / 100) * 1.08;
    const totalCurrentCost = currentCost + currentYear2Cost + currentYear3Cost;
    
    // Calculate efficiency gains
    const efficiencyValue = currentCost * product.efficiencyGain * 3; // 3 years
    
    // Calculate total savings
    const totalSavings = (totalCurrentCost - totalIBMCost) + efficiencyValue;
    
    // Calculate ROI
    const roi = ((totalSavings / totalIBMCost) * 100).toFixed(0);
    
    // Calculate payback period (months)
    const monthlySavings = totalSavings / 36;
    const paybackMonths = Math.ceil(yearOneCost / monthlySavings);
    
    return {
      roi: roi,
      savings: Math.round(totalSavings),
      paybackMonths: paybackMonths,
      yearOneCost: Math.round(yearOneCost),
      totalCost: Math.round(totalIBMCost)
    };
  }
};

function calculateROI() {
  const product = document.getElementById('roi-product').value;
  const companySize = document.getElementById('roi-size').value;
  const industry = document.getElementById('roi-industry').value;
  const dataVolume = parseFloat(document.getElementById('roi-data-volume').value) || 0;
  const growthRate = parseFloat(document.getElementById('roi-growth-rate').value) || 0;
  const currentCost = parseFloat(document.getElementById('roi-current-cost').value) || 0;
  
  if (dataVolume === 0 || currentCost === 0) {
    alert('Please enter data volume and current cost');
    return;
  }
  
  const result = roiCalculator.calculate(product, companySize, industry, dataVolume, growthRate, currentCost);
  
  if (result) {
    document.getElementById('roi-result-value').textContent = result.roi + '%';
    document.getElementById('roi-savings-value').textContent = '$' + (result.savings / 1000000).toFixed(1) + 'M';
    document.getElementById('roi-payback-value').textContent = result.paybackMonths + ' months';
    document.getElementById('roi-result-panel').style.display = 'block';
  }
}

    panel.classList.toggle('collapsed');
  }
}

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

  const kpiGrid = document.getElementById('kpi-grid');
  if (kpiGrid) {
    kpiGrid.innerHTML = kpis.map(kpi => `
    <div class="kpi${kpi.attention ? ' attention' : ''}">
      <small>${kpi.label}</small>
      <strong>${kpi.value}</strong>
      <span class="${kpi.up ? 'up' : 'down'}">${kpi.change}</span>
    </div>
    `).join('');
  }
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

  const pipelineTable = document.getElementById('pipeline-table');
  if (pipelineTable) {
    pipelineTable.innerHTML = tableHead + rows;
  }
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

  const insightList = document.getElementById('insight-list');
  if (insightList) {
    insightList.innerHTML = insights.map((insight, index) => `
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
}

// Render Rep Coaching
function renderCoaching() {
  const rep = currentRep;
  const gap = rep.goal - rep.pipeline;
  const percent = (rep.pipeline / rep.goal) * 100;
  
  // Update header
  const repAvatar = document.getElementById('rep-avatar');
  const repName = document.getElementById('rep-name');
  const repMeta = document.getElementById('rep-meta');
  const crumbLabel = document.getElementById('crumb-label');
  
  if (repAvatar) {
    repAvatar.textContent = rep.initials;
    repAvatar.className = `avatar large ${getAvatarClass(reps.indexOf(rep))}`;
  }
  if (repName) repName.textContent = rep.name;
  if (repMeta) repMeta.textContent = `${rep.role} · ${rep.region} region`;
  if (crumbLabel) crumbLabel.textContent = 'Rep coaching';
  
  // Update AI summary
  const aiSummary = document.getElementById('ai-summary');
  const riskScore = document.getElementById('risk-score');
  if (aiSummary) aiSummary.textContent = rep.aiSummary;
  if (riskScore) riskScore.textContent = `${rep.risk}%`;
  
  // Update KPIs
  const untouched = rep.accountsAssigned - rep.accountsTouched;
  const repKpis = document.getElementById('rep-kpis');
  if (repKpis) {
    repKpis.innerHTML = `
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
  }
  
  // Update pipeline analysis
  const deepCurrent = document.getElementById('deep-current');
  const deepGoal = document.getElementById('deep-goal');
  const deepGap = document.getElementById('deep-gap');
  const deepProgress = document.getElementById('deep-progress');
  const pipelineStatus = document.getElementById('pipeline-status');
  
  if (deepCurrent) deepCurrent.textContent = formatCurrency(rep.pipeline);
  if (deepGoal) deepGoal.textContent = formatCurrency(rep.goal);
  if (deepGap) deepGap.textContent = formatCurrency(-gap);
  if (deepProgress) deepProgress.style.width = `${Math.min(percent, 100)}%`;
  if (pipelineStatus) {
    pipelineStatus.textContent = gap > 0 ? 'Needs attention' : 'On track';
    pipelineStatus.className = `status-pill ${gap > 0 ? 'danger' : 'warning'}`;
  }
  
  // Update Zoom Out
  renderZoomOut(rep);
  
  // Update Sales Formula
  const oppGap = rep.teamAvg - rep.opportunities;
  const meetingsNeeded = Math.ceil(oppGap / (rep.conversion / 100));
  
  const formulaMetrics = document.getElementById('formula-metrics');
  if (formulaMetrics) {
    formulaMetrics.innerHTML = `
    <div><small>OPPORTUNITIES CREATED</small><strong>${rep.opportunities}</strong></div>
    <div><small>TEAM AVERAGE</small><strong>${rep.teamAvg}</strong></div>
    <div><small>OPPORTUNITY GAP</small><strong style="color: ${oppGap > 0 ? '#d8653b' : '#087f75'}">${oppGap > 0 ? '-' : '+'}${Math.abs(oppGap)}</strong></div>
    <div><small>MEETINGS NEEDED</small><strong>${meetingsNeeded}</strong></div>
    `;
  }
  
  const meetingsNeededEl = document.getElementById('meetings-needed');
  const conversionNote = document.getElementById('conversion-note');
  const formulaStatus = document.getElementById('formula-status');
  
  if (meetingsNeededEl) meetingsNeededEl.textContent = `${meetingsNeeded} more meetings needed`;
  if (conversionNote) conversionNote.textContent = `Based on ${rep.name.split(' ')[0]}'s ${rep.conversion}% meeting-to-opportunity conversion`;
  if (formulaStatus) formulaStatus.textContent = oppGap > 0 ? 'Below pace' : 'On pace';
  
  // Update Recovery Plan
  const avgDeal = rep.pipeline / rep.opportunities;
  const oppsNeeded = Math.ceil(gap / avgDeal);
  const largeOppsNeeded = Math.ceil(gap / (avgDeal * 1.5));
  
  const recoveryGap = document.getElementById('recovery-gap');
  const optionA = document.getElementById('option-a');
  const optionB = document.getElementById('option-b');
  const actionAccounts = document.getElementById('action-accounts');
  const actionMeetings = document.getElementById('action-meetings');
  const actionStalled = document.getElementById('action-stalled');
  
  if (recoveryGap) recoveryGap.textContent = formatCurrency(gap);
  if (optionA) {
    optionA.textContent = `${oppsNeeded} opportunities`;
    if (optionA.nextElementSibling) optionA.nextElementSibling.textContent = `at ${formatCurrency(avgDeal)} average`;
  }
  if (optionB) {
    optionB.textContent = `${largeOppsNeeded} opportunities`;
    if (optionB.nextElementSibling) optionB.nextElementSibling.textContent = `at ${formatCurrency(avgDeal * 1.5)} average`;
  }
  
  if (actionAccounts) actionAccounts.textContent = Math.ceil(untouched * 0.3);
  if (actionMeetings) actionMeetings.textContent = meetingsNeeded;
  if (actionStalled) actionStalled.textContent = Math.min(rep.opportunities, 2);
  
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
  
  const exposureGrid = document.getElementById('exposure-grid');
  if (exposureGrid) {
    exposureGrid.innerHTML = exposures.map(exp => `
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
  }
  
  const exposedLabel = document.getElementById('exposed-label');
  if (exposedLabel) exposedLabel.textContent = rep.exposedArea;
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
  const recommendationList = document.getElementById('recommendation-list');
  if (recommendationList) {
    recommendationList.innerHTML = rep.recommendations.map(rec => `
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
  const repMenu = document.getElementById('rep-menu');
  if (repMenu) {
    repMenu.innerHTML = reps.map(rep => `
    <button data-rep="${rep.id}">${rep.name}</button>
    `).join('');
  }
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
    'product-intelligence': { id: 'product-intelligence', label: 'Product intelligence' },
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
document.addEventListener('DOMContentLoaded', () => {
  init();
  initEnhancements();
});

// Made with Bob

// ============================================
// DARK MODE TOGGLE
// ============================================

function initDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

// ============================================
// CHART.JS CONFIGURATIONS
// ============================================

const chartColors = {
  primary: '#0f62fe',
  success: '#24a148',
  warning: '#f1c21b',
  danger: '#da1e28',
  teal: '#087f75',
  purple: '#8a3ffc',
  grid: 'rgba(0, 0, 0, 0.05)',
  text: '#525252'
};

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#161616',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#393939',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function(context) {
          return context.parsed.y !== null ? formatCurrency(context.parsed.y) : '';
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: chartColors.grid,
        drawBorder: false
      },
      ticks: {
        color: chartColors.text,
        font: {
          size: 11
        },
        callback: function(value) {
          return formatCurrency(value);
        }
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: chartColors.text,
        font: {
          size: 11
        }
      }
    }
  }
};

// ============================================
// SPARKLINE GENERATOR
// ============================================

function createSparkline(data, trend = 'neutral') {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 24 - ((value - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');
  
  const trendClass = trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : '';
  
  return `
    <svg class="sparkline ${trendClass}" viewBox="0 0 60 24">
      <polyline class="sparkline-path" points="${points}" />
    </svg>
  `;
}

// ============================================
// PROGRESS RING GENERATOR
// ============================================

function createProgressRing(percentage, size = 120) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  return `
    <div class="progress-ring" style="width: ${size}px; height: ${size}px;">
      <svg width="${size}" height="${size}">
        <circle class="progress-ring-bg" cx="${size/2}" cy="${size/2}" r="${radius}" />
        <circle class="progress-ring-progress" cx="${size/2}" cy="${size/2}" r="${radius}"
                style="stroke-dashoffset: ${offset};" />
      </svg>
      <div class="progress-ring-text">${percentage}%</div>
    </div>
  `;
}

// ============================================
// TOOLTIP HELPER
// ============================================

function addTooltip(element, text, position = 'top') {
  element.classList.add('tooltip');
  if (position !== 'top') {
    element.classList.add(`tooltip-${position}`);
  }
  element.setAttribute('data-tooltip', text);
}

// ============================================
// LOADING STATE HELPERS
// ============================================

function showLoading(element) {
  element.classList.add('loading');
}

function hideLoading(element) {
  element.classList.remove('loading');
}

function createSkeleton(type = 'text') {
  const skeletonClasses = {
    text: 'skeleton skeleton-text',
    title: 'skeleton skeleton-title',
    card: 'skeleton skeleton-card',
    avatar: 'skeleton skeleton-avatar'
  };
  
  const div = document.createElement('div');
  div.className = skeletonClasses[type] || skeletonClasses.text;
  return div;
}

// ============================================
// EMPTY STATE GENERATOR
// ============================================

function createEmptyState(icon, title, message, actionText, actionCallback) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message}</p>
      ${actionText ? `<button class="button primary" onclick="${actionCallback}">${actionText}</button>` : ''}
    </div>
  `;
}

// ============================================
// PIPELINE TREND CHART
// ============================================

function renderPipelineTrendChart() {
  try {
    const canvas = document.getElementById('pipeline-trend-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
      datasets: [{
        label: 'Pipeline',
        data: [980000, 1050000, 1120000, 1180000, 1240000, 1290000, 1340000, 1372000],
        borderColor: chartColors.teal,
        backgroundColor: 'rgba(8, 127, 117, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: chartColors.teal,
        pointBorderWidth: 2
      }]
    },
    options: {
      ...chartDefaults,
      plugins: {
        ...chartDefaults.plugins,
        tooltip: {
          ...chartDefaults.plugins.tooltip,
          callbacks: {
            label: function(context) {
              return 'Pipeline: ' + formatCurrency(context.parsed.y);
            }
          }
        }
      }
    }
    });
  } catch (error) {
    console.error('Error rendering pipeline trend chart:', error);
  }
}

// ============================================
// OPPORTUNITY DISTRIBUTION CHART
// ============================================

function renderOpportunityChart() {
  try {
    const canvas = document.getElementById('opportunity-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closing'],
      datasets: [{
        data: [12, 9, 11, 8, 3],
        backgroundColor: [
          chartColors.primary,
          chartColors.teal,
          chartColors.purple,
          chartColors.warning,
          chartColors.success
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            padding: 15,
            font: {
              size: 12
            },
            color: chartColors.text,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: '#161616',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          padding: 12,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + ' opportunities';
            }
          }
        }
      }
    }
    });
  } catch (error) {
    console.error('Error rendering opportunity chart:', error);
  }
}

// ============================================
// REP PERFORMANCE CHART
// ============================================

function renderRepPerformanceChart() {
  try {
    const canvas = document.getElementById('rep-performance-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
    type: 'bar',
    data: {
      labels: reps.map(r => r.name.split(' ')[0]),
      datasets: [{
        label: 'Pipeline',
        data: reps.map(r => r.pipeline),
        backgroundColor: reps.map(r => r.risk >= 70 ? chartColors.danger : 
                                       r.risk >= 40 ? chartColors.warning : 
                                       chartColors.success),
        borderRadius: 6,
        barThickness: 32
      }]
    },
    options: {
      ...chartDefaults,
      plugins: {
        ...chartDefaults.plugins,
        tooltip: {
          ...chartDefaults.plugins.tooltip,
          callbacks: {
            label: function(context) {
              const rep = reps[context.dataIndex];
              return [
                'Pipeline: ' + formatCurrency(context.parsed.y),
                'Goal: ' + formatCurrency(rep.goal),
                'Risk: ' + rep.risk + '%'
              ];
            }
          }
        }
      }
    }
    });
  } catch (error) {
    console.error('Error rendering rep performance chart:', error);
  }
}

// ============================================
// INITIALIZE ENHANCEMENTS
// ============================================

function initEnhancements() {
  try {
    // Initialize dark mode
    initDarkMode();
    
    // Add fade-in animations to main sections
    document.querySelectorAll('.panel, .kpi').forEach((el, index) => {
      el.classList.add('stagger-item');
      el.style.animationDelay = `${index * 0.05}s`;
    });
    
    // Initialize charts if canvases exist and Chart.js is loaded
    setTimeout(() => {
      if (typeof Chart !== 'undefined') {
        renderPipelineTrendChart();
        renderOpportunityChart();
        renderRepPerformanceChart();
      }
    }, 100);
  } catch (error) {
    console.error('Error initializing enhancements:', error);
  }
}


// AI Copilot Functionality
const copilot = {
  isOpen: false,
  isTyping: false,
  
  // Knowledge base for intelligent responses
  knowledge: {
    reps: reps,
    accounts: accounts,
    opportunities: opportunities
  },
  
  // Pre-defined responses for common queries
  responses: {
    'why is jordan behind quota': {
      answer: `Jordan Lee is behind quota primarily due to **low account coverage** and **insufficient opportunity creation**.

**Key Issues:**
• Only **26% of territory engaged** (19 of 74 accounts touched)
• Created **4 opportunities** vs team average of **7**
• Meeting-to-opportunity conversion at **28%** vs team average **35%**
• Pipeline gap of **-$58K** with only **2.6× coverage**

**Root Causes:**
1. **Territory Coverage**: Jordan is leaving 74% of assigned accounts untouched, limiting pipeline potential
2. **Activity Efficiency**: While call volume is adequate (48 calls/week), connect rate is below average at 32%
3. **Product Knowledge**: Not actively discussing watsonx.ai despite its 58% win rate

**Recommended Actions:**
1. **Immediate**: Touch 15 additional accounts this week
2. **This Month**: Generate 6 additional meetings to close opportunity gap
3. **Training**: Schedule watsonx.ai product training
4. **Coaching**: Review account prioritization strategy`,
      sources: ['Risk Assessment', 'Territory Coverage', 'Activity Intelligence']
    },
    
    'which accounts should i target for watsonx.ai': {
      answer: `Based on propensity scoring and current customer profiles, here are the **top accounts for watsonx.ai**:

**High Priority (85%+ propensity):**
1. **Acme Corporation** (Priya Shah)
   • Currently using Azure OpenAI
   • High AI spend, looking for cost optimization
   • Next step: Schedule AI strategy discussion

2. **Enterprise Systems Ltd** (Jordan Lee)
   • Existing Db2 customer with large data volumes
   • Exploring ML/AI capabilities
   • Next step: Demo watsonx.ai on their data

3. **TechStart Solutions** (Sam Rivera)
   • Technology company, AI-forward culture
   • Recently hired data science team
   • Next step: Technical deep-dive session

**Medium Priority (70-84% propensity):**
4. **Global Industries Inc** (Maya Chen)
   • Manufacturing automation interest
   • Quality control AI use case
   
5. **Healthcare Partners** (Elena Garcia)
   • Patient data analytics opportunity
   • Compliance-friendly AI needed

**Coaching Note:** Only 3 of 6 reps are actively selling watsonx.ai. Consider team-wide AI solution training.`,
      sources: ['Product Propensity Engine', 'Account Intelligence', 'Opportunity Data']
    },
    
    'generate a coaching plan for noah': {
      answer: `# Coaching Plan: Noah Williams

**Status:** 🔴 High Risk - Immediate intervention required

**Current Performance:**
• Pipeline: $164K (goal: $220K) - **25% below quota**
• Risk Score: **81%** (Critical)
• Coverage: Only **29% of territory** engaged
• Activity: **38 calls/week** vs team avg **57**

---

## 🎯 30-Day Coaching Plan

### Week 1: Activity Foundation
**Goal:** Double daily prospecting activity

**Actions:**
1. **Daily Check-ins** (15 min)
   - Review previous day's activity
   - Set daily call targets (minimum 12 calls/day)
   - Remove blockers

2. **Territory Audit** (60 min session)
   - Review all 62 assigned accounts
   - Prioritize top 30 accounts
   - Create account engagement plan

3. **Metrics to Track:**
   - Calls per day: Target 12+ (currently 7.6)
   - Connect rate: Target 35%+ (currently 28%)

### Week 2: Conversion Skills
**Goal:** Improve meeting-to-opportunity conversion

**Actions:**
1. **Call Recording Review** (45 min)
   - Listen to 3 recent calls together
   - Identify discovery question gaps
   - Practice value proposition

2. **Product Training** (90 min)
   - watsonx.ai positioning (Noah's weak area)
   - Instana best practices (Noah's strength - build on it)

3. **Metrics to Track:**
   - Meetings booked: Target 15+ (currently 11)
   - Product mentions: Track watsonx.ai discussions

### Week 3: Pipeline Building
**Goal:** Create 5 new qualified opportunities

**Actions:**
1. **Account Strategy Sessions** (30 min each)
   - Deep dive on top 5 accounts
   - Identify buying signals
   - Create opportunity plans

2. **Joint Calls** (2-3 calls)
   - Shadow Noah on discovery calls
   - Provide real-time coaching
   - Model effective questioning

3. **Metrics to Track:**
   - New opportunities created: Target 5
   - Pipeline added: Target $50K+

### Week 4: Momentum & Accountability
**Goal:** Establish sustainable habits

**Actions:**
1. **Progress Review** (60 min)
   - Celebrate wins
   - Analyze what's working
   - Adjust approach as needed

2. **Peer Learning** (30 min)
   - Pair with Elena Garcia (top performer)
   - Learn her Instana positioning
   - Share best practices

3. **Set Next Month Goals:**
   - Activity targets
   - Pipeline goals
   - Skill development focus

---

## 📊 Success Metrics

**By End of Month:**
- [ ] Calls per day: 12+ (from 7.6)
- [ ] Territory coverage: 45%+ (from 29%)
- [ ] New opportunities: 5+ (from 3/month)
- [ ] Pipeline: $200K+ (from $164K)
- [ ] Risk score: <60% (from 81%)

---

## 🚨 Red Flags to Watch

- Missing daily check-ins
- Call volume not improving by Week 2
- No new opportunities by Week 3
- Resistance to coaching

**Escalation Plan:** If no improvement by Week 2, involve Director for PIP discussion.`,
      sources: ['Risk Assessment', 'Activity Intelligence', 'Coaching Recommendations']
    },
    
    'what are my team\'s biggest risks this quarter': {
      answer: `# Team Risk Analysis - Q3 Week 8

**Overall Status:** ⚠️ **3 of 6 reps at risk** - Team pacing at 82% of quota

---

## 🔴 Critical Risks

### 1. Opportunity Creation Decline (-14% MoM)
**Impact:** Future pipeline at risk

**Details:**
• Team created **43 opportunities** vs **50 last month**
• Primary driver: Reduced meeting activity
• **Jordan, Maya, and Noah** below team average

**Action:** Implement daily activity tracking for at-risk reps

---

### 2. watsonx.ai Underutilization
**Impact:** Missing $200K+ pipeline opportunity

**Details:**
• Only **12% of calls** mention watsonx.ai (down 32%)
• Product has **58% win rate** (highest on team)
• Only **3 of 6 reps** actively selling it

**Action:** Schedule urgent watsonx.ai training for Jordan, Maya, Noah

---

### 3. Noah Williams - Critical Risk (81%)
**Impact:** $56K quota gap, trending worse

**Details:**
• Only **29% territory coverage**
• **38 calls/week** vs team avg **57**
• **3 opportunities** vs team avg **7**

**Action:** Immediate coaching intervention (see coaching plan)

---

## ⚠️ Medium Risks

### 4. Jordan Lee - Territory Coverage (72% risk)
• Only **26% of accounts** engaged
• **4 opportunities** created vs team avg **7**
• Action: Territory audit and account prioritization

### 5. Maya Chen - Future Pipeline Risk (38% risk)
• Strong pipeline **today** ($286K)
• But opportunity creation **down 38%**
• Action: Protect current deals while rebuilding pipeline

---

## ✅ Strengths to Leverage

### Priya Shah - Top Performer
• **4.2× coverage**, exceeding quota
• Strong watsonx.ai expertise
• **Action:** Share best practices with team

### Elena Garcia - High Activity
• **15 calls/day** with **44% connect rate**
• Strong Instana positioning
• **Action:** Pair with Noah for peer coaching

---

## 📈 Recommended Actions (Priority Order)

1. **This Week:**
   - [ ] Schedule watsonx.ai training (Jordan, Maya, Noah)
   - [ ] Start daily check-ins with Noah
   - [ ] Territory audit with Jordan

2. **This Month:**
   - [ ] Implement activity tracking dashboard
   - [ ] Create product positioning playbook
   - [ ] Establish peer coaching program

3. **This Quarter:**
   - [ ] Rebuild opportunity creation to 50+/month
   - [ ] Increase watsonx.ai pipeline by $200K
   - [ ] Get all reps to 3.5× coverage minimum

**Bottom Line:** Focus on Noah (critical) and opportunity creation (systemic). Success here protects Q4.`,
      sources: ['Risk Assessments', 'Team Analytics', 'Product Intelligence']
    }
  },
  
  init() {
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    const toggle = document.getElementById('copilot-toggle');
    const close = document.getElementById('copilot-close');
    const send = document.getElementById('copilot-send');
    const input = document.getElementById('copilot-input');
    const suggestions = document.querySelectorAll('.copilot-suggestion');
    
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleChat());
    }
    
    if (close) {
      close.addEventListener('click', () => this.closeChat());
    }
    
    if (send) {
      send.addEventListener('click', () => this.sendMessage());
    }
    
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
      
      // Auto-resize textarea
      input.addEventListener('input', (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      });
    }
    
    suggestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.query;
        this.sendMessage(query);
      });
    });
  },
  
  toggleChat() {
    const chat = document.getElementById('copilot-chat');
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      chat.classList.add('active');
      document.getElementById('copilot-input').focus();
    } else {
      chat.classList.remove('active');
    }
  },
  
  closeChat() {
    const chat = document.getElementById('copilot-chat');
    chat.classList.remove('active');
    this.isOpen = false;
  },
  
  sendMessage(text) {
    const input = document.getElementById('copilot-input');
    const message = text || input.value.trim();
    
    if (!message || this.isTyping) return;
    
    // Add user message
    this.addMessage(message, 'user');
    
    // Clear input
    if (!text) {
      input.value = '';
      input.style.height = 'auto';
    }
    
    // Show typing indicator
    this.showTyping();
    
    // Simulate AI response delay
    setTimeout(() => {
      this.hideTyping();
      this.generateResponse(message);
    }, 1500 + Math.random() * 1000);
  },
  
  addMessage(content, type = 'assistant', sources = []) {
    const messagesContainer = document.getElementById('copilot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `copilot-message ${type}`;
    
    const avatar = type === 'user' ? 'AM' : `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4M12 8h.01"></path>
      </svg>
    `;
    
    // Convert markdown-style formatting to HTML
    const formattedContent = this.formatMessage(content);
    
    let sourcesHTML = '';
    if (sources.length > 0) {
      sourcesHTML = `
        <div class="message-meta">
          ${sources.map(s => `<span class="message-source">📊 ${s}</span>`).join('')}
        </div>
      `;
    }
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        ${formattedContent}
        ${sourcesHTML}
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  
  formatMessage(text) {
    // Convert markdown-style formatting to HTML
    let formatted = text
      // Headers
      .replace(/^# (.+)$/gm, '<h3 style="margin: 0 0 12px; font-size: 16px; font-weight: 600;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h4 style="margin: 12px 0 8px; font-size: 14px; font-weight: 600;">$1</h4>')
      .replace(/^### (.+)$/gm, '<h5 style="margin: 8px 0 6px; font-size: 13px; font-weight: 600;">$1</h5>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Bullet points
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      // Checkboxes
      .replace(/^\- \[ \] (.+)$/gm, '<li style="list-style: none;"><input type="checkbox" disabled> $1</li>')
      .replace(/^\- \[x\] (.+)$/gm, '<li style="list-style: none;"><input type="checkbox" checked disabled> $1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr style="margin: 16px 0; border: none; border-top: 1px solid #dde4e6;">');
    
    // Wrap in paragraphs if not already wrapped
    if (!formatted.startsWith('<')) {
      formatted = '<p>' + formatted + '</p>';
    }
    
    // Wrap bullet points in ul
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul style="margin: 8px 0; padding-left: 20px;">$1</ul>');
    
    return formatted;
  },
  
  showTyping() {
    this.isTyping = true;
    const messagesContainer = document.getElementById('copilot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'copilot-typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4M12 8h.01"></path>
        </svg>
      </div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  
  hideTyping() {
    this.isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  },
  
  generateResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    // Check for pre-defined responses
    for (const [key, response] of Object.entries(this.responses)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
        this.addMessage(response.answer, 'assistant', response.sources);
        return;
      }
    }
    
    // Generate contextual response based on query keywords
    if (lowerQuery.includes('risk') || lowerQuery.includes('at risk')) {
      this.addMessage(this.generateRiskResponse(), 'assistant', ['Risk Assessments']);
    } else if (lowerQuery.includes('product') || lowerQuery.includes('watsonx') || lowerQuery.includes('ibm')) {
      this.addMessage(this.generateProductResponse(), 'assistant', ['Product Intelligence']);
    } else if (lowerQuery.includes('pipeline') || lowerQuery.includes('quota')) {
      this.addMessage(this.generatePipelineResponse(), 'assistant', ['Pipeline Analytics']);
    } else if (lowerQuery.includes('activity') || lowerQuery.includes('calls') || lowerQuery.includes('meetings')) {
      this.addMessage(this.generateActivityResponse(), 'assistant', ['Activity Intelligence']);
    } else {
      // Default helpful response
      this.addMessage(`I can help you with:

• **Team Performance**: Ask about quota attainment, pipeline health, or at-risk reps
• **Individual Coaching**: Get detailed coaching plans for any rep
• **Product Intelligence**: Find accounts to target for specific IBM products
• **Risk Analysis**: Understand your team's biggest risks and how to address them
• **Activity Insights**: Analyze call patterns, meeting effectiveness, and more

Try asking: "Why is Jordan behind quota?" or "Which accounts should I target for watsonx.ai?"`, 'assistant');
    }
  },
  
  generateRiskResponse() {
    const atRiskReps = this.knowledge.reps.filter(r => r.risk >= 50);
    return `Your team currently has **${atRiskReps.length} reps at risk**:

${atRiskReps.map(r => `• **${r.name}**: ${r.risk}% risk score - ${r.exposedArea} exposure`).join('\n')}

The primary team-wide risk is **opportunity creation down 14%** month-over-month. This threatens future pipeline.

Would you like a detailed coaching plan for any specific rep?`;
  },
  
  generateProductResponse() {
    return `**IBM Product Performance Summary:**

**Top Performers:**
• **watsonx.ai**: 58% win rate (highest!) but only 12% call mentions
• **Db2 Warehouse**: $320K pipeline, 47% win rate
• **Instana**: Trending up 15%, strong with Elena & Noah

**Opportunities:**
• **watsonx.ai training needed** for Jordan, Maya, and Noah
• Cross-sell Db2 customers to watsonx.data (high propensity)
• Leverage Priya's AI expertise across team

Which product would you like to focus on?`;
  },
  
  generatePipelineResponse() {
    const totalPipeline = this.knowledge.reps.reduce((sum, r) => sum + r.pipeline, 0);
    const totalGoal = this.knowledge.reps.reduce((sum, r) => sum + r.goal, 0);
    const pacing = ((totalPipeline / totalGoal) * 100).toFixed(0);
    
    return `**Team Pipeline Status:**

• Total Pipeline: **${formatCurrency(totalPipeline)}**
• Team Quota: **${formatCurrency(totalGoal)}**
• Pacing: **${pacing}% of quota**
• Coverage: **3.2×** (target: 3.5×)

**Key Issues:**
• 3 reps below quota (Jordan, Noah, Sam)
• Combined gap: **$278K**
• Opportunity creation down 14%

**Recommended Focus:**
1. Increase opportunity creation (team-wide)
2. Coach Jordan on territory coverage
3. Accelerate Noah's activity levels

Need a detailed plan for any of these?`;
  },
  
  generateActivityResponse() {
    return `**Team Activity Summary:**

**Strong Performers:**
• **Elena Garcia**: 15 calls/day, 44% connect rate
• **Priya Shah**: 13.6 calls/day, 42% connect rate

**Need Coaching:**
• **Noah Williams**: Only 7.6 calls/day, 28% connect rate
• **Jordan Lee**: 9.6 calls/day, 32% connect rate

**Product Mention Alert:**
• watsonx.ai mentions down 32% (only 12% of calls)
• Only 3 reps actively discussing AI solutions

**Action Items:**
1. Pair Noah with Elena for activity coaching
2. Schedule watsonx.ai training for team
3. Implement daily activity tracking

Would you like specific coaching recommendations?`;
  }
};

// Initialize copilot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  copilot.init();
});
