"use client";

import { useEffect, useState } from "react";

// API key artık environment variable’dan geliyor
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export default function Home() {
  const [playlistInput, setPlaylistInput] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [watched, setWatched] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Sayfa açıldığında localStorage yükle
  useEffect(() => {
    const savedId = localStorage.getItem("playlistId");
    if (savedId) {
      setPlaylistId(savedId);
      setPlaylistInput(savedId);
    }

    const savedWatched = JSON.parse(localStorage.getItem("watched") || "[]");
    setWatched(savedWatched);
  }, []);

  // URL → Playlist ID çıkarma
  const extractPlaylistId = (value: string): string => {
    if (!value) return "";

    // Direkt ID girildiyse (PL ile başlıyor)
    if (value.startsWith("PL") || value.startsWith("UU") || value.startsWith("LL"))
      return value;

    // URL ise:
    try {
      const url = new URL(value);
      const id = url.searchParams.get("list");
      return id || "";
    } catch {
      return "";
    }
  };

  // Input değişince playlistId güncelle
  const handleInput = (value: string) => {
    setPlaylistInput(value);
    const id = extractPlaylistId(value);
    setPlaylistId(id);
    localStorage.setItem("playlistId", id);
  };

  // Playlist ID değiştiğinde otomatik fetch
  useEffect(() => {
    if (playlistId) fetchVideos();
  }, [playlistId]);

  // API'den videoları al
  const fetchVideos = async () => {
    if (!API_KEY) {
      alert("API key bulunamadı. Vercel environment'a eklemen gerekiyor.");
      return;
    }

    if (!playlistId) {
      alert("Geçerli bir playlist URL veya ID girin.");
      return;
    }

    setLoading(true);

    try {
      const url =
        `https://www.googleapis.com/youtube/v3/playlistItems?` +
        `part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        alert("YouTube API Hatası: " + data.error.message);
        setVideos([]);
        return;
      }

      if (!data.items || data.items.length === 0) {
        alert("Playlist bulunamadı veya boş playlist.");
        setVideos([]);
        return;
      }

      setVideos(data.items);
    } catch (err) {
      alert("Ağ hatası: " + err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Watched toggle
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
          value={playlistInput}
          onChange={(e) => handleInput(e.target.value)}
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
        {videos.map((video) => {
          const id = video.snippet.resourceId.videoId;
          const isWatched = watched.includes(id);

          return (
            <div
              key={id}
              className={`p-4 rounded-xl border shadow-sm bg-white transition ${
                isWatched ? "opacity-60 bg-green-50 border-green-300" : ""
              }`}
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                className="rounded-md mb-3"
              />

              <h2 className="font-medium mb-2">{video.snippet.title}</h2>

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
