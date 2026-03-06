"use client";

import { useState } from 'react';
import { useMovies } from '../hooks/useMovies';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const { movies, loading, error, searchMovies } = useMovies();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchMovies(searchTerm);
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Hub de Cine SOA</h1>
            
            {/* Buscador */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10 flex gap-4">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar película (ej. Batman)..." 
                    className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                    Buscar
                </button>
            </form>

            {/* ESTADO 1: Loading (Indicador de carga) */}
            {loading && (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* ESTADO 2: Error (Mensaje amigable) */}
            {error && !loading && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg max-w-xl mx-auto text-center">
                    <p>⚠️ {error}</p>
                </div>
            )}

            {/* ESTADO 3: Success (Renderizado de tarjetas) */}
            {!loading && !error && movies.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <div key={movie.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition hover:scale-105">
                            {movie.poster_path ? (
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                    alt={movie.title} 
                                    className="w-full h-80 object-cover"
                                />
                            ) : (
                                <div className="w-full h-80 bg-gray-700 flex items-center justify-center text-gray-400">
                                    Sin imagen
                                </div>
                            )}
                            <div className="p-4">
                                <h2 className="font-bold text-lg mb-2 truncate">{movie.title}</h2>
                                <p className="text-gray-400 text-sm">{movie.release_date?.split('-')[0]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}