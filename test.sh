#!/bin/sh
#
# curlによる接続テスト(疎通確認)
#
# [注意事項]
# 事前に`npm start`でサーバーを起動した状態で実行してください

result=$(curl --request POST \
  --header 'content-type: application/json' \
  --url http://localhost:4000/ \
  --data '{"query":"query xxx { all { id } }"}')

echo $result
