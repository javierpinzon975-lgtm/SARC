import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { appendBlock, createGenesisBlock, sha256, tamperBlock, verifyChain } from '../js/blockchain.js';

globalThis.crypto ??= webcrypto;

const sampleEvent = {
  eventType: 'CITA_CREADA',
  appointmentId: 'CITA-TEST-001',
  actor: 'Paciente ficticio',
  role: 'PACIENTE',
  details: 'Registro sintético para prueba automatizada.'
};

test('SHA-256 genera una huella hexadecimal de 64 caracteres', async () => {
  const hash = await sha256('SARC');
  assert.match(hash, /^[a-f0-9]{64}$/);
});

test('la cadena inicial es válida', async () => {
  const chain = [await createGenesisBlock()];
  const result = await verifyChain(chain);
  assert.equal(result.valid, true);
});

test('un evento se agrega enlazado al hash anterior', async () => {
  let chain = [await createGenesisBlock()];
  chain = await appendBlock(chain, sampleEvent);
  assert.equal(chain.length, 2);
  assert.equal(chain[1].previousHash, chain[0].hash);
  assert.equal((await verifyChain(chain)).valid, true);
});

test('la verificación detecta la alteración de un dato', async () => {
  let chain = [await createGenesisBlock()];
  chain = await appendBlock(chain, sampleEvent);
  const altered = tamperBlock(chain, 1);
  const result = await verifyChain(altered);
  assert.equal(result.valid, false);
  assert.equal(result.index, 1);
});

test('la verificación detecta una ruptura del enlace', async () => {
  let chain = [await createGenesisBlock()];
  chain = await appendBlock(chain, sampleEvent);
  chain = await appendBlock(chain, { ...sampleEvent, appointmentId: 'CITA-TEST-002' });
  const altered = chain.map(block => ({ ...block }));
  altered[2].previousHash = 'f'.repeat(64);
  const result = await verifyChain(altered);
  assert.equal(result.valid, false);
  assert.equal(result.index, 2);
});

test('no permite registrar eventos incompletos', async () => {
  const chain = [await createGenesisBlock()];
  await assert.rejects(() => appendBlock(chain, { ...sampleEvent, appointmentId: ' ' }), /appointmentId es obligatorio/);
});
