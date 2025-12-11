"use client";

import { useEffect, useState } from "react";

const API_KEY = "AIzaSyA2s8fYYhZ8KPuasdA1V_pZ1GRNgtdFjAE";

export default function Home() {
  const [playlistId, setPlaylistId] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [watched, setWatched] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Sayfa açıldığında kaydedilen playlistId ve watched listesi yükle
  useEffect(() => {
    const savedId = localStorage.getItem("playlistId");
    if (savedId) setPlaylistId(savedId);

    const savedWatched = JSON.parse(localStorage.getItem("watched") || "[]");
    setWatched(savedWatched);
  }, []);

  // Playlist URL'den ID ayıklama (URL veya direkt ID destekli)
  const extractPlaylistId = (url: string) => {
    try {
      const u = new URL(url);
      return u.searchParams.get("list") || url; // direkt ID de girilebilir
    } catch {
      return url; // direkt ID girilmişse
    }
  };

  // Playlist input değiştiğinde state ve localStorage güncelle
  const handlePlaylistChange = (value: string) => {
    const id = extractPlaylistId(value);
    setPlaylistId(id);
    localStorage.setItem("playlistId", id);
  };

  // Playlist ID değiştiğinde otomatik fetch
  useEffect(() => {
    if (!playlistId) return;
    fetchVideos();
  }, [playlistId]);

  // Videoları fetch et
  const fetchVideos = async () => {
    if (!playlistId) {
      alert("Playlist ID veya URL girin.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`
      );
      const data = await res.json();

      if (!data.items) {
        alert("Playlist bulunamadı veya hatalı ID.");
        setVideos([]);
        return;
      }

      setVideos(data.items);
    } catch (e) {
      alert("API hatası: " + e);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Videoyu watched olarak işaretle / kaldır
  const toggleWatched = (id: string) => {
    const updated = watched.includes(id)
      ? watched.filter((v) => v !== id)
      : [...watched, id];
    setWatched(updated);
    localStorage.setItem("watched", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-6 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-semibold mb-6">YouTube Playlist Tracker</h1>

      {/* Playlist input */}
      <div className="flex gap-3 w-full max-w-xl mb-8">
        <input
          value={playlistId}
          onChange={(e) => handlePlaylistChange(e.target.value)}
          placeholder="Playlist URL veya ID girin..."
          className="flex-1 p-3 border rounded-lg bg-white shadow-sm"
        />
        <button
          onClick={fetchVideos}
          className="px-5 py-3 bg-black text-white rounded-lg"
        >
          Fetch
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-lg">Loading...</p>}

      {/* Video listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-4xl">
        {videos.map((v) => {
          const id = v.snippet.resourceId.videoId;
          const isWatched = watched.includes(id);

          return (
            <div
              key={id}
              className={`p-4 rounded-xl border shadow-sm bg-white transition ${
                isWatched ? "opacity-60 bg-green-50 border-green-300" : ""
              }`}
            >
              <img
                src={v.snippet.thumbnails.medium.url}
                className="rounded-md mb-3"
              />

              <h2 className="font-medium mb-2">{v.snippet.title}</h2>

              <button
                onClick={() => toggleWatched(id)}
                className={`w-full mt-2 py-2 rounded-lg font-medium border ${
                  isWatched
                    ? "bg-green-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {isWatched ? "✓ Watched" : "Mark as Watched"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {!loading && videos.length === 0 && (
        <p className="text-zinc-500 mt-10">
          Playlist URL veya ID girin ve Fetch'e basın.
        </p>
      )}
    </div>
  );
}
