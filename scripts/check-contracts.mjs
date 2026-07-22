import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import process from 'node:process';

const root = new URL('..', import.meta.url).pathname;
const contracts = ['cli-envelope', 'profile', 'os-instance', 'mission', 'capability', 'swarm-event'];
const failures = [];

async function json(path) {
  try { return JSON.parse(await readFile(path, 'utf8')); }
  catch (error) { failures.push(`${relative(root, path)}: ${error.message}`); return null; }
}

function requireKeys(value, keys, label) {
  for (const key of keys) if (!(key in value)) failures.push(`${label}: missing ${key}`);
}

function coreValid(contract, value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  switch (contract) {
    case 'cli-envelope':
      return typeof value.ok === 'boolean' && typeof value.schema === 'string' &&
        (value.ok ? 'data' in value && !('error' in value) : 'error' in value && !('data' in value));
    case 'profile':
      return value.schema_version === 'profile/v1' && value.governance?.human_in_the_loop === true &&
        value.routing?.human_escalation === true && ['lab', 'group'].includes(value.routing?.primary);
    case 'os-instance':
      return value.schema_version === 'os-instance/v1' && typeof value.slug === 'string' &&
        /^[a-z0-9][a-z0-9-]{1,62}$/.test(value.slug) && !('tier' in value);
    case 'mission':
      return value.schema_version === 'mission/v1' && ['H1', 'H2', 'H3', 'H4'].includes(value.hardness) &&
        Array.isArray(value.gates?.evidence) && value.gates.evidence.length > 0;
    case 'capability':
      return value.schema_version === 'capability/v1' &&
        ['local', 'remote', 'hybrid', 'degraded', 'disabled'].includes(value.mode);
    case 'swarm-event':
      return value.schema_version === 'swarm-event/v1' && Number.isInteger(value.sequence) && value.sequence >= 0 &&
        ['H1', 'H2', 'H3', 'H4'].includes(value.hardness);
    default: return false;
  }
}

for (const contract of contracts) {
  const schemaPath = join(root, 'schemas', contract, 'v1.schema.json');
  const schema = await json(schemaPath);
  if (schema) {
    requireKeys(schema, ['$schema', '$id', 'type', 'required', 'properties'], relative(root, schemaPath));
    if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') failures.push(`${contract}: wrong JSON Schema draft`);
    if (schema.$id !== `https://schemas.multiversa.dev/${contract}/v1`) failures.push(`${contract}: unexpected $id`);
  }

  for (const expectation of ['valid', 'invalid']) {
    const dir = join(root, 'fixtures', contract, expectation);
    let names = [];
    try { names = (await readdir(dir)).filter((name) => name.endsWith('.json')); }
    catch (error) { failures.push(`${relative(root, dir)}: ${error.message}`); }
    if (names.length === 0) failures.push(`${contract}: no ${expectation} fixtures`);
    for (const name of names) {
      const path = join(dir, name);
      const value = await json(path);
      if (!value) continue;
      const accepted = coreValid(contract, value);
      if (expectation === 'valid' && !accepted) failures.push(`${relative(root, path)}: rejected by core invariant check`);
      if (expectation === 'invalid' && accepted) failures.push(`${relative(root, path)}: invalid fixture was accepted`);
      const serialized = JSON.stringify(value).toLowerCase();
      if (/api[_-]?key|secret[_-]?value|password/.test(serialized)) failures.push(`${relative(root, path)}: possible secret field`);
    }
  }
}

if (failures.length) {
  console.error(`Contract checks failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Contract checks passed: ${contracts.length} schemas, valid/invalid fixtures present.`);
