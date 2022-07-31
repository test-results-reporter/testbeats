#!/usr/bin/env bash
# echo $(curl -s https://api.github.com/repos/test-results-reporter/reporter/releases/latest | sed -Ene '/^ *"tag_name": *"(v.+)",$/s//\1/p')

# curl -JLO https://github.com/test-results-reporter/reporter/releases/download/$(curl -s https://api.github.com/repos/test-results-reporter/reporter/releases/latest | sed -Ene '/^ *"tag_name": *"(v.+)",$/s//\1/p')/test-results-reporter-macos.zip
# unzip test-results-reporter-macos.zip
# ./test-results-reporter-macos

case "$OSTYPE" in
  darwin*)  file_name=test-results-reporter-macos ;; 
  linux*)   file_name=test-results-reporter-linux ;;
  msys*)    file_name=test-results-reporter-win.exe ;;
  cygwin*)  file_name=test-results-reporter-win.exe ;;
  *)        echo "$OSTYPE OS - Not Supported"; exit 1 ;;
esac

latest_tag=$(curl -s https://api.github.com/repos/test-results-reporter/reporter/releases/latest | sed -Ene '/^ *"tag_name": *"(v.+)",$/s//\1/p')
curl -JLO https://github.com/test-results-reporter/reporter/releases/download/${latest_tag}/${file_name}.zip
unzip ${file_name}.zip
chmod +x ${file_name}