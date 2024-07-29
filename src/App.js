import { useEffect, useRef, useState } from 'react';
import { SongList } from './components/SongList';
import './index.css';
import spotify from './lib/spotify';
import { Player } from './components/Player';
import { SearchInput } from './components/SearchInput';
import { Pagination } from './components/Pagination';

export default function App() {
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);
  // 曲の情報を格納
  const [popularSongs, setPopularSongs] = useState([]);
  // 音楽の再生
  const [isPlay, setIsPlay] = useState(false);
  // 選択した曲の情報
  const [selectedSong, setSelectedSong] = useState();
  // 検索KW
  const [keyword, setKeyword] = useState('');
  // 検索結果
  const [searchedSongs, setSearchdSongs] = useState();
  // 検索結果があるか判定
  const isSearchedResult = searchedSongs != null
  // ページの上限リミット
  const limit = 20;
  // 現在のページ数
  const [page, setPage] = useState(1);
  const audioRef = useRef(null);

  // apiから曲データ取得(確認用)
  useEffect(() => {
    fetchPopularSongs();
  }, []);

  const fetchPopularSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items.map((item) => {
      return item.track;
    });
    setPopularSongs(popularSongs);
    setIsLoading(false);
  }

  const handleSongSelected = async (song) => {
    setSelectedSong(song);
    if (song.preview_url != null) {
      audioRef.current.src = song.preview_url;
      audioRef.current.volume = 0.1;
      // console.log(audioRef.current.src);
      playSong();
    } else {
      // console.log("楽曲なし");
      pauseSong();
    }
    // console.log('handleSongSelectedをクリック');
  }

  // 曲の再生
  const playSong = () => {
    audioRef.current.play();
    setIsPlay(true);
  }

  // 曲の停止
  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlay(false);
  }

  // 曲の反転処理toggle
  const toggleSong = () => {
    if (isPlay) {
      pauseSong(); // 再生中だから止める
    } else {
      playSong(); // 停止中だから走らせる
    }
  }

  // 検索inputの条件を受け取る
  const handleInputChange = (e) => {
    // console.log(e.target.value);
    setKeyword(e.target.value);
  }

  // 
  /**
   * 検索KWをAPIに投げる
   * ページが存在したらAPIにオフセット値をセット （例:pageが2なら、21〜40のデータ取得
   */
  const searchSongs = async (page) => {
    setIsLoading(true);
    const offset = parseInt(page) ? (parseInt(page) - 1) * limit : 0;
    const result = await spotify.searchSongs(keyword, limit, offset);
    // console.log(result);
    // console.log(result.items);
    setSearchdSongs(result.items);
    setIsLoading(false);
  }

  // Nextボタンクリック
  const moveToNext = async () => {
    console.log("next click");
    const nextPage = page + 1;
    debugger
    await searchSongs(nextPage);
    setPage(nextPage);
  }

  // Previousボタンクリック
  const prevToNext = async () => {
    console.log("Previous click");
    const prevPage = page - 1;
    await searchSongs(prevPage);
    setPage(prevPage);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-500 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput onInputChange={handleInputChange} onSubmit={searchSongs} />
        <section>
          <h2 className="text-2xl font-semibold mb-5">{isSearchedResult ? 'Searched Results' : 'Popular Songs'}</h2>
          <SongList
            isLoading={isLoading}
            songs={isSearchedResult ? searchedSongs : popularSongs}
            onSongSelected={handleSongSelected}
          />
          {isSearchedResult && <Pagination onPrev={prevToNext} onNext={moveToNext} />}
        </section>
      </main>
      {selectedSong != null && <Player song={selectedSong} isPlay={isPlay} onButtonClick={toggleSong} />}
      <audio ref={audioRef} />
    </div>
  );
}