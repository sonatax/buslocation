buslocation
===========

Realtime Bus Location System using by node.js

使い方

public/ 以下にディレクトリを作成
- data/busposition
- data/busstop

各ディレクトリにそれぞれのファイルを作成する
- data/busposition/busPosition[0-9].json
形式は {"item":["139.70284270501,35.658478366553","139.70284270501,35.658478366553",...]}
- data/busstop/busStop[0-9].json
形式は {"item":["139.70284270501,35.658478366553,XX駅前","139.70284270501,35.658478366553,XX三丁目",...]}

busPosition, busStop の数字が同じファイルを1つの経路として呼び出す。

起動コマンドは"node app.js"

http://localhost:3000/ にアクセスすると動作が見れます
