import axios from "axios"

// アクセストークンを取得する
export const getToken = async () => {
  // axios使ってpostリクエスト
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'client_credentials',
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log(response); // レスポンスオブジェクトのdataプロパティにアクセス
  } catch (error) {
    console.error(error);
  }
}