import { useEffect, useRef, useState } from 'react';
import { SongList } from './components/SongList';
import './index.css';
import spotify from './lib/spotify';
import { Player } from './components/Player';
import { SearchInput } from './components/SearchInput';

export default function App() {
  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);
  // 曲の情報を格納
  const [popularSongs, setPopularSongs] = useState([]);
  // 音楽の再生
  const [isPlay, setIsPlay] = useState(false);
  // 選択した曲の情報
  const [selectedSong, setSelectedSong] = useState();
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
      console.log("楽曲なし");
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-500 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput />
        <section>
          <h2 className="text-2xl font-semibold mb-5">Popular Songs</h2>
          <SongList isLoading={isLoading} songs={popularSongs} onSongSelected={handleSongSelected} />
        </section>
      </main>
      {selectedSong != null && <Player song={selectedSong} isPlay={isPlay} onButtonClick={toggleSong} />}
      <audio ref={audioRef} />
    </div>
  );
}