"use client"

import axios from 'axios'
import { useState, useEffect } from 'react'

const API_KEY = "2a40e5f7"

export default function Home() {
  const [search, setSearch] = useState("")
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ✅ بارگذاری فیلم‌های پیش‌فرض
  useEffect(() => {
    fetchMovies("batman")
  }, [])

  const fetchMovies = async (query) => {
    if (!query.trim()) {
      query = "batman"
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`
      )
      
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

  const handleSearch = () => {
    if (!search.trim()) {
      fetchMovies("batman")
    } else {
      fetchMovies(search)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* هدر */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 mb-4">
            <span className="text-5xl">🎬</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Movie Explorer
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            جستجو و کشف فیلم‌های مورد علاقه‌تان
          </p>
        </div>

        {/* جستجو */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-gray-500">🔍</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="نام فیلم را وارد کنید... (مثال: inception)"
              className="w-full px-12 py-3.5 bg-white/5 backdrop-blur-lg border border-white/10 
              rounded-2xl focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 
              outline-none text-white placeholder:text-gray-500 transition-all text-sm"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 
              bg-gradient-to-r from-purple-500 to-pink-500 
              hover:from-purple-600 hover:to-pink-600 
              text-white font-medium rounded-xl transition-all duration-200 text-sm"
            >
              جستجو
            </button>
          </div>
          
          {/* دکمه نمایش همه */}
          <div className="text-center mt-3">
            <button
              onClick={() => {
                setSearch("")
                fetchMovies("batman")
              }}
              className="text-xs text-gray-400 hover:text-purple-400 transition-colors"
            >
              📽️ نمایش فیلم‌های محبوب
            </button>
          </div>
        </div>

        {/* وضعیت */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-3 text-sm">⏳ در حال جستجو...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-red-400 text-sm">❌ {error}</p>
          </div>
        )}

        {/* تعداد نتایج */}
        {!loading && !error && movies.length > 0 && (
          <p className="text-gray-400 text-sm text-center mb-6">
            {movies.length} فیلم یافت شد
          </p>
        )}

        {/* لیست فیلم‌ها */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className="group bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden 
                border border-white/10 hover:border-purple-400/30 
                hover:shadow-xl hover:shadow-purple-500/10 
                transition-all duration-300 hover:-translate-y-1"
              >
                {movie.Poster && movie.Poster !== "N/A" ? (
                  <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-700 
                  flex items-center justify-center text-5xl">
                    🎬
                  </div>
                )}
                
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                    {movie.Title}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-400">{movie.Year}</span>
                    <span className="text-xs text-gray-500">{movie.Type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* پیام خالی */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-30">🎬</div>
            <h2 className="text-xl font-medium text-gray-400">فیلمی پیدا نشد</h2>
            <p className="text-sm text-gray-500 mt-1">سعی کنید با کلمات دیگر جستجو کنید</p>
          </div>
        )}

        {/* فوتر */}
        <footer className="mt-16 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            داده‌ها از <span className="text-gray-500">OMDb API</span> • 
            ساخته شده با <span className="text-purple-400">❤️</span>
          </p>
        </footer>
        
      </div>
    </div>
  )
}