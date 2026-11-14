import { appendBlock, createGenesisBlock, tamperBlock, verifyChain } from './blockchain.js';

const $ = selector => document.querySelector(selector);
const chainList = $('#chain-list');
const form = $('#event-form');
let chain = [];
let verification = { valid: true, message: 'Cadena íntegra.' };

function shortHash(hash) {
  return `${hash.slice(0, 14)}…${hash.slice(-10)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function renderMetrics() {
  $('#metric-blocks').textContent = chain.length;
  $('#metric-events').textContent = Math.max(0, chain.length - 1);
  const status = $('#metric-integrity');
  status.textContent = verification.valid ? 'Válida' : 'Alterada';
  status.className = verification.valid ? 'status-good' : 'status-bad';
  $('#metric-integrity-detail').textContent = verification.valid ? 'Cadena verificada' : 'Se detectó una inconsistencia';
}

function renderVerification(result) {
  verification = result;
  const box = $('#verification-result');
  box.className = `verification ${result.valid ? 'good' : 'bad'}`;
  box.querySelector('.verification-icon').textContent = result.valid ? '✓' : '!';
  box.querySelector('strong').textContent = result.valid ? 'Cadena íntegra' : 'Alteración detectada';
  box.querySelector('p').textContent = result.message;
  renderMetrics();
}

function renderChain() {
  chainList.innerHTML = chain.map((block, index) => `
    <article class="block-card ${index === 0 ? 'genesis' : ''}">
      <div class="block-top">
        <div><span class="block-index">BLOQUE ${String(block.index).padStart(2, '0')}</span><strong>${escapeHtml(block.eventType.replaceAll('_', ' '))}</strong></div>
        <span class="role-pill">${escapeHtml(block.role)}</span>
      </div>
      <div class="block-meta"><span>Cita: <b>${escapeHtml(block.appointmentId)}</b></span><span>${new Date(block.timestamp).toLocaleString('es-CO')}</span></div>
      <p class="block-details">${escapeHtml(block.details)}</p>
      <div class="hash-row"><span>HASH</span><code title="${escapeHtml(block.hash)}">${shortHash(block.hash)}</code></div>
      <div class="hash-row"><span>ANTERIOR</span><code title="${escapeHtml(block.previousHash)}">${shortHash(block.previousHash)}</code></div>
      ${index > 0 ? `<button class="tamper-button" type="button" data-tamper="${index}">Alterar dato (demostración)</button>` : '<span class="genesis-note">Punto de inicio de la cadena</span>'}
    </article>
  `).join('<div class="chain-link" aria-hidden="true">↓</div>');
  renderMetrics();
}

async function verifyAndRender() {
  const result = await verifyChain(chain);
  renderVerification(result);
  return result;
}

async function initialize() {
  chain = [await createGenesisBlock()];
  renderChain();
  await verifyAndRender();
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Calculando hash…';
  try {
    chain = await appendBlock(chain, {
      eventType: $('#event-type').value,
      appointmentId: $('#appointment-id').value,
      actor: $('#actor').value,
      role: $('#role').value,
      details: $('#details').value
    });
    form.reset();
    renderChain();
    await verifyAndRender();
  } catch (error) {
    renderVerification({ valid: false, index: null, message: error.message });
  } finally {
    button.disabled = false;
    button.textContent = 'Calcular hash y agregar bloque';
  }
});

chainList.addEventListener('click', async event => {
  const button = event.target.closest('[data-tamper]');
  if (!button) return;
  try {
    chain = tamperBlock(chain, Number(button.dataset.tamper));
    renderChain();
    await verifyAndRender();
  } catch (error) {
    renderVerification({ valid: false, index: null, message: error.message });
  }
});

$('#verify-button').addEventListener('click', verifyAndRender);
$('#reset-button').addEventListener('click', initialize);
$('#sample-button').addEventListener('click', async () => {
  try {
    chain = [await createGenesisBlock()];
    chain = await appendBlock(chain, {
      eventType: 'CITA_CREADA', appointmentId: 'CITA-DEMO-001', actor: 'Paciente de prueba', role: 'PACIENTE',
      details: 'Se registró una cita ficticia para Medicina General.'
    });
    chain = await appendBlock(chain, {
      eventType: 'ESTADO_ACTUALIZADO', appointmentId: 'CITA-DEMO-001', actor: 'Recepción de prueba', role: 'RECEPCIONISTA',
      details: 'La cita de demostración cambió a estado CONFIRMADA.'
    });
    chain = await appendBlock(chain, {
      eventType: 'CITA_CANCELADA', appointmentId: 'CITA-DEMO-001', actor: 'Recepción de prueba', role: 'RECEPCIONISTA',
      details: 'La cita ficticia fue cancelada para demostrar la trazabilidad.'
    });
    renderChain();
    await verifyAndRender();
  } catch (error) {
    renderVerification({ valid: false, index: null, message: error.message });
  }
});

initialize().catch(error => renderVerification({ valid: false, index: null, message: error.message }));
