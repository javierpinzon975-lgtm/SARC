const GENESIS_PREVIOUS_HASH = '0'.repeat(64);

function normalizarEvento(evento) {
  return {
    index: evento.index,
    timestamp: evento.timestamp,
    eventType: evento.eventType,
    appointmentId: evento.appointmentId,
    actor: evento.actor,
    role: evento.role,
    details: evento.details,
    previousHash: evento.previousHash
  };
}

function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function sha256(value) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('La API criptográfica del navegador no está disponible. Abra la aplicación desde http://localhost.');
  }
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return bytesToHex(digest);
}

async function hashBlock(block) {
  return sha256(JSON.stringify(normalizarEvento(block)));
}

export async function createGenesisBlock() {
  const block = {
    index: 0,
    timestamp: new Date().toISOString(),
    eventType: 'GENESIS',
    appointmentId: 'SARC-CHAIN',
    actor: 'Sistema',
    role: 'SISTEMA',
    details: 'Bloque inicial de la prueba de concepto SARC.',
    previousHash: GENESIS_PREVIOUS_HASH
  };
  block.hash = await hashBlock(block);
  return block;
}

export async function appendBlock(chain, event) {
  if (!Array.isArray(chain) || chain.length === 0) {
    throw new Error('La cadena debe contener el bloque inicial.');
  }
  const required = ['eventType', 'appointmentId', 'actor', 'role', 'details'];
  for (const field of required) {
    if (typeof event[field] !== 'string' || !event[field].trim()) {
      throw new Error(`El campo ${field} es obligatorio.`);
    }
  }

  const previous = chain[chain.length - 1];
  const block = {
    index: chain.length,
    timestamp: new Date().toISOString(),
    eventType: event.eventType.trim(),
    appointmentId: event.appointmentId.trim(),
    actor: event.actor.trim(),
    role: event.role.trim(),
    details: event.details.trim(),
    previousHash: previous.hash
  };
  block.hash = await hashBlock(block);
  return [...chain, block];
}

export async function verifyChain(chain) {
  if (!Array.isArray(chain) || chain.length === 0) {
    return { valid: false, index: 0, message: 'La cadena está vacía.' };
  }

  for (let i = 0; i < chain.length; i += 1) {
    const block = chain[i];
    const expectedPrevious = i === 0 ? GENESIS_PREVIOUS_HASH : chain[i - 1].hash;

    if (block.index !== i) {
      return { valid: false, index: i, message: `Índice incorrecto en el bloque ${i}.` };
    }
    if (block.previousHash !== expectedPrevious) {
      return { valid: false, index: i, message: `El enlace con el bloque anterior no coincide en el bloque ${i}.` };
    }
    const calculatedHash = await hashBlock(block);
    if (block.hash !== calculatedHash) {
      return { valid: false, index: i, message: `El contenido del bloque ${i} fue alterado o no coincide con su hash.` };
    }
  }

  return { valid: true, index: null, message: `Cadena íntegra: ${chain.length} bloques verificados correctamente.` };
}

export function tamperBlock(chain, index) {
  if (!Number.isInteger(index) || index <= 0 || index >= chain.length) {
    throw new Error('Seleccione un bloque de evento válido para la demostración.');
  }
  const copy = chain.map(block => ({ ...block }));
  copy[index].details = `${copy[index].details} [DATO ALTERADO]`;
  return copy;
}
