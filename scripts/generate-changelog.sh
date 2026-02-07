#!/usr/bin/env bash
set -euo pipefail

# Generate a CHANGELOG entry for a given version range.
# Usage: ./scripts/generate-changelog.sh [version_tag]
#   version_tag: tag to generate changelog for (default: latest tag)
#
# Example:
#   ./scripts/generate-changelog.sh v0.16.0

REPO_URL="https://github.com/unhappychoice/mdts"

resolve_version_tag() {
  if [[ -n "${1:-}" ]]; then
    echo "$1"
  else
    git describe --tags --abbrev=0
  fi
}

resolve_previous_tag() {
  git describe --tags --abbrev=0 "${1}^" 2>/dev/null || echo ""
}

build_pr_map() {
  local range="$1"
  declare -gA PR_MAP=()
  while IFS= read -r line; do
    local merge_hash pr_num branch_commits
    merge_hash="${line%%	*}"
    local subject="${line#*	}"
    pr_num=$(echo "$subject" | grep -oP '#\K[0-9]+' || true)
    [[ -z "$pr_num" ]] && continue
    branch_commits=$(git log "${merge_hash}^1..${merge_hash}^2" --format="%h" 2>/dev/null || true)
    for c in $branch_commits; do
      PR_MAP["$c"]="$pr_num"
    done
  done < <(git log "$range" --merges --format="%h	%s")
}

format_entry() {
  local hash="$1" msg="$2"
  local commit_link="[${hash}](${REPO_URL}/commit/${hash})"
  local pr="${PR_MAP[$hash]:-}"
  local pr_link=""
  [[ -n "$pr" ]] && pr_link=" ([#${pr}](${REPO_URL}/pull/${pr}))"
  echo "- ${msg} (${commit_link})${pr_link}"
}

strip_prefix() {
  echo "$1" | sed -E 's/^[a-z]+(\([^)]*\))?!?: //'
}

main() {
  local version_tag
  version_tag=$(resolve_version_tag "${1:-}")
  local previous_tag
  previous_tag=$(resolve_previous_tag "$version_tag")

  local range
  if [[ -n "$previous_tag" ]]; then
    range="${previous_tag}..${version_tag}"
  else
    range="$version_tag"
  fi

  build_pr_map "$range"

  local -a feats=() fixes=() docs=() refactors=() improvements=() deps=() chores=() styles=() tests=()

  while IFS=$'\t' read -r hash subject; do
    [[ -z "$hash" ]] && continue
    # Skip version bump commits
    [[ "$subject" =~ ^[0-9]+\.[0-9]+ ]] && continue

    local msg
    msg=$(strip_prefix "$subject")
    local entry
    entry=$(format_entry "$hash" "$msg")

    case "$subject" in
      feat:*|feat\(*)                        feats+=("$entry") ;;
      fix:*|fix\(*)                          fixes+=("$entry") ;;
      docs:*|docs\(*)                        docs+=("$entry") ;;
      refactor:*|refactor\(*)                refactors+=("$entry") ;;
      perf:*|perf\(*)                        improvements+=("$entry") ;;
      style:*|style\(*)                      styles+=("$entry") ;;
      test:*|test\(*)                        tests+=("$entry") ;;
      chore\(deps\):*|chore\(deps-dev\):*)   deps+=("$entry") ;;
      chore:*|chore\(*)                      chores+=("$entry") ;;
      *)                                     chores+=("$entry") ;;
    esac
  done < <(git log "$range" --no-merges --format="%h	%s")

  echo "## ${version_tag}"

  local -a sections=(
    "✨ Features|feats"
    "🐛 Bug Fixes|fixes"
    "👍 Improvements|improvements"
    "📝 Documentation|docs"
    "♻️ Refactor|refactors"
    "👕 Code Style|styles"
    "🆙 Update Packages|deps"
    "💚 CI/Test|tests"
    "🛠️ Chores|chores"
  )

  for section in "${sections[@]}"; do
    local title="${section%%|*}"
    local var="${section##*|}"
    local -n arr="$var"
    if [[ ${#arr[@]} -gt 0 ]]; then
      echo ""
      echo "### ${title}"
      printf '%s\n' "${arr[@]}"
    fi
  done
}

main "$@"
