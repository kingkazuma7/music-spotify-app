import axios from "axios"

// Spotify APIからアクセストークンを取得して、利用するためにクラス定義
  // 1.Axiosを使用したPOSTリクエストの送信：
  // 2.レスポンスの処理：
  // 3.クラスの初期化：
  // 4.テスト用のメソッド：
  // 5.クラスのインスタンス化とエクスポート：
  // access_token ... SpotifyのAPIを認証してアクセスできるようにするためのもの

class SpotifyClient {
  static async initialize() {
    // axios使ってpostリクエスト
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      {
        grant_type: 'client_credentials',
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }
    );
    // console.log(response);

    // クラスのメンバ変数に格納
    let spotify = new SpotifyClient();
    spotify.token = response.data.access_token;
    return spotify;
  }
  test() {
    console.log(this.token);
  }
}

const spotify = await SpotifyClient.initialize();
export default spotify;