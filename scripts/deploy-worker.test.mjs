import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

let deployment
try {
  deployment = await import('../scripts/deploy-worker.mts')
} catch {
  deployment = {}
}
const releaseEligibility =
  await import('../scripts/merged-release-eligibility.mjs')

const requireFunction = (name) =>
  assert.equal(
    typeof deployment[name],
    'function',
    `deployment helper must export ${name}`
  )
const temporaryDirectory = () =>
  mkdtempSync(
    path.join(process.env.TMPDIR ?? os.tmpdir(), 'kohsweb-deploy-test-')
  )
const configText = (main = '.open-next/worker.js') => `{
  // JSONC comments and trailing commas are accepted.
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ${JSON.stringify(main)},
  "name": "kohsweb-worker",
  "compatibility_date": "2025-04-02",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public",],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS", },
  "routes": [{ "pattern": "koh.dev", "custom_domain": true, }],
  "vars": { "ENV": "production", },
}`

function createBuildFixture(root) {
  const buildDir = path.join(root, '.open-next')
  mkdirSync(path.join(buildDir, 'assets'), { recursive: true })
  writeFileSync(
    path.join(buildDir, 'worker.js'),
    'export default { fetch() { return new Response("ok") } }\n'
  )
}

test('deploy scripts keep the Worker build inside the guarded release wrapper', () => {
  const packageJson = JSON.parse(
    readFileSync(new URL('../package.json', import.meta.url), 'utf8')
  )
  assert.equal(packageJson.scripts.predeploy, undefined)
  assert.equal(
    packageJson.scripts['build:worker'],
    'opennextjs-cloudflare build'
  )
  assert.equal(packageJson.scripts.deploy, undefined)
  assert.equal(
    packageJson.scripts['deploy:merged'],
    'node scripts/deploy-worker.mts --merged-release'
  )
  assert.equal(
    packageJson.scripts['deploy:dry-run'],
    'node scripts/deploy-worker.mts --dry-run'
  )
  assert.deepEqual(packageJson.allowScripts, {
    'esbuild@0.28.2': true,
    'workerd@1.20261118.1': true
  })
  const npmrc = readFileSync(new URL('../.npmrc', import.meta.url), 'utf8')
  assert.match(npmrc, /^min-release-age=7$/m)
  assert.match(npmrc, /^strict-allow-scripts=true$/m)
  assert.throws(
    () =>
      execFileSync(
        process.execPath,
        [
          new URL('../scripts/deploy-worker.mts', import.meta.url).pathname,
          '--release'
        ],
        { cwd: new URL('..', import.meta.url).pathname, stdio: 'ignore' }
      ),
    (error) => error.status !== 0
  )
})

test('GitHub Actions validates pull requests and uses the guarded merged-release flow', () => {
  const workflow = readFileSync(
    new URL('../.github/workflows/cd.yaml', import.meta.url),
    'utf8'
  )
  assert.match(workflow, /pull_request:/)
  assert.match(workflow, /push:/)
  assert.match(workflow, /group: kohsweb-cloudflare-production/)
  assert.match(workflow, /cancel-in-progress:\s*false/)
  assert.match(workflow, /persist-credentials:\s*false/)
  assert.match(workflow, /git switch --create "verify\/\$\{GITHUB_SHA\}"/)
  assert.match(workflow, /run: npm ci/)
  assert.match(
    workflow,
    /run: node scripts\/deploy-worker\.mts --merged-release/
  )
  assert.match(workflow, /Install locked npm with minimum-release-age support/)
  assert.match(workflow, /Prepare isolated locked npm toolchain/)
  assert.match(workflow, /test "\$\(npm --version\)" = '12\.2\.3'/)
  assert.match(
    workflow,
    /npm ci --prefix "\$RUNNER_TEMP\/kohsweb-npm-toolchain"/
  )
  assert.match(
    workflow,
    /npm audit --prefix "\$RUNNER_TEMP\/kohsweb-npm-toolchain" --audit-level=high/
  )
  assert.match(workflow, /npm config get min-release-age/)
  assert.match(workflow, /npm config get strict-allow-scripts/)
  assert.match(workflow, /Audit locked dependencies/)
  const deploySetup = workflow
    .split('  deploy:')[1]
    .split('      - name: Deploy through')[0]
  assert.doesNotMatch(deploySetup, /CLOUDFLARE_API_TOKEN|CLOUDFLARE_ACCOUNT_ID/)
  assert.match(workflow, /release-eligibility:/)
  assert.match(
    workflow,
    /needs\.release-eligibility\.outputs\.eligible == 'true'/
  )
  assert.match(
    workflow,
    /Resolve associated pull requests without deployment credentials/
  )
  const eligibilityJob = workflow
    .split('  release-eligibility:')[1]
    .split('\n  deploy:')[0]
  assert.doesNotMatch(
    eligibilityJob,
    /CLOUDFLARE_API_TOKEN|CLOUDFLARE_ACCOUNT_ID/
  )
  assert.match(
    workflow,
    /pull-requests: read # Read-only association lookup for authorized PR #9/
  )
  assert.match(workflow, /Publish sanitized release outcome/)
  assert.match(workflow, /KOH_RELEASE_SHA:\s*\$\{\{\s*github\.sha\s*\}\}/)
  assert.match(workflow, /GH_TOKEN:\s*\$\{\{\s*github\.token\s*\}\}/)
  assert.doesNotMatch(workflow, /cloudflare\/wrangler-action/)
})

test('About page keeps education and verified teaching details separate from employment', () => {
  const about = readFileSync(
    new URL('../app/(commonLayout)/_components/index.tsx', import.meta.url),
    'utf8'
  )
  const history = readFileSync(
    new URL(
      '../app/(commonLayout)/_components/History/index.tsx',
      import.meta.url
    ),
    'utf8'
  )
  const log = readFileSync(
    new URL('../app/(commonLayout)/log/_components/index.tsx', import.meta.url),
    'utf8'
  )
  const careerIndex = about.indexOf('id="career-history-heading">職務経歴</h3>')
  const educationIndex = about.indexOf('id="education-heading">学歴</h3>')
  const activityIndex = about.indexOf(
    'id="writing-teaching-heading">執筆・教育活動</h3>'
  )
  assert.ok(careerIndex >= 0 && careerIndex < educationIndex)
  assert.ok(educationIndex < activityIndex)
  assert.match(history, /export function Education\(\)/)
  assert.doesNotMatch(
    history.split('export function Education()')[0],
    /法政大学情報科学部|HAL東京夜間ゲーム学科/
  )
  assert.match(
    log,
    /Webサーバー開発に必要なNode\.js・JavaScriptの基礎を学び、演習で簡単なWebシステムを構築する講義/
  )
  assert.doesNotMatch(log, /スタートアップの立ち上げや新規事業の企画/)
})

test('strict JSONC parsing accepts comments but rejects duplicate keys', () => {
  requireFunction('parseStrictJsonc')
  const parsed = deployment.parseStrictJsonc(
    '{\n // comment\n "name": "kohsweb-worker",\n "flag": true,\n}'
  )
  assert.equal(parsed.name, 'kohsweb-worker')
  assert.throws(
    () => deployment.parseStrictJsonc('{"name":"one","name":"two"}'),
    /duplicate/i
  )
})

test('pull-request guard requires the exact open unmerged Draft PR and head', () => {
  requireFunction('parsePullRequest')
  const sha = 'a'.repeat(40)
  const pullRequest = {
    number: 9,
    draft: true,
    state: 'open',
    merged_at: null,
    base: { ref: 'main', repo: { full_name: 'koh110/kohsweb' } },
    head: {
      ref: 'fix/release-upload-record-validation',
      sha,
      repo: { full_name: 'koh110/kohsweb' }
    }
  }
  assert.equal(deployment.parsePullRequest(pullRequest, sha, 9).headSha, sha)
  assert.throws(
    () => deployment.parsePullRequest({ ...pullRequest, number: 8 }, sha, 9),
    /Draft|requested/i
  )
  assert.throws(
    () => deployment.parsePullRequest({ ...pullRequest, draft: false }, sha, 9),
    /Draft/i
  )
  assert.throws(
    () =>
      deployment.parsePullRequest(
        { ...pullRequest, head: { ...pullRequest.head, sha: 'b'.repeat(40) } },
        sha,
        9
      ),
    /Draft|release SHA/i
  )
  assert.throws(
    () =>
      deployment.parsePullRequest(
        { ...pullRequest, base: { ...pullRequest.base, ref: 'develop' } },
        sha,
        9
      ),
    /requested Draft/i
  )
})

test('merged release guard derives one exact same-repository main PR from the release SHA', () => {
  requireFunction('parseMergedPullRequest')
  const releaseSha = 'b'.repeat(40)
  const pullRequest = {
    number: 9,
    draft: false,
    state: 'closed',
    merged_at: '2026-11-28T00:00:00Z',
    merge_commit_sha: releaseSha,
    base: { ref: 'main', repo: { full_name: 'koh110/kohsweb' } },
    head: {
      ref: 'fix/release-upload-record-validation',
      sha: 'a'.repeat(40),
      repo: { full_name: 'koh110/kohsweb' }
    }
  }
  assert.deepEqual(
    deployment.parseMergedPullRequest([pullRequest], releaseSha),
    {
      number: 9,
      headRef: 'fix/release-upload-record-validation',
      headSha: 'a'.repeat(40),
      baseRef: 'main',
      mergeCommitSha: releaseSha
    }
  )
  assert.throws(
    () => deployment.parseMergedPullRequest([], releaseSha),
    /PR #9/i
  )
  assert.throws(
    () =>
      deployment.parseMergedPullRequest(
        [{ ...pullRequest, merged_at: null }],
        releaseSha
      ),
    /PR #9/i
  )
  assert.throws(
    () =>
      deployment.parseMergedPullRequest(
        [
          {
            ...pullRequest,
            base: { ref: 'other', repo: { full_name: 'koh110/kohsweb' } }
          }
        ],
        releaseSha
      ),
    /PR #9/i
  )
  assert.throws(
    () =>
      deployment.parseMergedPullRequest(
        [
          {
            ...pullRequest,
            head: {
              ...pullRequest.head,
              repo: { full_name: 'attacker/fork' }
            }
          }
        ],
        releaseSha
      ),
    /PR #9/i
  )
  assert.equal(
    deployment.parseMergedPullRequest(
      [pullRequest, { ...pullRequest, number: 8 }],
      releaseSha
    ).number,
    9
  )
  assert.throws(
    () =>
      deployment.parseMergedPullRequest(
        [{ ...pullRequest, number: 8 }],
        releaseSha
      ),
    /PR #9/i
  )
})

test('pre-deploy eligibility safely skips every commit except the exact merged PR #9', () => {
  const releaseSha = 'd'.repeat(40)
  const pullRequest = {
    number: 9,
    state: 'closed',
    merged_at: '2026-11-28T00:00:00Z',
    merge_commit_sha: releaseSha,
    base: { ref: 'main', repo: { full_name: 'koh110/kohsweb' } },
    head: { repo: { full_name: 'koh110/kohsweb' } }
  }
  assert.equal(
    releaseEligibility.isEligibleMergedReleasePullRequest(
      [[pullRequest]],
      releaseSha
    ),
    true
  )
  for (const outOfScope of [
    [],
    [{ ...pullRequest, number: 8 }],
    [{ ...pullRequest, merge_commit_sha: 'e'.repeat(40) }],
    [{ ...pullRequest, base: { ...pullRequest.base, ref: 'develop' } }],
    [{ ...pullRequest, head: { repo: { full_name: 'fork/kohsweb' } } }],
    [{ ...pullRequest, merged_at: null }]
  ]) {
    assert.equal(
      releaseEligibility.isEligibleMergedReleasePullRequest(
        outOfScope,
        releaseSha
      ),
      false
    )
  }
  assert.throws(
    () => releaseEligibility.isEligibleMergedReleasePullRequest({}, releaseSha),
    /array/i
  )
  assert.throws(
    () =>
      releaseEligibility.isEligibleMergedReleasePullRequest(
        [pullRequest, pullRequest],
        releaseSha
      ),
    /more than one/i
  )
})

test('eligibility CLI emits one workflow boolean and skips a direct main push', () => {
  const directory = temporaryDirectory()
  const scriptPath = new URL(
    '../scripts/merged-release-eligibility.mjs',
    import.meta.url
  ).pathname
  const releaseSha = 'f'.repeat(40)
  const pullRequest = {
    number: 9,
    state: 'closed',
    merged_at: '2026-11-28T00:00:00Z',
    merge_commit_sha: releaseSha,
    base: { ref: 'main', repo: { full_name: 'koh110/kohsweb' } },
    head: { repo: { full_name: 'koh110/kohsweb' } }
  }
  try {
    const eligiblePath = path.join(directory, 'eligible.json')
    writeFileSync(eligiblePath, JSON.stringify([[pullRequest]]))
    const env = {
      ...process.env,
      GITHUB_SHA: releaseSha,
      GITHUB_REPOSITORY: 'koh110/kohsweb'
    }
    assert.equal(
      execFileSync(process.execPath, [scriptPath, eligiblePath], {
        env,
        encoding: 'utf8'
      }).trim(),
      'true'
    )
    const directPushPath = path.join(directory, 'direct-push.json')
    writeFileSync(directPushPath, JSON.stringify([[]]))
    assert.equal(
      execFileSync(process.execPath, [scriptPath, directPushPath], {
        env,
        encoding: 'utf8'
      }).trim(),
      'false'
    )
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test('merged release guard requires the exact GitHub Actions main push event', () => {
  requireFunction('validateMergedReleaseEvent')
  const releaseSha = 'c'.repeat(40)
  const environment = {
    GITHUB_ACTIONS: 'true',
    CI: 'true',
    GITHUB_EVENT_NAME: 'push',
    GITHUB_REF: 'refs/heads/main',
    GITHUB_SHA: releaseSha,
    GITHUB_REPOSITORY: 'koh110/kohsweb'
  }
  assert.doesNotThrow(() =>
    deployment.validateMergedReleaseEvent(releaseSha, environment)
  )
  for (const [key, value] of [
    ['GITHUB_ACTIONS', 'false'],
    ['CI', 'false'],
    ['GITHUB_EVENT_NAME', 'workflow_dispatch'],
    ['GITHUB_REF', 'refs/heads/feature'],
    ['GITHUB_SHA', 'd'.repeat(40)],
    ['GITHUB_REPOSITORY', 'other/repo']
  ]) {
    assert.throws(
      () =>
        deployment.validateMergedReleaseEvent(releaseSha, {
          ...environment,
          [key]: value
        }),
      /GitHub Actions push of the exact main SHA/i
    )
  }
})

test('release account must match the independently read-back target', () => {
  requireFunction('validateReleaseAccountId')
  const accountId = 'a'.repeat(32)
  assert.equal(
    deployment.validateReleaseAccountId(accountId, accountId),
    accountId
  )
  assert.throws(
    () => deployment.validateReleaseAccountId(accountId, 'b'.repeat(32)),
    /independently read-back expected account/i
  )
  assert.throws(
    () => deployment.validateReleaseAccountId(accountId, 'invalid'),
    /valid 32-character/i
  )
})

test('release wrapper pins the authorized PR number to #9', () => {
  requireFunction('parseReleasePullRequestNumber')
  assert.equal(deployment.parseReleasePullRequestNumber(undefined), 9)
  assert.equal(deployment.parseReleasePullRequestNumber('9'), 9)
  assert.throws(
    () => deployment.parseReleasePullRequestNumber('8'),
    /pinned to pull request #9/i
  )
  assert.throws(
    () => deployment.parseReleasePullRequestNumber('07'),
    /pinned to pull request #9/i
  )
})

test('live Worker exposure is read from Cloudflare and mismatches fail closed', async () => {
  requireFunction('parseWorkerSubdomainResponse')
  requireFunction('readWorkerSubdomainState')
  const body = {
    success: true,
    result: { enabled: false, previews_enabled: false }
  }
  assert.deepEqual(deployment.parseWorkerSubdomainResponse(body, false), {
    workersDev: false,
    previewsEnabled: false
  })
  assert.throws(
    () => deployment.parseWorkerSubdomainResponse(body, true),
    /does not match/i
  )
  assert.throws(
    () =>
      deployment.parseWorkerSubdomainResponse(
        { success: true, result: { enabled: false, previews_enabled: true } },
        false
      ),
    /preview URLs to be disabled/i
  )
  assert.throws(
    () =>
      deployment.parseWorkerSubdomainResponse(
        { success: true, result: { enabled: false } },
        false
      ),
    /preview setting is missing/i
  )

  const accountId = 'a'.repeat(32)
  let requestedUrl
  let requestOptions
  const exposure = await deployment.readWorkerSubdomainState({
    accountId,
    workerName: 'kohsweb-worker',
    apiToken: 'fake-token',
    expectedWorkersDev: false,
    timeoutMs: 1000,
    abortSignal: new AbortController().signal,
    fetchImpl: async (url, options) => {
      requestedUrl = String(url)
      requestOptions = options
      return { ok: true, status: 200, json: async () => body }
    }
  })
  assert.equal(
    requestedUrl,
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/kohsweb-worker/subdomain`
  )
  assert.equal(requestOptions.headers.Authorization, 'Bearer fake-token')
  assert.deepEqual(exposure, { workersDev: false, previewsEnabled: false })
  await assert.rejects(
    deployment.readWorkerSubdomainState({
      accountId,
      workerName: 'kohsweb-worker',
      apiToken: 'fake-token',
      expectedWorkersDev: true,
      timeoutMs: 1000,
      abortSignal: new AbortController().signal,
      fetchImpl: async () => ({ ok: true, status: 200, json: async () => body })
    }),
    /does not match/i
  )
})

test('production routing read-back binds koh.dev to the expected Worker and zone', async () => {
  requireFunction('parseWorkerRoutingState')
  requireFunction('readWorkerRoutingState')
  const accountId = 'a'.repeat(32)
  const zoneId = 'c'.repeat(32)
  const zoneResponse = {
    success: true,
    result: [{ id: zoneId, name: 'koh.dev', account: { id: accountId } }]
  }
  const routesResponse = { success: true, result: [] }
  const domainsResponse = {
    success: true,
    result: [
      {
        hostname: 'koh.dev',
        service: 'kohsweb-worker',
        zone_id: zoneId,
        zone_name: 'koh.dev'
      }
    ]
  }
  const input = {
    zoneResponse,
    routesResponse,
    domainsResponse,
    accountId,
    workerName: 'kohsweb-worker',
    hostname: 'koh.dev'
  }
  assert.deepEqual(deployment.parseWorkerRoutingState(input), {
    hostname: 'koh.dev',
    worker: 'kohsweb-worker',
    zoneId,
    routeCount: 0
  })
  assert.throws(
    () =>
      deployment.parseWorkerRoutingState({
        ...input,
        zoneResponse: {
          ...zoneResponse,
          result: [
            { ...zoneResponse.result[0], account: { id: 'b'.repeat(32) } }
          ]
        }
      }),
    /does not own the expected production zone/i
  )
  assert.throws(
    () =>
      deployment.parseWorkerRoutingState({
        ...input,
        routesResponse: {
          success: true,
          result: [{ pattern: 'koh.dev/*', script: 'other-worker' }]
        }
      }),
    /unexpected Worker routes/i
  )
  assert.throws(
    () =>
      deployment.parseWorkerRoutingState({
        ...input,
        domainsResponse: {
          success: true,
          result: [{ ...domainsResponse.result[0], service: 'other-worker' }]
        }
      }),
    /not mapped to the expected Worker/i
  )

  const calls = []
  const responses = [zoneResponse, routesResponse, domainsResponse]
  const state = await deployment.readWorkerRoutingState({
    accountId,
    workerName: 'kohsweb-worker',
    hostname: 'koh.dev',
    apiToken: 'fake-token',
    timeoutMs: 1000,
    abortSignal: new AbortController().signal,
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options })
      const body = responses[calls.length - 1]
      return { ok: true, status: 200, json: async () => body }
    }
  })
  assert.deepEqual(state, {
    hostname: 'koh.dev',
    worker: 'kohsweb-worker',
    zoneId,
    routeCount: 0
  })
  assert.equal(calls.length, 3)
  assert.equal(new URL(calls[0].url).searchParams.get('account.id'), accountId)
  assert.equal(calls[1].url.endsWith(`/zones/${zoneId}/workers/routes`), true)
  assert.equal(
    calls[2].url.endsWith(
      `/accounts/${accountId}/workers/domains?hostname=koh.dev`
    ),
    true
  )
  for (const call of calls)
    assert.equal(call.options.headers.Authorization, 'Bearer fake-token')
})

test('Worker build environment excludes deployment and GitHub credentials', () => {
  requireFunction('createWorkerBuildEnvironment')
  const root = temporaryDirectory()
  try {
    const env = deployment.createWorkerBuildEnvironment({
      evidencePath: root,
      sourceEnv: {
        PATH: '/usr/bin',
        LANG: 'C.UTF-8',
        CLOUDFLARE_API_TOKEN: 'token-should-not-propagate',
        GH_TOKEN: 'github-token-should-not-propagate',
        KOH_RELEASE_PR: '9'
      }
    })
    assert.equal(env.PATH, '/usr/bin')
    assert.equal(env.CLOUDFLARE_API_TOKEN, undefined)
    assert.equal(env.GH_TOKEN, undefined)
    assert.equal(env.KOH_RELEASE_PR, undefined)
    assert.equal(env.NODE_ENV, 'production')
    assert.equal(env.NEXT_TELEMETRY_DISABLED, '1')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('version upload parser accepts only pinned Wrangler records with exact Worker identity', () => {
  requireFunction('parseVersionUploadOutput')
  const timestamp = '2026-11-27T00:00:00.000Z'
  const session = {
    type: 'wrangler-session',
    version: 1,
    wrangler_version: '4.165.0',
    command_line_args: [],
    log_file_path: '/private/log',
    timestamp
  }
  const upload = {
    type: 'version-upload',
    version: 1,
    worker_name: 'kohsweb-worker',
    worker_tag: null,
    version_id: 'v-123',
    preview_url: null,
    preview_alias_url: null,
    wrangler_environment: null,
    worker_name_overridden: false,
    bundle_size: { raw_bytes: 100, gzip_bytes: 50 },
    timestamp
  }
  const output = `${JSON.stringify(session)}\n${JSON.stringify(upload)}\n`
  assert.equal(
    deployment.parseVersionUploadOutput(output, {
      workerName: 'kohsweb-worker',
      dryRun: false
    }).versionId,
    'v-123'
  )
  const optionalFieldsOmitted = { ...upload }
  delete optionalFieldsOmitted.preview_url
  delete optionalFieldsOmitted.preview_alias_url
  delete optionalFieldsOmitted.wrangler_environment
  assert.equal(
    deployment.parseVersionUploadOutput(
      `${JSON.stringify(session)}\n${JSON.stringify(optionalFieldsOmitted)}`,
      { workerName: 'kohsweb-worker', dryRun: false }
    ).versionId,
    'v-123'
  )
  const overriddenButExact = { ...upload, worker_name_overridden: true }
  const overriddenOutput = [
    JSON.stringify(session),
    JSON.stringify(overriddenButExact)
  ].join(String.fromCharCode(10))
  assert.throws(
    () =>
      deployment.parseVersionUploadOutput(overriddenOutput, {
        workerName: 'kohsweb-worker',
        dryRun: false
      }),
    /worker_name_overridden/
  )
  const workerTagOmitted = { ...upload }
  delete workerTagOmitted.worker_tag
  const omittedTagOutput = [
    JSON.stringify(session),
    JSON.stringify(workerTagOmitted)
  ].join(String.fromCharCode(10))
  assert.equal(
    deployment.parseVersionUploadOutput(omittedTagOutput, {
      workerName: 'kohsweb-worker',
      dryRun: false
    }).versionId,
    'v-123'
  )
  assert.throws(
    () =>
      deployment.parseVersionUploadOutput(
        `${JSON.stringify(session)}\n${JSON.stringify({ ...upload, worker_name: 'other-worker' })}`,
        { workerName: 'kohsweb-worker', dryRun: false }
      ),
    (error) => {
      assert.match(error.message, /worker_name/)
      assert.doesNotMatch(error.message, /other-worker/)
      return true
    }
  )
  for (const field of ['preview_url', 'preview_alias_url']) {
    assert.throws(
      () =>
        deployment.parseVersionUploadOutput(
          `${JSON.stringify(session)}\n${JSON.stringify({ ...upload, [field]: 'https://preview.invalid' })}`,
          { workerName: 'kohsweb-worker', dryRun: false }
        ),
      /invalid version-upload/i
    )
  }
  assert.equal(
    deployment.parseVersionUploadOutput(
      `${JSON.stringify(session)}\n${JSON.stringify({ ...upload, version_id: null })}`,
      { workerName: 'kohsweb-worker', dryRun: true }
    ).versionId,
    null
  )
  assert.throws(
    () =>
      deployment.parseVersionUploadOutput(
        `${output}${JSON.stringify({ type: 'future-event', version: 1 })}`,
        { workerName: 'kohsweb-worker', dryRun: false }
      ),
    /unknown|record/i
  )
  assert.throws(
    () =>
      deployment.parseVersionUploadOutput(
        `${output}${JSON.stringify(upload)}`,
        { workerName: 'kohsweb-worker', dryRun: false }
      ),
    /exactly one|duplicate/i
  )
  assert.throws(
    () =>
      deployment.parseVersionUploadOutput(output, {
        workerName: 'other-worker',
        dryRun: false
      }),
    /worker/i
  )
})

test('version upload parser identifies invalid fields without including their values', () => {
  const timestamp = '2026-11-27T00:00:00.000Z'
  const session = {
    type: 'wrangler-session',
    version: 1,
    wrangler_version: '4.165.0',
    command_line_args: [],
    timestamp
  }
  const upload = {
    type: 'version-upload',
    version: 1,
    worker_name: 'other-worker',
    worker_tag: null,
    version_id: 'v-123',
    preview_url: null,
    preview_alias_url: null,
    wrangler_environment: null,
    worker_name_overridden: false,
    timestamp
  }
  const output = [JSON.stringify(session), JSON.stringify(upload)].join(
    String.fromCharCode(10)
  )
  assert.throws(
    () =>
      deployment.parseVersionUploadOutput(output, {
        workerName: 'kohsweb-worker',
        dryRun: false
      }),
    (error) => {
      assert.match(error.message, /worker_name/)
      assert.doesNotMatch(error.message, /other-worker/)
      return true
    }
  )
})

test('version read-back verifies full-SHA annotation and returns binding names only', () => {
  requireFunction('parseVersionViewOutput')
  const message = `kohsweb-worker release ${'a'.repeat(40)}`
  const version = {
    id: 'v-123',
    metadata: { created_on: '2026-11-27T00:00:00.000Z' },
    annotations: { 'workers/message': message },
    resources: {
      bindings: [
        { name: 'ASSETS', type: 'assets' },
        { name: 'TOKEN', type: 'secret_text', value: 'never return this' }
      ]
    }
  }
  const summary = deployment.parseVersionViewOutput(JSON.stringify(version), {
    versionId: 'v-123',
    message
  })
  assert.deepEqual(summary.bindings, [
    { name: 'ASSETS', type: 'assets' },
    { name: 'TOKEN', type: 'secret_text' }
  ])
  assert.throws(
    () =>
      deployment.parseVersionViewOutput(JSON.stringify(version), {
        versionId: 'v-123',
        message: 'wrong'
      }),
    /annotation|message/i
  )
  assert.throws(
    () =>
      deployment.parseVersionViewOutput(
        JSON.stringify({
          ...version,
          resources: {
            bindings: [
              { name: 'TOKEN', type: 'secret_text' },
              { name: 'TOKEN', type: 'secret_text' }
            ]
          }
        }),
        { versionId: 'v-123', message }
      ),
    /duplicate|binding/i
  )
})

test('deployment status read-back requires the exact version at 100 percent', () => {
  requireFunction('parseDeploymentStatusOutput')
  const message = `kohsweb-worker release ${'a'.repeat(40)}`
  const status = {
    id: 'd-123',
    created_on: '2026-11-27T00:00:00.000Z',
    annotations: { 'workers/message': message },
    versions: [{ version_id: 'v-123', percentage: 100 }]
  }
  assert.equal(
    deployment.parseDeploymentStatusOutput(JSON.stringify(status), {
      versionId: 'v-123',
      message
    }).id,
    'd-123'
  )
  assert.throws(
    () =>
      deployment.parseDeploymentStatusOutput(
        JSON.stringify({
          ...status,
          versions: [{ version_id: 'v-123', percentage: 50 }]
        }),
        { versionId: 'v-123', message }
      ),
    /100|active|version/i
  )
  assert.throws(
    () =>
      deployment.parseDeploymentStatusOutput(
        JSON.stringify({ ...status, annotations: {} }),
        { versionId: 'v-123', message }
      ),
    /annotation|message/i
  )
})

test('public production smoke requires the exact HTTPS About marker and response type', () => {
  requireFunction('parseProductionCareerPageResponse')
  const response = {
    status: 200,
    contentType: 'text/html; charset=utf-8',
    finalUrl: 'https://koh.dev/?koh-release-check=abc',
    redirected: false,
    body: '<main><h3>職務経歴</h3></main>'
  }
  assert.deepEqual(deployment.parseProductionCareerPageResponse(response), {
    hostname: 'koh.dev',
    status: 200,
    bodyBytes: Buffer.byteLength(response.body),
    marker: '職務経歴'
  })
  for (const invalid of [
    { ...response, status: 503 },
    { ...response, contentType: 'application/json' },
    { ...response, finalUrl: 'https://other.example/' },
    { ...response, redirected: true },
    { ...response, body: '<main>old release</main>' }
  ]) {
    assert.throws(
      () => deployment.parseProductionCareerPageResponse(invalid),
      /HTTP smoke|About-page/i
    )
  }
})

test('failed-promotion recovery only marks the candidate for manual rollback when it owns traffic', () => {
  requireFunction('classifyPromotionRecovery')
  const status = (versionId) => ({
    id: 'deployment-1',
    message: null,
    createdOn: '2026-11-28T00:00:00.000Z',
    versions: [{ versionId, percentage: 100 }]
  })
  assert.deepEqual(
    deployment.classifyPromotionRecovery(
      status('previous-v'),
      'previous-v',
      'candidate-v'
    ),
    {
      outcome: 'previous-version-still-active',
      activeVersionId: 'previous-v'
    }
  )
  assert.deepEqual(
    deployment.classifyPromotionRecovery(
      status('candidate-v'),
      'previous-v',
      'candidate-v'
    ),
    {
      outcome: 'candidate-active-manual-rollback-required',
      activeVersionId: 'candidate-v'
    }
  )
  assert.deepEqual(
    deployment.classifyPromotionRecovery(
      status('other-v'),
      'previous-v',
      'candidate-v'
    ),
    {
      outcome: 'unexpected-version-active-manual-review',
      activeVersionId: 'other-v'
    }
  )
})

test('bounded subprocess runner captures output and kills timed-out or overflowing process groups', async () => {
  requireFunction('runBoundedProcess')
  const evidence = temporaryDirectory()
  const env = { PATH: process.env.PATH, HOME: evidence, NODE_ENV: 'test' }
  const run = (label, code, timeoutMs = 10_000) =>
    deployment.runBoundedProcess({
      command: process.execPath,
      args: ['-e', code],
      cwd: process.cwd(),
      env,
      evidencePath: evidence,
      label,
      timeoutMs,
      abortSignal: new AbortController().signal
    })
  try {
    const success = await run('success', 'process.stdout.write("ok")')
    assert.equal(success.code, 0)
    assert.equal(success.stdout, 'ok')
    await assert.rejects(
      run('timeout', 'setInterval(() => {}, 1000)', 50),
      /timed out/
    )
    const timeoutEvidence = JSON.parse(
      readFileSync(path.join(evidence, 'timeout-result.json'), 'utf8')
    )
    assert.equal(timeoutEvidence.outcome, 'timeout')
    await assert.rejects(
      run(
        'overflow',
        'process.stdout.write(Buffer.alloc(8 * 1024 * 1024 + 1))'
      ),
      /output limit/
    )
    const overflowEvidence = JSON.parse(
      readFileSync(path.join(evidence, 'overflow-result.json'), 'utf8')
    )
    assert.equal(overflowEvidence.stdout_truncated, true)
  } finally {
    rmSync(evidence, { recursive: true, force: true })
  }
})

test('route-free config can be prepared before build artifacts exist', () => {
  requireFunction('buildRouteFreeConfig')
  const root = temporaryDirectory()
  try {
    const config = deployment.buildRouteFreeConfig({
      sourceText: configText(),
      repoRoot: root,
      accountId: 'a'.repeat(32),
      workersDev: false,
      validateArtifacts: false
    })
    assert.equal(config.main, path.join(root, '.open-next', 'worker.js'))
    assert.equal(
      config.assets.directory,
      path.join(root, '.open-next', 'assets')
    )
    createBuildFixture(root)
    const validated = deployment.buildRouteFreeConfig({
      sourceText: configText(),
      repoRoot: root,
      accountId: 'a'.repeat(32),
      workersDev: false
    })
    assert.equal(validated.main, config.main)
    assert.equal(validated.assets.directory, config.assets.directory)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('route-free config preserves Worker settings and injects explicit target identity', () => {
  requireFunction('buildRouteFreeConfig')
  const root = temporaryDirectory()
  try {
    createBuildFixture(root)
    const config = deployment.buildRouteFreeConfig({
      sourceText: configText(),
      repoRoot: root,
      accountId: 'a'.repeat(32),
      workersDev: false
    })
    assert.equal(config.name, 'kohsweb-worker')
    assert.equal(config.account_id, 'a'.repeat(32))
    assert.equal(config.workers_dev, false)
    assert.equal(config.preview_urls, false)
    assert.equal(config.vars.ENV, 'production')
    assert.equal(config.assets.binding, 'ASSETS')
    assert.equal(config.main, path.join(root, '.open-next', 'worker.js'))
    assert.equal(
      config.assets.directory,
      path.join(root, '.open-next', 'assets')
    )
    assert.equal(Object.hasOwn(config, 'routes'), false)
    assert.equal(Object.hasOwn(config, 'route'), false)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('route-free config rejects nested routing keys and missing explicit target settings', () => {
  requireFunction('buildRouteFreeConfig')
  const root = temporaryDirectory()
  try {
    createBuildFixture(root)
    const nested = configText().replace(
      '"vars":',
      '"env": { "production": { "routes": [] } },\n  "vars":'
    )
    assert.throws(
      () =>
        deployment.buildRouteFreeConfig({
          sourceText: nested,
          repoRoot: root,
          accountId: 'a'.repeat(32),
          workersDev: false
        }),
      /route/i
    )
    assert.throws(
      () =>
        deployment.buildRouteFreeConfig({
          sourceText: configText(),
          repoRoot: root,
          accountId: 'a'.repeat(32)
        }),
      /workersDev/i
    )
    assert.throws(
      () =>
        deployment.buildRouteFreeConfig({
          sourceText: configText(),
          repoRoot: root,
          workersDev: false
        }),
      /accountId/i
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('route-free config rejects account drift and escaping symlinks', () => {
  requireFunction('buildRouteFreeConfig')
  const root = temporaryDirectory()
  const outside = temporaryDirectory()
  try {
    createBuildFixture(root)
    const configuredAccount = configText().replace(
      '"name": "kohsweb-worker",',
      `"account_id": "${'b'.repeat(32)}",\n  "name": "kohsweb-worker",`
    )
    assert.throws(
      () =>
        deployment.buildRouteFreeConfig({
          sourceText: configuredAccount,
          repoRoot: root,
          accountId: 'a'.repeat(32),
          workersDev: false
        }),
      /account/i
    )
    writeFileSync(path.join(outside, 'worker.js'), 'outside')
    symlinkSync(
      path.join(outside, 'worker.js'),
      path.join(root, '.open-next', 'escaped.js')
    )
    assert.throws(
      () =>
        deployment.buildRouteFreeConfig({
          sourceText: configText('.open-next/escaped.js'),
          repoRoot: root,
          accountId: 'a'.repeat(32),
          workersDev: false
        }),
      /symlink|escape|regular/i
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
    rmSync(outside, { recursive: true, force: true })
  }
})

test('release tree verifier requires a clean exact commit and normal index flags', () => {
  requireFunction('verifyCleanReleaseTree')
  const root = temporaryDirectory()
  try {
    execFileSync('git', ['init', '--quiet', root])
    execFileSync('git', ['-C', root, 'config', 'user.email', 'test-user'])
    execFileSync('git', ['-C', root, 'config', 'user.name', 'Test'])
    writeFileSync(path.join(root, 'tracked.txt'), 'stable\n')
    execFileSync('git', ['-C', root, 'add', 'tracked.txt'])
    execFileSync('git', ['-C', root, 'commit', '--quiet', '-m', 'fixture'])
    execFileSync('git', [
      '-C',
      root,
      'switch',
      '--quiet',
      '--create',
      'verify/test'
    ])
    const sha = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], {
      encoding: 'utf8'
    }).trim()
    assert.equal(
      deployment.verifyCleanReleaseTree({ repoRoot: root, expectedSha: sha }),
      sha
    )
    assert.throws(
      () =>
        deployment.verifyCleanReleaseTree({
          repoRoot: root,
          expectedSha: '0'.repeat(40)
        }),
      /sha/i
    )
    writeFileSync(path.join(root, 'tracked.txt'), 'changed\n')
    assert.throws(
      () =>
        deployment.verifyCleanReleaseTree({ repoRoot: root, expectedSha: sha }),
      /dirty|changed/i
    )
    writeFileSync(path.join(root, 'tracked.txt'), 'stable\n')
    execFileSync('git', [
      '-C',
      root,
      'update-index',
      '--assume-unchanged',
      'tracked.txt'
    ])
    assert.throws(
      () =>
        deployment.verifyCleanReleaseTree({ repoRoot: root, expectedSha: sha }),
      /assume|skip|flag/i
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
