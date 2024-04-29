#!/usr/bin/env bash

case "$OSTYPE" in
  darwin*)  file_name=testbeats-macos ;;
  linux*)   file_name=testbeats-linux ;;
  msys*)    file_name=testbeats-win.exe ;;
  cygwin*)  file_name=testbeats-win.exe ;;
  *)        echo "$OSTYPE OS - Not Supported"; exit 1 ;;
esac

latest_tag=$(curl -s https://api.github.com/repos/test-results-reporter/testbeats/releases/latest | sed -Ene '/^ *"tag_name": *"(v.+)",$/s//\1/p')
curl -JLO https://github.com/test-results-reporter/testbeats/releases/download/${latest_tag}/${file_name}.zip
unzip ${file_name}.zip
chmod +x ${file_name}