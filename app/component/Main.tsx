"use client"

import axios from 'axios'
import { useState } from 'react'

const API_KEY = "2a40e5f7"

export default function Home() {
  const [search, setSearch] = useState("")
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!search.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(search)}`
      )
      
      console.log("🔍 جستجو:", search)
      console.log("📦 پاسخ:", response)
      
      if (response.data.Response === "True") {
        setMovies(response.data.Search)
      } else {
        setError(response.data.Error || "فیلمی پیدا نشد")
        setMovies([])
      }
    } catch (err) {
      console.error("❌ خطا:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🎬 جستجوی فیلم</h1>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="نام فیلم را وارد کنید..."
          className="px-4 py-2 border rounded-lg flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          🔍 جستجو
        </button>
      </div>

      {loading && <p className="mt-4">⏳ در حال جستجو...</p>}
      {error && <p className="mt-4 text-red-500">❌ {error}</p>}

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="border rounded-lg p-4">
            <h3 className="font-bold">{movie.Title}</h3>
            <p className="text-sm text-gray-500">{movie.Year}</p>
            {movie.Poster && movie.Poster !== "N/A" && (
              <img src={movie.Poster} alt={movie.Title} className="mt-2 w-full h-auto rounded" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}