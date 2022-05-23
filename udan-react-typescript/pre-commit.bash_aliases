#!/bin/sh
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g')

# run linter on staged files
echo "Running Linter..⚒️⚒️⚒️"
./node_modules/.bin/eslint $STAGED_FILES --quiet --fix
LINTER_EXIT_CODE=$?

# run Prettier on staged files
echo "Running Prettier..✨✨✨"
./node_modules/.bin/prettier $STAGED_FILES --ignore-unknown --write

# add files auto-fixed by the linter and prettier
git add -f $STAGED_FILES

# check linter exit code
if [ $LINTER_EXIT_CODE -ne 0 ]; then
    echo "No, no, no! fix those lint errors first..😠"
    exit 1
else
    echo "lint all good..👍"
fi

# run tests related to staged files
echo "Running Tests"
./node_modules/.bin/jest --bail --findRelatedTests $STAGED_FILES --passWithNoTests
JEST_EXIT_CODE=$?

# check jest exit code
if [ $JEST_EXIT_CODE -ne 0 ]; then
    echo "Please you can do better than this..🙏🙏🙏"
    exit 1
else
    echo "test all good..👍"
fi

# return 0-exit code
echo "🎉 you are a rockstar..🔥🔥🔥"
exit 0