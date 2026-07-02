// AI Insights Panel Toggle
function toggleAIInsights(event) {
  // Find the closest parent panel from the clicked button
  const button = event.target;
  const panel = button.closest('.ai-insights-panel');
  if (panel) {
    panel.classList.toggle('collapsed');
  }
}

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
    const roiErr = document.getElementById('roi-error');
    if (roiErr) {
      roiErr.textContent = 'Please enter data volume and current cost.';
      roiErr.style.display = 'block';
      setTimeout(() => { roiErr.style.display = 'none'; }, 4000);
    }
    return;
  }
  const roiErr = document.getElementById('roi-error');
  if (roiErr) roiErr.style.display = 'none';
  
  const result = roiCalculator.calculate(product, companySize, industry, dataVolume, growthRate, currentCost);
  
  if (result) {
    document.getElementById('roi-result-value').textContent = result.roi + '%';
    document.getElementById('roi-savings-value').textContent = '$' + (result.savings / 1000000).toFixed(1) + 'M';
    document.getElementById('roi-payback-value').textContent = result.paybackMonths + ' months';
    document.getElementById('roi-result-panel').style.display = 'block';
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
    coverage: 7.4,
    risk: 18,
    opportunities: 9,
    meetings: 24,
    accountsAssigned: 82,
    accountsTouched: 67,
    teamAvg: 7,
    conversion: 38,
    prevPipeline: 295000,
    prevOpportunities: 8,
    prevMeetings: 21,
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
    coverage: 7.7,
    risk: 38,
    opportunities: 3,
    meetings: 14,
    accountsAssigned: 76,
    accountsTouched: 58,
    teamAvg: 7,
    conversion: 21,
    prevPipeline: 310000,
    prevOpportunities: 7,
    prevMeetings: 19,
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
    coverage: 6.5,
    risk: 45,
    opportunities: 7,
    meetings: 21,
    accountsAssigned: 68,
    accountsTouched: 52,
    teamAvg: 7,
    conversion: 33,
    prevPipeline: 208000,
    prevOpportunities: 6,
    prevMeetings: 18,
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
    coverage: 5.3,
    risk: 72,
    opportunities: 4,
    meetings: 16,
    accountsAssigned: 74,
    accountsTouched: 19,
    teamAvg: 7,
    conversion: 28,
    prevPipeline: 195000,
    prevOpportunities: 5,
    prevMeetings: 18,
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
    coverage: 5.2,
    risk: 81,
    opportunities: 3,
    meetings: 11,
    accountsAssigned: 62,
    accountsTouched: 18,
    teamAvg: 7,
    conversion: 27,
    prevPipeline: 180000,
    prevOpportunities: 4,
    prevMeetings: 14,
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
    coverage: 6.3,
    risk: 57,
    opportunities: 8,
    meetings: 23,
    accountsAssigned: 70,
    accountsTouched: 54,
    teamAvg: 7,
    conversion: 35,
    prevPipeline: 188000,
    prevOpportunities: 7,
    prevMeetings: 20,
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
  { id: 'opp1', name: 'Acme - Cloud Migration', account: 'Acme Corporation', value: 45000, stage: 'Propose', owner: 'Priya Shah', closeDate: '2026-07-15', probability: 70, lastActivity: '2026-06-20', daysStalled: 4, product: 'watsonx.data' },
  { id: 'opp2', name: 'Global Industries - ERP Upgrade', account: 'Global Industries Inc', value: 120000, stage: 'Negotiate', owner: 'Maya Chen', closeDate: '2026-08-01', probability: 80, lastActivity: '2026-06-23', daysStalled: 1, product: 'Db2 Warehouse' },
  { id: 'opp3', name: 'TechStart - Security Suite', account: 'TechStart Solutions', value: 28000, stage: 'Prepare', owner: 'Sam Rivera', closeDate: '2026-07-30', probability: 40, lastActivity: '2026-05-28', daysStalled: 27, product: 'Guardium' },
  { id: 'opp4', name: 'Enterprise Systems - Data Analytics', account: 'Enterprise Systems Ltd', value: 95000, stage: 'Propose', owner: 'Jordan Lee', closeDate: '2026-08-15', probability: 60, lastActivity: '2026-06-22', daysStalled: 2, product: 'watsonx.ai' },
  { id: 'opp5', name: 'Retail Dynamics - POS System', account: 'Retail Dynamics Corp', value: 52000, stage: 'Qualify', owner: 'Noah Williams', closeDate: '2026-09-01', probability: 30, lastActivity: '2026-06-01', daysStalled: 23, product: 'Instana' },
  { id: 'opp6', name: 'Healthcare Partners - Integration Platform', account: 'Healthcare Partners', value: 78000, stage: 'Negotiate', owner: 'Elena Garcia', closeDate: '2026-07-20', probability: 75, lastActivity: '2026-06-23', daysStalled: 1, product: 'DataStage' },
  { id: 'opp7', name: 'Innovation Labs - AI Platform', account: 'Innovation Labs', value: 35000, stage: 'Engage', owner: 'Priya Shah', closeDate: '2026-08-10', probability: 50, lastActivity: '2026-06-18', daysStalled: 6, product: 'watsonx.ai' },
  { id: 'opp8', name: 'Financial Group - Compliance Software', account: 'Financial Group LLC', value: 110000, stage: 'Propose', owner: 'Maya Chen', closeDate: '2026-07-25', probability: 65, lastActivity: '2026-05-15', daysStalled: 40, product: 'Guardium' },
  { id: 'opp9', name: 'Manufacturing Plus - IoT Solution', account: 'Manufacturing Plus', value: 42000, stage: 'Negotiate', owner: 'Sam Rivera', closeDate: '2026-08-05', probability: 70, lastActivity: '2026-06-21', daysStalled: 3, product: 'Instana' },
  { id: 'opp10', name: 'Digital Commerce - E-commerce Platform', account: 'Digital Commerce Co', value: 67000, stage: 'Design', owner: 'Jordan Lee', closeDate: '2026-09-15', probability: 45, lastActivity: '2026-06-10', daysStalled: 14, product: 'watsonx.data' },
  { id: 'opp11', name: 'MedTech - Patient Management System', account: 'MedTech Innovations', value: 88000, stage: 'Qualify', owner: 'Noah Williams', closeDate: '2026-08-20', probability: 55, lastActivity: '2026-06-05', daysStalled: 19, product: 'watsonx.ai' },
  { id: 'opp12', name: 'Cloud Services - Infrastructure Upgrade', account: 'Cloud Services Inc', value: 72000, stage: 'Propose', owner: 'Elena Garcia', closeDate: '2026-07-28', probability: 68, lastActivity: '2026-06-19', daysStalled: 5, product: 'Db2 Warehouse' },
  { id: 'opp13', name: 'DataFlow Corp - Lakehouse Migration', account: 'DataFlow Corp', value: 135000, stage: 'Design', owner: 'Priya Shah', closeDate: '2026-07-18', probability: 55, lastActivity: '2026-05-20', daysStalled: 35, product: 'watsonx.data' },
  { id: 'opp14', name: 'SecureBank - Security Audit Platform', account: 'SecureBank', value: 92000, stage: 'Engage', owner: 'Jordan Lee', closeDate: '2026-08-25', probability: 35, lastActivity: '2026-06-08', daysStalled: 16, product: 'Guardium' },
  { id: 'opp15', name: 'AutoMotive Inc - Observability Suite', account: 'AutoMotive Inc', value: 58000, stage: 'Qualify', owner: 'Sam Rivera', closeDate: '2026-09-10', probability: 50, lastActivity: '2026-05-25', daysStalled: 30, product: 'Instana' }
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
  closeSearch();
  // Find the rep that owns this account and open their coaching view
  const rep = reps.find(r => r.name === account.owner);
  if (rep) {
    openCoaching(rep.id);
  } else {
    switchView('opportunities');
  }
}

function showOpportunityDetails(opp) {
  closeSearch();
  switchView('opportunities');
  // Scroll the table and briefly highlight the matching row after render
  setTimeout(() => {
    const rows = document.querySelectorAll('#opportunities .rep-row');
    rows.forEach(row => {
      if (row.textContent.includes(opp.name) || row.textContent.includes(opp.account)) {
        row.style.transition = 'background 0.3s';
        row.style.background = '#eaf7f2';
        row.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setTimeout(() => { row.style.background = ''; }, 1800);
      }
    });
  }, 120);
}

function renderSearchResults(results) {
  const searchResultsContainer = document.getElementById('search-results');
  if (!searchResultsContainer) return;

  if (results.length === 0) {
    const query = document.getElementById('search-input')?.value || '';
    if (query.length >= 2) {
      searchResultsContainer.innerHTML = `<div class="search-empty">No results for "<strong>${query}</strong>"</div>`;
    } else {
      // Populate searchResults with all reps so the delegate can call .action()
      searchResults = reps.map(r => ({
        type: 'rep', category: 'Rep',
        title: r.name,
        subtitle: `${r.role} · ${r.region}`,
        data: r,
        action: () => openCoaching(r.id)
      }));
      searchResultsContainer.innerHTML = `
        <div class="search-empty-hint">
          <div class="search-hint-label">Quick access</div>
          ${searchResults.map((r, i) => `
            <div class="search-result-item" data-index="${i}">
              <div class="search-result-icon">👤</div>
              <div class="search-result-content">
                <div class="search-result-title">${r.title}</div>
                <div class="search-result-subtitle">${r.subtitle}</div>
              </div>
              <div class="search-result-badge">Rep</div>
            </div>`).join('')}
        </div>`;
    }
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
      const query = document.getElementById('search-input')?.value || document.getElementById('topbar-search-input')?.value || '';
      html += `
        <div class="search-result-item ${globalIndex === selectedSearchIndex ? 'selected' : ''}" data-index="${globalIndex}">
          <div class="search-result-icon">${result.type === 'rep' ? '👤' : result.type === 'account' ? '🏢' : '💼'}</div>
          <div class="search-result-content">
            <div class="search-result-title">${highlightMatch(result.title, query)}</div>
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
  if (!query || query.trim().length < 2) return text;
  try {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  } catch { return text; }
}

function openSearch() {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  searchModal.classList.add('active');
  searchInput.focus();
  selectedSearchIndex = -1;
  // Mirror topbar input value into modal
  const topbar = document.getElementById('topbar-search-input');
  if (topbar && topbar.value) {
    searchInput.value = topbar.value;
    handleSearchInput({ target: searchInput });
  }
}

function closeSearch() {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  searchModal.classList.remove('active');
  searchInput.value = '';
  document.getElementById('search-results').innerHTML = '';
  searchResults = [];
  selectedSearchIndex = -1;
  // Clear topbar input too
  const topbar = document.getElementById('topbar-search-input');
  if (topbar) topbar.value = '';
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
// ── Dynamic greeting + quarter bar ───────────────
function initDynamicHeader() {
  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('overview-greeting');
  if (el) el.textContent = `${greeting}, Noelle.`;

  // Quarter progress — IBM FY2026 Q3: May 1 – Jul 31 (91 days)
  const qStart = new Date('2026-05-01');
  const qEnd   = new Date('2026-07-31');
  const today  = new Date();
  const totalDays   = Math.round((qEnd - qStart) / 86400000);
  const elapsed     = Math.max(0, Math.min(Math.round((today - qStart) / 86400000), totalDays));
  const weekNum     = Math.ceil(elapsed / 7);
  const totalWeeks  = Math.ceil(totalDays / 7);
  const pct         = Math.round((elapsed / totalDays) * 100);

  const labelEl  = document.getElementById('quarter-label');
  const fillEl   = document.getElementById('quarter-fill');
  const pctEl    = document.getElementById('quarter-pct');
  const eyebrow  = document.getElementById('overview-eyebrow');

  if (labelEl) labelEl.textContent = `Q3 · Week ${weekNum} of ${totalWeeks}`;
  if (fillEl)  fillEl.style.width  = `${pct}%`;
  if (pctEl)   pctEl.textContent   = `${pct}%`;
  if (eyebrow) eyebrow.textContent = `Q3 · WEEK ${weekNum} OF ${totalWeeks}`;

  // Notification badge — count unread
  _updateNotifBadge();
}

function _updateNotifBadge() {
  const unreadCount = mockNotifications.filter(n => n.unread).length;
  const badge = document.querySelector('.notif-count-badge');
  const dot   = document.getElementById('notif-dot');
  if (badge) badge.textContent = unreadCount;
  if (dot)   dot.style.display = unreadCount > 0 ? 'block' : 'none';
}

function init() {
  renderOverview();
  renderCoaching();
  setupEventListeners();
  initDynamicHeader();
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
    { label: 'PIPELINE COVERAGE', value: '6.5×', change: 'Target 7×', up: false },
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

function getStatusBadge(rep) {
  if (rep.risk < 40) return '<span class="status-badge on-track">On track</span>';
  if (rep.risk < 70) return '<span class="status-badge watch">Watch</span>';
  return '<span class="status-badge intervene">Intervene</span>';
}

function renderPipelineTable() {
  const tableHead = `
    <div class="table-head">
      <div>REP</div>
      <div>PIPELINE PROGRESS</div>
      <div>PIPELINE GAP</div>
      <div>COVERAGE</div>
      <div>QUOTA RISK</div>
      <div>STATUS</div>
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
          <strong class="${rep.coverage < 7 ? 'coverage low' : ''}">${rep.coverage.toFixed(1)}×</strong>
        </div>
        <div>
          <span class="risk ${getRiskClass(rep.risk)}">${rep.risk}%</span>
        </div>
        <div>${getStatusBadge(rep)}</div>
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
  
  // Update KPIs with WoW deltas
  const untouched = rep.accountsAssigned - rep.accountsTouched;
  
  function wowDelta(current, prev, isCurrency) {
    if (prev === undefined) return '';
    const diff = current - prev;
    if (diff === 0) return '<span class="wow-delta neutral">→ 0</span>';
    const sign = diff > 0 ? '+' : '';
    const label = isCurrency ? sign + formatCurrency(diff) : sign + diff;
    return `<span class="wow-delta ${diff > 0 ? 'up' : 'down'}">${diff > 0 ? '↑' : '↓'} ${label} WoW</span>`;
  }

  const repKpis = document.getElementById('rep-kpis');
  if (repKpis) {
    repKpis.innerHTML = `
    <div class="rep-kpi"><small>CURRENT PIPELINE</small><strong>${formatCurrency(rep.pipeline)}</strong>${wowDelta(rep.pipeline, rep.prevPipeline, true)}</div>
    <div class="rep-kpi"><small>GOAL</small><strong>${formatCurrency(rep.goal)}</strong></div>
    <div class="rep-kpi"><small>GAP TO QUOTA</small><strong class="${gap > 0 ? 'danger' : ''}">${formatCurrency(-gap)}</strong></div>
    <div class="rep-kpi"><small>COVERAGE</small><strong>${rep.coverage.toFixed(1)}×</strong></div>
    <div class="rep-kpi"><small>OPPORTUNITIES</small><strong>${rep.opportunities}</strong>${wowDelta(rep.opportunities, rep.prevOpportunities, false)}</div>
    <div class="rep-kpi"><small>MEETINGS</small><strong>${rep.meetings}</strong>${wowDelta(rep.meetings, rep.prevMeetings, false)}</div>
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
    return '<div class="no-questions">No specific coaching questions needed — rep is performing well!</div>';
  }

  return questions.map((section, i) => `
    <details class="cq-accordion" ${i === 0 ? 'open' : ''}>
      <summary class="cq-summary">
        <span class="cq-icon">${section.icon}</span>
        <strong class="cq-title">${section.category}</strong>
        <span class="cq-count">${section.questions.length} question${section.questions.length !== 1 ? 's' : ''}</span>
        <span class="cq-chevron">▾</span>
      </summary>
      <ol class="coaching-questions-list cq-list">
        ${section.questions.map(q => `<li>${q}</li>`).join('')}
      </ol>
    </details>
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
  
  // Brand toggle (Northstar logo)
  const brandToggle = document.getElementById('brand-toggle');
  if (brandToggle) {
    brandToggle.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }
  
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
  
  // Pipeline table rows — only fire when the row has a data-rep and modal is not open
  document.addEventListener('click', (e) => {
    if (document.getElementById('search-modal')?.classList.contains('active')) return;
    const row = e.target.closest('.rep-row[data-rep]');
    if (row && row.dataset.rep) {
      openCoaching(row.dataset.rep);
    }
  });

  // Insight rows
  document.addEventListener('click', (e) => {
    if (document.getElementById('search-modal')?.classList.contains('active')) return;
    const row = e.target.closest('.insight-row[data-rep]');
    if (row && row.dataset.rep) {
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
  
  // Topbar inline search input — focus opens modal, typing searches live
  const topbarInput = document.getElementById('topbar-search-input');
  if (topbarInput) {
    topbarInput.addEventListener('focus', () => {
      openSearch();
      // Mirror any pre-typed text into the modal input
      const modalInput = document.getElementById('search-input');
      if (modalInput && topbarInput.value) {
        modalInput.value = topbarInput.value;
        handleSearchInput({ target: modalInput });
      }
    });
    topbarInput.addEventListener('input', () => {
      const modalInput = document.getElementById('search-input');
      if (modalInput) {
        modalInput.value = topbarInput.value;
        handleSearchInput({ target: modalInput });
      }
      if (!document.getElementById('search-modal').classList.contains('active')) {
        openSearch();
      }
    });
    topbarInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        topbarInput.value = '';
        topbarInput.blur();
        closeSearch();
      }
    });
  }

  // Modal search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
  }

  // Search result clicks — delegated on the results container, not document
  const searchResultsEl = document.getElementById('search-results');
  if (searchResultsEl) {
    searchResultsEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const resultItem = e.target.closest('.search-result-item');
      if (!resultItem) return;
      const index = parseInt(resultItem.dataset.index);
      if (!isNaN(index) && searchResults[index]) {
        searchResults[index].action();
      }
    });
  }

  // Close search when clicking the backdrop
  document.addEventListener('click', (e) => {
    if (e.target.id === 'search-modal') {
      closeSearch();
    }
  });
  
  // Close search button
  const searchClose = document.getElementById('search-close');
  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }
  
  // Global keyboard shortcut for search (Cmd/Ctrl + K) — focus topbar input
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const topbar = document.getElementById('topbar-search-input');
      if (topbar) { topbar.focus(); topbar.select(); }
      else openSearch();
    }
  });
  
  // Coaching notes modal
  const addNoteBtn = document.getElementById('add-coaching-note');
  if (addNoteBtn) {
    addNoteBtn.addEventListener('click', openNotesModal);
  }
  const notesClose = document.getElementById('notes-close');
  if (notesClose) notesClose.addEventListener('click', closeNotesModal);
  const notesSave = document.getElementById('notes-save');
  if (notesSave) notesSave.addEventListener('click', saveCoachingNote);
  document.addEventListener('click', (e) => {
    if (e.target.id === 'notes-modal') closeNotesModal();
  });
  
  // Compare view — no selects needed, handled by initCompareSelects
}

function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  
  const viewConfig = {
    'overview': { id: 'overview', label: 'Manager overview' },
    'coaching': { id: 'coaching', label: 'Rep coaching' },
    'opportunities': { id: 'opportunities', label: 'Opportunities' },
    'activity': { id: 'activity', label: 'Activity intelligence' },
    'compare': { id: 'compare', label: 'Rep comparison' }
  };
  
  if (viewConfig[view]) {
    const config = viewConfig[view];
    const viewElement = document.getElementById(config.id);
    const navElement = document.querySelector(`[data-view="${view}"]`);
    
    if (viewElement) viewElement.classList.add('active');
    if (navElement) navElement.classList.add('active');
    document.getElementById('crumb-label').textContent = config.label;
    
    if (view === 'compare') renderCompareView();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCoaching(repId) {
  closeSearch();
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
  initOpportunityFilters();
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

// Full quarter of daily pipeline data (13 weeks × 5 days = 65 data points)
const pipelineTrendData = (() => {
  // Seed a smooth upward curve with realistic week-over-week noise
  const base = [
    880000, 892000, 905000, 918000, 930000, // Wk 1
    942000, 958000, 971000, 985000, 998000, // Wk 2
    1008000,1020000,1034000,1048000,1060000,// Wk 3
    1072000,1082000,1094000,1106000,1118000,// Wk 4
    1128000,1140000,1152000,1164000,1175000,// Wk 5
    1185000,1196000,1208000,1218000,1228000,// Wk 6
    1238000,1248000,1258000,1268000,1278000,// Wk 7
    1288000,1298000,1310000,1322000,1334000,// Wk 8 ← current
    1342000,1350000,1360000,1370000,1378000,// Wk 9  (projected)
    1386000,1394000,1402000,1410000,1418000,// Wk 10
    1426000,1434000,1442000,1450000,1458000,// Wk 11
    1466000,1474000,1482000,1490000,1498000,// Wk 12
    1506000,1514000,1522000,1530000,1540000 // Wk 13
  ];
  const labels = [];
  for (let w = 1; w <= 13; w++) {
    ['Mon','Tue','Wed','Thu','Fri'].forEach(d => labels.push(`W${w} ${d}`));
  }
  return { labels, values: base };
})();

let pipelineTrendChart = null;

function renderPipelineTrendChart(range = '8W') {
  try {
    const canvas = document.getElementById('pipeline-trend-chart');
    if (!canvas) return;

    const rangeConfig = {
      '2W': { points: 10, label: '2-week pipeline trend',   step: 'day'  },
      '4W': { points: 20, label: '4-week pipeline trend',   step: 'day'  },
      '8W': { points: 40, label: '8-week pipeline growth',  step: 'day'  },
      'Q':  { points: 65, label: 'Full quarter (13 weeks)', step: 'week' },
    };
    const cfg = rangeConfig[range] || rangeConfig['8W'];

    // For Full Q, downsample to weekly (last day of each week)
    let labels, values;
    if (range === 'Q') {
      labels = []; values = [];
      for (let w = 1; w <= 13; w++) {
        labels.push(`Week ${w}`);
        values.push(pipelineTrendData.values[(w * 5) - 1]);
      }
    } else {
      const slice = pipelineTrendData.values.slice(0, cfg.points);
      const labelSlice = pipelineTrendData.labels.slice(0, cfg.points);
      labels = labelSlice;
      values = slice;
    }

    // Week 8 = index 39 in daily data (0-based), index 7 in weekly Q view
    const cutoff = range === 'Q' ? 8 : Math.min(40, values.length);

    const actualData    = values.map((v, i) => i < cutoff ? v : null);
    const projectedData = values.map((v, i) => i >= cutoff - 1 ? v : null);

    // Update subtitle
    const subtitle = document.getElementById('pipeline-trend-subtitle');
    if (subtitle) subtitle.textContent = cfg.label;

    // Destroy previous chart instance before re-rendering
    if (pipelineTrendChart) { pipelineTrendChart.destroy(); pipelineTrendChart = null; }

    const ctx = canvas.getContext('2d');
    pipelineTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Pipeline (actual)',
            data: actualData,
            borderColor: chartColors.teal,
            backgroundColor: 'rgba(8, 127, 117, 0.08)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: (context) => context.dataIndex % 5 === 4 || range !== 'Q' ? 3 : 0,
            pointHoverRadius: 6,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: chartColors.teal,
            pointBorderWidth: 2,
            spanGaps: true
          },
          {
            label: 'Projected',
            data: projectedData,
            borderColor: chartColors.teal,
            backgroundColor: 'transparent',
            borderDash: [5, 4],
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            spanGaps: true
          }
        ]
      },
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 14,
              font: { size: 10 },
              color: chartColors.text,
              usePointStyle: true,
              pointStyle: 'line'
            }
          },
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              label: function(context) {
                const val = context.parsed.y;
                if (val === null) return null;
                return (context.dataset.label === 'Projected' ? 'Projected: ' : 'Pipeline: ') + formatCurrency(val);
              },
              afterBody: function(items) {
                const idx = items[0]?.dataIndex;
                if (idx > 0) {
                  const prev = values[idx - 1];
                  const curr = values[idx];
                  if (prev && curr) {
                    const delta = curr - prev;
                    const pct = ((delta / prev) * 100).toFixed(1);
                    return [`Δ ${delta >= 0 ? '+' : ''}${formatCurrency(delta)} (${pct}%)`];
                  }
                }
                return [];
              }
            }
          }
        }
      }
    });

    // Wire up toggle buttons
    const toggle = document.getElementById('trend-range-toggle');
    if (toggle && !toggle._wired) {
      toggle._wired = true;
      toggle.addEventListener('click', e => {
        const btn = e.target.closest('button[data-range]');
        if (!btn) return;
        toggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPipelineTrendChart(btn.dataset.range);
      });
    }
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
      labels: ['Prepare', 'Engage', 'Qualify', 'Design', 'Propose', 'Negotiate', 'Closing'],
      datasets: [{
        data: [7, 8, 9, 7, 11, 8, 3],
        backgroundColor: [
          chartColors.primary,
          chartColors.teal,
          chartColors.purple,
          chartColors.warning,
          chartColors.success,
          '#e67e22',
          '#8e44ad'
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
    
    // Initialize compare view selects
    initCompareSelects();
  } catch (error) {
    console.error('Error initializing enhancements:', error);
  }
}

// ============================================
// OPPORTUNITY FILTERING
// ============================================

function renderProductMix() {
  const container = document.getElementById('product-mix-container');
  if (!container) return;

  // Product win rates and colours (static enrichment data)
  const productMeta = {
    'watsonx.ai':   { winRate: 58, color: '#0f62fe' },
    'watsonx.data': { winRate: 51, color: '#087f75' },
    'Db2 Warehouse':{ winRate: 44, color: '#8a3ffc' },
    'Instana':      { winRate: 47, color: '#f1c21b' },
    'Guardium':     { winRate: 39, color: '#d8653b' },
    'DataStage':    { winRate: 53, color: '#24a148' },
    'Turbonomic':   { winRate: 42, color: '#a66e00' },
  };

  // Aggregate from live opportunities array
  const byProduct = {};
  opportunities.forEach(opp => {
    if (!byProduct[opp.product]) byProduct[opp.product] = { total: 0, count: 0, reps: {} };
    byProduct[opp.product].total += opp.value;
    byProduct[opp.product].count += 1;
    byProduct[opp.product].reps[opp.owner] = (byProduct[opp.product].reps[opp.owner] || 0) + 1;
  });

  const maxTotal = Math.max(...Object.values(byProduct).map(d => d.total));
  const rows = Object.entries(byProduct).sort((a, b) => b[1].total - a[1].total);

  container.innerHTML = rows.map(([product, data]) => {
    const meta = productMeta[product] || { winRate: 45, color: '#697077' };
    const avgDeal = data.total / data.count;
    const topRep = Object.entries(data.reps).sort((a, b) => b[1] - a[1])[0][0];
    const barPct = Math.round((data.total / maxTotal) * 100);
    const winColor = meta.winRate >= 50 ? '#24a148' : meta.winRate >= 43 ? '#a66e00' : '#da1e28';

    return `
      <div class="product-mix-row" data-product="${product}">
        <div class="pmr-top">
          <div class="pmr-name-wrap">
            <span class="pmr-dot" style="background:${meta.color}"></span>
            <strong class="pmr-name">${product}</strong>
          </div>
          <div class="pmr-summary">
            <span class="pmr-total">${formatCurrency(data.total)}</span>
            <span class="pmr-count">${data.count} opp${data.count !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="pmr-bar-wrap">
          <div class="pmr-bar-track">
            <div class="pmr-bar-fill" style="width:${barPct}%;background:${meta.color}"></div>
          </div>
        </div>
        <div class="pmr-detail">
          <div class="pmr-stat">
            <span class="pmr-stat-label">Avg deal</span>
            <strong class="pmr-stat-val">${formatCurrency(avgDeal)}</strong>
          </div>
          <div class="pmr-stat">
            <span class="pmr-stat-label">Win rate</span>
            <strong class="pmr-stat-val" style="color:${winColor}">${meta.winRate}%</strong>
          </div>
          <div class="pmr-stat">
            <span class="pmr-stat-label">Top rep</span>
            <strong class="pmr-stat-val">${topRep.split(' ')[0]}</strong>
          </div>
          <div class="pmr-stat">
            <span class="pmr-stat-label">Pipeline share</span>
            <strong class="pmr-stat-val">${barPct}%</strong>
          </div>
        </div>
      </div>`;
  }).join('');
}

function initOpportunityFilters() {
  const opportunitiesSection = document.getElementById('opportunities');
  if (!opportunitiesSection) return;

  renderProductMix();
  
  const segmentedButtons = opportunitiesSection.querySelectorAll('.segmented button');
  const opportunityTable = opportunitiesSection.querySelector('.panel');
  
  if (!segmentedButtons.length || !opportunityTable) return;
  
  segmentedButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active state
      segmentedButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter opportunities based on button text
      const filterType = this.textContent.trim();
      filterOpportunities(filterType, opportunityTable);
    });
  });
}

function filterOpportunities(filterType, tableContainer) {
  let filteredOpps = [];
  
  if (filterType === 'All opportunities') {
    filteredOpps = opportunities;
  } else if (filterType === 'Stalled') {
    // Stalled = no activity in 21+ days
    filteredOpps = opportunities.filter(opp => opp.daysStalled >= 21);
  } else if (filterType === 'Closing this month') {
    // Opportunities closing in July 2026
    filteredOpps = opportunities.filter(opp => {
      const closeDate = new Date(opp.closeDate);
      return closeDate.getMonth() === 6 && closeDate.getFullYear() === 2026; // July = month 6
    });
  }
  
  renderOpportunityTable(filteredOpps, tableContainer);
}

function renderOpportunityTable(opps, tableContainer) {
  // Find the existing rows container or create structure
  const existingRows = tableContainer.querySelectorAll('.rep-row');
  existingRows.forEach(row => row.remove());
  
  if (opps.length === 0) {
    const noDataRow = document.createElement('div');
    noDataRow.className = 'rep-row';
    noDataRow.style.padding = '40px';
    noDataRow.style.textAlign = 'center';
    noDataRow.style.color = '#68767d';
    noDataRow.innerHTML = '<p>No opportunities match this filter.</p>';
    tableContainer.appendChild(noDataRow);
    return;
  }
  
  opps.forEach(opp => {
    const row = document.createElement('div');
    row.className = 'rep-row';
    
    // Determine avatar color based on stage
    const avatarColors = {
      'Prepare': '',
      'Engage': 'peach',
      'Qualify': 'peach',
      'Design': 'blue',
      'Propose': 'blue',
      'Negotiate': 'purple',
      'Closing': 'blue'
    };
    
    const avatarClass = avatarColors[opp.stage] || '';
    const initials = opp.account.split(' ').map(w => w[0]).join('').substring(0, 2);
    
    // Add stalled indicator if applicable
    const stalledBadge = opp.daysStalled >= 21 ? 
      `<span style="background: #d8653b; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 8px;">STALLED ${opp.daysStalled}d</span>` : '';
    
    row.innerHTML = `
      <div class="rep-ident">
        <span class="avatar ${avatarClass}">${initials}</span>
        <div>
          <strong>${opp.name}</strong>${stalledBadge}
          <small>Last activity: ${opp.lastActivity}</small>
        </div>
      </div>
      <div><small>${opp.account}</small></div>
      <div><span class="badge">${opp.product}</span></div>
      <div><strong>$${(opp.value / 1000).toFixed(0)}K</strong></div>
      <div><span class="stage">${opp.stage}</span></div>
      <div><small>${opp.owner}</small></div>
      <div><small>${opp.closeDate}</small></div>
    `;
    
    tableContainer.appendChild(row);
  });
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
• Pipeline gap of **-$58K** with only **5.3× coverage** (target: 7×)

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
• **7.4× coverage**, exceeding 7× target
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
   - [ ] Get all reps to 7× coverage minimum

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
• Coverage: **6.5×** (target: 7×)

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

// ============================================
// COACHING NOTES (localStorage per rep)
// ============================================

function getNotesKey(repId) {
  return `northstar_notes_${repId}`;
}

function loadNotes(repId) {
  try {
    return JSON.parse(localStorage.getItem(getNotesKey(repId))) || [];
  } catch (e) {
    return [];
  }
}

function saveNotes(repId, notes) {
  localStorage.setItem(getNotesKey(repId), JSON.stringify(notes));
}

function openNotesModal() {
  const rep = currentRep;
  const modal = document.getElementById('notes-modal');
  const title = document.getElementById('notes-modal-title');
  if (title) title.textContent = `Notes for ${rep.name}`;
  renderNotesList(rep.id);
  if (modal) modal.classList.add('active');
}

function closeNotesModal() {
  const modal = document.getElementById('notes-modal');
  if (modal) modal.classList.remove('active');
  const input = document.getElementById('notes-input');
  if (input) input.value = '';
}

function renderNotesList(repId) {
  const notes = loadNotes(repId);
  const list = document.getElementById('notes-list');
  if (!list) return;
  if (notes.length === 0) {
    list.innerHTML = '<p class="notes-empty">No notes yet. Add the first note below.</p>';
    return;
  }
  list.innerHTML = notes.map((note, i) => `
    <div class="note-item">
      <div class="note-meta">
        <span class="note-date">${new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <button class="note-delete" data-index="${i}" aria-label="Delete note">✕</button>
      </div>
      <p class="note-text">${note.text}</p>
    </div>
  `).join('');
  
  list.querySelectorAll('.note-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const updated = loadNotes(repId);
      updated.splice(idx, 1);
      saveNotes(repId, updated);
      renderNotesList(repId);
    });
  });
}

function saveCoachingNote() {
  const input = document.getElementById('notes-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  const notes = loadNotes(currentRep.id);
  notes.unshift({ date: new Date().toISOString(), text });
  saveNotes(currentRep.id, notes);
  input.value = '';
  renderNotesList(currentRep.id);
}

// ============================================
// REP COMPARISON VIEW
// ============================================

function initCompareSelects() {
  // No dropdowns anymore — render all reps immediately
  renderCompareView('all');

  // Metric group filter toggle
  const toggle = document.getElementById('compare-metric-toggle');
  if (toggle) {
    toggle.addEventListener('click', e => {
      const btn = e.target.closest('button[data-group]');
      if (!btn) return;
      toggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCompareView(btn.dataset.group);
    });
  }

}

function renderCompareView(group = 'all') {
  const grid = document.getElementById('compare-grid');
  if (!grid) return;

  const allMetrics = [
    { label: 'Pipeline',          group: 'pipeline', raw: r => r.pipeline,                             display: r => formatCurrency(r.pipeline) },
    { label: 'Quota',             group: 'pipeline', raw: r => r.goal,                                 display: r => formatCurrency(r.goal) },
    { label: 'Pipeline vs Quota', group: 'pipeline', raw: r => Math.round((r.pipeline/r.goal)*100),    display: r => Math.round((r.pipeline/r.goal)*100) + '%' },
    { label: 'Pipeline Gap',      group: 'pipeline', raw: r => r.pipeline - r.goal,                    display: r => { const g = r.pipeline-r.goal; return `<span style="color:${g>=0?'#19806c':'#bd4d2d'}">${formatCurrency(g)}</span>`; }, noBar: true },
    { label: 'Coverage',          group: 'coverage', raw: r => r.coverage,                             display: r => r.coverage.toFixed(1) + '×' },
    { label: 'Quota Risk',        group: 'coverage', raw: r => r.risk,     lowerIsBetter: true,        display: r => r.risk + '%' },
    { label: 'Territory Coverage',group: 'coverage', raw: r => Math.round((r.accountsTouched/r.accountsAssigned)*100), display: r => Math.round((r.accountsTouched/r.accountsAssigned)*100) + '%' },
    { label: 'Accounts Touched',  group: 'coverage', raw: r => r.accountsTouched,                      display: r => `${r.accountsTouched} / ${r.accountsAssigned}` },
    { label: 'Opportunities',     group: 'activity', raw: r => r.opportunities,                        display: r => r.opportunities },
    { label: 'Meetings',          group: 'activity', raw: r => r.meetings,                             display: r => r.meetings },
    { label: 'Conversion %',      group: 'activity', raw: r => r.conversion,                           display: r => r.conversion + '%' },
    { label: 'Status',            group: 'all',      raw: r => 100 - r.risk, noBar: true,              display: r => {
      if (r.risk < 40) return '<span class="status-badge on-track">On track</span>';
      if (r.risk < 70) return '<span class="status-badge watch">Watch</span>';
      return '<span class="status-badge intervene">Intervene</span>';
    }}
  ];

  const metrics = group === 'all' ? allMetrics : allMetrics.filter(m => m.group === group || m.group === 'all');
  const cols = reps.length + 1; // label col + one per rep
  const gridCols = `160px repeat(${reps.length}, 1fr)`;

  // Build a single flat CSS grid — all cells are direct children of one container
  let html = `<div class="compare-table" style="--compare-cols:${cols};grid-template-columns:${gridCols}">`;

  // Header cells
  html += `<div class="cc cc-label cc-head"></div>`;
  reps.forEach((rep, i) => {
    html += `<div class="cc cc-rep cc-head">
      <span class="avatar ${getAvatarClass(i)}" style="margin-bottom:4px">${rep.initials}</span>
      <strong>${rep.name}</strong>
      <small>${rep.role} · ${rep.region}</small>
      <button class="button primary compare-coach-btn" onclick="openCoaching('${rep.id}')" style="margin-top:6px;font-size:11px;padding:4px 10px;width:100%">Coach</button>
    </div>`;
  });

  // Metric rows
  metrics.forEach((metric, rowIdx) => {
    const rawVals = reps.map(r => metric.raw(r));
    const bestRaw = metric.lowerIsBetter ? Math.min(...rawVals) : Math.max(...rawVals);
    const maxRaw  = Math.max(...rawVals.map(Math.abs)) || 1;
    const alt     = rowIdx % 2 === 1 ? ' cc-alt' : '';

    // label cell
    html += `<div class="cc cc-label${alt}"><span>${metric.label}</span></div>`;

    // value cells
    reps.forEach((rep, i) => {
      const raw    = rawVals[i];
      const isBest = raw === bestRaw;
      const barPct = metric.noBar ? 0 : Math.round((Math.abs(raw) / maxRaw) * 100);
      const barColor = metric.lowerIsBetter
        ? (raw === bestRaw ? '#24a148' : raw === Math.max(...rawVals) ? '#da1e28' : '#f1c21b')
        : (raw === bestRaw ? '#24a148' : raw === Math.min(...rawVals) ? '#da1e28' : '#f1c21b');

      html += `<div class="cc${alt}${isBest ? ' cc-best' : ''}">
        <span class="cc-val">${metric.display(rep)}</span>
        ${!metric.noBar ? `<div class="compare-bar-track"><div class="compare-bar-fill" style="width:${barPct}%;background:${barColor}"></div></div>` : ''}
      </div>`;
    });
  });

  html += `</div>`;
  grid.innerHTML = html;
}

// ============================================
// MOCK DATA — IBM button interactions
// ============================================

const mockNotifications = [
  {
    id: 1, unread: true, type: 'risk',
    title: 'Noah Williams — urgent intervention needed',
    body: 'Risk score reached 81%. Pipeline coverage at 2.3× with only 18 accounts touched. Immediate coaching recommended.',
    time: '12 min ago'
  },
  {
    id: 2, unread: true, type: 'deal',
    title: 'DataFlow Corp deal stalled 35 days',
    body: '$135K watsonx.data opportunity has had no activity since May 20. Assigned to Priya Shah — follow-up overdue.',
    time: '1 hr ago'
  },
  {
    id: 3, unread: true, type: 'ai',
    title: 'watsonx.ai — team enablement gap detected',
    body: 'Only 3 of 6 reps mentioned watsonx.ai in calls this week despite 58% win rate. Consider scheduling product training.',
    time: '3 hr ago'
  },
  {
    id: 4, unread: false, type: 'success',
    title: 'Elena Garcia closed Healthcare Partners',
    body: '$78K DataStage deal marked Closed-Won. Elena\'s Q3 attainment now at 107%. Great result!',
    time: 'Yesterday'
  },
  {
    id: 5, unread: false, type: 'deal',
    title: 'Q3 forecast updated in Salesforce',
    body: 'Team commit adjusted to $1.22M based on latest opportunity stage changes. Best case remains $1.48M.',
    time: 'Yesterday'
  }
];

const mockActivityWeeks = [
  { week: 'Week 5', calls: 298, connects: 112, meetings: 104, emails: 1089, replies: 251, demos: 26 },
  { week: 'Week 6', calls: 315, connects: 124, meetings: 118, emails: 1142, replies: 268, demos: 29 },
  { week: 'Week 7', calls: 332, connects: 131, meetings: 124, emails: 1198, replies: 281, demos: 32 },
  { week: 'Week 8', calls: 342, connects: 130, meetings: 128, emails: 1247, replies: 299, demos: 34 }
];

const mockTrainingModules = [
  {
    product: 'watsonx.ai',
    level: 'URGENT',
    levelClass: 'danger',
    duration: '45 min',
    type: 'Self-paced · IBM Learning',
    description: 'Core positioning, demo flow, and competitive differentiation for watsonx.ai. Covers AI governance, foundation models, and Studio IDE.',
    assignTo: ['Jordan Lee', 'Maya Chen', 'Noah Williams'],
    url: '#'
  },
  {
    product: 'watsonx.data',
    level: 'HIGH',
    levelClass: 'warning',
    duration: '30 min',
    type: 'Webinar recording',
    description: 'Lakehouse architecture, Presto/Spark integration, and cost-reduction messaging. Ideal for reps with Db2 customers.',
    assignTo: ['Sam Rivera', 'Jordan Lee'],
    url: '#'
  },
  {
    product: 'Instana',
    level: 'MEDIUM',
    levelClass: 'info',
    duration: '20 min',
    type: 'Battle card + talk track',
    description: 'Observability positioning against Datadog. Focus on full-stack coverage, no sampling, and IBM hybrid cloud advantage.',
    assignTo: ['Maya Chen', 'Noah Williams'],
    url: '#'
  },
  {
    product: 'Guardium',
    level: 'SHARE',
    levelClass: 'success',
    duration: '15 min',
    type: 'Customer story deck',
    description: 'Healthcare and financial services success stories. Jordan has strong Guardium expertise — share his pitch recordings with the team.',
    assignTo: [],
    url: '#'
  }
];

const mockSegments = ['All segments', 'Enterprise (1000+)', 'Mid-Market (100–999)', 'SMB (<100)', 'Financial Services', 'Healthcare', 'Technology', 'Manufacturing', 'Retail'];
const mockProducts  = ['All products', 'watsonx.ai', 'watsonx.data', 'Db2 Warehouse', 'Instana', 'Guardium', 'Turbonomic', 'DataStage'];

// ── Utility ──────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast toast-${type} toast-show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('toast-show'), 3200);
}

function openModal(id)  {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}
function openDrawer(id)  { closeAllDrawers(); const el = document.getElementById(id); if (el) el.classList.add('open'); }
function closeDrawer(id) { const el = document.getElementById(id); if (el) el.classList.remove('open'); }
function closeAllDrawers() {
  document.querySelectorAll('.side-drawer').forEach(d => d.classList.remove('open'));
}
function positionDropdown(panelId, anchorEl) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const rect = anchorEl.getBoundingClientRect();
  panel.style.top  = (rect.bottom + 6 + window.scrollY) + 'px';
  panel.style.left = rect.left + 'px';
  const wasOpen = panel.classList.contains('active');
  document.querySelectorAll('.dropdown-panel').forEach(p => p.classList.remove('active'));
  if (!wasOpen) panel.classList.add('active');
}

// ── Profile drawer ────────────────────────────────
function initProfileDrawer() {
  const profileBtn = document.querySelector('.profile');
  if (profileBtn) profileBtn.addEventListener('click', () => openDrawer('profile-drawer'));
  const closeBtn = document.getElementById('profile-drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', () => closeDrawer('profile-drawer'));
}

// ── Notifications ─────────────────────────────────
function renderNotifications() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  const typeIcon = { risk: '⚠', deal: '◆', ai: '✦', success: '✓' };
  const typeClass = { risk: 'notif-risk', deal: 'notif-deal', ai: 'notif-ai', success: 'notif-success' };
  list.innerHTML = mockNotifications.map(n => `
    <div class="notif-item ${n.unread ? 'notif-unread' : ''}" data-id="${n.id}">
      <span class="notif-icon ${typeClass[n.type]}">${typeIcon[n.type]}</span>
      <div class="notif-content">
        <strong>${n.title}</strong>
        <p>${n.body}</p>
        <small>${n.time}</small>
      </div>
    </div>
  `).join('');
}

function initNotifications() {
  const bell = document.getElementById('notif-btn');
  if (bell) bell.addEventListener('click', () => {
    renderNotifications();
    openDrawer('notif-panel');
  });
  const closeBtn = document.getElementById('notif-panel-close');
  if (closeBtn) closeBtn.addEventListener('click', () => closeDrawer('notif-panel'));
  const markAll = document.getElementById('mark-all-read-btn');
  if (markAll) markAll.addEventListener('click', () => {
    mockNotifications.forEach(n => n.unread = false);
    renderNotifications();
    _updateNotifBadge();
  });
}

// ── Pipeline segment filter ───────────────────────
function initSegmentFilter() {
  const btn = document.querySelector('.segmented button:not(.active)'); // "Coverage ratio"
  const allSegsBtn = document.querySelector('.pipeline-panel .filter-btn');
  
  // Coverage ratio tab
  const segmented = document.querySelector('.pipeline-panel .segmented');
  if (segmented) {
    segmented.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        segmented.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        if (b.textContent.trim() === 'Coverage ratio') {
          renderCoverageTable();
        } else {
          renderPipelineTable();
        }
      });
    });
  }

  // Segment filter dropdown
  if (allSegsBtn) {
    allSegsBtn.addEventListener('click', (e) => {
      const opts = document.getElementById('segment-options');
      if (opts) {
        opts.innerHTML = mockSegments.map((s, i) => `
          <label class="filter-option">
            <input type="radio" name="seg-filter" value="${s}" ${i === 0 ? 'checked' : ''}> ${s}
          </label>
        `).join('');
      }
      positionDropdown('segment-panel', allSegsBtn);
      e.stopPropagation();
    });
  }

  const applyBtn = document.getElementById('segment-apply-btn');
  if (applyBtn) applyBtn.addEventListener('click', () => {
    const sel = document.querySelector('input[name="seg-filter"]:checked');
    const label = sel ? sel.value : 'All segments';
    const filterBtn = document.querySelector('.pipeline-panel .filter-btn');
    if (filterBtn) filterBtn.textContent = label + '⌄';
    document.getElementById('segment-panel').classList.remove('active');
    // Actually filter — segments map to rep regions/roles
    const segmentMap = {
      'All segments': null,
      'Enterprise (1000+)': r => r.role.includes('Enterprise'),
      'Mid-Market (100–999)': r => r.role.includes('Commercial'),
      'SMB (<100)': r => false,
      'Financial Services': r => r.region === 'East',
      'Healthcare': r => r.region === 'West',
      'Technology': r => r.region === 'Central',
      'Manufacturing': r => r.region === 'South',
      'Retail': r => false,
    };
    const filterFn = segmentMap[label];
    if (!filterFn) {
      renderPipelineTable(); // All segments
    } else {
      const table = document.getElementById('pipeline-table');
      if (table) {
        const rows = table.querySelectorAll('.rep-row');
        rows.forEach(row => {
          const rep = reps.find(r => r.id === row.dataset.rep);
          row.style.display = rep && filterFn(rep) ? '' : 'none';
        });
      }
    }
    showToast(`Pipeline filtered: ${label}`);
  });
  const clearBtn = document.getElementById('segment-clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    const filterBtn = document.querySelector('.pipeline-panel .filter-btn');
    if (filterBtn) filterBtn.textContent = 'All segments⌄';
    document.getElementById('segment-panel').classList.remove('active');
    renderPipelineTable(); // restore all rows
  });
}

function renderCoverageTable() {
  const table = document.getElementById('pipeline-table');
  if (!table) return;
  const head = `<div class="table-head"><div>REP</div><div>COVERAGE RATIO</div><div>PIPELINE</div><div>QUOTA</div><div>STATUS</div></div>`;
  const rows = reps.map((rep, i) => {
    const coverageColor = rep.coverage >= 7.0 ? '#24a148' : rep.coverage >= 5.5 ? '#a66e00' : '#da1e28';
    return `
      <div class="rep-row" data-rep="${rep.id}">
        <div class="rep-ident">
          <span class="avatar ${getAvatarClass(i)}">${rep.initials}</span>
          <div><strong>${rep.name}</strong><small>${rep.role}</small></div>
        </div>
        <div>
          <strong style="font-size:22px;color:${coverageColor}">${rep.coverage.toFixed(1)}×</strong>
          <small style="display:block;color:var(--muted)">Target: 7×</small>
          <div style="background:var(--line);height:6px;border-radius:3px;margin-top:4px;width:120px">
            <div style="background:${coverageColor};width:${Math.min((rep.coverage/7)*100,100)}%;height:100%;border-radius:3px"></div>
          </div>
        </div>
        <div><strong>${formatCurrency(rep.pipeline)}</strong></div>
        <div><strong>${formatCurrency(rep.goal)}</strong></div>
        <div>${getStatusBadge(rep)}</div>
      </div>`;
  }).join('');
  table.innerHTML = head + rows;
}

// ── Product filter (Opportunities) ───────────────
function initProductFilter() {
  const filterBtn = document.getElementById('filter-products-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', (e) => {
      const opts = document.getElementById('product-filter-options');
      if (opts) {
        opts.innerHTML = mockProducts.map((p, i) => `
          <label class="filter-option">
            <input type="radio" name="prod-filter" value="${p}" ${i === 0 ? 'checked' : ''}> ${p}
          </label>
        `).join('');
      }
      positionDropdown('product-filter-panel', filterBtn);
      e.stopPropagation();
    });
  }
  const applyBtn = document.getElementById('product-filter-apply-btn');
  if (applyBtn) applyBtn.addEventListener('click', () => {
    const sel = document.querySelector('input[name="prod-filter"]:checked');
    const label = sel ? sel.value : 'All products';
    if (filterBtn) filterBtn.textContent = label + '⌄';
    document.getElementById('product-filter-panel').classList.remove('active');
    showToast(`Opportunities filtered: ${label}`);
  });
  const clearBtn = document.getElementById('product-filter-clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (filterBtn) filterBtn.textContent = 'All products⌄';
    document.getElementById('product-filter-panel').classList.remove('active');
  });
}

// ── Rep filter (Activity) ─────────────────────────
function initRepFilter() {
  const filterBtn = document.querySelector('#activity .filter-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', (e) => {
      const opts = document.getElementById('rep-filter-options');
      if (opts) {
        const repOptions = ['All reps', ...reps.map(r => r.name)];
        opts.innerHTML = repOptions.map((r, i) => `
          <label class="filter-option">
            <input type="radio" name="rep-filter" value="${r}" ${i === 0 ? 'checked' : ''}> ${r}
          </label>
        `).join('');
      }
      positionDropdown('rep-filter-panel', filterBtn);
      e.stopPropagation();
    });
  }
  const applyBtn = document.getElementById('rep-filter-apply-btn');
  if (applyBtn) applyBtn.addEventListener('click', () => {
    const sel = document.querySelector('input[name="rep-filter"]:checked');
    const label = sel ? sel.value : 'All reps';
    if (filterBtn) filterBtn.textContent = label + '⌄';
    document.getElementById('rep-filter-panel').classList.remove('active');
    // Filter activity table rows
    const body = document.getElementById('activity-table-body');
    if (body) {
      body.querySelectorAll('.rep-row').forEach(row => {
        const name = row.querySelector('strong')?.textContent || '';
        row.style.display = (label === 'All reps' || name === label) ? '' : 'none';
      });
    }
    showToast(`Activity filtered: ${label}`);
  });
  const clearBtn = document.getElementById('rep-filter-clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (filterBtn) filterBtn.textContent = 'All reps⌄';
    document.getElementById('rep-filter-panel').classList.remove('active');
    const body = document.getElementById('activity-table-body');
    if (body) body.querySelectorAll('.rep-row').forEach(row => row.style.display = '');
  });
}

// ── Activity time tabs ────────────────────────────

// Avatar class helper (matches getAvatarClass index order)
const _activityAvatarMap = { 'PS': '', 'MC': 'peach', 'SR': 'blue', 'JL': 'purple', 'NW': 'peach', 'EG': 'blue' };

function renderActivityTable(data) {
  const body = document.getElementById('activity-table-body');
  if (!body) return;

  const teamAvgCalls = data.length ? Math.round(data.reduce((s, r) => s + r.calls, 0) / data.length) : 0;

  body.innerHTML = data.map(rep => {
    const avatarClass = _activityAvatarMap[rep.rep_initials] || '';
    const connectClass = rep.connect_rate >= 40 ? 'up' : rep.connect_rate >= 30 ? '' : 'down';
    const replyClass   = rep.reply_rate   >= 25 ? 'up' : rep.reply_rate   >= 18 ? '' : 'down';
    const daysInPeriod = Math.max(1, Math.round(
      (new Date(rep.period_end) - new Date(rep.period_start)) / 86400000
    ));
    const callsPerDay = (rep.calls / daysInPeriod).toFixed(1);

    return `<div class="rep-row">
      <div class="rep-ident">
        <span class="avatar ${avatarClass}">${rep.rep_initials}</span>
        <div><strong>${rep.rep_name}</strong><small>${rep.role} · ${rep.region}</small></div>
      </div>
      <div><strong>${rep.calls}</strong><small>${callsPerDay}/day</small></div>
      <div><span class="${connectClass}">${rep.connect_rate}%</span></div>
      <div><strong>${rep.meetings}</strong></div>
      <div><strong>${rep.emails}</strong></div>
      <div><span class="${replyClass}">${rep.reply_rate}%</span></div>
      <div><strong>${rep.meetings}</strong></div>
    </div>`;
  }).join('');
}

// Mock activity data keyed to each rep — "This week" baseline
const _activityBaseline = [
  { rep_name: 'Priya Shah',   rep_initials: 'PS', role: 'Enterprise AE',  region: 'East',    calls: 68,  meetings: 24, emails: 245, connect_rate: 42, reply_rate: 28 },
  { rep_name: 'Maya Chen',    rep_initials: 'MC', role: 'Enterprise AE',  region: 'West',    calls: 52,  meetings: 14, emails: 198, connect_rate: 38, reply_rate: 18 },
  { rep_name: 'Sam Rivera',   rep_initials: 'SR', role: 'Commercial AE',  region: 'South',   calls: 61,  meetings: 21, emails: 223, connect_rate: 41, reply_rate: 26 },
  { rep_name: 'Jordan Lee',   rep_initials: 'JL', role: 'Enterprise AE',  region: 'Central', calls: 48,  meetings: 16, emails: 187, connect_rate: 32, reply_rate: 21 },
  { rep_name: 'Noah Williams',rep_initials: 'NW', role: 'Commercial AE',  region: 'East',    calls: 38,  meetings: 11, emails: 142, connect_rate: 28, reply_rate: 19 },
  { rep_name: 'Elena Garcia', rep_initials: 'EG', role: 'Commercial AE',  region: 'West',    calls: 75,  meetings: 23, emails: 252, connect_rate: 44, reply_rate: 29 },
];

// Scale factor and slight rate drift per period
const _periodScale = {
  week:    { factor: 1,    connectDrift:  0, replyDrift:  0 },
  '30d':   { factor: 4.3,  connectDrift: -1, replyDrift: -1 },
  quarter: { factor: 13,   connectDrift: -2, replyDrift: -2 },
};

function _mockActivityData(period) {
  const { factor, connectDrift, replyDrift } = _periodScale[period] || _periodScale.week;
  const today = new Date().toISOString().split('T')[0];
  const daysBack = period === '30d' ? 30 : period === 'quarter' ? 91 : 7;
  const startDate = new Date(Date.now() - daysBack * 86400000).toISOString().split('T')[0];

  return _activityBaseline.map(r => ({
    ...r,
    calls:        Math.round(r.calls    * factor),
    meetings:     Math.round(r.meetings * factor),
    emails:       Math.round(r.emails   * factor),
    connect_rate: Math.max(0, r.connect_rate + connectDrift),
    reply_rate:   Math.max(0, r.reply_rate   + replyDrift),
    period_start: startDate,
    period_end:   today,
  }));
}

async function loadActivityMetrics(period) {
  const body = document.getElementById('activity-table-body');
  if (!body) return;

  let usedLive = false;
  try {
    const res = await fetch(
      `${BACKEND_API}/api/v1/activities/metrics?period=${period}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.length) {
      renderActivityTable(data);
      usedLive = true;
    }
  } catch { /* backend unreachable */ }

  if (!usedLive) {
    renderActivityTable(_mockActivityData(period));
  }

  const label = period === 'week' ? 'This week' : period === '30d' ? 'Last 30 days' : 'This quarter';
  showToast(`Activity: ${label}`);
}

function initActivityTabs() {
  const toggle = document.getElementById('activity-period-toggle');
  if (!toggle) return;
  const tabs = toggle.querySelectorAll('button[data-period]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadActivityMetrics(tab.dataset.period);
    });
  });
}

// ── 1:1 Session modal ─────────────────────────────
function initSessionModal() {
  const btn = document.getElementById('start-1on1-btn');
  if (btn) btn.addEventListener('click', () => {
    const title = document.getElementById('session-modal-title');
    if (title) title.textContent = `Session with ${currentRep.name}`;
    // Default to tomorrow 10am
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const dtInput = document.getElementById('session-datetime');
    if (dtInput) dtInput.value = tomorrow.toISOString().slice(0, 16);
    // Build dynamic agenda from rep performance
    const agendaList = document.getElementById('session-agenda-list');
    if (agendaList) {
      const gap = currentRep.goal - currentRep.pipeline;
      const items = [
        `Pipeline review — current at ${formatCurrency(currentRep.pipeline)} vs ${formatCurrency(currentRep.goal)} goal`,
        gap > 0 ? `Gap closure strategy — ${formatCurrency(gap)} shortfall this quarter` : 'Pipeline above goal — discuss Q4 planning',
        `Opportunity creation — ${currentRep.opportunities} created vs ${currentRep.teamAvg} team average`,
        `Account coverage — ${currentRep.accountsTouched} of ${currentRep.accountsAssigned} accounts touched`,
        'Blockers, support needed, and commitments for next week'
      ];
      agendaList.innerHTML = items.map(item => `<li>${item}</li>`).join('');
    }
    openModal('session-modal');
  });
  document.getElementById('session-modal-close').addEventListener('click', () => closeModal('session-modal'));
  document.getElementById('session-modal-cancel').addEventListener('click', () => closeModal('session-modal'));
  document.getElementById('session-modal-confirm').addEventListener('click', () => {
    const dt = document.getElementById('session-datetime').value;
    const fmt = document.getElementById('session-format').value;
    if (!dt) { showToast('Please select a date and time', 'error'); return; }
    const date = new Date(dt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    closeModal('session-modal');
    showToast(`1:1 with ${currentRep.name} scheduled for ${date} via ${fmt}`);
  });
  // Close on backdrop
  document.getElementById('session-modal').addEventListener('click', (e) => {
    if (e.target.id === 'session-modal') closeModal('session-modal');
  });
}

// ── Save recovery plan ────────────────────────────
function initRecoveryPlan() {
  const btn = document.getElementById('save-recovery-btn');
  if (btn) btn.addEventListener('click', () => {
    const checks = document.querySelectorAll('#action-plan input[type="checkbox"]');
    const completed = Array.from(checks).filter(c => c.checked).length;
    const total = checks.length;
    const key = `northstar_recovery_${currentRep.id}`;
    const state = Array.from(checks).map(c => c.checked);
    localStorage.setItem(key, JSON.stringify(state));
    showToast(`Recovery plan saved (${completed}/${total} actions committed)`, completed > 0 ? 'success' : 'info');
  });
  // Restore saved checkboxes when rep changes
  function restoreRecoveryPlan(repId) {
    const key = `northstar_recovery_${repId}`;
    try {
      const state = JSON.parse(localStorage.getItem(key));
      if (!Array.isArray(state)) return;
      const checks = document.querySelectorAll('#action-plan input[type="checkbox"]');
      checks.forEach((c, i) => {
        c.checked = !!state[i];
        c.closest('label').classList.toggle('completed', !!state[i]);
      });
    } catch(e) {}
  }
  // Patch selectRep to also restore plan
  const _origSelectRep = window.selectRep || selectRep;
  window._restoreRecoveryOnSwitch = restoreRecoveryPlan;
}

// ── Export buttons → print ────────────────────────
// ── Export & Sharing Functions ────────────────────
function initExportButtons() {
  ['export-brief-btn', 'export-opps-btn', 'export-activity-btn', 'export-compare-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', (e) => { e.preventDefault(); openExportModal(id); });
  });
}

function openExportModal(sourceButtonId) {
  const modal = document.getElementById('export-modal');
  const title = document.getElementById('export-modal-title');
  if (!modal) return;

  const titles = {
    'export-brief-btn':    'Export Manager Brief',
    'export-opps-btn':     'Export Opportunities',
    'export-activity-btn': 'Export Activity Data',
    'export-compare-btn':  'Export Rep Comparison'
  };
  if (title) title.textContent = titles[sourceButtonId] || 'Export Data';
  modal.dataset.source = sourceButtonId;
  openModal('export-modal');
}

function exportToPDF() {
  const source = document.getElementById('export-modal').dataset.source;
  
  // Show loading toast
  showToast('Generating PDF...', 'info');
  
  // Simulate PDF generation
  setTimeout(() => {
    const filename = `northstar-${source.replace('-btn', '')}-${new Date().toISOString().split('T')[0]}.pdf`;
    showToast(`PDF exported: ${filename}`, 'success');
    closeModal('export-modal');
    
    // In production, this would trigger actual PDF generation
    // using a library like jsPDF or server-side generation
  }, 1500);
}

function exportToCSV() {
  const source = document.getElementById('export-modal').dataset.source;
  
  let csvContent = '';
  let filename = '';
  
  // Generate CSV based on source
  if (source === 'export-opps-btn') {
    csvContent = generateOpportunitiesCSV();
    filename = `opportunities-${new Date().toISOString().split('T')[0]}.csv`;
  } else if (source === 'export-activity-btn') {
    csvContent = generateActivityCSV();
    filename = `activity-${new Date().toISOString().split('T')[0]}.csv`;
  } else if (source === 'export-compare-btn') {
    csvContent = generateCompareCSV();
    filename = `rep-comparison-${new Date().toISOString().split('T')[0]}.csv`;
  } else {
    csvContent = generateBriefCSV();
    filename = `manager-brief-${new Date().toISOString().split('T')[0]}.csv`;
  }
  
  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast(`CSV exported: ${filename}`, 'success');
  closeModal('export-modal');
}

function generateCompareCSV() {
  const headers = ['Metric', ...reps.map(r => r.name)];
  const rows = [
    ['Pipeline',           ...reps.map(r => r.pipeline)],
    ['Quota',              ...reps.map(r => r.goal)],
    ['Pipeline vs Quota',  ...reps.map(r => Math.round((r.pipeline / r.goal) * 100) + '%')],
    ['Pipeline Gap',       ...reps.map(r => r.pipeline - r.goal)],
    ['Coverage',           ...reps.map(r => r.coverage.toFixed(1) + 'x')],
    ['Quota Risk',         ...reps.map(r => r.risk + '%')],
    ['Territory Coverage', ...reps.map(r => Math.round((r.accountsTouched / r.accountsAssigned) * 100) + '%')],
    ['Accounts Touched',   ...reps.map(r => `${r.accountsTouched} / ${r.accountsAssigned}`)],
    ['Opportunities',      ...reps.map(r => r.opportunities)],
    ['Meetings',           ...reps.map(r => r.meetings)],
    ['Conversion %',       ...reps.map(r => r.conversion + '%')],
    ['Status',             ...reps.map(r => r.risk < 40 ? 'On track' : r.risk < 70 ? 'Watch' : 'Intervene')],
  ];
  return [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
}

function generateOpportunitiesCSV() {
  const headers = ['Opportunity', 'Account', 'Product', 'Value', 'Stage', 'Owner', 'Close Date', 'Probability', 'Days Stalled'];
  const rows = opportunities.map(opp => [
    opp.name,
    opp.account,
    opp.product,
    opp.value,
    opp.stage,
    opp.owner,
    opp.closeDate,
    opp.probability + '%',
    opp.daysStalled
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateActivityCSV() {
  const headers = ['Rep', 'Calls', 'Meetings', 'Emails', 'Connect Rate', 'Reply Rate'];
  const rows = reps.map(rep => [
    rep.name,
    rep.calls,
    rep.meetings,
    rep.emails,
    rep.connectRate + '%',
    rep.replyRate + '%'
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateBriefCSV() {
  const headers = ['Rep', 'Quota', 'Pipeline', 'Coverage', 'Risk Score', 'Status'];
  const rows = reps.map(rep => [
    rep.name,
    rep.quota,
    rep.pipeline,
    rep.coverage.toFixed(1) + 'x',
    rep.riskScore + '%',
    rep.status
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// ── Share Coaching Plan ────────────────────────────
function initSharePlan() {
  const btn = document.getElementById('share-plan-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('share-modal');
      const title = document.getElementById('share-modal-title');
      const repName = document.getElementById('rep-name').textContent;
      
      title.textContent = `Share Coaching Plan: ${repName}`;
      openModal('share-modal');
    });
  }
  
  // Handle recipient change
  const recipientSelect = document.getElementById('share-recipient');
  if (recipientSelect) {
    recipientSelect.addEventListener('change', (e) => {
      const customGroup = document.getElementById('custom-email-group');
      customGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });
  }
  
  // Handle share confirmation
  const confirmBtn = document.getElementById('share-modal-confirm');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', shareCoachingPlan);
  }
  
  // Handle cancel
  const cancelBtn = document.getElementById('share-modal-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => closeModal('share-modal'));
  }
  
  const closeBtn = document.getElementById('share-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal('share-modal'));
  }
}

function shareCoachingPlan() {
  const recipient = document.getElementById('share-recipient').value;
  const customEmail = document.getElementById('share-email').value;
  const message = document.getElementById('share-message').value;
  const includeNotes = document.getElementById('share-include-notes').checked;
  
  if (!recipient) {
    showToast('Please select a recipient', 'error');
    return;
  }
  
  if (recipient === 'custom' && !customEmail) {
    showToast('Please enter an email address', 'error');
    return;
  }
  
  // Show loading
  showToast('Sharing coaching plan...', 'info');
  
  // Simulate sharing
  setTimeout(() => {
    const repName = document.getElementById('rep-name').textContent;
    const recipientText = recipient === 'custom' ? customEmail :
                         recipient === 'rep' ? repName :
                         recipient === 'manager' ? 'your manager' : 'the team';
    
    showToast(`Coaching plan shared with ${recipientText}`, 'success');
    closeModal('share-modal');
    
    // Reset form
    document.getElementById('share-recipient').value = '';
    document.getElementById('share-email').value = '';
    document.getElementById('share-message').value = '';
    document.getElementById('custom-email-group').style.display = 'none';
    
  }, 1000);
}

// ── Email Digest Settings ──────────────────────────
function initEmailDigest() {
  const btn = document.getElementById('email-digest-btn');
  if (btn) btn.addEventListener('click', () => { openModal('digest-modal'); loadDigestSettings(); });
  
  // Handle enable/disable toggle
  const enableCheckbox = document.getElementById('digest-enabled');
  if (enableCheckbox) {
    enableCheckbox.addEventListener('change', (e) => {
      const settings = document.getElementById('digest-settings');
      settings.style.opacity = e.target.checked ? '1' : '0.5';
      settings.style.pointerEvents = e.target.checked ? 'auto' : 'none';
    });
  }
  
  // Handle save
  const saveBtn = document.getElementById('digest-modal-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveDigestSettings);
  }
  
  // Handle cancel
  const cancelBtn = document.getElementById('digest-modal-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => closeModal('digest-modal'));
  }
  
  const closeBtn = document.getElementById('digest-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal('digest-modal'));
  }
}

function loadDigestSettings() {
  // Load saved settings from localStorage
  const saved = localStorage.getItem('emailDigestSettings');
  if (saved) {
    const settings = JSON.parse(saved);
    document.getElementById('digest-enabled').checked = settings.enabled;
    document.getElementById('digest-frequency').value = settings.frequency;
    document.getElementById('digest-time').value = settings.time;
    
    // Load options
    settings.options.forEach(opt => {
      const checkbox = document.querySelector(`.digest-option[value="${opt}"]`);
      if (checkbox) checkbox.checked = true;
    });
    
    // Update UI state
    const settingsDiv = document.getElementById('digest-settings');
    settingsDiv.style.opacity = settings.enabled ? '1' : '0.5';
    settingsDiv.style.pointerEvents = settings.enabled ? 'auto' : 'none';
  }
}

function saveDigestSettings() {
  const enabled = document.getElementById('digest-enabled').checked;
  const frequency = document.getElementById('digest-frequency').value;
  const time = document.getElementById('digest-time').value;
  
  const options = Array.from(document.querySelectorAll('.digest-option:checked'))
    .map(cb => cb.value);
  
  const settings = { enabled, frequency, time, options };
  
  // Save to localStorage
  localStorage.setItem('emailDigestSettings', JSON.stringify(settings));
  
  // Show confirmation
  const frequencyText = frequency === 'daily' ? 'daily' :
                       frequency === 'weekly' ? 'every Monday' :
                       frequency === 'biweekly' ? 'bi-weekly' : 'monthly';
  
  if (enabled) {
    showToast(`Email digest scheduled ${frequencyText} at ${time}`, 'success');
  } else {
    showToast('Email digest disabled', 'success');
  }
  
  closeModal('digest-modal');
}

// ── Export Modal Event Listeners ───────────────────
function initExportModal() {
  const pdfBtn = document.getElementById('export-pdf-btn');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', exportToPDF);
  }
  
  const csvBtn = document.getElementById('export-csv-btn');
  if (csvBtn) {
    csvBtn.addEventListener('click', exportToCSV);
  }
  
  const closeBtn = document.getElementById('export-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal('export-modal'));
  }
  
  // Close on backdrop click
  const modal = document.getElementById('export-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'export-modal') closeModal('export-modal');
    });
  }
}

// ── New opportunity modal ─────────────────────────
function initNewOppModal() {
  const openBtn = document.getElementById('new-opp-btn');
  if (openBtn) openBtn.addEventListener('click', () => {
    // Populate account select
    const acctSel = document.getElementById('opp-account');
    if (acctSel && acctSel.options.length <= 1) {
      acctSel.innerHTML = accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    }
    // Populate owner select
    const ownerSel = document.getElementById('opp-owner');
    if (ownerSel && ownerSel.options.length <= 1) {
      ownerSel.innerHTML = reps.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
    }
    // Default close date ~60 days out
    const closeInput = document.getElementById('opp-close');
    if (closeInput && !closeInput.value) {
      const d = new Date(); d.setDate(d.getDate() + 60);
      closeInput.value = d.toISOString().split('T')[0];
    }
    openModal('new-opp-modal');
  });

  const closeModal_ = () => closeModal('new-opp-modal');
  document.getElementById('new-opp-modal-close').addEventListener('click', closeModal_);
  document.getElementById('new-opp-modal-cancel').addEventListener('click', closeModal_);
  document.getElementById('new-opp-modal').addEventListener('click', (e) => {
    if (e.target.id === 'new-opp-modal') closeModal('new-opp-modal');
  });

  document.getElementById('new-opp-modal-confirm').addEventListener('click', () => {
    const name    = document.getElementById('opp-name').value.trim();
    const value   = parseFloat(document.getElementById('opp-value').value) || 0;
    const product = document.getElementById('opp-product').value;
    const stage   = document.getElementById('opp-stage').value;
    const ownerEl = document.getElementById('opp-owner');
    const owner   = ownerEl.options[ownerEl.selectedIndex]?.text || '';
    const errEl   = document.getElementById('opp-error');

    if (!name) {
      errEl.textContent = 'Opportunity name is required.';
      errEl.style.display = 'block'; return;
    }
    if (value <= 0) {
      errEl.textContent = 'Please enter a valid estimated value.';
      errEl.style.display = 'block'; return;
    }
    errEl.style.display = 'none';

    // Add to mock data array so the filter/table will pick it up
    const newOpp = {
      id: 'opp' + (opportunities.length + 1),
      name, account: document.getElementById('opp-account').options[document.getElementById('opp-account').selectedIndex]?.text || '',
      value, stage, owner, product,
      closeDate: document.getElementById('opp-close').value,
      probability: stage === 'Prepare' ? 10 : stage === 'Engage' ? 20 : stage === 'Qualify' ? 35 : stage === 'Design' ? 50 : stage === 'Propose' ? 65 : stage === 'Negotiate' ? 80 : 90,
      lastActivity: new Date().toISOString().split('T')[0],
      daysStalled: 0
    };
    opportunities.push(newOpp);
    closeModal('new-opp-modal');
    showToast(`Opportunity "${name}" created — ${product} · ${formatCurrency(value)}`);
    // Clear form
    document.getElementById('opp-name').value = '';
    document.getElementById('opp-value').value = '';
  });
}

// ── Activity trends modal ─────────────────────────
function initTrendsModal() {
  const btn = document.getElementById('view-trends-btn');
  if (btn) btn.addEventListener('click', () => {
    const body = document.getElementById('trends-modal-body');
    if (body) {
      const metrics = ['calls', 'connects', 'meetings', 'emails', 'replies', 'demos'];
      const labels  = ['Calls', 'Connects', 'Meetings', 'Emails', 'Replies', 'Demos'];
      const iconMap  = { calls: '📞', connects: '✅', meetings: '📅', emails: '✉', replies: '↩', demos: '🖥' };
      body.innerHTML = `
        <div class="trends-grid">
          ${metrics.map((m, mi) => {
            const vals = mockActivityWeeks.map(w => w[m]);
            const last = vals[vals.length - 1];
            const prev = vals[vals.length - 2];
            const delta = last - prev;
            const color = delta >= 0 ? '#24a148' : '#da1e28';
            const maxVal = Math.max(...vals);
            const bars = vals.map((v, i) => {
              const h = Math.round((v / maxVal) * 48);
              const isLast = i === vals.length - 1;
              return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px">
                <span style="font-size:10px;color:var(--muted)">${v}</span>
                <div style="width:24px;height:${h}px;background:${isLast ? '#0f62fe' : '#d0e2ff'};border-radius:3px 3px 0 0"></div>
                <span style="font-size:10px;color:var(--muted)">${mockActivityWeeks[i].week.replace('Week ','W')}</span>
              </div>`;
            }).join('');
            return `
              <div class="trend-card">
                <div class="trend-card-head">
                  <span class="trend-icon">${iconMap[m]}</span>
                  <div>
                    <small>${labels[mi].toUpperCase()}</small>
                    <strong style="font-size:22px;display:block">${last.toLocaleString()}</strong>
                  </div>
                  <span style="font-size:12px;font-weight:600;color:${color};margin-left:auto">${delta >= 0 ? '+' : ''}${delta} WoW</span>
                </div>
                <div style="display:flex;align-items:flex-end;gap:6px;padding-top:8px">${bars}</div>
              </div>`;
          }).join('')}
        </div>`;
    }
    openModal('trends-modal');
  });
  document.getElementById('trends-modal-close').addEventListener('click', () => closeModal('trends-modal'));
  document.getElementById('trends-modal').addEventListener('click', e => {
    if (e.target.id === 'trends-modal') closeModal('trends-modal');
  });
}

// ── Product training modal ────────────────────────

// Base URL for the backend API — empty string means same origin (local server).
// When running from GitHub Pages (no backend), API calls gracefully fall back
// to mock data.
const BACKEND_API = (() => {
  // If served from GitHub Pages, point at the local backend if running
  if (window.location.hostname.includes('github.io')) return '';
  return window.location.origin;
})();

function renderTrainingMockCards(body) {
  body.innerHTML = mockTrainingModules.map(m => `
    <div class="training-card">
      <div class="training-card-head">
        <div>
          <strong class="training-product">${m.product}</strong>
          <span class="status-badge ${m.levelClass === 'danger' ? 'intervene' : m.levelClass === 'warning' ? 'watch' : 'on-track'}" style="margin-left:8px">${m.level}</span>
        </div>
        <span class="training-meta">${m.duration} · ${m.type}</span>
      </div>
      <p class="training-desc">${m.description}</p>
      ${m.assignTo.length ? `<p class="training-assign">Assign to: <strong>${m.assignTo.join(', ')}</strong></p>` : ''}
      <div class="training-actions">
        <button class="button primary" onclick="window.open('https://yourlearning.ibm.com','_blank')">Open in YourLearning →</button>
        ${m.assignTo.length ? `<button class="button secondary" onclick="assignTraining('${m.url || '#'}', '${m.assignTo.join(',')}')">Assign to team</button>` : ''}
      </div>
    </div>
  `).join('');
}

function renderTrainingLiveCards(body, teamData) {
  // Group completions and pending into a clean card per rep
  const cards = teamData.map(rep => {
    const name = rep.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const recent = rep.recent_completions.map(c =>
      `<li>✓ <strong>${c.title}</strong> <span style="color:var(--muted);font-size:11px">(${c.completed_at}${c.score ? ` · ${c.score}%` : ''})</span></li>`
    ).join('');
    const pending = rep.pending.map(a =>
      `<li>
        <strong>${a.title}</strong>
        <span style="color:var(--muted);font-size:11px"> · Due ${a.due_date}</span>
        <button class="button secondary" style="margin-left:8px;font-size:11px;padding:2px 8px"
          onclick="assignCourse('${rep.email}','${a.course_id}')">Assign</button>
      </li>`
    ).join('');

    return `
      <div class="training-card">
        <div class="training-card-head">
          <strong class="training-product">${name}</strong>
          <span class="training-meta">${rep.completions} completed · ${rep.hours_learned}h · ${rep.pending_assignments} pending</span>
        </div>
        ${recent ? `<div style="margin:8px 0"><small style="color:var(--muted);text-transform:uppercase;font-size:10px;font-weight:700">Recent completions</small><ul style="margin:4px 0 0;padding-left:16px;font-size:12px">${recent}</ul></div>` : ''}
        ${pending ? `<div style="margin:8px 0"><small style="color:var(--muted);text-transform:uppercase;font-size:10px;font-weight:700">Pending assignments</small><ul style="margin:4px 0 0;padding-left:16px;font-size:12px">${pending}</ul></div>` : ''}
        <div class="training-actions">
          <button class="button primary" onclick="window.open('https://yourlearning.ibm.com','_blank')">Open YourLearning →</button>
        </div>
      </div>`;
  }).join('');
  body.innerHTML = cards;
}

async function assignCourse(email, courseId) {
  try {
    const res = await fetch(`${BACKEND_API}/api/v1/learning/rep/${encodeURIComponent(email)}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId, priority: 'HIGH' })
    });
    if (res.ok) showToast(`Course assigned to ${email}`, 'success');
    else showToast('Assignment failed — check backend logs', 'error');
  } catch {
    showToast('Could not reach backend', 'error');
  }
}

function assignTraining(url, names) {
  showToast(`Assigned training to ${names}`, 'success');
}

function initTrainingModal() {
  const btn = document.getElementById('review-training-btn');
  if (btn) btn.addEventListener('click', async () => {
    const body = document.getElementById('training-modal-body');
    if (!body) { openModal('training-modal'); return; }

    // Show loading state immediately
    body.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted)">Loading YourLearning data…</div>';
    openModal('training-modal');

    // Build email list from reps (first.last@ibm.com convention)
    const emails = reps.map(r => {
      const parts = r.name.toLowerCase().split(' ');
      return `${parts[0]}.${parts[parts.length - 1]}@ibm.com`;
    }).join(',');

    try {
      const res = await fetch(
        `${BACKEND_API}/api/v1/learning/team/summary?emails=${encodeURIComponent(emails)}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Check if backend is in mock mode — if so blend with our richer mock cards
      const statusRes = await fetch(`${BACKEND_API}/api/v1/learning/status`, { signal: AbortSignal.timeout(2000) }).catch(() => null);
      const status = statusRes ? await statusRes.json().catch(() => null) : null;

      if (status?.mode === 'live') {
        renderTrainingLiveCards(body, data.team);
      } else {
        // Backend running but in mock mode — use our richer product-focused mock cards
        renderTrainingMockCards(body);
      }
    } catch {
      // Backend not reachable (GitHub Pages, backend off) — silent fallback
      renderTrainingMockCards(body);
    }
  });
  document.getElementById('training-modal-close').addEventListener('click', () => closeModal('training-modal'));
  document.getElementById('training-modal').addEventListener('click', e => {
    if (e.target.id === 'training-modal') closeModal('training-modal');
  });
}

// ── Close dropdowns when clicking outside ─────────
function initDropdownDismiss() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-panel') && !e.target.closest('.filter-btn')) {
      document.querySelectorAll('.dropdown-panel').forEach(p => p.classList.remove('active'));
    }
    if (!e.target.closest('.side-drawer') && !e.target.closest('.profile') && !e.target.closest('.icon-btn.notification')) {
      closeAllDrawers();
    }
  });
}

// ── Restore recovery plan on rep switch ───────────
const _origSelectRep = selectRep;
function selectRep(repId) {
  _origSelectRep(repId);
  if (window._restoreRecoveryOnSwitch) {
    setTimeout(() => window._restoreRecoveryOnSwitch(repId), 50);
  }
}

// ── Master init ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initProfileDrawer();
  initNotifications();
  initSegmentFilter();
  initProductFilter();
  initRepFilter();
  initActivityTabs();
  initSessionModal();
  initRecoveryPlan();
  initExportButtons();
  initExportModal();
  initSharePlan();
  initEmailDigest();
  initNewOppModal();
  initTrendsModal();
  initTrainingModal();
  initDropdownDismiss();
});
