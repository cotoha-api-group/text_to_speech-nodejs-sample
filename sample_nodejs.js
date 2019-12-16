const rp = require("request-promise");
const errors = require('request-promise/errors');
const fs = require("fs");

//認証情報定義
const clientId = "input client id here";
const clientSecret = "input client secret here";

//接続先定義
const oauthUrl = "https://api.ce-cotoha.com/v1/oauth/accesstokens"
const ttsUrl = "https://api.ce-cotoha.com/api/tts/v1/tts"

// アクセストークン取得
function getToken(postUrl, cId, cSecret){
    let options = {
        method: "POST",
        uri: postUrl,
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        json: {
            "grantType": "client_credentials",
            "clientId": cId,
            "clientSecret": cSecret
        }
    }
    let request = rp(options).catch(errors.StatusCodeError, function(err){
        console.log('[ERROR!(@getToken)] status: ' + err.response.body.status + ', message: ' + err.response.body.message);
        process.exit(1);
    });
    return request;
}

// JSON ファイルの読み込み
// データをポストし合成音声を取得
// 音声ファイルを出力
function postAndRecieve(postUrl, accessToken, inputFilePath, outputFilePath){
    const jsonObject = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));
    let postJson = {
        "text": jsonObject.text,
        "speakerId": jsonObject.speakerId
    };
    if(jsonObject.textType){
        postJson.textType = jsonObject.textType;
    }
    if(jsonObject.speechRate){
        postJson.speechRate = jsonObject.speechRate;
    }
    if(jsonObject.powerRate){
        postJson.powerRate = jsonObject.powerRate;
    }
    if(jsonObject.intonation){
        postJson.intonation = jsonObject.intonation;
    }
    if(jsonObject.pitch){
        postJson.pitch = jsonObject.pitch;
    }
    console.log("post data: " + (JSON.stringify(postJson)).toString());

    let options = {
        method: "POST",
        uri: postUrl,
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "audio/wav"
        },
        json: postJson
    }
    let request = rp(options).on("response", (response) => {
        response.pipe(fs.createWriteStream(outputFilePath));
    }).catch(errors.StatusCodeError, function(err){
        console.log("[ERROR!(@postAndRecieve)] status: " + err.statusCode + ", code: " + err.response.body.code + ", detail: " + err.response.body.detail);
        process.exit(1);
    });
    return request;
}

// main の処理
// コマンドライン引数1 : 音声合成設定を記入したjsonファイル
// コマンドライン引数2(option) : 出力wavファイル名
// 出力 : 合成音声wavファイル
async function main() {
    if(process.argv.length <= 2){
        console.log("usage: node sample_nodejs [input_json_file] [(option)output_wav_file]");
        process.exit(1);
    }
    let inputFilePath = process.argv[2];
    let outputFilePath;
    if(process.argv.length > 3){
        outputFilePath = process.argv[3];
    }
    else{
        outputFilePath = "output.wav";
    }
    let tokenJson = await getToken(oauthUrl, clientId, clientSecret);
    let accessToken = tokenJson.access_token;
    console.log("getToken completed successfully.");
    await postAndRecieve(ttsUrl, accessToken, inputFilePath, outputFilePath);
    console.log("postAndRecieve completed successfully.");
    console.log(outputFilePath + " has been generated.");
}

main()