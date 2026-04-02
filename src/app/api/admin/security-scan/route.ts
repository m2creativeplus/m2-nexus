import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const NEXUS_DIR = '/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/m2-nexus';

async function run(cmd: string): Promise<string> {
  try {
    const { stdout } = await execAsync(cmd, { timeout: 10000 });
    return stdout.trim();
  } catch (e: unknown) {
    // grep returns exit code 1 when no matches — that's fine
    if (e && typeof e === 'object' && 'stdout' in e) return (e as { stdout: string }).stdout?.trim() ?? '';
    return '';
  }
}

interface Finding {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  file: string;
  line: string;
  match: string;
  description: string;
}

function parseGrepOutput(raw: string, severity: Finding['severity'], category: string, description: string): Finding[] {
  return raw.split('\n').filter(Boolean).map(line => {
    const colonIdx = line.indexOf(':');
    const file = line.slice(0, colonIdx).replace(NEXUS_DIR + '/src/', '');
    const rest = line.slice(colonIdx + 1);
    const lineNumMatch = rest.match(/^(\d+):(.*)/);
    return {
      severity,
      category,
      file,
      line: lineNumMatch?.[1] ?? '?',
      match: (lineNumMatch?.[2] ?? rest).trim().slice(0, 120),
      description,
    };
  });
}

export async function GET() {
  const src = `"${NEXUS_DIR}/src"`;
  const grepBase = `grep -rn --include="*.ts" --include="*.tsx" --include="*.js"`;

  const [
    hardcodedPasswords,
    hardcodedApiKeys,
    dangerousEval,
    innerHtml,
    consoleLogs,
    anyTypes,
    tsIgnore,
    noAuth,
    corsWildcard,
    envAccess,
    npmAuditRaw,
    gitSecrets,
  ] = await Promise.all([
    run(`${grepBase} -E '"sovereign"|"admin"|"m2nexus"|"password123"|"secret123"' ${src}`),
    run(`${grepBase} -E 'sk-(proj|test|live)-[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{35}' ${src}`),
    run(`${grepBase} -E '\\beval\\(' ${src}`),
    run(`${grepBase} -E 'dangerouslySetInnerHTML|innerHTML\\s*=' ${src}`),
    run(`${grepBase} -E 'console\\.(log|warn|error)\\(' ${src} | grep -v node_modules`),
    run(`${grepBase} -E ':\\s*any\\b' ${src}`),
    run(`${grepBase} -E '@ts-ignore|@ts-nocheck' ${src}`),
    run(`${grepBase} -E 'export async function (GET|POST|PUT|DELETE|PATCH)' ${src}/app/api --include="*.ts" -l`),
    run(`${grepBase} -E "'Access-Control-Allow-Origin':\\s*[\"']\*[\"']" ${src}`),
    run(`${grepBase} -E 'process\\.env\\.' ${src}`),
    run(`cd "${NEXUS_DIR}" && npm audit --json 2>/dev/null | node -e "
      const d=[];let j='';process.stdin.on('data',c=>j+=c);process.stdin.on('end',()=>{
        try{const a=JSON.parse(j);Object.values(a.vulnerabilities||{}).forEach(v=>{
          d.push(v.name+'|'+v.severity+'|'+(v.via?.[0]?.title||'')+'|'+(v.via?.[0]?.url||''));
        });console.log(d.join('\\n'));}catch{}
      });" 2>/dev/null || echo ""`),
    run(`cd "${NEXUS_DIR}" && git log --all --oneline --diff-filter=A -- '*.env*' 2>/dev/null`),
  ]);

  const findings: Finding[] = [
    ...parseGrepOutput(hardcodedPasswords, 'CRITICAL', 'Hardcoded Credentials',
      'Plaintext password comparison in source code'),
    ...parseGrepOutput(hardcodedApiKeys, 'CRITICAL', 'Exposed API Key',
      'API key pattern detected in source code'),
    ...parseGrepOutput(dangerousEval, 'HIGH', 'Code Injection',
      'eval() usage allows arbitrary code execution'),
    ...parseGrepOutput(innerHtml, 'HIGH', 'XSS Risk',
      'Direct HTML injection without sanitization'),
    ...parseGrepOutput(corsWildcard, 'HIGH', 'CORS Misconfiguration',
      'Wildcard CORS allows any origin to access this endpoint'),
    ...parseGrepOutput(anyTypes, 'MEDIUM', 'Type Safety',
      'TypeScript any type bypasses type checking'),
    ...parseGrepOutput(tsIgnore, 'MEDIUM', 'Type Safety',
      '@ts-ignore suppresses type errors silently'),
    ...parseGrepOutput(consoleLogs, 'LOW', 'Log Hygiene',
      'console statements may leak sensitive data in production'),
  ];

  // Parse npm audit vulnerabilities
  const npmVulns = npmAuditRaw.split('\n').filter(Boolean).map(line => {
    const [name, severity, title, url] = line.split('|');
    return { name, severity, title, url };
  });

  // Check which API routes lack auth
  const routeFiles = noAuth.split('\n').filter(Boolean);
  const authCheckedRoutes = await run(
    `${grepBase} -l "auth\\(\\)|getAuth\\|currentUser\\|clerkClient" ${src}/app/api --include="*.ts"`
  );
  const authChecked = new Set(authCheckedRoutes.split('\n').filter(Boolean).map(f => f.trim()));
  const unprotectedRoutes = routeFiles.filter(f => !authChecked.has(f)).map(f =>
    f.replace(NEXUS_DIR + '/src/', '')
  );

  // Env var audit
  const envUsages = envAccess.split('\n').filter(Boolean).map(line => {
    const match = line.match(/process\.env\.([A-Z_]+)/);
    return match?.[1];
  }).filter(Boolean);
  const uniqueEnvVars = [...new Set(envUsages)];

  // Score
  const critical = findings.filter(f => f.severity === 'CRITICAL').length;
  const high = findings.filter(f => f.severity === 'HIGH').length;
  const medium = findings.filter(f => f.severity === 'MEDIUM').length;
  const low = findings.filter(f => f.severity === 'LOW').length;
  const score = Math.max(0, 100 - (critical * 25) - (high * 10) - (medium * 3) - (low * 1));

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    score,
    riskLevel: score < 40 ? 'CRITICAL' : score < 60 ? 'HIGH' : score < 80 ? 'MEDIUM' : 'LOW',
    summary: { critical, high, medium, low, total: findings.length },
    findings,
    unprotectedRoutes,
    npmVulnerabilities: npmVulns,
    envVarsUsed: uniqueEnvVars,
    gitEnvHistory: gitSecrets.split('\n').filter(Boolean),
  });
}
