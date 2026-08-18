// ====================== SAMADHAAN — Demo Data ======================
const DEPARTMENTS = [
  { id:'revenue', name:'Revenue & Land Records', icon:'📋', cat:'Revenue', sla:'7 days' },
  { id:'home', name:'Home Affairs & Police', icon:'🛡️', cat:'Security', sla:'3 days' },
  { id:'finance', name:'Finance & Treasury', icon:'💰', cat:'Finance', sla:'10 days' },
  { id:'education', name:'School Education', icon:'🏫', cat:'Education', sla:'5 days' },
  { id:'higher-edu', name:'Higher Education', icon:'🎓', cat:'Education', sla:'7 days' },
  { id:'health', name:'Public Health & Family Welfare', icon:'🏥', cat:'Health', sla:'2 days' },
  { id:'medical', name:'Medical Education', icon:'⚕️', cat:'Health', sla:'5 days' },
  { id:'water', name:'Water Supply & Resources', icon:'💧', cat:'Utilities', sla:'3 days' },
  { id:'electricity', name:'Electricity & Power', icon:'⚡', cat:'Utilities', sla:'2 days' },
  { id:'roads', name:'Roads & Highways', icon:'🛣️', cat:'Infrastructure', sla:'7 days' },
  { id:'transport', name:'Transport & Motor Vehicles', icon:'🚌', cat:'Transport', sla:'5 days' },
  { id:'urban', name:'Urban Development & Municipal', icon:'🏙️', cat:'Urban', sla:'5 days' },
  { id:'rural', name:'Rural Development & Panchayat', icon:'🏘️', cat:'Rural', sla:'7 days' },
  { id:'agriculture', name:'Agriculture & Farmers Welfare', icon:'🌾', cat:'Agriculture', sla:'5 days' },
  { id:'irrigation', name:'Irrigation & Water Resources', icon:'🚰', cat:'Agriculture', sla:'7 days' },
  { id:'sanitation', name:'Sanitation & Public Health Eng', icon:'🧹', cat:'Urban', sla:'3 days' },
  { id:'drainage', name:'Drainage & Sewerage', icon:'🌊', cat:'Urban', sla:'3 days' },
  { id:'garbage', name:'Solid Waste Management', icon:'🗑️', cat:'Urban', sla:'2 days' },
  { id:'streetlight', name:'Street Lighting', icon:'💡', cat:'Utilities', sla:'2 days' },
  { id:'pollution', name:'Environment & Pollution Control', icon:'🏭', cat:'Environment', sla:'7 days' },
  { id:'forest', name:'Forest & Wildlife', icon:'🌳', cat:'Environment', sla:'10 days' },
  { id:'fire', name:'Fire & Emergency Services', icon:'🚒', cat:'Emergency', sla:'1 day' },
  { id:'civil-supplies', name:'Civil Supplies & Food', icon:'🍚', cat:'Public Dist', sla:'3 days' },
  { id:'consumer', name:'Consumer Affairs & Legal Metrology', icon:'⚖️', cat:'Consumer', sla:'5 days' },
  { id:'social-welfare', name:'Social Welfare & Empowerment', icon:'🤝', cat:'Welfare', sla:'7 days' },
  { id:'women-child', name:'Women & Child Development', icon:'👶', cat:'Welfare', sla:'3 days' },
  { id:'labour', name:'Labour & Employment', icon:'👷', cat:'Labour', sla:'5 days' },
  { id:'handloom', name:'Handloom, Textiles & Handicrafts', icon:'🧵', cat:'Industry', sla:'10 days' },
  { id:'industries', name:'Industries & MSME', icon:'🏭', cat:'Industry', sla:'10 days' },
  { id:'it', name:'Information Technology & Electronics', icon:'💻', cat:'Technology', sla:'7 days' },
  { id:'egov', name:'E-Governance & Digital Services', icon:'🖥️', cat:'Technology', sla:'3 days' },
  { id:'pension', name:'Pension & Retirement Benefits', icon:'👴', cat:'Welfare', sla:'5 days' },
  { id:'minority', name:'Minority Affairs', icon:'🕌', cat:'Welfare', sla:'7 days' },
  { id:'backward', name:'Backward Classes & Tribal Welfare', icon:'👥', cat:'Welfare', sla:'7 days' },
  { id:'disability', name:'Disability Empowerment', icon:'♿', cat:'Welfare', sla:'5 days' },
  { id:'sports', name:'Youth Affairs & Sports', icon:'⚽', cat:'Youth', sla:'7 days' },
  { id:'culture', name:'Art, Culture & Archives', icon:'🎭', cat:'Culture', sla:'10 days' },
  { id:'tourism', name:'Tourism Department', icon:'🗺️', cat:'Tourism', sla:'7 days' },
  { id:'archives', name:'Archives & Records', icon:'📚', cat:'Administration', sla:'10 days' },
  { id:'pwood', name:'Public Works Department (PWD)', icon:'🏗️', cat:'Infrastructure', sla:'7 days' },
  { id:'posts', name:'Posts & Telecommunications', icon:'📮', cat:'Communications', sla:'5 days' },
  { id:'disaster', name:'Disaster Management & Relief', icon:'⚠️', cat:'Emergency', sla:'1 day' },
  { id:'law', name:'Law, Justice & Legislative Affairs', icon:'⚖️', cat:'Administration', sla:'10 days' },
  { id:'planning', name:'Planning, Statistics & Programme', icon:'📊', cat:'Administration', sla:'10 days' },
  { id:'housing', name:'Housing & Urban Housing Board', icon:'🏠', cat:'Housing', sla:'15 days' },
  { id:'parks', name:'Parks, Gardens & Horticulture', icon:'🌴', cat:'Urban', sla:'5 days' },
  { id:'animals', name:'Animal Husbandry & Veterinary', icon:'🐄', cat:'Agriculture', sla:'5 days' },
  { id:'fisheries', name:'Fisheries Department', icon:'🐟', cat:'Agriculture', sla:'7 days' },
  { id:'cooperation', name:'Cooperation & Cooperative Societies', icon:'🤝', cat:'Finance', sla:'7 days' },
  { id:'excise', name:'Excise & Prohibition', icon:'🍾', cat:'Revenue', sla:'5 days' },
  { id:'gst', name:'Commercial Taxes & GST', icon:'🧾', cat:'Revenue', sla:'7 days' },
  { id:'registration', name:'Registration & Stamps', icon:'📑', cat:'Revenue', sla:'5 days' },
  { id:'transport-corpn', name:'State Transport Corporation', icon:'🚍', cat:'Transport', sla:'5 days' },
  { id:'police-traffic', name:'Traffic Police & Road Safety', icon:'🚦', cat:'Security', sla:'2 days' },
  { id:'food-safety', name:'Food Safety & Drug Administration', icon:'🍱', cat:'Health', sla:'3 days' },
  { id:'drugs', name:'Drugs Control', icon:'💊', cat:'Health', sla:'5 days' },
  { id:'ayush', name:'AYUSH & Traditional Medicine', icon:'🌿', cat:'Health', sla:'7 days' },
  { id:'mid-day-meal', name:'Mid-day Meal Authority', icon:'🍱', cat:'Education', sla:'3 days' },
  { id:'scholarship', name:'Scholarship & Fee Reimbursement', icon:'🎓', cat:'Education', sla:'15 days' },
  { id:'birth-death', name:'Birth & Death Registration', icon:'📜', cat:'Certificates', sla:'3 days' },
  { id:'caste-cert', name:'Caste & Income Certificate', icon:'📄', cat:'Certificates', sla:'5 days' },
  { id:'domicile', name:'Domicile / Residence Certificate', icon:'🏘️', cat:'Certificates', sla:'5 days' },
  { id:'marriage-reg', name:'Marriage Registration', icon:'💍', cat:'Certificates', sla:'3 days' },
  { id:'passport', name:'Passport Verification Cell', icon:'🛂', cat:'Certificates', sla:'7 days' },
  { id:'property-tax', name:'Property Tax & Assessment', icon:'🏛️', cat:'Revenue', sla:'10 days' },
  { id:'water-tax', name:'Water Tax & Billing', icon:'💧', cat:'Revenue', sla:'10 days' },
  { id:'building-permit', name:'Building Plan Approval', icon:'📐', cat:'Urban', sla:'15 days' },
  { id:'trade-license', name:'Trade License & Shops', icon:'🏪', cat:'Urban', sla:'7 days' },
  { id:'stray-animals', name:'Stray Animal Control', icon:'🐕', cat:'Urban', sla:'3 days' },
  { id:'public-toilets', name:'Public Toilets & Urinals', icon:'🚻', cat:'Urban', sla:'2 days' },
];

const SEED_COMPLAINTS = [
  { id:'SAM-2026-UP-000124', title:'Large pothole near Civil Lines crossing', dept:'roads', status:'In Progress', priority:'High', updated:'Today, 11:30 AM', score:94, location:'Civil Lines, Kanpur' },
  { id:'SAM-2026-UP-000118', title:'Streetlight not working for 5 days', dept:'streetlight', status:'Pending', priority:'Medium', updated:'Yesterday, 4:20 PM', score:68, location:'Shastri Nagar, Kanpur' },
  { id:'SAM-2026-UP-000099', title:'Overflowing drain near vegetable market', dept:'drainage', status:'Resolved', priority:'High', updated:'04 Aug 2026', score:88, location:'Arya Nagar, Kanpur' },
];

const OFFICERS = [
  { name:'Arjun Mehta', dept:'Roads & Highways', region:'Kanpur Central', assigned:24, resolved:15, pending:7, sla:'91%', rating:'4.2' },
  { name:'Sunita Rao', dept:'Water Supply', region:'Kanpur South', assigned:31, resolved:26, pending:3, sla:'96%', rating:'4.5' },
  { name:'Imran Khan', dept:'Sanitation', region:'Kanpur West', assigned:19, resolved:14, pending:4, sla:'88%', rating:'4.0' },
  { name:'Deepika Nair', dept:'Electricity & Power', region:'Kanpur East', assigned:22, resolved:18, pending:2, sla:'94%', rating:'4.3' },
];

const TRANSLATIONS = {
  en:{ report:'Report a Problem', track:'Track Complaint', myComp:'My Complaints', home:'Home', help:'Help', login:'Login', lang:'English' },
  hi:{ report:'शिकायत दर्ज करें', track:'शिकायत ट्रैक करें', myComp:'मेरी शिकायतें', home:'होम', help:'सहायता', login:'लॉगिन', lang:'हिन्दी' },
  bn:{ report:'অভিযোগ দাখিল করুন', track:'অভিযোগ ট্র্যাক করুন', myComp:'আমার অভিযোগ', home:'হোম', help:'সাহায্য', login:'লগইন', lang:'বাংলা' },
  mr:{ report:'तक्रार नोंदवा', track:'तक्रार ट्रॅक करा', myComp:'माझ्या तक्रारी', home:'होम', help:'मदत', login:'लॉगिन', lang:'मराठी' },
  ta:{ report:'புகார் பதிவு', track:'புகார் கண்காணிப்பு', myComp:'எனது புகார்கள்', home:'முகப்பு', help:'உதவி', login:'உள்நுழை', lang:'தமிழ்' },
  te:{ report:'ఫిర్యాదు నమోదు', track:'ఫిర్యాదు ట్రాక్', myComp:'నా ఫిర్యాదులు', home:'హోమ్', help:'సహాయం', login:'లాగిన్', lang:'తెలుగు' },
  gu:{ report:'ફરિયાદ નોંધો', track:'ફરિયાદ ટ્રેક', myComp:'મારી ફરિયાદો', home:'હોમ', help:'મદદ', login:'લોગિન', lang:'ગુજરાતી' },
  kn:{ report:'ದೂರು ನೋಂದಣಿ', track:'ದೂರು ಟ್ರ್ಯಾಕ್', myComp:'ನನ್ನ ದೂರುಗಳು', home:'ಹೋಮ್', help:'ಸಹಾಯ', login:'ಲಾಗಿನ್', lang:'ಕನ್ನಡ' },
  ml:{ report:'പരാതി രേഖപ്പെടുത്തുക', track:'പരാതി ട്രാക്ക്', myComp:'എന്റെ പരാതികൾ', home:'ഹോം', help:'സഹായം', login:'ലോഗിൻ', lang:'മലയാളം' },
  pa:{ report:'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ', track:'ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ', myComp:'ਮੇਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ', home:'ਹੋਮ', help:'ਮਦਦ', login:'ਲਾਗਇਨ', lang:'ਪੰਜਾਬੀ' },
  or:{ report:'ଅଭିଯୋଗ ଦର୍ତ୍ତାବେକ୍ଷଣ', track:'ଅଭିଯୋଗ ଟ୍ରାକ୍', myComp:'ମୋର ଅଭିଯୋଗ', home:'ହୋମ୍', help:'ସାହାଯ୍ୟ', login:'ଲଗଇନ୍', lang:'ଓଡ଼ିଆ' },
  ur:{ report:'شکایت درج کریں', track:'شکایت ٹریک', myComp:'میری شکایات', home:'ہوم', help:'مدد', login:'لاگ ان', lang:'اردو' },
};

// ====================== State ======================
const State = {
  role: 'citizen',
  complaints: [...SEED_COMPLAINTS],
  language: 'en',
  theme: 'light',
  user: null,
};

// ====================== Session / Auth ======================
const SESSION_KEY = 'samadhaan-session';
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes
const OTP_DEMO = '123456';
const OTP_TTL = 120; // seconds
const MAX_OTP_RETRIES = 5;
const DEMO_CREDENTIALS = {
  officer: { governmentId: 'GOV-UP-10245', password: 'officer123', name: 'Arjun Mehta', dept: 'Roads & Highways' },
  admin: { governmentId: 'ADMIN-GOV-001', password: 'admin123', name: 'System Administrator' },
};

let authState = {
  loginRole: 'citizen',    // which login screen is showing
  mode: 'login',           // login | register
  step: 'form',            // form | otp
  otpTimer: null,
  otpSeconds: 0,
  otpRetries: 0,
  otpLocked: false,
  pendingData: {},         // data collected before OTP
};

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (Date.now() > s.expiresAt) { localStorage.removeItem(SESSION_KEY); return null; }
    return s;
  } catch { return null; }
}

function createSession(role, user) {
  const session = { role, user, createdAt: Date.now(), expiresAt: Date.now() + SESSION_TTL };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  State.user = null;
}

function isAuthenticated() {
  const s = getSession();
  if (!s) return false;
  State.user = s.user;
  return true;
}

function getAuthedRole() {
  const s = getSession();
  return s ? s.role : null;
}

function requireAuth(role) {
  const s = getSession();
  if (!s || s.role !== role) return false;
  State.user = s.user;
  return true;
}

function startOtpTimer() {
  clearInterval(authState.otpTimer);
  authState.otpSeconds = OTP_TTL;
  authState.otpTimer = setInterval(() => {
    authState.otpSeconds--;
    const el = $('#otp-timer');
    if (el) el.textContent = `⏱ ${Math.floor(authState.otpSeconds/60)}:${String(authState.otpSeconds%60).padStart(2,'0')}`;
    if (authState.otpSeconds <= 0) {
      clearInterval(authState.otpTimer);
      const el2 = $('#otp-timer');
      if (el2) el2.textContent = 'OTP expired';
      const btn = $('#otp-verify-btn');
      if (btn) { btn.disabled = true; btn.textContent = 'OTP expired — resend'; }
    }
  }, 1000);
}

function stopOtpTimer() {
  clearInterval(authState.otpTimer);
  authState.otpTimer = null;
}

// ====================== Helpers ======================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const deptName = (id) => { const d = DEPARTMENTS.find(x=>x.id===id); return d?d.name:id; };
const deptIcon = (id) => { const d = DEPARTMENTS.find(x=>x.id===id); return d?d.icon:'📋'; };
function toast(msg){ const t=$('#toast'); t.innerHTML='✓ '+msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600); }
function openModal(id){ $('#'+id).classList.add('show'); }
function closeModal(id){ $('#'+id).classList.remove('show'); }

// ====================== Render ======================
function render(){
  // Restore session if exists
  const s = getSession();
  if (s) { State.role = s.role; State.user = s.user; }
  renderSidebar();
  if(State.role==='citizen') renderCitizen();
  else if(State.role==='officer') renderOfficer();
  else renderAdmin();
  updateRoleUI();
}

function updateRoleUI(){
  document.querySelectorAll('.app').forEach(a=>a.classList.remove('active'));
  $('#app-'+State.role).classList.add('active');
  const rs=$('#role-select');
  if(rs) rs.value=State.role;
  const rl=$('#role-label');
  const s=getSession();
  if(s && s.role===State.role){
    if(rl) rl.textContent = State.role==='citizen'?'Citizen':State.role==='officer'?'Officer':'Admin';
    const lu=$('#logged-user');
    if(lu) lu.style.display='flex';
    const ln=$('#logged-name');
    if(ln) ln.textContent = (s.user?.name||'User').split(' ')[0];
  } else {
    if(rl) rl.textContent = State.role==='citizen'?'Citizen':State.role==='officer'?'Officer':'Admin';
    const lu=$('#logged-user');
    if(lu) lu.style.display='none';
  }
}

function renderSidebar(){
  const s=$('#citizen-sidebar');
  if(!s) return;
  s.innerHTML = `
    <div class="sb-label">CITIZEN SERVICES</div>
    <button class="sb-btn ${citizenView==='home'?'active':''}" onclick="navCitizen('home')"><span class="ico">🏠</span> Home</button>
    <button class="sb-btn ${citizenView==='report'?'active':''}" onclick="navCitizen('report')"><span class="ico">➕</span> Report a Problem</button>
    <button class="sb-btn ${citizenView==='complaints'?'active':''}" onclick="navCitizen('complaints')"><span class="ico">📋</span> My Complaints <span class="sb-count">${State.complaints.length}</span></button>
    <button class="sb-btn ${citizenView==='departments'?'active':''}" onclick="navCitizen('departments')"><span class="ico">🏛️</span> Departments</button>
    <button class="sb-btn ${citizenView==='track'?'active':''}" onclick="navCitizen('track')"><span class="ico">🔍</span> Track Complaint</button>
    <div class="sb-divider"></div>
    <div class="sb-label">MORE SERVICES</div>
    <button class="sb-btn ${citizenView==='utilities'?'active':''}" onclick="navCitizen('utilities')"><span class="ico">🔧</span> Public Utilities</button>
    <button class="sb-btn ${citizenView==='notices'?'active':''}" onclick="navCitizen('notices')"><span class="ico">📢</span> Notice Board</button>
    <button class="sb-btn ${citizenView==='map'?'active':''}" onclick="navCitizen('map')"><span class="ico">🗺️</span> Live Map</button>
    <button class="sb-btn ${citizenView==='emergency'?'active':''}" onclick="navCitizen('emergency')"><span class="ico">🆘</span> Emergency & SOS</button>
    <button class="sb-btn ${citizenView==='profile'?'active':''}" onclick="navCitizen('profile')"><span class="ico">👤</span> Profile</button>
    <div class="sb-divider"></div>
    <div class="sb-label">SUPPORT</div>
    <button class="sb-btn" onclick="openModal('ai-modal')"><span class="ico">🤖</span> Samadhaan AI</button>
    <button class="sb-btn" onclick="openModal('a11y-modal')"><span class="ico">♿</span> Accessibility</button>
    <button class="sb-btn" onclick="openModal('lang-modal')"><span class="ico">🌐</span> Language</button>
  `;
}

let citizenView='home';
function navCitizen(view){ citizenView=view; renderCitizen(); closeMobileNav(); }

function renderCitizen(){
  const c=$('#citizen-content');
  if(!requireAuth('citizen')){ c.innerHTML=renderAuth('citizen'); return; }
  if(citizenView==='home') c.innerHTML=citizenHome();
  else if(citizenView==='report') c.innerHTML=citizenReport();
  else if(citizenView==='complaints') c.innerHTML=citizenComplaints();
  else if(citizenView==='departments') c.innerHTML=citizenDepartments();
  else if(citizenView==='track') c.innerHTML=citizenTrack();
  else if(citizenView==='utilities') c.innerHTML=citizenUtilities();
  else if(citizenView==='notices') c.innerHTML=citizenNotices();
  else if(citizenView==='map') c.innerHTML=citizenMap();
  else if(citizenView==='emergency') c.innerHTML=citizenEmergency();
  else if(citizenView==='profile') c.innerHTML=citizenProfile();
}

function citizenHome(){
  const active=State.complaints.filter(c=>c.status!=='Resolved').length;
  const resolved=State.complaints.filter(c=>c.status==='Resolved').length;
  return `
  <div class="hero">
    <span class="pill pill-orange">Your voice matters</span>
    <h2>Your problem.<br><em>One platform.</em><br>Faster resolution.</h2>
    <p>Report civic and government-related problems using text, voice, or photos — and track their resolution transparently.</p>
    <div class="hero-acts">
      <button class="btn btn-primary" onclick="navCitizen('report')">➕ Report a Problem</button>
      <button class="btn btn-outline" style="color:#fff;border-color:rgba(255,255,255,.3)" onclick="navCitizen('track')">🔍 Track Complaint</button>
    </div>
  </div>
  <div class="quick-grid">
    <button class="quick" onclick="navCitizen('report')"><div class="quick-ico" style="background:#fff0df;color:#db841e">➕</div><strong>Report a Problem</strong><small>Submit a new grievance</small></button>
    <button class="quick" onclick="navCitizen('track')"><div class="quick-ico" style="background:#e8f5fc;color:#0e78bd">🔍</div><strong>Track Complaint</strong><small>Check complaint status</small></button>
    <button class="quick" onclick="navCitizen('complaints')"><div class="quick-ico" style="background:#e7f6ef;color:#27896f">📋</div><strong>My Complaints</strong><small>${State.complaints.length} active</small></button>
    <button class="quick" onclick="openModal('ai-modal')"><div class="quick-ico" style="background:#f1efff;color:#7359bb">🤖</div><strong>Samadhaan AI</strong><small>Get instant help</small></button>
    <button class="quick" onclick="navCitizen('emergency')"><div class="quick-ico" style="background:#fff0ef;color:#c9534d">🆘</div><strong>Emergency / SOS</strong><small>Quick emergency access</small></button>
    <button class="quick" onclick="navCitizen('utilities')"><div class="quick-ico" style="background:#e8f5fc;color:#0e78bd">🔧</div><strong>Public Utilities</strong><small>Water, power, traffic</small></button>
    <button class="quick" onclick="navCitizen('notices')"><div class="quick-ico" style="background:#fff4e3;color:#c3791d">📢</div><strong>Government Notices</strong><small>Official announcements</small></button>
    <button class="quick" onclick="navCitizen('map')"><div class="quick-ico" style="background:#e7f6ef;color:#27896f">🗺️</div><strong>Live Map</strong><small>Safety & risk zones</small></button>
  </div>
  <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:16px" class="cols-2">
    <div class="panel">
      <div class="panel-h"><div><h3>Government Updates</h3><p>Important information for your community</p></div><span class="pill pill-gray">Demo Data</span></div>
      <div style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--border)">
        <div style="width:32px;height:32px;border-radius:9px;background:#fff3e2;display:grid;place-items:center">⚠️</div>
        <div><strong style="font-size:12px">Monsoon preparedness advisory</strong><p style="font-size:11px;color:var(--muted);margin:4px 0">Keep drainage areas clear and report waterlogging early.</p><small style="font-size:10px;color:#96a5b4">Public service announcement · 2 hours ago</small></div>
      </div>
      <div style="display:flex;gap:12px;padding:14px 0">
        <div style="width:32px;height:32px;border-radius:9px;background:#e8f5fc;display:grid;place-items:center">🔔</div>
        <div><strong style="font-size:12px">Service centre hours updated</strong><p style="font-size:11px;color:var(--muted);margin:4px 0">Citizen help desks are open from 9:00 AM to 5:00 PM.</p><small style="font-size:10px;color:#96a5b4">Department notice · Yesterday</small></div>
      </div>
      <div style="display:flex;gap:6px;font-size:10px;color:#b37b35;background:#fff8ec;padding:8px;margin-top:10px;border-radius:7px">⚡ These are simulated updates for this prototype.</div>
    </div>
    <div class="panel">
      <div class="panel-h"><div><h3>Your Complaint Summary</h3><p>Stay informed at every step</p></div></div>
      <div style="display:flex;gap:13px;align-items:center;margin:20px 0">
        <strong style="font:800 28px Manrope;color:var(--navy)">${State.complaints.length}</strong>
        <span style="font-size:11px;color:var(--muted)">Total complaints<br><small style="font-size:9px">Since you joined</small></span>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <span style="font-size:11px;color:var(--muted);display:flex;align-items:center;gap:7px"><i style="width:7px;height:7px;border-radius:50%;background:#0e78bd;display:inline-block"></i> In Progress <strong style="margin-left:auto">${active-resolved>0?active-resolved:0}</strong></span>
        <span style="font-size:11px;color:var(--muted);display:flex;align-items:center;gap:7px"><i style="width:7px;height:7px;border-radius:50%;background:#2d9a78;display:inline-block"></i> Resolved <strong style="margin-left:auto">${resolved}</strong></span>
      </div>
      <button class="btn btn-outline btn-full" style="margin-top:16px" onclick="navCitizen('complaints')">View complaint history</button>
    </div>
  </div>
  <div class="panel" style="margin-top:16px">
    <div class="panel-h"><div><h3>Browse All Government Departments</h3><p>${DEPARTMENTS.length} departments available — find the right one for your complaint</p></div><button class="btn btn-outline" onclick="navCitizen('departments')">View all →</button></div>
    <div class="dept-grid">${DEPARTMENTS.slice(0,8).map(d=>`<div class="dept-card" onclick="reportWithDept('${d.id}')"><div class="dept-ico">${d.icon}</div><strong>${d.name}</strong><small>SLA: ${d.sla}</small></div>`).join('')}</div>
  </div>
  <div class="panel" style="margin-top:16px">
    <h3 style="font-family:Manrope;font-size:15px;margin-bottom:16px">How Samadhaan Works</h3>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px" class="how-steps">
      ${['Report','AI understands','Department assigned','Officer resolves','You track'].map((s,i)=>`<div style="display:flex;gap:8px"><span style="font:700 14px Manrope;color:#9dafbe">${String(i+1).padStart(2,'0')}</span><div><strong style="font-size:12px;display:block;color:var(--ink)">${s}</strong><small style="font-size:10px;color:var(--muted)">${['Tell us what happened','We classify the issue','It reaches the right team','Action is taken','Get updates anytime'][i]}</small></div></div>`).join('')}
    </div>
  </div>
  `;
}

let wizardStep=1, wizData={desc:'',dept:'roads',loc:'',file:''};
function citizenReport(){
  const steps=['Problem','Location','Evidence','Review'];
  const analyzing=wizAnalyzing;
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
    <div><span class="pill pill-blue">NEW GRIEVANCE</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Report a Problem</h1><p style="color:var(--muted);font-size:13px">It takes less than two minutes.</p></div>
    <span class="pill pill-gray">Demo workflow</span>
  </div>
  <div class="wizard" style="margin:0 auto">
    <div class="wsteps">${steps.map((s,i)=>`<div class="wstep ${wizardStep>i+1?'done':''} ${wizardStep===i+1?'cur':''}"><span class="num">${wizardStep>i+1?'✓':i+1}</span><span>${s}</span>${i<3?'<span class="line"></span>':''}</div>`).join('')}</div>
    <div class="wbody">
    ${analyzing?`<div style="text-align:center;padding:40px 0">
      <div style="height:64px;width:64px;background:linear-gradient(135deg,#0e78bd,#32a57d);border-radius:20px;display:grid;place-items:center;font-size:30px;margin:0 auto;animation:pulse 1.4s infinite alternate;color:#fff">🤖</div>
      <h2 style="font:700 18px Manrope;margin:18px 0 6px">Samadhaan AI is analyzing...</h2><p style="color:var(--muted);font-size:12px">Finding the right department and priority</p>
      <div style="width:200px;height:4px;background:#e7eef3;border-radius:6px;overflow:hidden;margin:18px auto"><div style="width:55%;height:100%;background:var(--blue);animation:load 1.2s infinite"></div></div>
    </div>`: wizardStep===1?`
      <div style="display:flex;gap:14px;margin-bottom:20px"><span style="font:700 12px Manrope;color:#92a7b8">01</span><div><h2 style="font:700 20px Manrope;margin-bottom:4px">What is the problem?</h2><p style="color:var(--muted);font-size:12px">Describe the issue or speak it out.</p></div></div>
      <div class="field"><label>Describe your problem</label><textarea id="wiz-desc" placeholder="For example: There is a large pothole near the main market...">${wizData.desc}</textarea></div>
      <div style="display:flex;gap:12px;padding:8px 0">
        <button class="btn btn-outline" onclick="voiceInput()">🎤 Tap & Speak</button>
        <span style="margin-left:auto;font-size:10px;color:#98a9b6;align-self:center" id="char-count">0/500</span>
      </div>
      <div style="display:flex;gap:8px;padding:10px;background:#f0f8fc;border-radius:8px;color:#39718e;font-size:11px;align-items:flex-start">🤖 <span><strong>Tip:</strong> Include what happened, where, and how it affects people.</span></div>
    `: wizardStep===2?`
      <div style="display:flex;gap:14px;margin-bottom:20px"><span style="font:700 12px Manrope;color:#92a7b8">02</span><div><h2 style="font:700 20px Manrope;margin-bottom:4px">Where is the problem?</h2><p style="color:var(--muted);font-size:12px">A precise location helps the right team respond faster.</p></div></div>
      <div class="field"><label>Address or landmark</label><input id="wiz-loc" placeholder="Enter a landmark, street or area" value="${wizData.loc}"></div>
      <div class="loc-opts">
        <button onclick="useLocation()"><strong>📍 Use current location</strong><small style="color:var(--muted)">We only use this when you click</small></button>
        <button onclick="toast('Map selection opened (demo)')"><strong>🗺️ Select on map</strong><small style="color:var(--muted)">Pin the exact spot</small></button>
      </div>
      <div class="map-box">Demo Map · OpenStreetMap would appear here</div>
    `: wizardStep===3?`
      <div style="display:flex;gap:14px;margin-bottom:20px"><span style="font:700 12px Manrope;color:#92a7b8">03</span><div><h2 style="font:700 20px Manrope;margin-bottom:4px">Add Evidence <span style="font-size:10px;color:#9aa9b6">(optional)</span></h2><p style="color:var(--muted);font-size:12px">Photos or videos help officers understand the situation.</p></div></div>
      <div class="upload-area" onclick="toast('File picker would open here')"><div class="up-ico">📤</div><strong>Upload photos or video</strong><span>PNG, JPG or MP4 · Max 10 MB</span></div>
      <div style="display:flex;gap:8px;padding:10px;background:#eff9f4;border-radius:8px;color:#42806f;font-size:11px;align-items:flex-start;margin-top:14px">🔒 Your evidence is encrypted and only shared with the assigned department.</div>
    `:`
      <div style="display:flex;gap:14px;margin-bottom:20px"><span style="font:700 12px Manrope;color:#92a7b8">04</span><div><h2 style="font:700 20px Manrope;margin-bottom:4px">Review your complaint</h2><p style="color:var(--muted);font-size:12px">Please check the details before submitting.</p></div></div>
      <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden">
        <div style="display:flex;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border);font-size:11px"><span style="color:var(--muted)">Problem</span><strong>${wizData.desc||'Civic issue reported'}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border);font-size:11px"><span style="color:var(--muted)">Department</span><strong>${deptIcon(wizData.dept)} ${deptName(wizData.dept)} <span class="pill pill-blue">AI match 94%</span></strong></div>
        <div style="display:flex;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border);font-size:11px"><span style="color:var(--muted)">Location</span><strong>📍 ${wizData.loc||'Kanpur, Uttar Pradesh'}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border);font-size:11px"><span style="color:var(--muted)">Priority</span><strong><span class="pill pill-red">High priority</span></strong></div>
        <div style="display:flex;justify-content:space-between;padding:12px 14px;font-size:11px"><span style="color:var(--muted)">Evidence</span><strong>${wizData.file||'No evidence attached'}</strong></div>
      </div>
      <div style="display:flex;gap:8px;padding:10px;background:#f0f8fc;border-radius:8px;color:#39718e;font-size:11px;align-items:flex-start;margin-top:14px">🤖 <span><strong>AI prediction — please verify.</strong> You can change the department after submitting.</span></div>
    `}
    </div>
    <div class="wfoot">
      ${wizardStep>1?'<button class="btn btn-outline" onclick="wizBack()">← Back</button>':''}
      <span style="margin-left:auto;font-size:10px;color:#98a9b6;display:flex;align-items:center;gap:4px">🔒 Progress saved in demo</span>
      <button class="btn btn-primary" onclick="${wizardStep===4?'submitComplaint()':'wizNext()'}">${wizardStep===4?'✓ Submit Complaint':'Continue →'}</button>
    </div>
  </div>`;
}

let wizAnalyzing=false;
function wizNext(){
  if(wizardStep===1){ wizData.desc=$('#wiz-desc').value; if(!wizData.desc.trim()){toast('Please describe the problem first');return;} }
  if(wizardStep===2){ wizData.loc=$('#wiz-loc').value; }
  if(wizardStep===3){ wizAnalyzing=true; renderCitizen(); setTimeout(()=>{ wizAnalyzing=false; wizardStep=4; renderCitizen(); },900); return; }
  wizardStep=Math.min(wizardStep+1,4); renderCitizen();
}
function wizBack(){ wizardStep=Math.max(wizardStep-1,1); renderCitizen(); }
function voiceInput(){ wizData.desc='मेरे इलाके में सड़क पर बहुत बड़ा गड्ढा है'; renderCitizen(); toast('Voice transcription added. You can edit it.'); }
function useLocation(){ wizData.loc='Civil Lines, Kanpur, Uttar Pradesh'; renderCitizen(); toast('Demo location selected'); }
function submitComplaint(){
  const id=`SAM-2026-UP-${String(125+Math.floor(Math.random()*700)).padStart(6,'0')}`;
  State.complaints.unshift({id,title:wizData.desc||'Civic issue reported',dept:wizData.dept,status:'Pending',priority:'High',updated:'Just now',score:91,location:wizData.loc||'Kanpur, Uttar Pradesh'});
  wizardStep=1; wizData={desc:'',dept:'roads',loc:'',file:''};
  citizenView='complaints'; renderCitizen(); toast('Complaint submitted successfully');
}
function reportWithDept(id){ wizData.dept=id; citizenView='report'; wizardStep=1; renderCitizen(); }

function citizenComplaints(){
  const filter=window._cFilter||'All';
  const q=(window._cSearch||'').toLowerCase();
  let list=State.complaints;
  if(filter!=='All') list=list.filter(c=>c.status===filter);
  if(q) list=list.filter(c=>`${c.title} ${c.id} ${deptName(c.dept)}`.toLowerCase().includes(q));
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
    <div><span class="pill pill-blue">YOUR ACTIVITY</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">My Complaints</h1><p style="color:var(--muted);font-size:13px">Follow every report from submission to resolution.</p></div>
    <button class="btn btn-primary" onclick="navCitizen('report')">➕ New Complaint</button>
  </div>
  <div class="toolbar">
    <div class="tabs">${['All','Pending','In Progress','Resolved'].map(t=>`<button class="${filter===t?'active':''}" onclick="setFilter('${t}')">${t} (${t==='All'?State.complaints.length:State.complaints.filter(c=>c.status===t).length})</button>`).join('')}</div>
    <div class="search-box">🔍<input placeholder="Search complaints" value="${window._cSearch||''}" oninput="setSearch(this.value)"></div>
  </div>
  <div class="clist">
    ${list.map(c=>complaintCard(c)).join('')||'<div class="empty"><div class="e-ico">📋</div><strong>No complaints found</strong><p>Try another search or report a new problem.</p><button class="btn btn-primary" onclick="navCitizen(\'report\')">Report Your First Problem</button></div>'}
  </div>`;
}
function complaintCard(c){
  return `<div class="ccard">
    <div class="ccard-top"><span class="cid">${c.id} · ${c.updated}</span><span class="pill ${c.status==='Resolved'?'pill-green':c.priority==='High'?'pill-red':'pill-orange'}">${c.status}</span></div>
    <div class="ccard-main"><div class="ccard-ico">${deptIcon(c.dept)}</div><div><h4>${c.title}</h4><p>${deptName(c.dept)} · 📍 ${c.location}</p></div><div class="ccard-score"><small>AI priority score</small><strong>${c.score}<span style="font-size:10px;color:#9baab7">/100</span></strong></div></div>
    <div class="ccard-bot"><span>⏰ SLA: ${c.status==='Resolved'?'Completed':c.priority==='High'?'18h remaining':'2d remaining'}</span>
    <span><button class="btn btn-outline" style="height:28px;font-size:10px;padding:0 10px" onclick="toast('Opened ${c.id}')">View Details →</button>${c.status!=='Resolved'?`<button class="btn" style="height:28px;font-size:10px;padding:0 10px;color:var(--green)" onclick="resolveComplaint('${c.id}')">✓ Mark Resolved</button>`:''}</span></div>
  </div>`;
}
function setFilter(f){ window._cFilter=f; renderCitizen(); }
function setSearch(s){ window._cSearch=s; renderCitizen(); }
function resolveComplaint(id){ State.complaints=State.complaints.map(c=>c.id===id?{...c,status:'Resolved',updated:'Just now'}:c); renderCitizen(); toast('Complaint status updated to resolved'); }

function citizenDepartments(){
  const q=(window._dSearch||'').toLowerCase();
  let list=DEPARTMENTS;
  if(q) list=list.filter(d=>d.name.toLowerCase().includes(q)||d.cat.toLowerCase().includes(q));
  return `
  <div style="margin-bottom:20px"><span class="pill pill-blue">ALL DEPARTMENTS</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Government Departments</h1><p style="color:var(--muted);font-size:13px">${DEPARTMENTS.length} departments across all government services. Tap any department to file a complaint.</p></div>
  <div class="toolbar"><div class="search-box" style="flex:1">🔍<input style="width:100%" placeholder="Search departments..." value="${window._dSearch||''}" oninput="setDeptSearch(this.value)"></div></div>
  <div class="dept-grid">${list.map(d=>`<div class="dept-card" onclick="reportWithDept('${d.id}')"><div class="dept-ico">${d.icon}</div><strong>${d.name}</strong><small>Category: ${d.cat}<br>SLA: ${d.sla}</small></div>`).join('')}</div>
  ${list.length===0?'<div class="empty"><div class="e-ico">🔍</div><strong>No departments found</strong><p>Try a different search.</p></div>':''}
  `;
}
function setDeptSearch(s){ window._dSearch=s; renderCitizen(); }

function citizenTrack(){
  return `
  <div style="margin-bottom:20px"><span class="pill pill-blue">TRACK GRIEVANCE</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Track a Complaint</h1><p style="color:var(--muted);font-size:13px">Enter your grievance ID to see the latest status.</p></div>
  <div class="panel" style="display:flex;align-items:center;gap:14px;background:#eef8fc;border:1px solid #d8ebf4">
    <div style="height:38px;width:38px;border-radius:10px;background:#d7eff9;display:grid;place-items:center;font-size:18px">🔍</div>
    <div style="flex:1"><strong style="font-size:13px">Have a grievance ID?</strong><p style="font-size:11px;color:var(--muted);margin:3px 0 0">Enter it below to track your complaint.</p></div>
  </div>
  <div class="panel"><div style="display:flex;gap:8px"><input id="track-id" class="field" style="flex:1;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:13px" placeholder="SAM-2026-UP-000124"><button class="btn btn-blue" onclick="doTrack()">Track</button></div></div>
  <div id="track-result"></div>
  `;
}
function doTrack(){
  const id=$('#track-id').value.trim();
  const c=State.complaints.find(x=>x.id===id);
  const r=$('#track-result');
  if(!c){ r.innerHTML='<div class="empty"><div class="e-ico">🔍</div><strong>Complaint not found</strong><p>Check the ID and try again.</p></div>'; return; }
  const steps=['Submitted','AI Analysed','Assigned','In Progress','Resolved'];
  const curIdx=steps.indexOf(c.status==='Resolved'?'Resolved':'In Progress');
  r.innerHTML=`<div class="panel"><div class="panel-h"><div><h3>${c.title}</h3><p>${c.id} · ${deptName(c.dept)}</p></div><span class="pill ${c.status==='Resolved'?'pill-green':'pill-orange'}">${c.status}</span></div>
  <div style="display:flex;flex-direction:column;gap:0;margin-top:16px">${steps.map((s,i)=>`<div style="display:flex;gap:12px;align-items:center;padding:10px 0;position:relative"><div style="width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:12px;flex-shrink:0;z-index:2;${i<=curIdx?'background:var(--blue);color:#fff':'background:#e2e9f0;color:#9baab7'}">${i<curIdx?'✓':i+1}</div><div><strong style="font-size:12px;color:var(--ink)">${s}</strong>${i===curIdx?'<small style="display:block;font-size:10px;color:var(--blue)">Current status</small>':''}</div>${i<steps.length-1?`<div style="position:absolute;left:14px;top:38px;bottom:-10px;width:2px;background:${i<curIdx?'var(--blue)':'#e2e9f0'}"></div>`:''}</div>`).join('')}</div></div>`;
}

// ====================== Authentication Screens ======================
function renderAuth(role) {
  authState.loginRole = role;
  const isCitizen = role === 'citizen';
  const isOfficer = role === 'officer';
  const isAdmin = role === 'admin';
  const roleLabel = isCitizen ? 'Citizen' : isOfficer ? 'Officer' : 'Administrator';
  const roleIcon = isCitizen ? '👤' : isOfficer ? '👮' : '🛡️';
  const accentColor = isCitizen ? '#0e78bd' : isOfficer ? '#27896f' : '#082b53';
  const logoImg = '/assets/logo/samadhan_logo.jpeg';

  if (authState.step === 'otp') {
    const num = authState.pendingData.mobile || authState.pendingData.empId || '';
    const timerLabel = authState.otpSeconds > 0
      ? `⏱ ${Math.floor(authState.otpSeconds/60)}:${String(authState.otpSeconds%60).padStart(2,'0')}`
      : (authState.otpLocked ? 'Locked' : 'Expired');
    return `
    <div class="auth-screen">
      <div class="auth-logo"><img src="${logoImg}" onerror="this.style.display='none'" alt="Samadhaan"><h2>Verify Your Identity</h2><p>OTP sent to ${num ? `••••${String(num).slice(-4)}` : 'your registered number'}</p></div>
      <p style="font-size:12px;text-align:center;color:var(--muted);margin-bottom:14px">Enter the 6-digit OTP (Demo: <strong style="color:${accentColor}">${OTP_DEMO}</strong>)</p>
      <div class="otp-input">${[0,1,2,3,4,5].map(i=>`<input maxlength="1" oninput="if(this.value&&${i}<5)this.nextElementSibling?.focus()" data-otp="${i}" placeholder="0">`).join('')}</div>
      <div style="text-align:center;margin:8px 0;font-size:11px;color:${authState.otpSeconds<=0?'var(--red)':'var(--muted)'}" id="otp-timer">${timerLabel}</div>
      ${authState.otpLocked ? '<div style="text-align:center;font-size:11px;color:var(--red);margin-bottom:10px">Too many attempts. Please resend OTP.</div>' : ''}
      <button class="btn btn-primary btn-full" id="otp-verify-btn" style="background:${accentColor}" onclick="verifyOtp()">Verify & Continue</button>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn btn-outline btn-full" onclick="resendOtp()">Resend OTP</button>
        <button class="btn btn-outline btn-full" onclick="authState.step='form';stopOtpTimer();render()">Change Number</button>
      </div>
      <div class="auth-note">🔒 Demo OTP — use <strong>${OTP_DEMO}</strong>. OTP expires in ${OTP_TTL/60} min. Max ${MAX_OTP_RETRIES} retries.</div>
    </div>`;
  }

  if (authState.mode === 'register' && isCitizen) {
    return `
    <div class="auth-screen">
      <div class="auth-logo"><img src="${logoImg}" onerror="this.style.display='none'" alt="Samadhaan"><h2>Register as Citizen</h2><p>Create your Samadhaan account</p></div>
      <div class="field"><label>Full Name</label><input id="reg-name" placeholder="Enter your full name"></div>
      <div class="field"><label>Mobile Number</label><input id="reg-mobile" placeholder="10-digit mobile number" maxlength="10" oninput="this.value=this.value.replace(/[^0-9]/g,'')"></div>
      <div class="field"><label>Email</label><input id="reg-email" placeholder="your@email.com"></div>
      <div class="field"><label>State</label><select id="reg-state"><option>Uttar Pradesh</option><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option><option>West Bengal</option><option>Gujarat</option><option>Rajasthan</option></select></div>
      <div class="field"><label>District</label><input id="reg-district" placeholder="e.g. Kanpur"></div>
      <div class="field"><label>City</label><input id="reg-city" placeholder="e.g. Kanpur"></div>
      <div class="field"><label>Preferred Language</label><select id="reg-lang"><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option><option value="ur">اردو</option><option value="bn">বাংলা</option><option value="ta">தமிழ்</option><option value="te">తెలుగు</option></select></div>
      <button class="btn btn-primary btn-full" style="background:${accentColor}" onclick="registerCitizen()">Send OTP & Create Account</button>
      <div style="text-align:center;margin-top:12px"><a style="font-size:11px;cursor:pointer;color:${accentColor}" onclick="authState.mode='login';render()">Already registered? Login →</a></div>
      <div class="auth-note">🔒 Demo authentication — use <strong>${OTP_DEMO}</strong> as OTP.</div>
    </div>`;
  }

  // Login forms per role
  if (isOfficer) {
    return `
    <div class="auth-screen">
      <div class="auth-logo"><img src="${logoImg}" onerror="this.style.display='none'" alt="Samadhaan"><h2>${roleIcon} Officer Login</h2><p>Government Officer Portal</p></div>
      <div class="field"><label>Government / Employee ID</label><input id="auth-empId" placeholder="e.g. GOV-UP-10245"></div>
      <div class="field"><label>Password</label><input id="auth-pass" type="password" placeholder="Enter your password" onkeydown="if(event.key==='Enter')loginStaff('officer')"></div>
      <button class="btn btn-primary btn-full" style="background:${accentColor}" onclick="loginStaff('officer')">Verify & Login</button>
      <div class="auth-note">🔒 Demo: Government ID <strong>${DEMO_CREDENTIALS.officer.governmentId}</strong>, password <strong>${DEMO_CREDENTIALS.officer.password}</strong></div>
    </div>`;
  }

  if (isAdmin) {
    return `
    <div class="auth-screen">
      <div class="auth-logo"><img src="${logoImg}" onerror="this.style.display='none'" alt="Samadhaan"><h2>${roleIcon} Administrator Login</h2><p>Governance Command Center</p></div>
      <div class="field"><label>Government ID</label><input id="auth-empId" placeholder="e.g. ADMIN-GOV-001"></div>
      <div class="field"><label>Password</label><input id="auth-pass" type="password" placeholder="Enter your password" onkeydown="if(event.key==='Enter')loginStaff('admin')"></div>
      <button class="btn btn-primary btn-full" style="background:${accentColor}" onclick="loginStaff('admin')">Verify & Login</button>
      <div class="auth-note">🔒 Demo: Government ID <strong>${DEMO_CREDENTIALS.admin.governmentId}</strong>, password <strong>${DEMO_CREDENTIALS.admin.password}</strong></div>
    </div>`;
  }

  // Citizen login
  return `
  <div class="auth-screen">
    <div class="auth-logo"><img src="${logoImg}" onerror="this.style.display='none'" alt="Samadhaan"><h2>Welcome to SAMADHAAN</h2><p>Aapki Shikayat, Hamari Zimmedari</p></div>
    <div class="auth-tabs">
      <button class="${authState.mode==='login'?'active':''}" onclick="authState.mode='login';render()">Login</button>
      <button class="${authState.mode==='register'?'active':''}" onclick="authState.mode='register';render()">Register</button>
    </div>
    <div class="field"><label>Mobile Number</label><div style="display:flex;align-items:center;border:1px solid var(--border);border-radius:8px;overflow:hidden"><span style="padding:0 12px;font-weight:700;color:var(--ink);background:var(--bg-soft,#f4f8fb);border-right:1px solid var(--border);font-size:13px;height:42px;display:flex;align-items:center">+91</span><input id="auth-mobile" style="border:none;border-radius:0;flex:1" placeholder="10-digit mobile number" maxlength="10" inputmode="numeric" oninput="this.value=this.value.replace(/[^0-9]/g,'');if(this.value.length===10)this.blur()" onkeydown="if(event.key==='Enter')sendOtpCitizen()"></div></div>
    <button class="btn btn-primary btn-full" style="background:${accentColor}" onclick="sendOtpCitizen()">Send OTP</button>
    <div style="text-align:center;font-size:11px;color:var(--muted);margin:14px 0">OR</div>
    <div class="field"><label>Email</label><input id="auth-email" placeholder="your@email.com"></div>
    <div class="field"><label>Password</label><input id="auth-pass" type="password" placeholder="Enter password"></div>
    <button class="btn btn-blue btn-full" onclick="loginDirect()">Login with Email</button>
    <div style="text-align:center;margin-top:12px"><a style="font-size:11px;cursor:pointer;color:${accentColor}" onclick="authState.mode='register';render()">New user? Register →</a></div>
    <div class="auth-note">🔒 Demo authentication — use <strong>${OTP_DEMO}</strong> as OTP.</div>
  </div>`;
}

function sendOtpCitizen() {
  const m = $('#auth-mobile');
  if (!m || !m.value.trim()) { toast('Please enter your 10-digit mobile number'); return; }
  if (m.value.length !== 10) { toast('Mobile number must be exactly 10 digits'); return; }
  if (!/^[6-9]\d{9}$/.test(m.value)) { toast('Enter a valid Indian mobile number (starts with 6, 7, 8 or 9)'); return; }
  authState.pendingData = { mobile: m.value, name: 'Prachi Sharma', location: 'Kanpur, Uttar Pradesh' };
  authState.step = 'otp';
  authState.otpRetries = 0;
  authState.otpLocked = false;
  startOtpTimer();
  render();
  toast('OTP sent to +91 ' + m.value.slice(0,5) + ' ' + m.value.slice(5) + ' (Demo: ' + OTP_DEMO + ')');
}

function loginStaff(role) {
  const loginContainer = role === 'officer' ? $('#officer-content') : $('#admin-content');
  const id = loginContainer?.querySelector('#auth-empId');
  const password = loginContainer?.querySelector('#auth-pass');

  const account = DEMO_CREDENTIALS[role];
  if (!id || !id.value.trim()) { toast('Please enter your Government ID'); return; }
  if (!password || !password.value) { toast('Please enter your password'); return; }
  if (!account || id.value.trim().toUpperCase() !== account.governmentId || password.value !== account.password) {
    toast('Invalid Government ID or password');
    return;
  }

  const userData = { name: account.name, empId: account.governmentId, role: role.toUpperCase(), dept: account.dept || '' };
  createSession(role, userData);
  State.user = userData;
  State.role = role;
  authState.step = 'form';
  authState.mode = 'login';
  authState.pendingData = {};
  if (role === 'officer') officerView = 'dashboard';
  if (role === 'admin') adminView = 'overview';
  render();
  toast(`${role === 'officer' ? 'Officer Dashboard' : 'Admin Dashboard'} opened`);
}

function sendOtpOfficer() {
  const e = $('#auth-empId');
  const m = $('#auth-mobile');
  if (!e || !e.value.trim()) { toast('Please enter your Government/Employee ID'); return; }
  if (!m || m.value.length < 10) { toast('Please enter your registered mobile number'); return; }
  authState.pendingData = { empId: e.value, mobile: m.value, name: 'Arjun Mehta', role: 'OFFICER', dept: 'Roads & Highways' };
  authState.step = 'otp';
  authState.otpRetries = 0;
  authState.otpLocked = false;
  startOtpTimer();
  render();
  toast('OTP sent to registered mobile (Demo: ' + OTP_DEMO + ')');
}

function sendOtpAdmin() {
  const u = $('#auth-username');
  const p = $('#auth-pass');
  const m = $('#auth-mobile');
  if (!u || !u.value.trim()) { toast('Please enter admin username'); return; }
  if (!p || !p.value.trim()) { toast('Please enter password'); return; }
  if (u.value !== 'admin' || p.value !== 'admin123') { toast('Invalid admin credentials (Demo: admin / admin123)'); return; }
  if (!m || m.value.length < 10) { toast('Please enter registered mobile number'); return; }
  authState.pendingData = { username: u.value, mobile: m.value, name: 'System Administrator', role: 'ADMIN' };
  authState.step = 'otp';
  authState.otpRetries = 0;
  authState.otpLocked = false;
  startOtpTimer();
  render();
  toast('OTP sent (Demo: ' + OTP_DEMO + ')');
}

function registerCitizen() {
  const n = $('#reg-name');
  const m = $('#reg-mobile');
  if (!n || !n.value.trim()) { toast('Please enter your full name'); return; }
  if (!m || m.value.length < 10) { toast('Please enter a valid 10-digit mobile number'); return; }
  authState.pendingData = {
    mobile: m.value,
    name: n.value,
    email: $('#reg-email')?.value || '',
    state: $('#reg-state')?.value || 'Uttar Pradesh',
    location: ($('#reg-district')?.value || 'Kanpur') + ', ' + ($('#reg-state')?.value || 'Uttar Pradesh'),
  };
  authState.step = 'otp';
  authState.otpRetries = 0;
  authState.otpLocked = false;
  startOtpTimer();
  render();
  toast('OTP sent for verification (Demo: ' + OTP_DEMO + ')');
}

function verifyOtp() {
  if (authState.otpLocked) { toast('Too many failed attempts. Resend OTP to try again.'); return; }
  if (authState.otpSeconds <= 0) { toast('OTP expired. Please resend.'); return; }
  const otp = Array.from($$('[data-otp]')).map(i => i.value).join('');
  if (otp.length !== 6) { toast('Please enter all 6 digits'); return; }

  if (otp !== OTP_DEMO) {
    authState.otpRetries++;
    if (authState.otpRetries >= MAX_OTP_RETRIES) {
      authState.otpLocked = true;
      stopOtpTimer();
      toast('Maximum retries reached. OTP locked. Resend to try again.');
      render();
      return;
    }
    toast(`Invalid OTP. ${MAX_OTP_RETRIES - authState.otpRetries} attempts remaining.`);
    $$('[data-otp]').forEach(i => i.value = '');
    $('[data-otp="0"]')?.focus();
    return;
  }

  // Success
  stopOtpTimer();
  const role = authState.loginRole;
  const d = authState.pendingData;
  const userData = {
    name: d.name || 'User',
    mobile: d.mobile || '',
    email: d.email || '',
    location: d.location || 'Kanpur, Uttar Pradesh',
    empId: d.empId || '',
    role: d.role || 'CITIZEN',
  };
  createSession(role, userData);
  State.user = userData;
  State.role = role;
  authState.step = 'form';
  authState.mode = 'login';
  authState.otpRetries = 0;
  authState.otpLocked = false;
  authState.pendingData = {};
  citizenView = 'home';
  render();
  toast(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);
}

function resendOtp() {
  stopOtpTimer();
  authState.otpRetries = 0;
  authState.otpLocked = false;
  authState.step = 'otp';
  startOtpTimer();
  render();
  toast('New OTP sent (Demo: ' + OTP_DEMO + ')');
}

function loginDirect() {
  const e = $('#auth-email');
  const p = $('#auth-pass');

  if (!e || !/^\S+@\S+\.\S+$/.test(e.value.trim())) {
    toast('Please enter a valid email address');
    return;
  }

  if (!p || !p.value) {
    toast('Please enter your password');
    return;
  }

  const DEMO_EMAIL = 'citizen@samadhaan.gov.in';
  const DEMO_PASSWORD = 'citizen123';

  if (
    e.value.trim().toLowerCase() !== DEMO_EMAIL ||
    p.value !== DEMO_PASSWORD
  ) {
    toast('Invalid email or password');
    return;
  }

  const userData = {
    name: 'Prachi Sharma',
    mobile: '9876543210',
    email: e.value.trim(),
    location: 'Kanpur, Uttar Pradesh',
    role: 'CITIZEN'
  };

  createSession('citizen', userData);
  State.user = userData;
  State.role = 'citizen';
  citizenView = 'home';
  render();
  toast('Login successful!');
}

function logout() {
  clearSession();
  authState.step = 'form';
  authState.mode = 'login';
  citizenView = 'home';
  officerView = 'dashboard';
  adminView = 'overview';
  render();
  toast('Logged out successfully');
}

// ====================== Public Utilities ======================
function citizenUtilities(){
  const utils=[
    {ico:'💧',bg:'#e8f5fc',color:'#0e78bd',name:'Water Supply',val:'Normal',status:'Supply OK',time:'6:00 AM - 9:00 AM',note:'Morning supply scheduled'},
    {ico:'⚡',bg:'#fff4e3',color:'#c3791d',name:'Electricity',val:'No Outage',status:'Stable',time:'Updated 11:42 AM',note:'No scheduled outages today'},
    {ico:'🚦',bg:'#fff0ef',color:'#c9534d',name:'Traffic',val:'Moderate',status:'Heavy at 2 spots',time:'Live · GT Road',note:'GT Road junction congested'},
    {ico:'🌬️',bg:'#e7f6ef',color:'#27896f',name:'Air Quality',val:'AQI 72',status:'Satisfactory',time:'Updated 10:00 AM',note:'PM2.5 within limits'},
    {ico:'☀️',bg:'#fff4e3',color:'#c3791d',name:'Weather',val:'32°C',status:'Partly Cloudy',time:'14 Aug 2026',note:'Humidity 64% · Wind 12 km/h'},
    {ico:'🚌',bg:'#e8f5fc',color:'#0e78bd',name:'Public Transport',val:'Running',status:'On schedule',time:'Live · 8 routes',note:'All city buses operational'},
    {ico:'🚮',bg:'#e7f6ef',color:'#27896f',name:'Garbage Collection',val:'Scheduled',status:'Today 4:00 PM',time:'Zone A & B',note:'Collection route active'},
    {ico:'🚨',bg:'#fff0ef',color:'#c9534d',name:'Emergency Info',val:'No Active Alerts',status:'All clear',time:'Updated 11:30 AM',note:'No emergency situations reported'},
  ];
  return `
  <div style="margin-bottom:20px"><span class="pill pill-blue">PUBLIC UTILITIES</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Public Utilities</h1><p style="color:var(--muted);font-size:13px">Live information for your area · Kanpur, Uttar Pradesh</p></div>
  <div class="util-grid">${utils.map(u=>`<div class="util-card"><div class="util-head"><div class="util-ico" style="background:${u.bg};color:${u.color}">${u.ico}</div><strong>${u.name}</strong></div><div class="util-val">${u.val}</div><small>${u.status}</small><div class="util-status" style="background:${u.bg};color:${u.color}">${u.time}</div><div style="font-size:10px;color:var(--muted);margin-top:8px">${u.note}</div></div>`).join('')}</div>
  <div style="display:flex;gap:6px;font-size:10px;color:#b37b35;background:#fff8ec;padding:8px;margin-top:14px;border-radius:7px;align-items:center">⚡ Demo/Mock Data — Live API integration will replace this when available.</div>
  `;
}

// ====================== Notice Board ======================
const NOTICES=[
  {cat:'Emergency',catColor:'#fff0ef',color:'#c9534d',icon:'⚠️',iconBg:'#fff0ef',title:'Heavy Rainfall Warning',body:'IMD has issued a heavy rainfall alert for the next 48 hours. Citizens are advised to stay cautious.',date:'14 Aug 2026 · 9:00 AM',priority:'High'},
  {cat:'Scheme',catColor:'#e8f5fc',color:'#0e78bd',icon:'📢',iconBg:'#e8f5fc',title:'New Pension Scheme Enrollment Open',body:'Applications for the expanded old-age pension scheme are now being accepted at all service centres.',date:'13 Aug 2026 · 2:00 PM',priority:'Medium'},
  {cat:'Service',catColor:'#fff4e3',color:'#c3791d',icon:'🔔',iconBg:'#fff4e3',title:'Water Supply Timings Revised',body:'Morning water supply timings have been adjusted due to maintenance at the treatment plant.',date:'12 Aug 2026 · 6:00 PM',priority:'Low'},
  {cat:'Public',catColor:'#e7f6ef',color:'#27896f',icon:'📋',iconBg:'#e7f6ef',title:'Property Tax Payment Deadline Extended',body:'The last date for property tax payment has been extended to 31 August 2026.',date:'11 Aug 2026 · 10:00 AM',priority:'Medium'},
  {cat:'Emergency',catColor:'#fff0ef',color:'#c9534d',icon:'🚨',iconBg:'#fff0ef',title:'Dengue Prevention Drive',body:'Fogging operations will be conducted across all wards this week. Keep surroundings clean.',date:'10 Aug 2026 · 5:00 PM',priority:'High'},
  {cat:'Scheme',catColor:'#e8f5fc',color:'#0e78bd',icon:'🏠',iconBg:'#e8f5fc',title:'Affordable Housing Scheme 2026',body:'Applications for the new affordable housing scheme are now open for eligible families.',date:'09 Aug 2026 · 11:00 AM',priority:'Low'},
];
let noticeFilter='All';
function citizenNotices(){
  const cats=['All','Emergency','Scheme','Service','Public'];
  let list=NOTICES;
  if(noticeFilter!=='All') list=NOTICES.filter(n=>n.cat===noticeFilter);
  return `
  <div style="margin-bottom:20px"><span class="pill pill-blue">NOTICE BOARD</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Government Notice Board</h1><p style="color:var(--muted);font-size:13px">Official announcements, schemes, and alerts for your area</p></div>
  <div class="toolbar"><div class="tabs">${cats.map(c=>`<button class="${noticeFilter===c?'active':''}" onclick="noticeFilter='${c}';renderCitizen()">${c}</button>`).join('')}</div></div>
  <div class="panel">${list.map(n=>`<div class="notice-item" onclick="toast('${n.title} opened')"><div class="notice-icon" style="background:${n.iconBg}">${n.icon}</div><div class="notice-body" style="flex:1"><div style="display:flex;gap:8px;align-items:center"><strong>${n.title}</strong><span class="notice-cat" style="background:${n.catColor};color:${n.color}">${n.cat}</span>${n.priority==='High'?'<span class="pill pill-red">High Priority</span>':''}</div><p>${n.body}</p><small>${n.date}</small></div></div>`).join('')}</div>
  <div style="display:flex;gap:6px;font-size:10px;color:#b37b35;background:#fff8ec;padding:8px;margin-top:14px;border-radius:7px;align-items:center">⚡ Demo Data — Simulated government notices for prototype demonstration.</div>
  `;
}

// ====================== Live Map ======================
let mapFilter='all';
function citizenMap(){
  const pins=[
    {x:25,y:30,type:'safe',label:'Green Zone',icon:'🟢',detail:'Safe area'},
    {x:55,y:25,type:'warning',label:'Waterlogging Risk',icon:'🟡',detail:'Warning zone'},
    {x:72,y:40,type:'risk',label:'Flood-Prone Area',icon:'🔴',detail:'High risk area'},
    {x:35,y:55,type:'hospital',label:'City Hospital',icon:'🏥',detail:'Emergency: 108'},
    {x:65,y:60,type:'police',label:'Police Station',icon:'🚔',detail:'Emergency: 100'},
    {x:45,y:70,type:'fire',label:'Fire Station',icon:'🚒',detail:'Emergency: 101'},
    {x:80,y:70,type:'complaint',label:'Active Complaints',icon:'📍',detail:'3 nearby complaints'},
    {x:20,y:65,type:'govt',label:'Government Office',icon:'🏛️',detail:'Citizen service centre'},
  ];
  const filtered = mapFilter==='all'?pins:pins.filter(p=>p.type===mapFilter);
  const filters=[{id:'all',label:'All'},{id:'safe',label:'🟢 Safe Zones'},{id:'warning',label:'🟡 Warning'},{id:'risk',label:'🔴 Risk Zones'},{id:'hospital',label:'🏥 Hospitals'},{id:'police',label:'🚔 Police'},{id:'fire',label:'🚒 Fire'},{id:'complaint',label:'📍 Complaints'},{id:'govt',label:'🏛️ Govt Offices'}];
  return `
  <div style="margin-bottom:20px"><span class="pill pill-blue">LIVE MAP</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Live Map & Safety Information</h1><p style="color:var(--muted);font-size:13px">View safe zones, risk areas, emergency services near you</p></div>
  <div class="map-filters">${filters.map(f=>`<button class="map-filter-btn ${mapFilter===f.id?'active':''}" onclick="mapFilter='${f.id}';renderCitizen()">${f.label}</button>`).join('')}</div>
  <div class="panel" style="padding:0;overflow:hidden">
    <div class="map-large"><div class="grid-bg"></div>${filtered.map(p=>`<div class="map-pin" style="left:${p.x}%;top:${p.y}%" onclick="toast('${p.label}: ${p.detail}')" title="${p.label}">${p.icon}</div>`).join('')}<div class="map-label" style="left:42%;top:12%">📍 Your Location: Kanpur</div></div>
    <div class="map-legend" style="padding:14px"><span><i style="background:#27896f"></i>Safe Zone</span><span><i style="background:#e6a246"></i>Warning</span><span><i style="background:#c9534d"></i>High Risk</span><span><i style="background:#0e78bd"></i>Emergency Service</span><span><i style="background:#7359bb"></i>Government Facility</span></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px" class="cols-2">
    <div class="panel"><div class="panel-h"><div><h3>Nearby Emergency Services</h3></div></div>${[{ico:'🏥',n:'City Hospital',d:'1.2 km',t:'Emergency: 108'},{ico:'🚔',n:'Police Station',d:'0.8 km',t:'Emergency: 100'},{ico:'🚒',n:'Fire Station',d:'2.1 km',t:'Emergency: 101'}].map(e=>`<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);align-items:center"><span style="font-size:20px">${e.ico}</span><div style="flex:1"><strong style="font-size:12px">${e.n}</strong><p style="font-size:10px;color:var(--muted)">${e.d} away · ${e.t}</p></div></div>`).join('')}</div>
    <div class="panel"><div class="panel-h"><div><h3>Active Alerts</h3></div></div><div style="padding:10px;background:#fff0ef;border-radius:8px;color:#c9534d;font-size:11px;margin-bottom:8px">⚠️ <strong>Heavy Rainfall Warning</strong><br><span style="font-size:10px">IMD alert for next 48 hours</span></div><div style="padding:10px;background:#fff4e3;border-radius:8px;color:#c3791d;font-size:11px">🟡 <strong>Waterlogging Risk</strong><br><span style="font-size:10px">2 zones at risk of waterlogging</span></div></div>
  </div>
  <div style="display:flex;gap:6px;font-size:10px;color:#b37b35;background:#fff8ec;padding:8px;margin-top:14px;border-radius:7px;align-items:center">⚡ Demo Map — Interactive OpenStreetMap will appear here when API is configured.</div>
  `;
}

// ====================== Emergency & SOS ======================
function citizenEmergency(){
  return `
  <div style="margin-bottom:20px"><span class="pill pill-red">EMERGENCY & SAFETY</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Emergency & SOS</h1><p style="color:var(--muted);font-size:13px">Quick access to emergency services and alerts</p></div>
  <div class="panel sos-section">
    <p style="font-size:12px;color:var(--muted);margin-bottom:18px">Press the SOS button in case of emergency. You will be asked to confirm.</p>
    <button class="sos-btn" onclick="openModal('sos-confirm')">SOS</button>
    <p style="font-size:11px;color:var(--muted);margin-top:14px">SOS will share your location with emergency services.<br><strong>Demo only — not connected to real emergency services.</strong></p>
  </div>
  <div class="panel" style="margin-top:16px">
    <div class="panel-h"><div><h3>Emergency Contacts</h3><p>Tap to call (demo)</p></div></div>
    <div class="emergency-contacts">
      <div class="ec-card" onclick="toast('Calling 108... (demo)')"><div class="ec-ico">🚑</div><strong>Ambulance</strong><small>108</small></div>
      <div class="ec-card" onclick="toast('Calling 100... (demo)')"><div class="ec-ico">🚔</div><strong>Police</strong><small>100</small></div>
      <div class="ec-card" onclick="toast('Calling 101... (demo)')"><div class="ec-ico">🚒</div><strong>Fire</strong><small>101</small></div>
      <div class="ec-card" onclick="toast('Calling 112... (demo)')"><div class="ec-ico">📞</div><strong>Emergency (All)</strong><small>112</small></div>
      <div class="ec-card" onclick="toast('Calling Women Helpline... (demo)')"><div class="ec-ico">👩</div><strong>Women Helpline</strong><small>1091</small></div>
      <div class="ec-card" onclick="toast('Calling Child Helpline... (demo)')"><div class="ec-ico">👶</div><strong>Child Helpline</strong><small>1098</small></div>
    </div>
  </div>
  <div class="panel" style="margin-top:16px">
    <div class="panel-h"><div><h3>Active Disaster Alerts</h3></div><span class="pill pill-gray">Demo</span></div>
    <div style="padding:12px;background:#fff0ef;border:1px solid #f5c8c5;border-radius:9px;margin-bottom:10px;display:flex;gap:10px;align-items:flex-start"><span style="font-size:18px">⚠️</span><div><strong style="font-size:12px;color:#c9534d">Heavy Rainfall Warning</strong><p style="font-size:11px;color:var(--muted);margin:4px 0">IMD has issued a heavy rainfall alert for the next 48 hours. Stay indoors if possible.</p><small style="font-size:10px;color:#96a5b4">14 Aug 2026 · 9:00 AM</small></div></div>
    <div style="padding:12px;background:#fff4e3;border:1px solid #f5dfbb;border-radius:9px;display:flex;gap:10px;align-items:flex-start"><span style="font-size:18px">🟡</span><div><strong style="font-size:12px;color:#c3791d">Dengue Prevention Alert</strong><p style="font-size:11px;color:var(--muted);margin:4px 0">Fogging operations underway. Keep surroundings clean and dry.</p><small style="font-size:10px;color:#96a5b4">10 Aug 2026</small></div></div>
  </div>
  <div class="panel" style="margin-top:16px">
    <div class="panel-h"><div><h3>Emergency Complaint</h3><p>Report an urgent safety issue</p></div></div>
    <button class="btn btn-primary btn-full" onclick="navCitizen('report')" style="background:#c9534d">🚨 File Emergency Complaint</button>
  </div>
  `;
}

// ====================== Citizen Profile ======================
function citizenProfile(){
  const u=State.user||{name:'Prachi Sharma',mobile:'9876543210',location:'Kanpur, Uttar Pradesh'};
  const resolved=State.complaints.filter(c=>c.status==='Resolved').length;
  const active=State.complaints.filter(c=>c.status!=='Resolved').length;
  return `
  <div style="margin-bottom:20px"><span class="pill pill-blue">MY PROFILE</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Citizen Profile</h1></div>
  <div class="panel">
    <div class="profile-header">
      <div class="profile-avatar">${u.name.charAt(0)}</div>
      <div class="profile-info"><strong>${u.name}</strong><p>📱 ${u.mobile}</p><p>📍 ${u.location}</p><p><span class="pill pill-green">✓ Verified Citizen</span></p></div>
    </div>
    <div class="profile-stats">
      <div class="profile-stat"><strong>${State.complaints.length}</strong><small>Total Complaints</small></div>
      <div class="profile-stat"><strong>${active}</strong><small>Active</small></div>
      <div class="profile-stat"><strong>${resolved}</strong><small>Resolved</small></div>
    </div>
  </div>
  <div class="panel" style="margin-top:16px">
    <div class="profile-menu">
      <button onclick="openModal('lang-modal')"><span class="pm-ico">🌐</span> Change Language <span style="margin-left:auto;font-size:10px;color:var(--muted)">${(TRANSLATIONS[State.language]||TRANSLATIONS.en).lang}</span></button>
      <button onclick="openModal('a11y-modal')"><span class="pm-ico">♿</span> Accessibility Settings</button>
      <button onclick="toggleTheme()"><span class="pm-ico">${State.theme==='dark'?'☀️':'🌙'}</span> ${State.theme==='dark'?'Light Mode':'Dark Mode'}</button>
      <button onclick="openModal('notif-modal')"><span class="pm-ico">🔔</span> Notification Settings</button>
      <button onclick="toast('Privacy settings (demo)')"><span class="pm-ico">🔒</span> Privacy & Security</button>
      <button onclick="toast('Help & support (demo)')"><span class="pm-ico">❓</span> Help & Support</button>
      <button onclick="logout()" style="color:var(--red)"><span class="pm-ico">🚪</span> Logout</button>
    </div>
  </div>
  `;
}

// ====================== Officer Detail ======================
let officerView='dashboard';
let officerDetailId=null;
function navOfficer(view,id){ officerView=view; if(id)officerDetailId=id; renderOfficer(); }

function officerComplaintDetail(){
  const c=State.complaints.find(x=>x.id===officerDetailId)||State.complaints[0];
  const steps=['Submitted','AI Verified','Assigned','In Progress','Resolved','Closed'];
  const curIdx=steps.indexOf(c.status==='Resolved'?'Resolved':'In Progress');
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
    <div><span class="pill pill-blue">COMPLAINT DETAIL</span><h1 style="font-family:Manrope;font-size:24px;margin:8px 0 4px">${c.id}</h1><p style="color:var(--muted);font-size:13px">${c.title}</p></div>
    <button class="btn btn-outline" onclick="navOfficer('dashboard')">← Back to Dashboard</button>
  </div>
  <div class="detail-grid" style="margin-bottom:16px">
    <div class="panel">
      <div class="panel-h"><div><h3>Complaint Information</h3></div></div>
      <div class="detail-row"><span>Complaint ID</span><strong>${c.id}</strong></div>
      <div class="detail-row"><span>Description</span><strong>${c.title}</strong></div>
      <div class="detail-row"><span>Department</span><strong>${deptIcon(c.dept)} ${deptName(c.dept)}</strong></div>
      <div class="detail-row"><span>Location</span><strong>📍 ${c.location}</strong></div>
      <div class="detail-row"><span>Priority</span><strong><span class="pill ${c.priority==='High'?'pill-red':'pill-orange'}">${c.priority}</span></strong></div>
      <div class="detail-row"><span>SLA Deadline</span><strong>18 Aug 2026, 5:00 PM</strong></div>
      <div class="detail-row"><span>Status</span><strong><span class="pill ${c.status==='Resolved'?'pill-green':'pill-orange'}">${c.status}</span></strong></div>
    </div>
    <div class="panel">
      <div class="panel-h"><div><h3>AI Analysis</h3></div><span class="pill pill-gray">AI advisory</span></div>
      <div class="detail-row"><span>Department</span><strong>${deptName(c.dept)}</strong></div>
      <div class="detail-row"><span>Category</span><strong>${c.title}</strong></div>
      <div class="detail-row"><span>Priority</span><strong>${c.priority}</strong></div>
      <div class="detail-row"><span>AI Confidence</span><strong>${c.score}%</strong></div>
      <div class="detail-row"><span>Duplicate Probability</span><strong>8%</strong></div>
      <div class="detail-row"><span>SLA Risk</span><strong style="color:var(--red)">HIGH</strong></div>
      <div style="font-size:10px;color:#ad936c;margin-top:10px;display:flex;gap:5px;align-items:flex-start">🤖 AI predictions are advisory and must be verified by authorized personnel.</div>
    </div>
  </div>
  <div class="panel" style="margin-bottom:16px">
    <div class="panel-h"><div><h3>Status Timeline</h3></div></div>
    ${steps.map((s,i)=>`<div class="timeline-step"><div class="timeline-dot ${i>curIdx?'pending':''}">${i<curIdx?'✓':i+1}</div><div><strong style="font-size:12px;color:var(--ink)">${s}</strong>${i===curIdx?'<small style="display:block;font-size:10px;color:var(--blue)">Current status</small>':''}${i<curIdx?'<small style="display:block;font-size:10px;color:var(--muted)">Completed</small>':''}</div>${i<steps.length-1?`<div class="timeline-line ${i>=curIdx?'pending':''}"></div>`:''}</div>`).join('')}
  </div>
  <div class="panel">
    <div class="panel-h"><div><h3>Officer Actions</h3></div></div>
    <div class="officer-actions">
      <button class="btn btn-primary" onclick="toast('Complaint accepted')">✓ Accept</button>
      <button class="btn btn-outline" onclick="toast('Work started')">🔨 Start Work</button>
      <button class="btn btn-outline" onclick="toast('Information requested from citizen')">ℹ️ Request Info</button>
      <button class="btn btn-outline" onclick="toast('Remark added')">📝 Add Remark</button>
      <button class="btn btn-outline" onclick="toast('Resolution proof uploaded')">📤 Upload Proof</button>
      <button class="btn btn-outline" style="color:var(--red)" onclick="toast('Complaint escalated to supervisor')">⬆️ Escalate</button>
      <button class="btn btn-primary" style="background:var(--green)" onclick="resolveComplaint('${c.id}');navOfficer('dashboard')">✓ Resolve</button>
    </div>
  </div>
  `;
}

function officerPerformance(){
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
    <div><span class="pill pill-blue">OFFICER PERFORMANCE</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Officer Performance</h1><p style="color:var(--muted);font-size:13px">Track resolution rates and SLA compliance</p></div>
    <button class="btn btn-outline" onclick="navOfficer('dashboard')">← Back to Dashboard</button>
  </div>
  <div class="stats" style="grid-template-columns:repeat(4,1fr)">
    <div class="stat"><div class="stat-ico" style="background:#e8f5fc;color:#0e78bd">📋</div><div class="stat-c"><label>My Assigned</label><strong>24</strong></div></div>
    <div class="stat"><div class="stat-ico" style="background:#e9f7f0;color:#21876b">✓</div><div class="stat-c"><label>Resolved</label><strong>15</strong></div></div>
    <div class="stat"><div class="stat-ico" style="background:#fff3e1;color:#dd8d24">⏰</div><div class="stat-c"><label>Pending</label><strong>7</strong></div></div>
    <div class="stat"><div class="stat-ico" style="background:#e9f7f0;color:#21876b">📊</div><div class="stat-c"><label>SLA Compliance</label><strong>91%</strong></div></div>
  </div>
  <div class="panel" style="margin-top:16px">
    <div class="panel-h"><div><h3>Officer Performance Table</h3><p>All officers in your region</p></div></div>
    <div class="tbl"><table><thead><tr><th>Officer</th><th>Dept</th><th>Assigned</th><th>Resolved</th><th>Pending</th><th>SLA %</th><th>Rating</th></tr></thead><tbody>
    ${OFFICERS.map(o=>`<tr><td><strong>${o.name}</strong></td><td>${o.dept}</td><td>${o.assigned}</td><td>${o.resolved}</td><td>${o.pending}</td><td class="${o.sla<'90%'?'neg':'pos'}">${o.sla}</td><td>⭐ ${o.rating}</td></tr>`).join('')}
    </tbody></table></div>
  </div>
  <div class="panel" style="margin-top:16px">
    <div class="panel-h"><div><h3>Resolution Trend</h3><p>Your performance over last 7 days</p></div></div>
    <div class="bars">${[30,45,38,52,48,65,72].map((h,i)=>`<div class="bar"><i style="height:${h}%"></i><span>D${i+1}</span></div>`).join('')}</div>
  </div>
  `;
}

// ====================== Admin Management Views ======================
let adminView='overview';
function navAdmin(view){ adminView=view; renderAdmin(); }

function renderOfficer(){
  const c=$('#officer-content');
  if(!requireAuth('officer')){ c.innerHTML=renderAuth('officer'); return; }
  if(officerView==='detail') c.innerHTML=officerComplaintDetail();
  else if(officerView==='performance') c.innerHTML=officerPerformance();
  else c.innerHTML=officerDashboard();
}

function officerDashboard(){
  const active=State.complaints.filter(c=>c.status!=='Resolved');
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
    <div><span class="pill pill-blue">GOVERNMENT OFFICER PORTAL</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">What should I solve first?</h1><p style="color:var(--muted);font-size:13px">Good morning, Officer Arjun. Here's your action plan for today.</p></div>
    <div style="display:flex;gap:8px"><button class="btn btn-outline">📅 09 Aug 2026</button><button class="btn btn-primary" onclick="toast('Dashboard refreshed')">📊 Refresh data</button></div>
  </div>
  <div class="panel" style="background:#fff8ed;border:1px solid #f5dfbb;margin-bottom:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
    <div style="height:36px;width:36px;border-radius:10px;background:#f9e1ba;display:grid;place-items:center;font-size:18px">🤖</div>
    <div style="flex:1"><span class="pill pill-orange">Samadhaan AI briefing · Demo</span><p style="font-size:12px;color:#6f6b60;margin:8px 0 0"><strong>Today's focus:</strong> 18 complaints are within 6 hours of SLA breach. Drainage reports are up 24% this week.</p></div>
    <button class="btn btn-outline" onclick="toast('Opening action plan')">View action plan →</button>
  </div>
  <div class="stats" style="grid-template-columns:repeat(6,1fr)">
    <div class="stat"><div class="stat-ico" style="background:#e8f5fc;color:#0e78bd">📋</div><div class="stat-c"><label>Total</label><strong>125,420</strong><small class="pos">↑ 8.4%</small></div></div>
    <div class="stat"><div class="stat-ico" style="background:#e9f7f0;color:#21876b">✓</div><div class="stat-c"><label>Resolved</label><strong>89,320</strong><small class="pos">↑ 12.8%</small></div></div>
    <div class="stat"><div class="stat-ico" style="background:#fff3e1;color:#dd8d24">⏰</div><div class="stat-c"><label>Pending</label><strong>18,421</strong><small class="neg">↓ 3.1%</small></div></div>
    <div class="stat"><div class="stat-ico" style="background:#fff0ef;color:#c9534d">⚠️</div><div class="stat-c"><label>Critical</label><strong>1,287</strong><small class="pos">↑ 5.2%</small></div></div>
    <div class="stat"><div class="stat-ico" style="background:#fff5dc;color:#bb841e">⚡</div><div class="stat-c"><label>SLA Risk</label><strong>1,428</strong><small class="pos">↑ 2.4%</small></div></div>
    <div class="stat"><div class="stat-ico" style="background:#f2efff;color:#7555bd">🎯</div><div class="stat-c"><label>SLA Breached</label><strong>2,140</strong><small class="neg">↓ 4.2%</small></div></div>
  </div>
  <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:16px" class="cols-2">
    <div class="panel">
      <div class="panel-h"><div><h3>Priority Action Queue</h3><p>AI-assisted recommendations, ranked by urgency</p></div></div>
      ${active.map((c,i)=>`<div class="prow"><div class="prank r${i+1}">${i+1}</div><div class="pinfo"><div><strong>${c.title}</strong><span class="pill ${c.priority==='High'?'pill-red':'pill-orange'}">${c.priority}</span></div><p>${c.id} · 📍 ${c.location}</p><small>⏰ ${i===0?'3 hours to SLA breach':'7 hours remaining'} · ${c.score}% AI urgency</small></div><button class="btn btn-outline" style="height:30px;font-size:10px" onclick="navOfficer('detail','${c.id}')">Open →</button></div>`).join('')}
      <button class="btn btn-outline btn-full" style="margin-top:14px" onclick="navOfficer('performance')">📊 View Officer Performance →</button>
    </div>
    <div class="panel">
      <div class="panel-h"><div><h3>Complaint Status</h3><p>Across your assigned region</p></div></div>
      <div style="display:flex;gap:20px;align-items:center;margin:16px 0">
        <div class="donut" style="background:conic-gradient(#2c9a78 0 71%,#e6a246 71% 86%,#157fbb 86% 96%,#c9534d 96% 100%)"><div class="donut-in"><strong>125k</strong><span>Total</span></div></div>
        <div class="legend" style="flex:1">
          <div class="legend-row"><i class="ld" style="background:#2c9a78"></i>Resolved<strong>71.2%</strong></div>
          <div class="legend-row"><i class="ld" style="background:#e6a246"></i>Pending<strong>14.7%</strong></div>
          <div class="legend-row"><i class="ld" style="background:#157fbb"></i>In Progress<strong>10.2%</strong></div>
          <div class="legend-row"><i class="ld" style="background:#c9534d"></i>Escalated<strong>3.9%</strong></div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:7px;background:#eff9f4;color:#21876b;padding:10px;border-radius:7px;font-size:11px">📈 <strong>Resolution rate is up 12%</strong><span style="color:#7f9d91">vs. previous month</span></div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:16px;margin-top:16px" class="cols-2">
    <div class="panel">
      <div class="panel-h"><div><h3>Complaint Trend</h3><p>Submitted vs resolved complaints</p></div><select class="select"><option>Last 30 days</option><option>Last 7 days</option></select></div>
      <div class="line-chart"><svg viewBox="0 0 520 170" preserveAspectRatio="none"><polyline points="0,130 55,118 110,135 165,98 220,110 275,82 330,93 385,62 440,70 520,28" fill="none" stroke="#0e78bd" stroke-width="2.5"/><polyline points="0,148 55,142 110,147 165,134 220,140 275,121 330,130 385,114 440,118 520,98" fill="none" stroke="#f2a43a" stroke-width="2.5" stroke-dasharray="5 4"/></svg></div>
      <div style="display:flex;gap:18px;margin-top:10px;font-size:10px;color:var(--muted)"><span>🟦 Submitted <strong style="color:var(--green)">+18%</strong></span><span>🟧 Resolved <strong style="color:var(--green)">+12%</strong></span></div>
    </div>
    <div class="panel">
      <div class="panel-h"><div><h3>AI Prediction & Early Warning</h3><p>Advisory insights from demo patterns</p></div><span style="font-size:18px">🤖</span></div>
      <div class="risk-card"><div class="risk-top"><span style="font-size:14px">⚠️</span><strong>Drainage risk</strong><span class="pill pill-red">High risk</span></div><div class="risk-num">+32% <span>expected in 7 days</span></div><p>Heavy rainfall may increase drainage complaints in 4 zones.</p></div>
      <div class="forecast"><div><span>Water supply</span><strong>+21%</strong><i style="width:58%"></i></div><div><span>Road damage</span><strong>+18%</strong><i style="width:42%"></i></div></div>
      <div style="display:flex;gap:5px;align-items:center;color:#a99272;font-size:9px;margin-top:12px">🤖 Demo prediction · Not scientifically validated</div>
    </div>
  </div>
  <div class="panel">
    <div class="panel-h"><div><h3>Department Performance</h3><p>Resolution and SLA compliance by team</p></div><button class="btn btn-outline" onclick="toast('Report exported')">Export Report →</button></div>
    <div class="tbl"><table><thead><tr><th>Department</th><th>Complaints</th><th>Resolved</th><th>SLA Compliance</th><th>Trend</th></tr></thead><tbody>
    ${[['Roads & Highways','14,820','10,420','91%','+8.2%'],['Water Supply','11,630','9,880','96%','+2.4%'],['Sanitation','9,240','7,320','88%','+12.1%'],['Electricity','7,840','6,902','94%','-3.8%']].map(r=>`<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="${r[4].startsWith('+')?'pos':'neg'}">${r[4]}</td></tr>`).join('')}
    </tbody></table></div>
  </div>
  `;
}

function renderAdmin(){
  const c=$('#admin-content');
  if(!requireAuth('admin')){ c.innerHTML=renderAuth('admin'); return; }
  if(adminView==='departments') c.innerHTML=adminDepartments();
  else if(adminView==='officers') c.innerHTML=adminOfficers();
  else if(adminView==='complaints') c.innerHTML=adminComplaints();
  else c.innerHTML=adminDashboard();
}
function adminDashboard(){
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
    <div><span class="pill pill-blue">COMMAND CENTER / OVERVIEW</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">National Civic Overview</h1><p style="color:var(--muted);font-size:13px">Make informed decisions with a live view of public grievances.</p></div>
    <div style="display:flex;gap:8px"><button class="btn btn-outline">🌐 All regions ▾</button><button class="btn btn-primary" onclick="toast('Data refreshed')">📊 Refresh</button></div>
  </div>
  <div class="panel" style="background:#fff8ec;border:1px solid #f5dfbb;display:flex;align-items:center;gap:11px;margin-bottom:16px;flex-wrap:wrap">
    <span style="font-size:16px">⚠️</span><div style="flex:1"><strong style="font-size:11px;color:#b67621">Demo alert: elevated rainfall-related civic risk detected</strong><div style="font-size:10px;color:#927650">Officer action recommended for 4 drainage hotspots.</div></div><span class="pill pill-orange">Simulated data</span>
  </div>
  <div class="stats" style="grid-template-columns:repeat(4,1fr)">
    <div class="stat"><div class="stat-ico" style="background:#e8f5fc;color:#0e78bd">📋</div><div class="stat-c"><label>Total Grievances</label><strong>125,420</strong><small class="pos">↑ 8.4%</small></div></div>
    <div class="stat"><div class="stat-ico" style="background:#fff3e1;color:#dd8d24">⏰</div><div class="stat-c"><label>Pending</label><strong>18,421</strong><small class="neg">↓ 3.1%</small></div></div>
    <div class="stat"><div class="stat-ico" style="background:#e9f7f0;color:#21876b">✓</div><div class="stat-c"><label>Resolved</label><strong>89,320</strong><small class="pos">↑ 12.8%</small></div></div>
    <div class="stat"><div class="stat-ico" style="background:#fff0ef;color:#c9534d">⚠️</div><div class="stat-c"><label>Escalated</label><strong>4,849</strong><small class="pos">↑ 1.8%</small></div></div>
  </div>
  <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px" class="cols-2">
    <div class="panel"><div class="panel-h"><div><h3>Grievance Volume</h3><p>Last 30 days across all regions</p></div><div style="text-align:right"><strong style="color:var(--green);font-size:13px">+18.4%</strong><br><small style="font-size:9px;color:var(--muted)">vs. prior period</small></div></div>
    <div class="bars">${[42,55,48,62,58,72,66,78,71,84,78,92].map((h,i)=>`<div class="bar"><i style="height:${h}%"></i><span>${i+1}</span></div>`).join('')}</div>
    <div style="display:flex;gap:18px;margin-top:10px;font-size:10px;color:var(--muted)"><span>🟦 Submitted</span><span>🟩 Resolved</span></div></div>
    <div class="panel"><div class="panel-h"><div><h3>Governance Health</h3><p>System-wide performance</p></div><span style="font-size:18px;color:var(--green)">🛡️</span></div>
    <div style="display:flex;align-items:center;gap:15px;border-bottom:1px solid var(--border);padding-bottom:16px"><div style="height:88px;width:88px;border-radius:50%;background:conic-gradient(#2c9a78 0 84%,#edf1f3 84%);display:grid;place-items:center;position:relative"><div style="position:absolute;inset:7px;background:var(--surface);border-radius:50%;display:flex;flex-direction:column;align-items:center"><strong style="font:700 22px Manrope">84</strong><span style="font-size:9px;color:var(--muted)">/100</span></div></div><div><strong style="color:var(--green);font-size:13px">Healthy</strong><p style="font-size:10px;color:var(--muted);margin:4px 0">Improving across 5 of 7 indicators</p></div></div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px;font-size:10px;color:var(--muted)"><span>🟢 Resolution rate <strong style="margin-left:auto;color:var(--ink)">78.4%</strong></span><span>🟦 SLA compliance <strong style="margin-left:auto;color:var(--ink)">92.4%</strong></span><span>🟧 Citizen satisfaction <strong style="margin-left:auto;color:var(--ink)">4.2/5</strong></span></div></div>
  </div>
  <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:16px;margin-top:16px" class="cols-2">
    <div class="panel"><div class="panel-h"><div><h3>Civic Problem Hotspots</h3><p>Areas with higher-than-average complaint density</p></div><span style="font-size:18px">📍</span></div>
    <div class="heatmap"><div class="heat h1"></div><div class="heat h2"></div><div class="heat h3"></div><div class="hm-label" style="left:18%;top:20%">Zone A · 423</div><div class="hm-label" style="right:15%;top:21%">Zone B · 298</div><div class="hm-label" style="left:52%;bottom:15%">Zone C · 187</div></div>
    <div style="display:flex;gap:14px;margin-top:10px;font-size:9px;color:var(--muted)"><span>🔴 High density</span><span>🟠 Medium</span><span>🟡 Low</span></div></div>
    <div class="panel"><div class="panel-h"><div><h3>AI Governance Insights</h3><p>Advisory analysis from demo data</p></div><span style="font-size:18px">🤖</span></div>
    ${[['Drainage complaints increased 32% this week.','Inspect drainage infrastructure in Zone A.','High impact'],['12 complaints at high risk of SLA breach.','Prioritize the action queue today.','Needs action'],['Garbage complaints recur in 4 locations.','Plan a scheduled sanitation visit.','Pattern']].map(([t,a,tag])=>`<div class="insight"><div class="ii">💡</div><div style="flex:1"><strong>${t}</strong><p>${a}</p><small>${tag} · AI-generated</small></div></div>`).join('')}
    </div>
  </div>
  <div class="panel"><div class="panel-h"><div><h3>Recent Grievances</h3><p>Latest activity across the platform</p></div></div>
  ${State.complaints.map(c=>`<div style="display:flex;align-items:center;gap:10px;border-top:1px solid var(--border);padding:11px 0"><span style="width:7px;height:7px;border-radius:50%;background:#e3a041"></span><div style="flex:1"><strong style="font-size:11px">${c.title}</strong><div style="font-size:9px;color:var(--muted)">${c.id} · ${deptName(c.dept)}</div></div><span class="pill ${c.status==='Resolved'?'pill-green':'pill-orange'}">${c.status}</span></div>`).join('')}
  </div>
  `;
}

// ====================== Role / Nav ======================
function setRole(r){
  if (State.role !== r && authState.step === 'otp') {
    stopOtpTimer();
    authState.step = 'form';
    authState.pendingData = {};
  }
  State.role=r;
  render();
  closeMobileNav();
}
function toggleMobileNav(){ document.body.classList.toggle('nav-open'); const a=$('#app-'+State.role); if(a) a.classList.toggle('nav-open'); }
function closeMobileNav(){ $$('.app').forEach(a=>a.classList.remove('nav-open')); }

// ====================== Theme / Language / Accessibility ======================
function toggleTheme(){ State.theme=State.theme==='light'?'dark':'light'; document.body.classList.toggle('theme-dark',State.theme==='dark'); localStorage.setItem('samadhaan-theme',State.theme); toast(State.theme==='dark'?'Dark mode enabled':'Light mode enabled'); }
function setLang(l){ State.language=l; localStorage.setItem('samadhaan-lang',l); const t=TRANSLATIONS[l]||TRANSLATIONS.en; toast('Language changed to '+t.lang); closeModal('lang-modal'); }

// ====================== Init ======================
function init(){
  const theme=localStorage.getItem('samadhaan-theme');
  if(theme==='dark'){ State.theme='dark'; document.body.classList.add('theme-dark'); }
  const lang=localStorage.getItem('samadhaan-lang');
  if(lang) State.language=lang;
  // Restore session
  const s = getSession();
  if (s) { State.role = s.role; State.user = s.user; }
  setTimeout(()=>{ const sp=$('#splash'); sp.style.opacity='0'; setTimeout(()=>sp.style.display='none',500); },2000);
  render();
}
window.addEventListener('DOMContentLoaded',init);

// ====================== ADMIN SUB-VIEWS ======================
function adminDepartments(){
  return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap"><div><span class="pill pill-blue">DEPARTMENT MANAGEMENT</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Departments</h1><p style="color:var(--muted);font-size:13px">${DEPARTMENTS.length} departments · Manage SLA & categories</p></div><button class="btn btn-outline" onclick="navAdmin('overview')">← Back</button></div><div class="panel"><div class="tbl"><table><thead><tr><th>Department</th><th>Category</th><th>SLA</th><th>Status</th><th>Action</th></tr></thead><tbody>${DEPARTMENTS.slice(0,15).map(d=>`<tr><td><strong>${d.icon} ${d.name}</strong></td><td>${d.cat||'General'}</td><td>${d.sla}</td><td><span class="pill pill-green">Active</span></td><td><button class="btn btn-outline" style="height:26px;font-size:10px;padding:0 8px" onclick="toast('Edit ${d.name}')">Edit</button></td></tr>`).join('')}</tbody></table></div></div>`;
}
function adminOfficers(){
  return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap"><div><span class="pill pill-blue">OFFICER MANAGEMENT</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">Officers</h1><p style="color:var(--muted);font-size:13px">Manage assignments & performance</p></div><button class="btn btn-outline" onclick="navAdmin('overview')">← Back</button></div><div class="panel"><div class="tbl"><table><thead><tr><th>Officer</th><th>Dept</th><th>Region</th><th>Assigned</th><th>Resolved</th><th>SLA %</th><th>Rating</th><th>Action</th></tr></thead><tbody>${OFFICERS.map(o=>`<tr><td><strong>${o.name}</strong></td><td>${o.dept}</td><td>${o.region||'Zone A'}</td><td>${o.assigned}</td><td>${o.resolved}</td><td class="${o.sla<'90%'?'neg':'pos'}">${o.sla}</td><td>⭐ ${o.rating}</td><td><button class="btn btn-outline" style="height:26px;font-size:10px;padding:0 8px" onclick="toast('Edit ${o.name}')">Edit</button></td></tr>`).join('')}</tbody></table></div></div>`;
}
function adminComplaints(){
  return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap"><div><span class="pill pill-blue">COMPLAINT MANAGEMENT</span><h1 style="font-family:Manrope;font-size:26px;margin:8px 0 4px">All Complaints</h1><p style="color:var(--muted);font-size:13px">Platform-wide grievance management</p></div><button class="btn btn-outline" onclick="navAdmin('overview')">← Back</button></div><div class="panel"><div class="tbl"><table><thead><tr><th>ID</th><th>Title</th><th>Department</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead><tbody>${State.complaints.map(c=>`<tr><td><strong>${c.id}</strong></td><td>${c.title}</td><td>${deptName(c.dept)}</td><td><span class="pill ${c.priority==='High'?'pill-red':'pill-orange'}">${c.priority}</span></td><td><span class="pill ${c.status==='Resolved'?'pill-green':'pill-orange'}">${c.status}</span></td><td><button class="btn btn-outline" style="height:26px;font-size:10px;padding:0 8px" onclick="toast('View ${c.id}')">View</button></td></tr>`).join('')}</tbody></table></div></div>`;
}
