#!/usr/bin/env node
import { execFileSync, spawn } from 'node:child_process'
import {
  chmodSync,
  closeSync,
  constants as fsConstants,
  fstatSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync
} from 'node:fs'
import { createHash } from 'node:crypto'
import { getNodeValue, parseTree, printParseErrorCode } from 'jsonc-parser'
import type { Node as JsonNode, ParseError } from 'jsonc-parser'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import { isEligibleMergedReleasePullRequest } from './merged-release-eligibility.mjs'

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function environmentForLocalGit(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    LANG: process.env.LANG,
    LC_ALL: process.env.LC_ALL,
    NODE_ENV: process.env.NODE_ENV,
    GIT_TERMINAL_PROMPT: '0'
  }
  if (process.env.XDG_CONFIG_HOME !== undefined)
    env.XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME
  return env
}

function environmentForGitHubCli(): NodeJS.ProcessEnv {
  const env = environmentForLocalGit()
  for (const key of [
    'GH_TOKEN',
    'GH_ENTERPRISE_TOKEN',
    'GITHUB_TOKEN',
    'GH_CONFIG_DIR',
    'GH_HOST'
  ]) {
    if (process.env[key] !== undefined) env[key] = process.env[key]
  }
  env.GH_PAGER = 'cat'
  return env
}

export function parseStrictJsonc(sourceText: string): Record<string, unknown> {
  const errors: ParseError[] = []
  const root = parseTree(sourceText, errors, { allowTrailingComma: true })
  if (root === undefined || errors.length > 0) {
    const detail = errors
      .map(
        (error) =>
          `${printParseErrorCode(error.error)} at offset ${error.offset}`
      )
      .join('; ')
    throw new SyntaxError(`Invalid JSONC: ${detail || 'empty document'}`)
  }
  if (root.type !== 'object')
    throw new SyntaxError('JSONC root must be an object')

  const rejectDuplicateKeys = (node: JsonNode): void => {
    if (node.type === 'object') {
      const keys = new Set<string>()
      for (const property of node.children ?? []) {
        const keyNode = property.children?.[0]
        const valueNode = property.children?.[1]
        if (
          keyNode?.type !== 'string' ||
          typeof keyNode.value !== 'string' ||
          valueNode === undefined
        ) {
          throw new SyntaxError(
            `Invalid JSONC object property at offset ${property.offset}`
          )
        }
        if (keys.has(keyNode.value))
          throw new SyntaxError(`Duplicate JSONC key: ${keyNode.value}`)
        keys.add(keyNode.value)
        rejectDuplicateKeys(valueNode)
      }
      return
    }
    for (const child of node.children ?? []) rejectDuplicateKeys(child)
  }
  rejectDuplicateKeys(root)

  const value: unknown = getNodeValue(root)
  if (!isRecord(value)) throw new SyntaxError('JSONC root must be an object')
  return value
}

function isInside(root: string, target: string): boolean {
  const relative = path.relative(root, target)
  return (
    relative === '' ||
    (relative !== '..' &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative))
  )
}

function assertNoSymlinkPath(
  root: string,
  candidate: string,
  kind: 'file' | 'directory'
): string {
  const absolute = path.resolve(candidate)
  if (!isInside(root, absolute))
    throw new Error(`Path escapes release tree: ${candidate}`)

  let cursor = root
  const segments = path.relative(root, absolute).split(path.sep).filter(Boolean)
  for (let index = 0; index < segments.length; index += 1) {
    cursor = path.join(cursor, segments[index])
    const entry = lstatSync(cursor)
    if (entry.isSymbolicLink())
      throw new Error(`Symlink is not allowed in release path: ${cursor}`)
    if (index < segments.length - 1 && !entry.isDirectory())
      throw new Error(`Non-directory path component: ${cursor}`)
  }

  const stat = lstatSync(absolute)
  if (kind === 'file' ? !stat.isFile() : !stat.isDirectory())
    throw new Error(`Expected regular ${kind}: ${absolute}`)
  const real = realpathSync(absolute)
  if (!isInside(root, real))
    throw new Error(`Resolved path escapes release tree: ${absolute}`)
  return real
}

function validateAssetTree(root: string, directory: string): void {
  const entries = readdirSync(directory, { withFileTypes: true })
  for (const entry of entries) {
    const child = path.join(directory, entry.name)
    const stat = lstatSync(child)
    if (stat.isSymbolicLink())
      throw new Error(`Asset symlink is not allowed: ${child}`)
    if (stat.isDirectory()) {
      const real = realpathSync(child)
      if (!isInside(root, real))
        throw new Error(`Asset directory escapes release tree: ${child}`)
      validateAssetTree(root, child)
    } else if (!stat.isFile()) {
      throw new Error(`Unsupported asset filesystem entry: ${child}`)
    }
  }
}

function rejectRoutingKeys(value: unknown, location = '$'): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      rejectRoutingKeys(item, `${location}[${index}]`)
    )
    return
  }
  if (!isRecord(value)) return
  for (const [key, child] of Object.entries(value)) {
    if (key === 'route' || key === 'routes' || key === 'custom_domain') {
      throw new Error(
        `Routing key is not allowed in route-free config: ${location}.${key}`
      )
    }
    rejectRoutingKeys(child, `${location}.${key}`)
  }
}

export function buildRouteFreeConfig({
  sourceText,
  repoRoot,
  accountId,
  workersDev,
  validateArtifacts = true
}: {
  sourceText: string
  repoRoot: string
  accountId: string
  workersDev: boolean
  validateArtifacts?: boolean
}): Record<string, unknown> {
  if (typeof accountId !== 'string' || !/^[a-f0-9]{32}$/.test(accountId)) {
    throw new Error('A valid explicit accountId is required')
  }
  if (typeof workersDev !== 'boolean')
    throw new Error('An explicit workersDev boolean is required')

  const root = realpathSync(repoRoot)
  const config = parseStrictJsonc(sourceText)
  if (typeof config.name !== 'string' || config.name.length === 0)
    throw new Error('Worker name is required')
  if (config.account_id !== undefined && config.account_id !== accountId) {
    throw new Error(
      'Configured account_id does not match the explicit accountId'
    )
  }
  if (typeof config.main !== 'string' || config.main.length === 0)
    throw new Error('Worker main path is required')
  const assets = config.assets
  if (
    !isRecord(assets) ||
    typeof assets.directory !== 'string' ||
    assets.directory.length === 0
  ) {
    throw new Error('Worker assets.directory is required')
  }

  const mainPath = path.resolve(root, config.main)
  const assetDirectoryPath = path.resolve(root, assets.directory)
  if (!isInside(root, mainPath))
    throw new Error('Worker main path escapes release tree')
  if (!isInside(root, assetDirectoryPath))
    throw new Error('Worker assets path escapes release tree')
  const main = validateArtifacts
    ? assertNoSymlinkPath(root, mainPath, 'file')
    : mainPath
  const assetDirectory = validateArtifacts
    ? assertNoSymlinkPath(root, assetDirectoryPath, 'directory')
    : assetDirectoryPath
  if (validateArtifacts) validateAssetTree(root, assetDirectory)

  delete config.route
  delete config.routes
  delete config.custom_domain
  rejectRoutingKeys(config)

  config.account_id = accountId
  config.workers_dev = workersDev
  config.preview_urls = false
  config.main = main
  config.assets = { ...assets, directory: assetDirectory }
  if (typeof config.$schema === 'string' && !path.isAbsolute(config.$schema)) {
    const schemaPath = path.resolve(root, config.$schema)
    if (!isInside(root, schemaPath))
      throw new Error('JSON schema path escapes release tree')
    config.$schema = schemaPath
  }
  return config
}

function runGit(repoRoot: string, args: string[]): Buffer {
  return execFileSync(
    'git',
    [
      '-C',
      repoRoot,
      '-c',
      'core.fsmonitor=false',
      '-c',
      'core.untrackedCache=false',
      ...args
    ],
    {
      env: environmentForLocalGit(),
      maxBuffer: 64 * 1024 * 1024,
      timeout: 30_000
    }
  )
}

function decodeUtf8(buffer: Buffer, description: string): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
  } catch {
    throw new Error(`${description} is not valid UTF-8`)
  }
}

export function verifyCleanReleaseTree({
  repoRoot,
  expectedSha
}: {
  repoRoot: string
  expectedSha: string
}): string {
  if (!/^[a-f0-9]{40}$/.test(expectedSha))
    throw new Error('Expected release SHA must be a full 40-character Git SHA')
  const root = realpathSync(repoRoot)
  const head = decodeUtf8(
    runGit(root, ['rev-parse', '--verify', 'HEAD^{commit}']),
    'Git HEAD'
  ).trim()
  if (head !== expectedSha)
    throw new Error(
      `Release SHA mismatch: expected ${expectedSha}, found ${head}`
    )

  const branch = decodeUtf8(
    runGit(root, ['symbolic-ref', '--quiet', '--short', 'HEAD']),
    'Git branch'
  ).trim()
  if (!branch.startsWith('verify/'))
    throw new Error(
      `Release checkout must use a verify/ branch, found ${branch}`
    )

  const flags = decodeUtf8(
    runGit(root, ['ls-files', '-v', '-z']),
    'Git index flags'
  )
    .split('\0')
    .filter(Boolean)
  if (flags.some((entry) => entry[0] !== 'H' || entry[1] !== ' ')) {
    throw new Error(
      'Assume-unchanged, skip-worktree, or other unusual index flag is set'
    )
  }

  const status = runGit(root, [
    'status',
    '--porcelain=v1',
    '-z',
    '--untracked-files=all'
  ])
  if (status.length > 0)
    throw new Error('Release tree is dirty or contains untracked files')
  try {
    runGit(root, ['diff', '--quiet', '--'])
    runGit(root, ['diff', '--cached', '--quiet', 'HEAD', '--'])
  } catch {
    throw new Error('Release worktree or index differs from HEAD')
  }

  const indexEntries = decodeUtf8(
    runGit(root, ['ls-files', '--stage', '-z']),
    'Git index entries'
  )
    .split('\0')
    .filter(Boolean)
  for (const entry of indexEntries) {
    const separator = entry.indexOf('\t')
    if (separator < 0) throw new Error('Malformed Git index entry')
    const [mode, oid, stage] = entry.slice(0, separator).split(' ')
    const relativePath = entry.slice(separator + 1)
    if (stage !== '0' || !/^[a-f0-9]{40}$/.test(oid ?? ''))
      throw new Error(`Unmerged or malformed Git index entry: ${relativePath}`)
    if (mode !== '100644' && mode !== '100755')
      throw new Error(`Unsupported tracked file mode ${mode}: ${relativePath}`)

    const absolutePath = path.resolve(root, relativePath)
    const file = assertNoSymlinkPath(root, absolutePath, 'file')
    const stat = lstatSync(file)
    const executable = (stat.mode & 0o111) !== 0
    if (executable !== (mode === '100755'))
      throw new Error(`Tracked file mode differs from index: ${relativePath}`)
    const actualOid = decodeUtf8(
      runGit(root, ['hash-object', `--path=${relativePath}`, file]),
      `Git object hash for ${relativePath}`
    ).trim()
    if (actualOid !== oid)
      throw new Error(
        `Tracked file content differs from index: ${relativePath}`
      )
  }

  return head
}

function assertAllowedKeys(
  value: Record<string, unknown>,
  allowed: string[],
  context: string
): void {
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key))
  if (unknown.length > 0)
    throw new Error(`Unknown ${context} field(s): ${unknown.join(', ')}`)
}

function isNullableString(value: unknown): boolean {
  return value === null || typeof value === 'string'
}

function isOptionalNullableString(value: unknown): boolean {
  return value === undefined || isNullableString(value)
}

export function parseVersionUploadOutput(
  output: string,
  { workerName, dryRun }: { workerName: string; dryRun: boolean }
): {
  versionId: string | null
  bundleSize: { rawBytes: number; gzipBytes: number } | null
} {
  const lines = output.split('\n').filter((line) => line.length > 0)
  if (lines.length < 2)
    throw new Error('Wrangler output is missing required structured records')

  const sessions: Record<string, unknown>[] = []
  const uploads: Record<string, unknown>[] = []
  for (const line of lines) {
    const record = parseStrictJsonc(line)
    if (record.type === 'wrangler-session') {
      assertAllowedKeys(
        record,
        [
          'type',
          'version',
          'wrangler_version',
          'command_line_args',
          'log_file_path',
          'timestamp'
        ],
        'wrangler-session'
      )
      if (
        record.version !== 1 ||
        record.wrangler_version !== '4.165.0' ||
        !Array.isArray(record.command_line_args) ||
        !record.command_line_args.every(
          (argument) => typeof argument === 'string'
        ) ||
        (record.log_file_path !== undefined &&
          typeof record.log_file_path !== 'string')
      ) {
        throw new Error('Invalid pinned Wrangler session record')
      }
      sessions.push(record)
      continue
    }
    if (record.type === 'version-upload') {
      assertAllowedKeys(
        record,
        [
          'type',
          'version',
          'worker_name',
          'worker_tag',
          'version_id',
          'preview_url',
          'preview_alias_url',
          'wrangler_environment',
          'worker_name_overridden',
          'bundle_size',
          'timestamp'
        ],
        'version-upload'
      )
      if (
        record.version !== 1 ||
        record.worker_name !== workerName ||
        record.worker_name_overridden !== false ||
        !isNullableString(record.worker_tag) ||
        !isNullableString(record.version_id) ||
        (record.preview_url !== undefined && record.preview_url !== null) ||
        (record.preview_alias_url !== undefined &&
          record.preview_alias_url !== null) ||
        !isOptionalNullableString(record.wrangler_environment)
      ) {
        throw new Error('Invalid version-upload record or Worker identity')
      }
      uploads.push(record)
      continue
    }
    throw new Error(
      `Unknown Wrangler structured record: ${String(record.type)}`
    )
  }

  if (sessions.length !== 1 || uploads.length !== 1)
    throw new Error(
      'Expected exactly one Wrangler session and one version-upload record'
    )
  const session = sessions[0]
  const upload = uploads[0]
  if (
    typeof session.timestamp !== 'string' ||
    Number.isNaN(Date.parse(session.timestamp)) ||
    typeof upload.timestamp !== 'string' ||
    Number.isNaN(Date.parse(upload.timestamp))
  ) {
    throw new Error('Wrangler structured record timestamp is invalid')
  }

  let bundleSize: { rawBytes: number; gzipBytes: number } | null = null
  if (upload.bundle_size !== undefined) {
    if (!isRecord(upload.bundle_size))
      throw new Error('Invalid version-upload bundle_size')
    assertAllowedKeys(
      upload.bundle_size,
      ['raw_bytes', 'gzip_bytes'],
      'bundle_size'
    )
    const { raw_bytes: rawBytes, gzip_bytes: gzipBytes } = upload.bundle_size
    if (
      !Number.isSafeInteger(rawBytes) ||
      !Number.isSafeInteger(gzipBytes) ||
      Number(rawBytes) < 0 ||
      Number(gzipBytes) < 0
    ) {
      throw new Error('Invalid version-upload bundle size')
    }
    bundleSize = { rawBytes: Number(rawBytes), gzipBytes: Number(gzipBytes) }
  }

  if (
    dryRun
      ? upload.version_id !== null
      : typeof upload.version_id !== 'string' || upload.version_id.length === 0
  ) {
    throw new Error(
      dryRun
        ? 'Dry-run unexpectedly returned a remote Version ID'
        : 'Upload did not return a Version ID'
    )
  }
  return {
    versionId: typeof upload.version_id === 'string' ? upload.version_id : null,
    bundleSize
  }
}

function requireTimestamp(value: unknown, context: string): string {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value)))
    throw new Error(`${context} has an invalid timestamp`)
  return value
}

function readAnnotationMessage(value: Record<string, unknown>): string | null {
  const annotations = value.annotations
  if (annotations === undefined) return null
  if (!isRecord(annotations))
    throw new Error('Cloudflare annotations must be an object')
  const message = annotations['workers/message']
  if (message === undefined || message === null) return null
  if (typeof message !== 'string')
    throw new Error('Cloudflare workers/message annotation must be a string')
  return message
}

export function parseVersionViewOutput(
  output: string,
  { versionId, message }: { versionId: string; message?: string }
): {
  id: string
  message: string | null
  createdOn: string
  bindings: Array<{ name: string; type: string }>
} {
  const version = parseStrictJsonc(output.trim())
  if (version.id !== versionId)
    throw new Error(
      'Version read-back ID does not match the uploaded Version ID'
    )
  if (!isRecord(version.metadata))
    throw new Error('Version read-back metadata is missing')
  const createdOn = requireTimestamp(
    version.metadata.created_on,
    'Version read-back metadata'
  )
  const actualMessage = readAnnotationMessage(version)
  if (message !== undefined && actualMessage !== message)
    throw new Error(
      'Version read-back annotation message does not match the release SHA'
    )
  const resources = version.resources
  if (!isRecord(resources) || !Array.isArray(resources.bindings))
    throw new Error('Version read-back bindings are missing')

  const names = new Set<string>()
  const bindings = resources.bindings
    .map((binding) => {
      if (
        !isRecord(binding) ||
        typeof binding.name !== 'string' ||
        binding.name.length === 0 ||
        typeof binding.type !== 'string' ||
        binding.type.length === 0
      ) {
        throw new Error('Invalid Version binding name or type')
      }
      if (names.has(binding.name))
        throw new Error(`Duplicate Version binding: ${binding.name}`)
      names.add(binding.name)
      return { name: binding.name, type: binding.type }
    })
    .sort(
      (left, right) =>
        left.name.localeCompare(right.name) ||
        left.type.localeCompare(right.type)
    )

  return { id: versionId, message: actualMessage, createdOn, bindings }
}

export function parseDeploymentStatusOutput(
  output: string,
  { versionId, message }: { versionId?: string; message?: string }
): {
  id: string
  message: string | null
  createdOn: string
  versions: Array<{ versionId: string; percentage: number }>
} {
  const deployment = parseStrictJsonc(output.trim())
  if (typeof deployment.id !== 'string' || deployment.id.length === 0)
    throw new Error('Deployment read-back ID is missing')
  const createdOn = requireTimestamp(
    deployment.created_on,
    'Deployment read-back'
  )
  const actualMessage = readAnnotationMessage(deployment)
  if (message !== undefined && actualMessage !== message)
    throw new Error(
      'Deployment annotation message does not match the release SHA'
    )
  if (!Array.isArray(deployment.versions))
    throw new Error('Deployment read-back versions are missing')
  const versions = deployment.versions.map((traffic) => {
    if (
      !isRecord(traffic) ||
      typeof traffic.version_id !== 'string' ||
      traffic.version_id.length === 0 ||
      typeof traffic.percentage !== 'number' ||
      !Number.isFinite(traffic.percentage) ||
      traffic.percentage < 0 ||
      traffic.percentage > 100
    ) {
      throw new Error('Invalid deployment traffic entry')
    }
    return { versionId: traffic.version_id, percentage: traffic.percentage }
  })
  if (
    versionId !== undefined &&
    (versions.length !== 1 ||
      versions[0].versionId !== versionId ||
      versions[0].percentage !== 100)
  ) {
    throw new Error(
      'Expected the exact release Version to be the only 100% active deployment'
    )
  }
  if (
    versionId === undefined &&
    (versions.length !== 1 || versions[0].percentage !== 100)
  ) {
    throw new Error('Current deployment is not a single 100% active Version')
  }
  return { id: deployment.id, message: actualMessage, createdOn, versions }
}

export function parseProductionCareerPageResponse({
  status,
  contentType,
  finalUrl,
  redirected,
  body
}: {
  status: number
  contentType: string | null
  finalUrl: string
  redirected: boolean
  body: string
}): { hostname: string; status: number; bodyBytes: number; marker: string } {
  const responseUrl = new URL(finalUrl)
  if (
    status !== 200 ||
    contentType === null ||
    !/^text\/html(?:;|$)/i.test(contentType) ||
    responseUrl.protocol !== 'https:' ||
    responseUrl.hostname !== RELEASE_HOSTNAME ||
    redirected ||
    !body.includes('職務経歴')
  ) {
    throw new Error(
      'Production HTTP smoke did not return the expected About-page release marker'
    )
  }
  return {
    hostname: responseUrl.hostname,
    status,
    bodyBytes: Buffer.byteLength(body),
    marker: '職務経歴'
  }
}

export function classifyPromotionRecovery(
  activeDeployment: ReturnType<typeof parseDeploymentStatusOutput>,
  previousVersionId: string,
  candidateVersionId: string
): { outcome: string; activeVersionId: string | null } {
  if (
    activeDeployment.versions.length !== 1 ||
    activeDeployment.versions[0].percentage !== 100
  ) {
    return {
      outcome: 'active-traffic-uncertain-manual-review',
      activeVersionId: null
    }
  }
  const activeVersionId = activeDeployment.versions[0].versionId
  if (activeVersionId === previousVersionId)
    return { outcome: 'previous-version-still-active', activeVersionId }
  if (activeVersionId === candidateVersionId)
    return {
      outcome: 'candidate-active-manual-rollback-required',
      activeVersionId
    }
  return { outcome: 'unexpected-version-active-manual-review', activeVersionId }
}

const WORKER_NAME = 'kohsweb-worker'
const REPOSITORY = 'koh110/kohsweb'
const RELEASE_HOSTNAME = 'koh.dev'
const RELEASE_PULL_REQUEST_NUMBER = 7
const WRANGLER_VERSION = '4.165.0'
const MAX_CHILD_OUTPUT_BYTES = 8 * 1024 * 1024
const DEFAULT_CHILD_TIMEOUT_MS = 5 * 60 * 1000
const MAX_CHILD_TIMEOUT_MS = 10 * 60 * 1000

function requireString(value: unknown, description: string): string {
  if (typeof value !== 'string' || value.length === 0)
    throw new Error(`${description} is required`)
  return value
}

function requireRecord(
  value: unknown,
  description: string
): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${description} must be an object`)
  return value
}

function verifyPinnedWrangler(repoRoot: string): string {
  const packageJson = parseStrictJsonc(
    readFileSync(path.join(repoRoot, 'package.json'), 'utf8')
  )
  const lock = parseStrictJsonc(
    readFileSync(path.join(repoRoot, 'package-lock.json'), 'utf8')
  )
  const dependencies = requireRecord(
    packageJson.devDependencies,
    'package.json devDependencies'
  )
  const scripts = requireRecord(packageJson.scripts, 'package.json scripts')
  const packages = requireRecord(lock.packages, 'package-lock.json packages')
  const locked = requireRecord(
    packages['node_modules/wrangler'],
    'locked Wrangler package'
  )
  const installed = parseStrictJsonc(
    readFileSync(
      path.join(repoRoot, 'node_modules/wrangler/package.json'),
      'utf8'
    )
  )
  if (
    dependencies.wrangler !== WRANGLER_VERSION ||
    locked.version !== WRANGLER_VERSION ||
    installed.version !== WRANGLER_VERSION
  ) {
    throw new Error(
      `Wrangler must be pinned and installed at ${WRANGLER_VERSION}`
    )
  }
  if (
    scripts.deploy !== undefined ||
    scripts['deploy:merged'] !==
      'node scripts/deploy-worker.mts --merged-release' ||
    scripts['deploy:dry-run'] !== 'node scripts/deploy-worker.mts --dry-run'
  ) {
    throw new Error(
      'Package deploy scripts do not route through the guarded deployment wrapper'
    )
  }

  const [major, minor] = process.versions.node.split('.').map(Number)
  if (major < 22 || (major === 22 && minor < 18))
    throw new Error('Deployment requires Node.js 22.18 or newer')
  const entry = path.join(repoRoot, 'node_modules/wrangler/bin/wrangler.js')
  const resolved = assertNoSymlinkPath(repoRoot, entry, 'file')
  return resolved
}

interface FileIdentity {
  dev: number
  ino: number
}

function fileIdentity(pathname: string): FileIdentity {
  const stat = lstatSync(pathname)
  if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory()))
    throw new Error(`Unexpected filesystem entry: ${pathname}`)
  return { dev: stat.dev, ino: stat.ino }
}

function assertSameIdentity(
  pathname: string,
  expected: FileIdentity,
  description: string
): void {
  const actual = fileIdentity(pathname)
  if (actual.dev !== expected.dev || actual.ino !== expected.ino)
    throw new Error(`${description} identity changed`)
}

function createPrivateDirectory(pathname: string): FileIdentity {
  mkdirSync(pathname, { mode: 0o700 })
  chmodSync(pathname, 0o700)
  const stat = lstatSync(pathname)
  if (
    !stat.isDirectory() ||
    stat.isSymbolicLink() ||
    (stat.mode & 0o777) !== 0o700
  ) {
    throw new Error(`Could not create a private directory: ${pathname}`)
  }
  return { dev: stat.dev, ino: stat.ino }
}

function writeNoClobber(
  pathname: string,
  contents: string | Buffer,
  mode = 0o600
): FileIdentity {
  if (typeof fsConstants.O_NOFOLLOW !== 'number')
    throw new Error(
      'Platform does not support no-follow exclusive file creation'
    )
  const flags =
    fsConstants.O_CREAT |
    fsConstants.O_EXCL |
    fsConstants.O_WRONLY |
    fsConstants.O_NOFOLLOW
  const fd = openSync(pathname, flags, mode)
  let opened: FileIdentity | undefined
  try {
    const stat = fstatSync(fd)
    if (!stat.isFile() || (stat.mode & 0o777) !== mode)
      throw new Error(`Private file mode is incorrect: ${pathname}`)
    opened = { dev: stat.dev, ino: stat.ino }
    writeFileSync(fd, contents)
    fsyncSync(fd)
  } finally {
    closeSync(fd)
  }
  if (opened === undefined)
    throw new Error(`Private file was not opened: ${pathname}`)
  assertSameIdentity(pathname, opened, 'Private file')
  return opened
}

function createEvidenceDirectory(requestedPath: string | undefined): {
  path: string
  identity: FileIdentity
} {
  let evidencePath: string
  if (requestedPath !== undefined) {
    if (!path.isAbsolute(requestedPath))
      throw new Error('KOH_RELEASE_EVIDENCE_DIR must be absolute')
    evidencePath = path.resolve(requestedPath)
    const parent = realpathSync(path.dirname(evidencePath))
    if (parent !== path.dirname(evidencePath))
      throw new Error(
        'Evidence directory parent must not contain symlink aliases'
      )
  } else {
    evidencePath = mkdtempSync(
      path.join(os.tmpdir(), 'kohsweb-deploy-evidence-')
    )
    chmodSync(evidencePath, 0o700)
    const stat = lstatSync(evidencePath)
    if (
      !stat.isDirectory() ||
      stat.isSymbolicLink() ||
      (stat.mode & 0o777) !== 0o700
    ) {
      throw new Error('Could not create a private temporary evidence directory')
    }
    return { path: evidencePath, identity: { dev: stat.dev, ino: stat.ino } }
  }
  return { path: evidencePath, identity: createPrivateDirectory(evidencePath) }
}

function validateEvidenceTree(
  evidencePath: string,
  rootIdentity: FileIdentity,
  protectedFiles: Map<string, FileIdentity>
): void {
  assertSameIdentity(evidencePath, rootIdentity, 'Evidence directory')
  const rootStat = lstatSync(evidencePath)
  if ((rootStat.mode & 0o777) !== 0o700)
    throw new Error('Evidence directory permissions changed')
  const visit = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const child = path.join(directory, entry.name)
      const stat = lstatSync(child)
      if (stat.isSymbolicLink() || (!stat.isDirectory() && !stat.isFile()))
        throw new Error(`Unsafe evidence entry: ${child}`)
      if ((stat.mode & 0o077) !== 0)
        throw new Error(
          `Evidence entry is accessible by group or others: ${child}`
        )
      const expected = protectedFiles.get(child)
      if (
        expected !== undefined &&
        (stat.dev !== expected.dev || stat.ino !== expected.ino)
      ) {
        throw new Error(`Protected evidence file identity changed: ${child}`)
      }
      if (stat.isDirectory()) visit(child)
    }
  }
  visit(evidencePath)
  for (const [pathname, identity] of protectedFiles)
    assertSameIdentity(pathname, identity, 'Protected evidence file')
}

function artifactFingerprint(
  config: Record<string, unknown>,
  repoRoot: string
): string {
  const main = requireString(config.main, 'Worker main artifact')
  const assets = requireRecord(config.assets, 'Worker assets config')
  const assetDirectory = requireString(
    assets.directory,
    'Worker assets directory'
  )
  const root = realpathSync(repoRoot)
  const safeAssetDirectory = assertNoSymlinkPath(
    root,
    assetDirectory,
    'directory'
  )
  const hash = createHash('sha256')
  const addFile = (pathname: string, relative: string): void => {
    const real = assertNoSymlinkPath(root, pathname, 'file')
    const stat = lstatSync(real)
    hash.update(`${relative}\0${stat.mode & 0o777}\0${stat.size}\0`)
    hash.update(readFileSync(real))
  }
  addFile(main, path.relative(root, main))
  const visit = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort(
      (left, right) => left.name.localeCompare(right.name)
    )) {
      const child = path.join(directory, entry.name)
      const stat = lstatSync(child)
      if (stat.isSymbolicLink())
        throw new Error(
          `Asset symlink changed after config validation: ${child}`
        )
      if (stat.isDirectory()) visit(child)
      else if (stat.isFile()) addFile(child, path.relative(root, child))
      else throw new Error(`Unsupported asset artifact: ${child}`)
    }
  }
  visit(safeAssetDirectory)
  return hash.digest('hex')
}

interface ProcessResult {
  code: number | null
  signal: NodeJS.Signals | null
  stdout: string
  stderr: string
}

function processGroupExists(pid: number): boolean {
  try {
    process.kill(-pid, 0)
    return true
  } catch (error) {
    if (isRecord(error) && error.code === 'ESRCH') return false
    if (isRecord(error) && error.code === 'EPERM') return true
    throw error
  }
}

function signalProcessGroup(pid: number, signal: NodeJS.Signals): void {
  try {
    process.kill(-pid, signal)
  } catch (error) {
    if (isRecord(error) && error.code === 'ESRCH') return
    throw error
  }
}

async function waitForProcessGroupExit(
  pid: number,
  timeoutMs: number
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (!processGroupExists(pid)) return true
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  return !processGroupExists(pid)
}

async function terminateProcessGroup(pid: number): Promise<void> {
  signalProcessGroup(pid, 'SIGTERM')
  if (await waitForProcessGroupExit(pid, 1_500)) return
  signalProcessGroup(pid, 'SIGKILL')
  if (!(await waitForProcessGroupExit(pid, 2_500))) {
    throw new Error(
      'Could not verify that the subprocess group terminated; evidence must be retained'
    )
  }
}

function createProcessResultFile(
  evidencePath: string,
  label: string,
  value: Record<string, unknown>
): void {
  const pathname = path.join(evidencePath, `${label}.json`)
  writeNoClobber(pathname, `${JSON.stringify(value, null, 2)}\n`)
}

export async function runBoundedProcess({
  command,
  args,
  cwd,
  env,
  evidencePath,
  label,
  timeoutMs,
  abortSignal,
  persistStdout = true,
  persistStderr = true
}: {
  command: string
  args: string[]
  cwd: string
  env: NodeJS.ProcessEnv
  evidencePath: string
  label: string
  timeoutMs: number
  abortSignal: AbortSignal
  persistStdout?: boolean
  persistStderr?: boolean
}): Promise<ProcessResult> {
  if (process.platform !== 'linux')
    throw new Error(
      'Deployment subprocess containment currently requires Linux process groups'
    )
  if (!/^[a-z0-9-]+$/.test(label))
    throw new Error('Invalid private evidence label')

  const child = spawn(command, args, {
    cwd,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
    windowsHide: true
  })
  let pid = child.pid
  let spawnError: Error | undefined
  let closeResult:
    { code: number | null; signal: NodeJS.Signals | null } | undefined
  const closePromise = new Promise<{
    code: number | null
    signal: NodeJS.Signals | null
  }>((resolve) => {
    child.once('close', (code, signal) => {
      closeResult = { code, signal }
      resolve({ code, signal })
    })
  })
  child.once('error', (error) => {
    spawnError = error
  })

  const stdoutChunks: Buffer[] = []
  const stderrChunks: Buffer[] = []
  let stdoutBytes = 0
  let stderrBytes = 0
  let stdoutTruncated = false
  let stderrTruncated = false
  let signalOverflow: (() => void) | undefined
  const overflowPromise = new Promise<void>((resolve) => {
    signalOverflow = resolve
  })
  const acceptChunk = (
    chunk: Buffer,
    target: Buffer[],
    which: 'stdout' | 'stderr'
  ): void => {
    const current = which === 'stdout' ? stdoutBytes : stderrBytes
    const room = Math.max(0, MAX_CHILD_OUTPUT_BYTES - current)
    if (room > 0) {
      target.push(Buffer.from(chunk.subarray(0, room)))
      if (which === 'stdout') stdoutBytes += Math.min(chunk.length, room)
      else stderrBytes += Math.min(chunk.length, room)
    }
    if (chunk.length > room) {
      if (which === 'stdout') stdoutTruncated = true
      else stderrTruncated = true
      signalOverflow?.()
      signalOverflow = undefined
    }
  }
  child.stdout.on('data', (chunk: Buffer) =>
    acceptChunk(chunk, stdoutChunks, 'stdout')
  )
  child.stderr.on('data', (chunk: Buffer) =>
    acceptChunk(chunk, stderrChunks, 'stderr')
  )

  const spawnPromise = new Promise<void>((resolve, reject) => {
    child.once('spawn', () => resolve())
    child.once('error', (error) => reject(error))
  })
  try {
    await spawnPromise
  } catch (error) {
    throw new Error(`Could not start ${path.basename(command)}`, {
      cause: error
    })
  }
  pid = child.pid
  if (pid === undefined)
    throw new Error(
      `Could not establish process identity for ${path.basename(command)}`
    )

  let timeoutHandle: NodeJS.Timeout | undefined
  let abortHandler: (() => void) | undefined
  let resolveAbort: (() => void) | undefined
  const abortPromise = new Promise<void>((resolve) => {
    resolveAbort = resolve
  })
  abortHandler = () => resolveAbort?.()
  if (abortSignal.aborted) abortHandler()
  else abortSignal.addEventListener('abort', abortHandler, { once: true })
  const timeoutPromise = new Promise<void>((resolve) => {
    timeoutHandle = setTimeout(resolve, timeoutMs)
  })
  const result = await Promise.race([
    closePromise.then((closed) => ({ kind: 'closed' as const, closed })),
    timeoutPromise.then(() => ({ kind: 'timeout' as const })),
    abortPromise.then(() => ({ kind: 'abort' as const })),
    overflowPromise.then(() => ({ kind: 'overflow' as const }))
  ])
  if (timeoutHandle !== undefined) clearTimeout(timeoutHandle)
  if (abortHandler !== undefined)
    abortSignal.removeEventListener('abort', abortHandler)

  const persistOutcome = (
    code: number | null,
    signal: NodeJS.Signals | null,
    outcome: string
  ): void => {
    const stdoutBuffer = Buffer.concat(stdoutChunks)
    const stderrBuffer = Buffer.concat(stderrChunks)
    if (persistStdout && stdoutBuffer.length > 0)
      writeNoClobber(
        path.join(evidencePath, `${label}.stdout.log`),
        stdoutBuffer
      )
    if (persistStderr && stderrBuffer.length > 0)
      writeNoClobber(
        path.join(evidencePath, `${label}.stderr.log`),
        stderrBuffer
      )
    createProcessResultFile(evidencePath, `${label}-result`, {
      command: path.basename(command),
      arguments: args,
      outcome,
      exit_code: code,
      signal,
      stdout_bytes: stdoutBytes,
      stderr_bytes: stderrBytes,
      stdout_truncated: stdoutTruncated,
      stderr_truncated: stderrTruncated
    })
  }

  if (result.kind !== 'closed') {
    await terminateProcessGroup(pid)
    const didClose =
      closeResult !== undefined ||
      (await Promise.race([
        closePromise.then(() => true),
        new Promise<boolean>((resolve) =>
          setTimeout(() => resolve(false), 1_000)
        )
      ]))
    if (!didClose)
      throw new Error(
        'Subprocess group terminated but direct child exit was not observed; evidence must be retained'
      )
    persistOutcome(
      closeResult?.code ?? null,
      closeResult?.signal ?? null,
      result.kind
    )
    const reason =
      result.kind === 'timeout'
        ? 'timed out'
        : result.kind === 'abort'
          ? 'was interrupted'
          : 'exceeded the output limit'
    throw new Error(`${path.basename(command)} ${reason}`)
  }

  if (processGroupExists(pid)) await terminateProcessGroup(pid)
  if (spawnError !== undefined) {
    persistOutcome(result.closed.code, result.closed.signal, 'spawn-error')
    throw new Error(`${path.basename(command)} could not be launched`, {
      cause: spawnError
    })
  }
  const stdoutBuffer = Buffer.concat(stdoutChunks)
  const stderrBuffer = Buffer.concat(stderrChunks)
  persistOutcome(result.closed.code, result.closed.signal, 'closed')
  if (stdoutTruncated || stderrTruncated)
    throw new Error(
      `${path.basename(command)} exceeded the bounded output limit`
    )
  const stdout = decodeUtf8(stdoutBuffer, `${path.basename(command)} stdout`)
  const stderr = decodeUtf8(stderrBuffer, `${path.basename(command)} stderr`)
  return {
    code: result.closed.code,
    signal: result.closed.signal,
    stdout,
    stderr
  }
}

function parseTimeout(value: string | undefined): number {
  if (value === undefined) return DEFAULT_CHILD_TIMEOUT_MS
  if (!/^[1-9][0-9]*$/.test(value))
    throw new Error('KOH_DEPLOY_TIMEOUT_MS must be a positive integer')
  const timeout = Number(value)
  if (!Number.isSafeInteger(timeout) || timeout > MAX_CHILD_TIMEOUT_MS) {
    throw new Error(
      `KOH_DEPLOY_TIMEOUT_MS must not exceed ${MAX_CHILD_TIMEOUT_MS}`
    )
  }
  return timeout
}

function normalizeRepository(remoteUrl: string): string {
  let value = remoteUrl.trim()
  if (value.startsWith('git@github.com:'))
    value = value.slice('git@github.com:'.length)
  else {
    let parsed: URL
    try {
      parsed = new URL(value)
    } catch {
      throw new Error('Origin remote is not a supported GitHub URL')
    }
    if (
      parsed.hostname !== 'github.com' ||
      parsed.password !== '' ||
      parsed.port !== '' ||
      parsed.search !== '' ||
      parsed.hash !== ''
    ) {
      throw new Error('Origin remote must be a credential-free github.com URL')
    }
    if (parsed.protocol === 'ssh:') {
      if (parsed.username !== 'git')
        throw new Error('SSH origin must use the git@github.com identity')
    } else if (parsed.protocol !== 'https:' || parsed.username !== '') {
      throw new Error('Origin remote must use HTTPS or SSH to github.com')
    }
    value = parsed.pathname.startsWith('/')
      ? parsed.pathname.slice(1)
      : parsed.pathname
  }
  if (value.endsWith('.git')) value = value.slice(0, -4)
  const segments = value.split('/')
  if (
    segments.length !== 2 ||
    segments.some((segment) => segment.length === 0)
  ) {
    throw new Error('Origin remote does not identify one GitHub repository')
  }
  return value
}

export function parsePullRequest(
  value: unknown,
  expectedSha: string,
  expectedNumber: number
): Record<string, unknown> {
  const pullRequest = requireRecord(value, 'GitHub pull request')
  const base = requireRecord(pullRequest.base, 'GitHub pull request base')
  const head = requireRecord(pullRequest.head, 'GitHub pull request head')
  const baseRepo = requireRecord(
    base.repo,
    'GitHub pull request base repository'
  )
  const headRepo = requireRecord(
    head.repo,
    'GitHub pull request head repository'
  )
  if (
    pullRequest.number !== expectedNumber ||
    pullRequest.draft !== true ||
    pullRequest.state !== 'open' ||
    pullRequest.merged_at !== null ||
    base.ref !== 'main' ||
    baseRepo.full_name !== REPOSITORY ||
    headRepo.full_name !== REPOSITORY ||
    head.sha !== expectedSha
  ) {
    throw new Error(
      'GitHub PR must be the requested Draft, open, unmerged same-repository PR at the exact release SHA'
    )
  }
  if (typeof head.ref !== 'string' || typeof base.ref !== 'string')
    throw new Error('GitHub PR refs are missing')
  return {
    number: expectedNumber,
    draft: true,
    state: 'open',
    headRef: head.ref,
    headSha: head.sha,
    baseRef: base.ref
  }
}

export function parseMergedPullRequest(
  value: unknown,
  expectedSha: string
): {
  number: number
  headRef: string
  headSha: string
  baseRef: string
  mergeCommitSha: string
} {
  if (!/^[a-f0-9]{40}$/.test(expectedSha))
    throw new Error('Expected merged release SHA must be a full Git SHA')
  if (!Array.isArray(value))
    throw new Error('GitHub commit pull-request response must be an array')
  if (!isEligibleMergedReleasePullRequest(value, expectedSha, REPOSITORY))
    throw new Error(
      `Expected the exact release SHA to be associated with merged PR #${RELEASE_PULL_REQUEST_NUMBER}`
    )

  const matches: Array<{
    number: number
    headRef: string
    headSha: string
    baseRef: string
    mergeCommitSha: string
  }> = []
  for (const item of value) {
    const pullRequest = requireRecord(item, 'GitHub associated pull request')
    if (pullRequest.number !== RELEASE_PULL_REQUEST_NUMBER) continue
    const base = isRecord(pullRequest.base) ? pullRequest.base : undefined
    const head = isRecord(pullRequest.head) ? pullRequest.head : undefined
    const baseRepo = base && isRecord(base.repo) ? base.repo : undefined
    const headRepo = head && isRecord(head.repo) ? head.repo : undefined
    if (
      pullRequest.state !== 'closed' ||
      typeof pullRequest.merged_at !== 'string' ||
      Number.isNaN(Date.parse(pullRequest.merged_at)) ||
      pullRequest.merge_commit_sha !== expectedSha ||
      base?.ref !== 'main' ||
      baseRepo?.full_name !== REPOSITORY ||
      headRepo?.full_name !== REPOSITORY
    ) {
      continue
    }
    if (
      !Number.isSafeInteger(pullRequest.number) ||
      Number(pullRequest.number) < 1 ||
      typeof head?.ref !== 'string' ||
      typeof head.sha !== 'string' ||
      !/^[a-f0-9]{40}$/.test(head.sha)
    ) {
      throw new Error('Merged GitHub PR has malformed identity fields')
    }
    matches.push({
      number: Number(pullRequest.number),
      headRef: head.ref,
      headSha: head.sha,
      baseRef: base.ref,
      mergeCommitSha: pullRequest.merge_commit_sha
    })
  }
  if (matches.length !== 1)
    throw new Error(
      `Expected exactly one merged same-repository main PR for release SHA; found ${matches.length}`
    )
  return matches[0]
}

async function verifyPullRequest({
  repoRoot,
  pullRequestNumber,
  expectedSha,
  evidencePath,
  label,
  timeoutMs,
  abortSignal
}: {
  repoRoot: string
  pullRequestNumber: number
  expectedSha: string
  evidencePath: string
  label: string
  timeoutMs: number
  abortSignal: AbortSignal
}): Promise<{ headRef: string; headSha: string; baseRef: string }> {
  const origin = decodeUtf8(
    runGit(repoRoot, ['remote', 'get-url', 'origin']),
    'Git origin'
  ).trim()
  if (normalizeRepository(origin) !== REPOSITORY)
    throw new Error(`Git origin must be ${REPOSITORY}`)

  const externalEnv = environmentForGitHubCli()
  const api = await runBoundedProcess({
    command: 'gh',
    args: ['api', `repos/${REPOSITORY}/pulls/${pullRequestNumber}`],
    cwd: repoRoot,
    env: externalEnv,
    evidencePath,
    label: `${label}-pr-api`,
    timeoutMs,
    abortSignal,
    persistStdout: false
  })
  if (api.code !== 0)
    throw new Error(`GitHub PR read failed with exit ${api.code}`)
  const pullRequest = parsePullRequest(
    parseStrictJsonc(api.stdout),
    expectedSha,
    pullRequestNumber
  )

  const branchRef = `refs/heads/${pullRequest.headRef}`
  runGit(repoRoot, ['check-ref-format', branchRef])
  const remoteBranch = await runBoundedProcess({
    command: 'git',
    args: ['ls-remote', 'origin', branchRef],
    cwd: repoRoot,
    env: environmentForLocalGit(),
    evidencePath,
    label: `${label}-remote-branch`,
    timeoutMs,
    abortSignal
  })
  if (remoteBranch.code !== 0)
    throw new Error(`GitHub branch read failed with exit ${remoteBranch.code}`)
  const remoteLines = remoteBranch.stdout.trim().split('\n').filter(Boolean)
  const remoteFields =
    remoteLines.length === 1 ? remoteLines[0].split('\t') : []
  if (
    remoteFields.length !== 2 ||
    remoteFields[0] !== expectedSha ||
    remoteFields[1] !== branchRef
  ) {
    throw new Error(
      'PR head branch SHA does not match the requested release SHA'
    )
  }

  const fetch = await runBoundedProcess({
    command: 'git',
    args: [
      'fetch',
      '--no-tags',
      'origin',
      `refs/pull/${pullRequestNumber}/head`
    ],
    cwd: repoRoot,
    env: environmentForLocalGit(),
    evidencePath,
    label: `${label}-pr-fetch`,
    timeoutMs,
    abortSignal
  })
  if (fetch.code !== 0)
    throw new Error(`GitHub PR head fetch failed with exit ${fetch.code}`)
  const fetchedSha = decodeUtf8(
    runGit(repoRoot, ['rev-parse', '--verify', 'FETCH_HEAD^{commit}']),
    'Fetched PR SHA'
  ).trim()
  if (fetchedSha !== expectedSha)
    throw new Error(
      'Fetched PR head SHA does not match the requested release SHA'
    )

  const verified = {
    headRef: String(pullRequest.headRef),
    headSha: String(pullRequest.headSha),
    baseRef: String(pullRequest.baseRef)
  }
  createProcessResultFile(evidencePath, `${label}-verified-pr`, {
    repository: REPOSITORY,
    pull_request: pullRequestNumber,
    state: 'open',
    merged: false,
    ...verified
  })
  return verified
}

async function verifyMergedPullRequest({
  repoRoot,
  expectedSha,
  expectedPullRequestNumber,
  evidencePath,
  label,
  timeoutMs,
  abortSignal
}: {
  repoRoot: string
  expectedSha: string
  expectedPullRequestNumber?: number
  evidencePath: string
  label: string
  timeoutMs: number
  abortSignal: AbortSignal
}): Promise<{
  number: number
  headRef: string
  headSha: string
  baseRef: string
  mergeCommitSha: string
}> {
  const origin = decodeUtf8(
    runGit(repoRoot, ['remote', 'get-url', 'origin']),
    'Git origin'
  ).trim()
  if (normalizeRepository(origin) !== REPOSITORY)
    throw new Error(`Git origin must be ${REPOSITORY}`)

  const externalEnv = environmentForGitHubCli()
  const api = await runBoundedProcess({
    command: 'gh',
    args: [
      'api',
      '-X',
      'GET',
      `repos/${REPOSITORY}/commits/${expectedSha}/pulls`,
      '-F',
      'per_page=100'
    ],
    cwd: repoRoot,
    env: externalEnv,
    evidencePath,
    label: `${label}-associated-pr-api`,
    timeoutMs,
    abortSignal,
    persistStdout: false
  })
  if (api.code !== 0)
    throw new Error(`GitHub merged PR read failed with exit ${api.code}`)
  let associatedPullRequests: unknown
  try {
    associatedPullRequests = JSON.parse(api.stdout)
  } catch {
    throw new Error('GitHub commit pull-request response is not valid JSON')
  }
  const verified = parseMergedPullRequest(associatedPullRequests, expectedSha)
  if (
    expectedPullRequestNumber !== undefined &&
    verified.number !== expectedPullRequestNumber
  ) {
    throw new Error('Merged PR identity changed during the release')
  }

  const mainRemote = await runBoundedProcess({
    command: 'git',
    args: ['ls-remote', 'origin', 'refs/heads/main'],
    cwd: repoRoot,
    env: environmentForLocalGit(),
    evidencePath,
    label: `${label}-remote-main`,
    timeoutMs,
    abortSignal
  })
  if (mainRemote.code !== 0)
    throw new Error(
      `GitHub main branch read failed with exit ${mainRemote.code}`
    )
  const mainLines = mainRemote.stdout.trim().split('\n').filter(Boolean)
  const mainFields = mainLines.length === 1 ? mainLines[0].split('\t') : []
  if (
    mainFields.length !== 2 ||
    mainFields[0] !== expectedSha ||
    mainFields[1] !== 'refs/heads/main'
  ) {
    throw new Error('Release SHA is no longer the exact origin/main tip')
  }

  createProcessResultFile(evidencePath, `${label}-verified-pr`, {
    repository: REPOSITORY,
    pull_request: verified.number,
    state: 'closed',
    merged: true,
    ...verified
  })
  return verified
}

function sameBindings(
  left: Array<{ name: string; type: string }>,
  right: Array<{ name: string; type: string }>
): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

function checkCommandSucceeded(
  result: ProcessResult,
  description: string
): void {
  if (result.code !== 0 || result.signal !== null) {
    throw new Error(
      `${description} failed with exit=${String(result.code)} signal=${String(result.signal)}`
    )
  }
}

function createWranglerEnvironment({
  evidencePath,
  configPath,
  envFilePath,
  structuredPath,
  accountId,
  apiToken
}: {
  evidencePath: string
  configPath: string
  envFilePath: string
  structuredPath: string
  accountId: string
  apiToken?: string
}): NodeJS.ProcessEnv {
  const home = path.join(evidencePath, 'home')
  const xdg = path.join(evidencePath, 'xdg')
  const temp = path.join(evidencePath, 'tmp')
  for (const directory of [home, xdg, temp]) {
    if (!lstatSync(evidencePath).isDirectory())
      throw new Error('Evidence root changed before Wrangler launch')
    try {
      createPrivateDirectory(directory)
    } catch (error) {
      if (!isRecord(error) || error.code !== 'EEXIST') throw error
      const stat = lstatSync(directory)
      if (
        !stat.isDirectory() ||
        stat.isSymbolicLink() ||
        (stat.mode & 0o777) !== 0o700
      )
        throw new Error(`Unsafe Wrangler directory: ${directory}`)
    }
  }
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    LANG: process.env.LANG ?? 'C.UTF-8',
    HOME: home,
    XDG_CONFIG_HOME: xdg,
    TMPDIR: temp,
    TEMP: temp,
    TMP: temp,
    CI: 'true',
    NODE_ENV: 'production',
    NO_UPDATE_NOTIFIER: '1',
    WRANGLER_SEND_METRICS: 'false',
    WRANGLER_OUTPUT_FILE_PATH: structuredPath,
    CLOUDFLARE_ACCOUNT_ID: accountId
  }
  if (apiToken !== undefined) env.CLOUDFLARE_API_TOKEN = apiToken
  if (configPath.length === 0 || envFilePath.length === 0)
    throw new Error('Wrangler config paths are required')
  return env
}

async function runWrangler({
  binary,
  repoRoot,
  evidencePath,
  label,
  args,
  accountId,
  apiToken,
  configPath,
  envFilePath,
  timeoutMs,
  abortSignal,
  persistStdout = true
}: {
  binary: string
  repoRoot: string
  evidencePath: string
  label: string
  args: string[]
  accountId: string
  apiToken?: string
  configPath: string
  envFilePath: string
  timeoutMs: number
  abortSignal: AbortSignal
  persistStdout?: boolean
}): Promise<ProcessResult> {
  const structuredPath = path.join(
    evidencePath,
    `${label}.wrangler-output.jsonl`
  )
  const structuredIdentity = writeNoClobber(structuredPath, '')
  const env = createWranglerEnvironment({
    evidencePath,
    configPath,
    envFilePath,
    structuredPath,
    accountId,
    apiToken
  })
  const result = await runBoundedProcess({
    command: process.execPath,
    args: [binary, ...args, '--config', configPath, '--env-file', envFilePath],
    cwd: repoRoot,
    env,
    evidencePath,
    label,
    timeoutMs,
    abortSignal,
    persistStdout,
    persistStderr: true
  })
  assertSameIdentity(
    structuredPath,
    structuredIdentity,
    'Wrangler structured output'
  )
  return result
}

export function createWorkerBuildEnvironment({
  evidencePath,
  sourceEnv = process.env
}: {
  evidencePath: string
  sourceEnv?: NodeJS.ProcessEnv
}): NodeJS.ProcessEnv {
  const home = path.join(evidencePath, 'build-home')
  const xdg = path.join(evidencePath, 'build-xdg')
  const temp = path.join(evidencePath, 'build-tmp')
  for (const directory of [home, xdg, temp]) createPrivateDirectory(directory)
  return {
    PATH: sourceEnv.PATH,
    LANG: sourceEnv.LANG ?? 'C.UTF-8',
    HOME: home,
    XDG_CONFIG_HOME: xdg,
    TMPDIR: temp,
    TEMP: temp,
    TMP: temp,
    CI: 'true',
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1',
    NO_UPDATE_NOTIFIER: '1'
  }
}

async function runWorkerBuild({
  repoRoot,
  evidencePath,
  timeoutMs,
  abortSignal
}: {
  repoRoot: string
  evidencePath: string
  timeoutMs: number
  abortSignal: AbortSignal
}): Promise<void> {
  const result = await runBoundedProcess({
    command: 'npm',
    args: ['run', 'build:worker'],
    cwd: repoRoot,
    env: createWorkerBuildEnvironment({ evidencePath }),
    evidencePath,
    label: 'open-next-build',
    timeoutMs,
    abortSignal
  })
  checkCommandSucceeded(result, 'OpenNext Worker build')
}

function readStructuredOutput(pathname: string): string {
  const stat = lstatSync(pathname)
  if (
    stat.isSymbolicLink() ||
    !stat.isFile() ||
    (stat.mode & 0o077) !== 0 ||
    stat.size > 1024 * 1024
  ) {
    throw new Error(
      `Unsafe or oversized Wrangler structured output: ${pathname}`
    )
  }
  return decodeUtf8(readFileSync(pathname), 'Wrangler structured output')
}

export function validateReleaseAccountId(
  accountId: unknown,
  expectedAccountId: unknown
): string {
  if (
    typeof accountId !== 'string' ||
    !/^[a-f0-9]{32}$/.test(accountId) ||
    typeof expectedAccountId !== 'string' ||
    !/^[a-f0-9]{32}$/.test(expectedAccountId)
  ) {
    throw new Error(
      'Target and independently read-back expected Cloudflare account IDs must be valid 32-character IDs'
    )
  }
  if (accountId !== expectedAccountId)
    throw new Error(
      'CLOUDFLARE_ACCOUNT_ID does not match the independently read-back expected account ID'
    )
  return accountId
}

export function parseWorkerSubdomainResponse(
  value: unknown,
  expectedWorkersDev: boolean
): { workersDev: boolean; previewsEnabled: false } {
  const envelope = requireRecord(value, 'Cloudflare Worker subdomain response')
  if (envelope.success !== true)
    throw new Error('Cloudflare Worker subdomain read-back was not successful')
  const result = requireRecord(
    envelope.result,
    'Cloudflare Worker subdomain result'
  )
  if (typeof result.enabled !== 'boolean')
    throw new Error('Cloudflare Worker subdomain enabled value is missing')
  if (typeof result.previews_enabled !== 'boolean')
    throw new Error('Cloudflare Worker preview setting is missing')
  if (result.enabled !== expectedWorkersDev)
    throw new Error(
      'Live workers.dev setting does not match the requested exposure-preserving release'
    )
  if (result.previews_enabled !== false)
    throw new Error(
      'Code-only release requires live Worker preview URLs to be disabled'
    )
  return { workersDev: result.enabled, previewsEnabled: false }
}

export async function readWorkerSubdomainState({
  accountId,
  workerName,
  apiToken,
  expectedWorkersDev,
  timeoutMs,
  abortSignal,
  fetchImpl = fetch
}: {
  accountId: string
  workerName: string
  apiToken: string
  expectedWorkersDev: boolean
  timeoutMs: number
  abortSignal: AbortSignal
  fetchImpl?: typeof fetch
}): Promise<{ workersDev: boolean; previewsEnabled: false }> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/workers/scripts/${encodeURIComponent(workerName)}/subdomain`
  let response: Response
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiToken}`
      },
      redirect: 'error',
      signal: AbortSignal.any([abortSignal, AbortSignal.timeout(timeoutMs)])
    })
  } catch {
    throw new Error('Cloudflare live Worker exposure read-back failed')
  }
  if (!response.ok)
    throw new Error(
      `Cloudflare live Worker exposure read-back failed with HTTP ${response.status}`
    )
  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new Error('Cloudflare live Worker exposure response was invalid JSON')
  }
  return parseWorkerSubdomainResponse(body, expectedWorkersDev)
}

export function parseWorkerRoutingState({
  zoneResponse,
  routesResponse,
  domainsResponse,
  accountId,
  workerName,
  hostname
}: {
  zoneResponse: unknown
  routesResponse: unknown
  domainsResponse: unknown
  accountId: string
  workerName: string
  hostname: string
}): { hostname: string; worker: string; zoneId: string; routeCount: 0 } {
  const zoneEnvelope = requireRecord(zoneResponse, 'Cloudflare zone response')
  if (zoneEnvelope.success !== true)
    throw new Error('Cloudflare production zone read-back was not successful')
  if (!Array.isArray(zoneEnvelope.result) || zoneEnvelope.result.length !== 1)
    throw new Error(
      'Cloudflare account must own exactly one active production zone'
    )
  const zone = requireRecord(zoneEnvelope.result[0], 'Cloudflare zone result')
  const zoneId = requireString(zone.id, 'Cloudflare production zone ID')
  const zoneAccount = requireRecord(zone.account, 'Cloudflare zone account')
  if (
    !/^[a-f0-9]{32}$/.test(zoneId) ||
    zone.name !== hostname ||
    zoneAccount.id !== accountId
  ) {
    throw new Error(
      'Cloudflare target account does not own the expected production zone'
    )
  }

  const routesEnvelope = requireRecord(
    routesResponse,
    'Cloudflare Worker routes response'
  )
  if (routesEnvelope.success !== true)
    throw new Error('Cloudflare Worker routes read-back was not successful')
  if (!Array.isArray(routesEnvelope.result))
    throw new Error('Cloudflare Worker routes response is missing its result')
  if (routesEnvelope.result.length !== 0)
    throw new Error(
      'Unexpected Worker routes exist in the production zone; refusing release'
    )

  const domainsEnvelope = requireRecord(
    domainsResponse,
    'Cloudflare Worker domains response'
  )
  if (domainsEnvelope.success !== true)
    throw new Error('Cloudflare Worker domain read-back was not successful')
  if (!Array.isArray(domainsEnvelope.result))
    throw new Error('Cloudflare Worker domain response is missing its result')
  const matchingDomains = domainsEnvelope.result.filter(
    (value) => isRecord(value) && value.hostname === hostname
  )
  if (matchingDomains.length !== 1)
    throw new Error(
      'Expected exactly one production custom-domain mapping for the hostname'
    )
  const domain = requireRecord(
    matchingDomains[0],
    'Cloudflare production Worker domain'
  )
  if (
    domain.service !== workerName ||
    domain.zone_id !== zoneId ||
    domain.zone_name !== hostname
  ) {
    throw new Error(
      'Production custom domain is not mapped to the expected Worker and zone'
    )
  }
  return { hostname, worker: workerName, zoneId, routeCount: 0 }
}

export async function readWorkerRoutingState({
  accountId,
  workerName,
  hostname,
  apiToken,
  timeoutMs,
  abortSignal,
  fetchImpl = fetch
}: {
  accountId: string
  workerName: string
  hostname: string
  apiToken: string
  timeoutMs: number
  abortSignal: AbortSignal
  fetchImpl?: typeof fetch
}): Promise<{
  hostname: string
  worker: string
  zoneId: string
  routeCount: 0
}> {
  const baseUrl = 'https://api.cloudflare.com/client/v4'
  const fetchJson = async (
    url: string,
    description: string
  ): Promise<unknown> => {
    let response: Response
    try {
      response = await fetchImpl(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiToken}`
        },
        redirect: 'error',
        signal: AbortSignal.any([abortSignal, AbortSignal.timeout(timeoutMs)])
      })
    } catch {
      throw new Error(`${description} read-back failed`)
    }
    if (!response.ok)
      throw new Error(
        `${description} read-back failed with HTTP ${response.status}`
      )
    try {
      return await response.json()
    } catch {
      throw new Error(`${description} response was invalid JSON`)
    }
  }

  const zoneQuery = new URLSearchParams({ name: hostname, status: 'active' })
  zoneQuery.set('account.id', accountId)
  const zoneResponse = await fetchJson(
    `${baseUrl}/zones?${zoneQuery.toString()}`,
    'Cloudflare production zone'
  )
  const zoneEnvelope = requireRecord(zoneResponse, 'Cloudflare zone response')
  const zones = Array.isArray(zoneEnvelope.result) ? zoneEnvelope.result : []
  if (zones.length !== 1)
    throw new Error(
      'Cloudflare account must own exactly one active production zone'
    )
  const zoneId = requireString(
    requireRecord(zones[0], 'Cloudflare zone result').id,
    'Cloudflare production zone ID'
  )
  if (!/^[a-f0-9]{32}$/.test(zoneId))
    throw new Error('Cloudflare production zone ID is malformed')

  const routesResponse = await fetchJson(
    `${baseUrl}/zones/${encodeURIComponent(zoneId)}/workers/routes`,
    'Cloudflare Worker routes'
  )
  const domainsResponse = await fetchJson(
    `${baseUrl}/accounts/${encodeURIComponent(accountId)}/workers/domains?hostname=${encodeURIComponent(hostname)}`,
    'Cloudflare production Worker domain'
  )
  return parseWorkerRoutingState({
    zoneResponse,
    routesResponse,
    domainsResponse,
    accountId,
    workerName,
    hostname
  })
}

export function validateMergedReleaseEvent(
  releaseSha: string,
  env: NodeJS.ProcessEnv = process.env
): void {
  if (
    !/^[a-f0-9]{40}$/.test(releaseSha) ||
    env.GITHUB_ACTIONS !== 'true' ||
    env.CI !== 'true' ||
    env.GITHUB_EVENT_NAME !== 'push' ||
    env.GITHUB_REF !== 'refs/heads/main' ||
    env.GITHUB_SHA !== releaseSha ||
    env.GITHUB_REPOSITORY !== REPOSITORY
  ) {
    throw new Error(
      'Merged release requires the GitHub Actions push of the exact main SHA'
    )
  }
}

type ReleaseMode = 'dry-run' | 'merged'

function parseReleaseInputs(mode: ReleaseMode): {
  releaseSha: string
  accountId: string
  workersDev: boolean
  pullRequestNumber?: number
  apiToken?: string
  evidenceDirectory?: string
  timeoutMs: number
} {
  const releaseSha = requireString(
    process.env.KOH_RELEASE_SHA,
    'KOH_RELEASE_SHA'
  )
  if (!/^[a-f0-9]{40}$/.test(releaseSha))
    throw new Error('KOH_RELEASE_SHA must be a full 40-character Git SHA')
  if (mode !== 'dry-run') validateMergedReleaseEvent(releaseSha)
  const accountId = validateReleaseAccountId(
    process.env.CLOUDFLARE_ACCOUNT_ID,
    process.env.KOH_EXPECTED_CLOUDFLARE_ACCOUNT_ID
  )
  const workersDevSetting = process.env.KOH_WORKERS_DEV_ENABLED
  if (workersDevSetting !== 'true' && workersDevSetting !== 'false') {
    throw new Error(
      'KOH_WORKERS_DEV_ENABLED must be explicitly set from the current Worker read-back'
    )
  }
  if (process.env.KOH_PREVIEW_URLS_ENABLED !== 'false') {
    throw new Error(
      'Code-only release requires KOH_PREVIEW_URLS_ENABLED=false from the current exposure read-back'
    )
  }
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
    throw new Error(
      'Refusing Cloudflare API access with TLS certificate validation disabled'
    )
  }
  const inputs: ReturnType<typeof parseReleaseInputs> = {
    releaseSha,
    accountId,
    workersDev: workersDevSetting === 'true',
    timeoutMs: parseTimeout(process.env.KOH_DEPLOY_TIMEOUT_MS)
  }
  if (mode !== 'dry-run') {
    if (
      process.env.CLOUDFLARE_API_TOKEN === undefined ||
      process.env.CLOUDFLARE_API_TOKEN.length === 0 ||
      process.env.CLOUDFLARE_API_TOKEN.startsWith('op://')
    ) {
      throw new Error(
        'Release requires a resolved CLOUDFLARE_API_TOKEN from an approved secret provider'
      )
    }
    if (process.env.KOH_RELEASE_PR !== undefined) {
      throw new Error(
        'Production release derives authorized PR #7 from the exact source commit; KOH_RELEASE_PR must not be set'
      )
    }
    inputs.apiToken = process.env.CLOUDFLARE_API_TOKEN
    inputs.evidenceDirectory = requireString(
      process.env.KOH_RELEASE_EVIDENCE_DIR,
      'KOH_RELEASE_EVIDENCE_DIR'
    )
  } else if (process.env.CLOUDFLARE_API_TOKEN !== undefined) {
    throw new Error('Dry-run must not receive a Cloudflare API token')
  }
  return inputs
}

export function parseReleasePullRequestNumber(value: unknown): number {
  if (value !== undefined && value !== String(RELEASE_PULL_REQUEST_NUMBER))
    throw new Error(
      `KOH_RELEASE_PR is pinned to pull request #${RELEASE_PULL_REQUEST_NUMBER}`
    )
  return RELEASE_PULL_REQUEST_NUMBER
}

async function verifyProductionCareerPage(
  releaseSha: string,
  timeoutMs: number
): Promise<ReturnType<typeof parseProductionCareerPageResponse>> {
  const url = new URL(`https://${RELEASE_HOSTNAME}/`)
  url.searchParams.set('koh-release-check', releaseSha)
  url.searchParams.set(
    'nonce',
    createHash('sha256')
      .update(`${releaseSha}:${process.pid}:${Date.now()}`)
      .digest('hex')
  )
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      accept: 'text/html',
      'cache-control': 'no-cache, no-store',
      pragma: 'no-cache'
    },
    signal: AbortSignal.timeout(Math.min(timeoutMs, 60_000))
  })
  const body = await response.text()
  return parseProductionCareerPageResponse({
    status: response.status,
    contentType: response.headers.get('content-type'),
    finalUrl: response.url,
    redirected: response.redirected,
    body
  })
}

async function inspectFailedPromotion({
  binary,
  repoRoot,
  evidencePath,
  accountId,
  apiToken,
  configPath,
  envFilePath,
  timeoutMs,
  previousVersionId,
  candidateVersionId
}: {
  binary: string
  repoRoot: string
  evidencePath: string
  accountId: string
  apiToken: string
  configPath: string
  envFilePath: string
  timeoutMs: number
  previousVersionId: string
  candidateVersionId: string
}): Promise<Record<string, unknown>> {
  try {
    const statusRun = await runWrangler({
      binary,
      repoRoot,
      evidencePath,
      label: 'failure-recovery-active-deployment-status',
      args: ['deployments', 'status', '--name', WORKER_NAME, '--json'],
      accountId,
      apiToken,
      configPath,
      envFilePath,
      timeoutMs: Math.min(timeoutMs, 60_000),
      abortSignal: AbortSignal.timeout(Math.min(timeoutMs, 60_000)),
      persistStdout: false
    })
    checkCommandSucceeded(
      statusRun,
      'Failure recovery active deployment read-back'
    )
    const active = parseDeploymentStatusOutput(statusRun.stdout, {})
    const decision = classifyPromotionRecovery(
      active,
      previousVersionId,
      candidateVersionId
    )
    return {
      ...decision,
      deployment_id: active.id,
      previous_version_id: previousVersionId,
      candidate_version_id: candidateVersionId,
      manual_action:
        decision.outcome === 'candidate-active-manual-rollback-required'
          ? 'Candidate traffic is confirmed; manually restore the previous Version only after re-reading active traffic.'
          : decision.outcome === 'previous-version-still-active'
            ? 'The previous Version is still active; no rollback is required.'
            : 'Active traffic is not a known safe state; reconcile Cloudflare manually before retrying.'
    }
  } catch {
    return {
      outcome: 'active-state-unverified-manual-review',
      active_version_id: null,
      deployment_id: null,
      previous_version_id: previousVersionId,
      candidate_version_id: candidateVersionId,
      manual_action:
        'Active traffic could not be verified; read Cloudflare deployment status manually before any rollback or retry.'
    }
  }
}

async function runGuardedDeployment({
  mode,
  abortSignal
}: {
  mode: ReleaseMode
  abortSignal: AbortSignal
}): Promise<Record<string, unknown>> {
  const dryRun = mode === 'dry-run'
  const release = !dryRun
  const inputs = parseReleaseInputs(mode)
  const repoRoot = realpathSync(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  )
  const releaseSha = verifyCleanReleaseTree({
    repoRoot,
    expectedSha: inputs.releaseSha
  })
  const wranglerBinary = verifyPinnedWrangler(repoRoot)
  const evidence = createEvidenceDirectory(inputs.evidenceDirectory)
  const evidencePath = evidence.path
  const configPath = path.join(evidencePath, 'wrangler.jsonc')
  const envFilePath = path.join(evidencePath, 'empty.env')
  const protectedFiles = new Map<string, FileIdentity>()
  let stage = 'local-preflight'
  let uploadedVersionId: string | undefined
  let deploymentId: string | undefined
  let promotionAttempted = false
  let beforeDeployment:
    ReturnType<typeof parseDeploymentStatusOutput> | undefined

  try {
    const sourceConfig = readFileSync(
      path.join(repoRoot, 'wrangler.jsonc'),
      'utf8'
    )
    const config = buildRouteFreeConfig({
      sourceText: sourceConfig,
      repoRoot,
      accountId: inputs.accountId,
      workersDev: inputs.workersDev,
      validateArtifacts: false
    })
    if (
      config.name !== WORKER_NAME ||
      config.workers_dev !== inputs.workersDev ||
      config.preview_urls !== false ||
      Object.hasOwn(config, 'route') ||
      Object.hasOwn(config, 'routes')
    ) {
      throw new Error(
        'Generated config does not satisfy the explicit route-free Worker target'
      )
    }
    protectedFiles.set(
      configPath,
      writeNoClobber(configPath, `${JSON.stringify(config, null, 2)}\n`)
    )
    protectedFiles.set(
      envFilePath,
      writeNoClobber(
        envFilePath,
        '# Repository .env files are intentionally not loaded.\n'
      )
    )
    const manifest = {
      repository: REPOSITORY,
      release_sha: releaseSha,
      worker: WORKER_NAME,
      account_id: inputs.accountId,
      workers_dev: inputs.workersDev,
      preview_urls: false,
      mode,
      created_at: new Date().toISOString()
    }
    writeNoClobber(
      path.join(evidencePath, 'manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`
    )
    validateEvidenceTree(evidencePath, evidence.identity, protectedFiles)

    const message = `${WORKER_NAME} release ${releaseSha}`
    stage = 'worker-build'
    await runWorkerBuild({
      repoRoot,
      evidencePath,
      timeoutMs: inputs.timeoutMs,
      abortSignal
    })
    if (
      verifyCleanReleaseTree({ repoRoot, expectedSha: releaseSha }) !==
      releaseSha
    )
      throw new Error('Build changed the tracked release tree')
    const validatedConfig = buildRouteFreeConfig({
      sourceText: sourceConfig,
      repoRoot,
      accountId: inputs.accountId,
      workersDev: inputs.workersDev
    })
    if (JSON.stringify(validatedConfig) !== JSON.stringify(config))
      throw new Error('Worker target configuration changed during build')
    const artifactHash = artifactFingerprint(validatedConfig, repoRoot)
    stage = 'local-preflight'
    let beforeBindings:
      ReturnType<typeof parseVersionViewOutput>['bindings'] | undefined
    let beforeExposure:
      ReturnType<typeof parseWorkerSubdomainResponse> | undefined
    let beforeRouting: ReturnType<typeof parseWorkerRoutingState> | undefined
    let verifiedPr:
      | {
          number: number
          headRef: string
          headSha: string
          baseRef: string
          mergeCommitSha?: string
        }
      | undefined

    if (release) {
      verifiedPr = await verifyMergedPullRequest({
        repoRoot,
        expectedSha: releaseSha,
        expectedPullRequestNumber: RELEASE_PULL_REQUEST_NUMBER,
        evidencePath,
        label: 'before-upload',
        timeoutMs: inputs.timeoutMs,
        abortSignal
      })
      if (
        verifyCleanReleaseTree({ repoRoot, expectedSha: releaseSha }) !==
        releaseSha
      )
        throw new Error('Release tree changed before preflight')

      stage = 'remote-preflight'
      const currentStatusRun = await runWrangler({
        binary: wranglerBinary,
        repoRoot,
        evidencePath,
        label: 'preflight-deployments-status',
        args: ['deployments', 'status', '--name', WORKER_NAME, '--json'],
        accountId: inputs.accountId,
        apiToken: inputs.apiToken,
        configPath,
        envFilePath,
        timeoutMs: inputs.timeoutMs,
        abortSignal,
        persistStdout: false
      })
      checkCommandSucceeded(
        currentStatusRun,
        'Pre-upload deployments status read-back'
      )
      beforeDeployment = parseDeploymentStatusOutput(
        currentStatusRun.stdout,
        {}
      )
      const currentVersionId = beforeDeployment.versions[0].versionId
      const currentVersionRun = await runWrangler({
        binary: wranglerBinary,
        repoRoot,
        evidencePath,
        label: 'preflight-active-version',
        args: [
          'versions',
          'view',
          currentVersionId,
          '--name',
          WORKER_NAME,
          '--json'
        ],
        accountId: inputs.accountId,
        apiToken: inputs.apiToken,
        configPath,
        envFilePath,
        timeoutMs: inputs.timeoutMs,
        abortSignal,
        persistStdout: false
      })
      checkCommandSucceeded(
        currentVersionRun,
        'Pre-upload active Version read-back'
      )
      const currentVersion = parseVersionViewOutput(currentVersionRun.stdout, {
        versionId: currentVersionId
      })
      beforeBindings = currentVersion.bindings
      beforeExposure = await readWorkerSubdomainState({
        accountId: inputs.accountId,
        workerName: WORKER_NAME,
        apiToken: inputs.apiToken!,
        expectedWorkersDev: inputs.workersDev,
        timeoutMs: inputs.timeoutMs,
        abortSignal
      })
      beforeRouting = await readWorkerRoutingState({
        accountId: inputs.accountId,
        workerName: WORKER_NAME,
        hostname: RELEASE_HOSTNAME,
        apiToken: inputs.apiToken!,
        timeoutMs: inputs.timeoutMs,
        abortSignal
      })
      createProcessResultFile(evidencePath, 'preflight-worker-exposure', {
        worker: WORKER_NAME,
        workers_dev: beforeExposure.workersDev,
        preview_urls: beforeExposure.previewsEnabled
      })
      createProcessResultFile(evidencePath, 'preflight-production-routing', {
        hostname: beforeRouting.hostname,
        worker: beforeRouting.worker,
        zone_id: beforeRouting.zoneId,
        route_count: beforeRouting.routeCount
      })
      createProcessResultFile(evidencePath, 'preflight-remote-state', {
        worker: WORKER_NAME,
        deployment_id: beforeDeployment.id,
        deployment_created_on: beforeDeployment.createdOn,
        active_versions: beforeDeployment.versions,
        active_message: beforeDeployment.message,
        bindings: beforeBindings
      })
      validateEvidenceTree(evidencePath, evidence.identity, protectedFiles)
    }

    if (
      verifyCleanReleaseTree({ repoRoot, expectedSha: releaseSha }) !==
      releaseSha
    )
      throw new Error('Release tree changed before Version upload')
    if (artifactFingerprint(config, repoRoot) !== artifactHash)
      throw new Error('Build artifacts changed before Version upload')
    stage = 'version-upload'
    const uploadRun = await runWrangler({
      binary: wranglerBinary,
      repoRoot,
      evidencePath,
      label: dryRun ? 'dry-run-upload' : 'version-upload',
      args: [
        'versions',
        'upload',
        ...(dryRun ? ['--dry-run'] : []),
        '--strict',
        '--keep-vars',
        '--minify',
        '--name',
        WORKER_NAME,
        '--message',
        message
      ],
      accountId: inputs.accountId,
      apiToken: inputs.apiToken,
      configPath,
      envFilePath,
      timeoutMs: inputs.timeoutMs,
      abortSignal
    })
    checkCommandSucceeded(
      uploadRun,
      dryRun ? 'Version upload dry-run' : 'Version upload'
    )
    const uploadOutput = readStructuredOutput(
      path.join(
        evidencePath,
        `${dryRun ? 'dry-run-upload' : 'version-upload'}.wrangler-output.jsonl`
      )
    )
    const uploadSummary = parseVersionUploadOutput(uploadOutput, {
      workerName: WORKER_NAME,
      dryRun
    })
    if (dryRun) {
      const result = {
        ok: true,
        phase: 'dry-run',
        worker: WORKER_NAME,
        release_sha: releaseSha,
        route_free_config: true,
        workers_dev: inputs.workersDev,
        preview_urls: false,
        version_id: null,
        bundle_size: uploadSummary.bundleSize,
        evidence_directory: evidencePath
      }
      writeNoClobber(
        path.join(evidencePath, 'summary.json'),
        `${JSON.stringify(result, null, 2)}\n`
      )
      validateEvidenceTree(evidencePath, evidence.identity, protectedFiles)
      return result
    }

    uploadedVersionId = uploadSummary.versionId ?? undefined
    if (uploadedVersionId === undefined)
      throw new Error('Version upload returned no remote Version ID')
    stage = 'version-readback'
    const uploadedVersionRun = await runWrangler({
      binary: wranglerBinary,
      repoRoot,
      evidencePath,
      label: 'uploaded-version-readback',
      args: [
        'versions',
        'view',
        uploadedVersionId,
        '--name',
        WORKER_NAME,
        '--json'
      ],
      accountId: inputs.accountId,
      apiToken: inputs.apiToken,
      configPath,
      envFilePath,
      timeoutMs: inputs.timeoutMs,
      abortSignal,
      persistStdout: false
    })
    checkCommandSucceeded(uploadedVersionRun, 'Uploaded Version read-back')
    const uploadedVersion = parseVersionViewOutput(uploadedVersionRun.stdout, {
      versionId: uploadedVersionId,
      message
    })
    if (!sameBindings(beforeBindings ?? [], uploadedVersion.bindings)) {
      throw new Error(
        'Uploaded Version binding names/types differ from the active Version; promotion refused'
      )
    }
    createProcessResultFile(evidencePath, 'uploaded-version-verified', {
      worker: WORKER_NAME,
      version_id: uploadedVersion.id,
      created_on: uploadedVersion.createdOn,
      message: uploadedVersion.message,
      bindings: uploadedVersion.bindings,
      bundle_size: uploadSummary.bundleSize
    })

    stage = 'pre-promotion-check'
    if (
      verifyCleanReleaseTree({ repoRoot, expectedSha: releaseSha }) !==
      releaseSha
    )
      throw new Error('Release tree changed before promotion')
    if (artifactFingerprint(config, repoRoot) !== artifactHash)
      throw new Error('Build artifacts changed before promotion')
    const prBeforePromotion = await verifyMergedPullRequest({
      repoRoot,
      expectedSha: releaseSha,
      expectedPullRequestNumber: RELEASE_PULL_REQUEST_NUMBER,
      evidencePath,
      label: 'before-promotion',
      timeoutMs: inputs.timeoutMs,
      abortSignal
    })
    if (
      verifiedPr === undefined ||
      prBeforePromotion.number !== verifiedPr.number ||
      prBeforePromotion.headSha !== verifiedPr.headSha ||
      prBeforePromotion.mergeCommitSha !== verifiedPr.mergeCommitSha
    )
      throw new Error('PR identity changed between upload and promotion')
    if (beforeExposure === undefined)
      throw new Error('Preflight Worker exposure state is missing')
    const exposureBeforePromotion = await readWorkerSubdomainState({
      accountId: inputs.accountId,
      workerName: WORKER_NAME,
      apiToken: inputs.apiToken!,
      expectedWorkersDev: inputs.workersDev,
      timeoutMs: inputs.timeoutMs,
      abortSignal
    })
    if (
      JSON.stringify(exposureBeforePromotion) !== JSON.stringify(beforeExposure)
    ) {
      throw new Error(
        'Worker exposure changed after upload; refusing promotion'
      )
    }
    if (beforeRouting === undefined)
      throw new Error('Preflight production routing state is missing')
    const routingBeforePromotion = await readWorkerRoutingState({
      accountId: inputs.accountId,
      workerName: WORKER_NAME,
      hostname: RELEASE_HOSTNAME,
      apiToken: inputs.apiToken!,
      timeoutMs: inputs.timeoutMs,
      abortSignal
    })
    if (
      JSON.stringify(routingBeforePromotion) !== JSON.stringify(beforeRouting)
    )
      throw new Error(
        'Production domain or Worker routes changed after upload; refusing promotion'
      )
    createProcessResultFile(evidencePath, 'pre-promotion-worker-exposure', {
      worker: WORKER_NAME,
      workers_dev: exposureBeforePromotion.workersDev,
      preview_urls: exposureBeforePromotion.previewsEnabled
    })
    createProcessResultFile(evidencePath, 'pre-promotion-production-routing', {
      hostname: routingBeforePromotion.hostname,
      worker: routingBeforePromotion.worker,
      zone_id: routingBeforePromotion.zoneId,
      route_count: routingBeforePromotion.routeCount
    })

    const activeStatusRun = await runWrangler({
      binary: wranglerBinary,
      repoRoot,
      evidencePath,
      label: 'pre-promotion-deployments-status',
      args: ['deployments', 'status', '--name', WORKER_NAME, '--json'],
      accountId: inputs.accountId,
      apiToken: inputs.apiToken,
      configPath,
      envFilePath,
      timeoutMs: inputs.timeoutMs,
      abortSignal,
      persistStdout: false
    })
    checkCommandSucceeded(
      activeStatusRun,
      'Pre-promotion deployments status read-back'
    )
    const currentDeployment = parseDeploymentStatusOutput(
      activeStatusRun.stdout,
      {}
    )
    if (
      beforeDeployment === undefined ||
      currentDeployment.id !== beforeDeployment.id ||
      JSON.stringify(currentDeployment.versions) !==
        JSON.stringify(beforeDeployment.versions)
    ) {
      throw new Error(
        'Active deployment changed after upload; refusing to promote over a concurrent release'
      )
    }

    stage = 'promotion-requested'
    promotionAttempted = true
    const promotionRun = await runWrangler({
      binary: wranglerBinary,
      repoRoot,
      evidencePath,
      label: 'promote-version',
      args: [
        'versions',
        'deploy',
        '--name',
        WORKER_NAME,
        '--version-id',
        uploadedVersionId,
        '--percentage',
        '100',
        '--message',
        message,
        '--yes'
      ],
      accountId: inputs.accountId,
      apiToken: inputs.apiToken,
      configPath,
      envFilePath,
      timeoutMs: inputs.timeoutMs,
      abortSignal
    })
    checkCommandSucceeded(promotionRun, 'Version promotion')

    stage = 'post-promotion-readback'
    const statusRun = await runWrangler({
      binary: wranglerBinary,
      repoRoot,
      evidencePath,
      label: 'post-promotion-deployments-status',
      args: ['deployments', 'status', '--name', WORKER_NAME, '--json'],
      accountId: inputs.accountId,
      apiToken: inputs.apiToken,
      configPath,
      envFilePath,
      timeoutMs: inputs.timeoutMs,
      abortSignal,
      persistStdout: false
    })
    checkCommandSucceeded(
      statusRun,
      'Post-promotion deployments status read-back'
    )
    const deployment = parseDeploymentStatusOutput(statusRun.stdout, {
      versionId: uploadedVersionId,
      message
    })
    if (deployment.id === beforeDeployment.id)
      throw new Error(
        'Post-promotion read-back returned the prior deployment ID'
      )
    deploymentId = deployment.id

    const activeVersionRun = await runWrangler({
      binary: wranglerBinary,
      repoRoot,
      evidencePath,
      label: 'post-promotion-version-readback',
      args: [
        'versions',
        'view',
        uploadedVersionId,
        '--name',
        WORKER_NAME,
        '--json'
      ],
      accountId: inputs.accountId,
      apiToken: inputs.apiToken,
      configPath,
      envFilePath,
      timeoutMs: inputs.timeoutMs,
      abortSignal,
      persistStdout: false
    })
    checkCommandSucceeded(activeVersionRun, 'Post-promotion Version read-back')
    const activeVersion = parseVersionViewOutput(activeVersionRun.stdout, {
      versionId: uploadedVersionId,
      message
    })
    if (!sameBindings(beforeBindings ?? [], activeVersion.bindings))
      throw new Error(
        'Active Version binding names/types changed after promotion'
      )
    const afterExposure = await readWorkerSubdomainState({
      accountId: inputs.accountId,
      workerName: WORKER_NAME,
      apiToken: inputs.apiToken!,
      expectedWorkersDev: inputs.workersDev,
      timeoutMs: inputs.timeoutMs,
      abortSignal
    })
    const afterRouting = await readWorkerRoutingState({
      accountId: inputs.accountId,
      workerName: WORKER_NAME,
      hostname: RELEASE_HOSTNAME,
      apiToken: inputs.apiToken!,
      timeoutMs: inputs.timeoutMs,
      abortSignal
    })
    if (
      beforeExposure === undefined ||
      JSON.stringify(afterExposure) !== JSON.stringify(beforeExposure)
    ) {
      throw new Error(
        'Post-promotion Worker exposure read-back did not match preflight'
      )
    }
    if (
      beforeRouting === undefined ||
      JSON.stringify(afterRouting) !== JSON.stringify(beforeRouting)
    ) {
      throw new Error(
        'Post-promotion production domain or route read-back did not match preflight'
      )
    }
    createProcessResultFile(evidencePath, 'post-promotion-worker-exposure', {
      worker: WORKER_NAME,
      workers_dev: afterExposure.workersDev,
      preview_urls: afterExposure.previewsEnabled
    })
    createProcessResultFile(evidencePath, 'post-promotion-production-routing', {
      hostname: afterRouting.hostname,
      worker: afterRouting.worker,
      zone_id: afterRouting.zoneId,
      route_count: afterRouting.routeCount
    })

    const prAfterPromotion = await verifyMergedPullRequest({
      repoRoot,
      expectedSha: releaseSha,
      expectedPullRequestNumber: RELEASE_PULL_REQUEST_NUMBER,
      evidencePath,
      label: 'after-promotion',
      timeoutMs: inputs.timeoutMs,
      abortSignal
    })
    if (
      verifiedPr === undefined ||
      prAfterPromotion.number !== verifiedPr.number ||
      prAfterPromotion.headSha !== verifiedPr.headSha ||
      prAfterPromotion.mergeCommitSha !== verifiedPr.mergeCommitSha
    ) {
      throw new Error('PR identity changed after promotion')
    }
    stage = 'post-promotion-http-smoke'
    const liveHttpSmoke = await verifyProductionCareerPage(
      releaseSha,
      inputs.timeoutMs
    )
    createProcessResultFile(evidencePath, 'post-promotion-public-http-smoke', {
      ...liveHttpSmoke,
      release_sha: releaseSha
    })
    stage = 'promoted'
    const result = {
      ok: true,
      phase: 'promoted',
      repository: REPOSITORY,
      pull_request: prAfterPromotion.number,
      pull_request_state: 'closed',
      pull_request_merged: true,
      pull_request_merge_commit: prAfterPromotion.mergeCommitSha ?? null,
      pull_request_head: prAfterPromotion.headSha,
      pull_request_base: prAfterPromotion.baseRef,
      worker: WORKER_NAME,
      release_sha: releaseSha,
      previous_version_id: beforeDeployment?.versions[0]?.versionId ?? null,
      version_id: uploadedVersionId,
      deployment_id: deployment.id,
      deployment_created_on: deployment.createdOn,
      active_percentage: deployment.versions[0].percentage,
      bindings: activeVersion.bindings,
      workers_dev: inputs.workersDev,
      preview_urls: false,
      route_free_config: true,
      production_hostname: afterRouting.hostname,
      production_zone_id: afterRouting.zoneId,
      production_route_count: afterRouting.routeCount,
      live_http_smoke: liveHttpSmoke,
      evidence_directory: evidencePath
    }
    writeNoClobber(
      path.join(evidencePath, 'summary.json'),
      `${JSON.stringify(result, null, 2)}\n`
    )
    validateEvidenceTree(evidencePath, evidence.identity, protectedFiles)
    writeNoClobber(
      path.join(evidencePath, 'release-record.json'),
      `${JSON.stringify(result, null, 2)}\n`
    )
    return result
  } catch (error) {
    const previousVersionId = beforeDeployment?.versions[0]?.versionId
    let recovery: Record<string, unknown> = {
      outcome: promotionAttempted
        ? 'active-state-unverified-manual-review'
        : 'promotion-not-requested',
      active_version_id: null,
      deployment_id: null,
      previous_version_id: previousVersionId ?? null,
      candidate_version_id: uploadedVersionId ?? null,
      manual_action: promotionAttempted
        ? 'Read Cloudflare active traffic manually before any rollback or retry.'
        : 'No promotion was requested; no production rollback is required.'
    }
    if (
      promotionAttempted &&
      previousVersionId !== undefined &&
      uploadedVersionId !== undefined &&
      inputs.apiToken !== undefined
    ) {
      try {
        validateEvidenceTree(evidencePath, evidence.identity, protectedFiles)
        recovery = await inspectFailedPromotion({
          binary: wranglerBinary,
          repoRoot,
          evidencePath,
          accountId: inputs.accountId,
          apiToken: inputs.apiToken,
          configPath,
          envFilePath,
          timeoutMs: inputs.timeoutMs,
          previousVersionId,
          candidateVersionId: uploadedVersionId
        })
      } catch {
        recovery = {
          outcome: 'evidence-identity-uncertain-manual-review',
          active_version_id: null,
          deployment_id: null,
          previous_version_id: previousVersionId,
          candidate_version_id: uploadedVersionId,
          manual_action:
            'Release evidence identity could not be verified; inspect Cloudflare active traffic manually before any rollback or retry.'
        }
      }
    }
    try {
      validateEvidenceTree(evidencePath, evidence.identity, protectedFiles)
      writeNoClobber(
        path.join(evidencePath, 'failure.json'),
        `${JSON.stringify(
          {
            ok: false,
            stage,
            previous_version_id: previousVersionId ?? null,
            uploaded_version_id: uploadedVersionId ?? null,
            deployment_id: deploymentId ?? null,
            recovery,
            error: error instanceof Error ? error.message : 'unknown error',
            evidence_directory: evidencePath
          },
          null,
          2
        )}\n`
      )
      writeNoClobber(
        path.join(evidencePath, 'release-record.json'),
        `${JSON.stringify(
          {
            ok: false,
            repository: REPOSITORY,
            pull_request: RELEASE_PULL_REQUEST_NUMBER,
            release_sha: inputs.releaseSha,
            worker: WORKER_NAME,
            stage,
            previous_version_id: previousVersionId ?? null,
            candidate_version_id: uploadedVersionId ?? null,
            deployment_id: deploymentId ?? null,
            recovery
          },
          null,
          2
        )}\n`
      )
      validateEvidenceTree(evidencePath, evidence.identity, protectedFiles)
    } catch {
      // Preserve the evidence directory as-is when its identity or contents are uncertain.
    }
    throw error
  }
}

async function cliMain(abortSignal: AbortSignal): Promise<void> {
  const parsed = parseArgs({
    args: process.argv.slice(2),
    options: {
      'merged-release': { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean' }
    },
    allowPositionals: false,
    strict: true
  })
  if (parsed.values.help === true) {
    process.stdout.write(
      'Usage: node scripts/deploy-worker.mts (--dry-run | --merged-release)\n'
    )
    return
  }
  const modes = [
    parsed.values['dry-run'] === true,
    parsed.values['merged-release'] === true
  ]
  if (modes.filter(Boolean).length !== 1)
    throw new Error('Choose exactly one of --dry-run or --merged-release')
  const mode: ReleaseMode =
    parsed.values['dry-run'] === true ? 'dry-run' : 'merged'
  process.umask(0o077)
  const result = await runGuardedDeployment({ mode, abortSignal })
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

const currentModulePath = realpathSync(fileURLToPath(import.meta.url))
const invokedPath =
  process.argv[1] === undefined
    ? undefined
    : realpathSync(path.resolve(process.argv[1]))
if (invokedPath === currentModulePath) {
  const abortController = new AbortController()
  const stop = (): void => abortController.abort()
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  try {
    await cliMain(abortController.signal)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    process.stderr.write(`${JSON.stringify({ ok: false, error: message })}\n`)
    process.exitCode = 1
  } finally {
    process.removeListener('SIGINT', stop)
    process.removeListener('SIGTERM', stop)
  }
}
