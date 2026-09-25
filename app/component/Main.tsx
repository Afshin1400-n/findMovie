"use client"

import axios from 'axios'
import { useState } from 'react'

const API_KEY = "2a40e5f7"

interface Movie {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

export default function Home() {
  const [search, setSearch] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [lastQuery, setLastQuery] = useState("")

  const fetchMovies = async (query: string, pageNum: number = 1, append: boolean = false) => {
    if (!query.trim()) {
      setMovies([])
      setError(null)
      setPage(1)
      setTotalResults(0)
      setLastQuery("")
      return
    }

    if (append) setLoadingMore(true)
    else setLoading(true)
    setError(null)

    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie&page=${pageNum}`
      )

      if (response.data.Response === "True") {
        if (append) {
          setMovies((prev) => [...prev, ...response.data.Search])
        } else {
          setMovies(response.data.Search)
        }
        setTotalResults(parseInt(response.data.totalResults, 10))
        setPage(pageNum)
        setLastQuery(query)
      } else {
        if (!append) {
          setError(response.data.Error || "No movies found")
          setMovies([])
          setTotalResults(0)
        }
      }
    } catch (err: any) {
      setError(err.message)
      if (!append) setMovies([])
    } finally {
      if (append) setLoadingMore(false)
      else setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchMovies(search, 1, false)
  }

  const handleLoadMore = () => {
    fetchMovies(lastQuery, page + 1, true)
  }

  const handlePopular = () => {
    setSearch("batman")
    fetchMovies("batman", 1, false)
  }

  const handleSuggestion = (suggestion: string) => {
    setSearch(suggestion)
    fetchMovies(suggestion, 1, false)
  }

  const hasMore = movies.length < totalResults

  return (
    <main
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)" }}
      className="min-h-screen w-full text-white p-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 mb-4">
            <span className="text-5xl">🎬</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Movie Explorer
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Search and discover your favorite movies
          </p>
        </div>

        {/* Search */}
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
              placeholder="Enter movie name... (e.g., inception)"
              className="w-full px-12 py-3.5 bg-white/5 backdrop-blur-lg border border-white/10 
              rounded-2xl focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 
              outline-none text-white placeholder:text-gray-500 transition-all text-sm"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 
              bg-gradient-to-r from-purple-500 to-pink-500 
              hover:from-purple-600 hover:to-pink-600 
              text-white font-medium rounded-xl transition-all duration-200 text-sm cursor-pointer"
            >
              Search
            </button>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={handlePopular}
              className="text-xs text-gray-400 hover:text-purple-400 transition-colors cursor-pointer"
            >
              📽️ Show popular movies
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ minHeight: "60vh" }} className="w-full flex items-center justify-center">

          {/* Loading */}
          {loading && (
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-3 text-sm">⏳ Searching...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-red-400 text-sm">❌ {error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && movies.length === 0 && (
            <div className="text-center">
              <div className="text-7xl mb-5 opacity-40">🎬</div>
              <h2 className="text-2xl font-semibold text-gray-300">
                Ready to explore?
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Please enter a movie name and click{" "}
                <span className="text-purple-400 font-medium">Search</span> to get started
              </p>
              <div className="mt-8">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                  Try searching for
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Inception", "Batman", "Interstellar", "Avatar", "Titanic"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestion(suggestion)}
                      className="px-4 py-2 bg-white/5 hover:bg-purple-500/20 
                      border border-white/10 hover:border-purple-400/40 
                      text-gray-300 hover:text-purple-300 
                      rounded-full text-sm transition-all duration-200 cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && movies.length > 0 && (
            <div className="w-full">
              <p className="text-gray-400 text-sm text-center mb-6">
                Showing {movies.length} of {totalResults} movies
              </p>

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

              {hasMore && (
                <div className="text-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                    hover:from-purple-600 hover:to-pink-600 active:scale-[0.98]
                    text-white font-medium rounded-xl transition-all duration-200 
                    shadow-md shadow-purple-500/20 hover:shadow-lg 
                    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                  >
                    {loadingMore ? "⏳ Loading..." : "📥 Load More"}
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    {movies.length} of {totalResults} loaded
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            Data from <span className="text-gray-500">OMDb API</span> • 
            Built with <span className="text-purple-400">❤️</span>
          </p>
        </footer>

      </div>
    </main>
  )
}