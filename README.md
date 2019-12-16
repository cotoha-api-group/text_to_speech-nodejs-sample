COTOHA API 音声合成サンプルプログラム(Node.js)
====
一括音声合成APIを利用して、合成音声を保存したwavファイルを生成するNode.jsプログラムです。

# Usage
1. コマンド`npm install`でパッケージをインストールしてください。
1. `sample_nodejs.js`の6,7行目の`input client id here`及び`input client secret here`と書かれている部分にCOTOHA API Portalアカウントページで表示される`client id`及び`client secret`をそれぞれ入力してください。
1. `/sample_json`内のjsonファイルを参考にして、作成したい合成音声の設定を記載したjsonファイルを作成してください。以後、このjsonファイルを`[your_tts_json]`と表記します。
1. コマンド`node sample_nodejs.js [your_tts_json]`を実行してください。実行したディレクトリに、合成音声が保存された`output.wav`が生成されます。
また、コマンド`node sample_nodejs.js [your_tts_json] [output_wav_name]`を実行すると、合成音声が`[output_wav_name]`で指定したファイル名で保存されます。

**出力例**
以下のように出力されれば、音声の生成が成功しています。
```
$ node sample_nodejs.js sample_json/simple.json test.wav
getToken completed successfully.
post data: {"text":"今日の天気は晴れです。","speakerId":"ja_JP-F-S0005-T002-E01-SR0"}
postAndRecieve completed successfully.
test.wav has been generated.
```

# Requirements
動作確認を行ったバージョンとなります。
- node 12.X
- request
- request-promise