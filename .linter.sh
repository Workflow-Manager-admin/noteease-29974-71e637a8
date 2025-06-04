#!/bin/bash
cd /home/kavia/workspace/code-generation/noteease-29974-71e637a8/note_app
npm run lint 
$ESLINT_EXIT_CODE
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
  exit 1
fi

