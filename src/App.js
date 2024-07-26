import { useEffect, useRef, useState } from 'react';
import { SongList } from './components/SongList';
import './index.css';
import spotify from './lib/spotify';

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
    audioRef.current.src = song.preview_url;
    // console.log(audioRef.current.src);
    audioRef.current.play();
    setIsPlay(true);
    // console.log('handleSongSelectedをクリック');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-500 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-5">Popular Songs</h2>
          <SongList isLoading={isLoading} songs={popularSongs} onSongSelected={handleSongSelected} />
        </section>
      </main>
      <audio ref={audioRef} />
    </div>
  );
}