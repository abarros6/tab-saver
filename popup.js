const refreshBtn = document.getElementById('refreshBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const saveBtn = document.getElementById('saveBtn');
const listEl = document.getElementById('list');
const sessionsEl = document.getElementById('sessions');
const statusEl = document.getElementById('status');

let currentTabs = []; // store [{title, url}]
let currentText = '';

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

function fetchTabs() {
  listEl.textContent = 'Loading…';
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      listEl.textContent = 'No tabs found.';
      disableControls();
      return;
    }
    currentTabs = tabs.map(tab => ({
      title: tab.title || '(no title)',
      url: tab.url || ''
    }));

    const lines = currentTabs.map(t => escapeHtml(`${t.title} — ${t.url}`));
    listEl.innerHTML = `<ul>${lines.map(l => `<li>${l}</li>`).join('')}</ul>`;

    currentText = currentTabs.map(t => `${t.title} - ${t.url}`).join('\n');
    enableControls();
    statusEl.textContent = `${tabs.length} tab(s) ready`;
  });
}

function enableControls() {
  copyBtn.disabled = false;
  downloadBtn.disabled = false;
  saveBtn.disabled = false;
}
function disableControls() {
  copyBtn.disabled = true;
  downloadBtn.disabled = true;
  saveBtn.disabled = true;
}

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(currentText);
  statusEl.textContent = 'Copied ✅';
});

downloadBtn.addEventListener('click', () => {
  const blob = new Blob([currentText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tabs-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  statusEl.textContent = 'Download started';
});

saveBtn.addEventListener('click', () => {
  chrome.storage.local.get({ sessions: [] }, (data) => {
    const sessions = data.sessions;
    const name = prompt('Name this session:', `Session ${new Date().toLocaleString()}`);
    if (!name) return;
    sessions.unshift({ name, tabs: currentTabs, savedAt: Date.now() });
    chrome.storage.local.set({ sessions }, () => {
      statusEl.textContent = 'Session saved ✅';
      renderSessions();
    });
  });
});

function renderSessions() {
  chrome.storage.local.get({ sessions: [] }, (data) => {
    if (data.sessions.length === 0) {
      sessionsEl.innerHTML = '<p>No saved sessions</p>';
      return;
    }
    sessionsEl.innerHTML = '';
    data.sessions.forEach((s, idx) => {
      const div = document.createElement('div');
      div.className = 'session';
      div.innerHTML = `
        <strong>${escapeHtml(s.name)}</strong>
        <button data-idx="${idx}" class="openBtn">Open</button>
        <button data-idx="${idx}" class="deleteBtn">Delete</button>
      `;
      sessionsEl.appendChild(div);
    });

    sessionsEl.querySelectorAll('.openBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = e.target.dataset.idx;
        const urls = data.sessions[i].tabs.map(t => t.url).filter(Boolean);
        chrome.windows.create({ url: urls });
      });
    });

    sessionsEl.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = e.target.dataset.idx;
        const updated = data.sessions.filter((_, idx) => idx !== parseInt(i));
        chrome.storage.local.set({ sessions: updated }, renderSessions);
      });
    });
  });
}

refreshBtn.addEventListener('click', fetchTabs);

fetchTabs();
renderSessions();
