import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export const REPOSITORY = 'koh110/kohsweb'
export const RELEASE_PULL_REQUEST_NUMBER = 9

export function isEligibleMergedReleasePullRequest(
  value,
  expectedSha,
  repository = REPOSITORY
) {
  if (typeof expectedSha !== 'string' || !/^[a-f0-9]{40}$/.test(expectedSha)) {
    throw new Error('Expected release SHA must be a full 40-character Git SHA')
  }
  if (!Array.isArray(value)) {
    throw new Error('Associated pull requests must be an array')
  }

  const pullRequests = value.flat(Infinity)
  if (
    pullRequests.some(
      (pullRequest) =>
        !pullRequest ||
        typeof pullRequest !== 'object' ||
        Array.isArray(pullRequest)
    )
  ) {
    throw new Error('Associated pull request entry must be an object')
  }

  const authorized = pullRequests.filter(
    (pullRequest) => pullRequest.number === RELEASE_PULL_REQUEST_NUMBER
  )
  if (authorized.length > 1) {
    throw new Error('More than one associated entry matched authorized PR #9')
  }
  if (authorized.length === 0) return false

  const [pullRequest] = authorized
  if (
    typeof pullRequest.state !== 'string' ||
    (pullRequest.merged_at !== null &&
      typeof pullRequest.merged_at !== 'string') ||
    typeof pullRequest.merge_commit_sha !== 'string' ||
    !pullRequest.base ||
    typeof pullRequest.base !== 'object' ||
    typeof pullRequest.base.ref !== 'string' ||
    !pullRequest.base.repo ||
    typeof pullRequest.base.repo !== 'object' ||
    typeof pullRequest.base.repo.full_name !== 'string' ||
    !pullRequest.head ||
    typeof pullRequest.head !== 'object' ||
    !pullRequest.head.repo ||
    typeof pullRequest.head.repo !== 'object' ||
    typeof pullRequest.head.repo.full_name !== 'string'
  ) {
    throw new Error('Associated PR #9 metadata is incomplete')
  }

  return (
    pullRequest.state === 'closed' &&
    typeof pullRequest.merged_at === 'string' &&
    pullRequest.merged_at.length > 0 &&
    pullRequest.merge_commit_sha === expectedSha &&
    pullRequest.base.ref === 'main' &&
    pullRequest.base.repo.full_name === repository &&
    pullRequest.head.repo.full_name === repository
  )
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const inputPath = process.argv[2]
    if (!inputPath)
      throw new Error('A GitHub associated-PR JSON file is required')
    const sha = process.env.GITHUB_SHA
    const repository = process.env.GITHUB_REPOSITORY
    if (repository !== REPOSITORY) {
      throw new Error(`Expected GitHub repository ${REPOSITORY}`)
    }
    const associatedPullRequests = JSON.parse(readFileSync(inputPath, 'utf8'))
    const eligible = isEligibleMergedReleasePullRequest(
      associatedPullRequests,
      sha,
      repository
    )
    process.stdout.write(`${eligible}\n`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    process.stderr.write(`${JSON.stringify({ ok: false, error: message })}\n`)
    process.exitCode = 1
  }
}
