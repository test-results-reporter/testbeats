#!/usr/bin/env bash

case "$OSTYPE" in
  darwin*)  file_name=test-results-reporter-macos ;;
  linux*)   file_name=test-results-reporter-linux ;;
  msys*)    file_name=test-results-reporter-win.exe ;;
  cygwin*)  file_name=test-results-reporter-win.exe ;;
  *)        echo "$OSTYPE OS - Not Supported"; exit 1 ;;
esac

latest_tag=$(curl -s https://api.github.com/repos/test-results-reporter/testbeats/releases/latest | sed -Ene '/^ *"tag_name": *"(v.+)",$/s//\1/p')
curl -JLO https://github.com/test-results-reporter/testbeats/releases/download/v1.1.6/${file_name}.zip
unzip ${file_name}.zip
chmod +x ${file_name}