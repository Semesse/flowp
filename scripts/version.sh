pnpm version $1
pnpm conventional-changelog -i CHANGELOG.md -s -r 2
git add CHANGELOG.md
git commit --amend --no-edit