"use client";

import { useState, useEffect } from 'react';
import { useMovies } from '../hooks/useMovies';
import { useFavorites } from '../hooks/useFavorites';
import { Movie } from '../types/movies';

export default function Home() {
    const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');
    
    const [searchTerm, setSearchTerm] = useState('');
    const { movies, loading, error, searchMovies } = useMovies();
    const { favorites, loadingFavs, errorFavs, loadFavorites } = useFavorites();

    useEffect(() => {
        if (activeTab === 'favorites') {
            loadFavorites();
        }
    }, [activeTab, loadFavorites]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchMovies(searchTerm);
    };

  const handleSaveFavorite = async (movie: Movie) => {

        try {
            console.log("Enviando petición al Proxy en ...");
const apiUrl = process.env.NEXT_PUBLIC_API_URL ,
response = await fetch(`${apiUrl}/api/favorites`, {
                
              method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    movie_id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path
                })
            });

            const result = await response.json();
            
            console.log(" Respuesta del servidor:", result); 

            if (response.ok && result.success) {
                alert(` ¡"${movie.title}" guardada en favoritos!`);
            } else {
                alert(` No se pudo guardar: ${result.error}`);
            }
        } catch (err) {
            console.error(" Error de red:", err); 
            alert('Error de red: Revisa la consola (F12) para más detalles.');
        }
    };  
    return (
        <main className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold text-center mb-6">Hub de Cine SOA</h1>
            
            <div className="flex justify-center gap-4 mb-8">
                <button 
                    onClick={() => setActiveTab('search')}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'search' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                     Buscar Películas
                </button>
                <button 
                    onClick={() => setActiveTab('favorites')}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'favorites' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                     Mis Favoritos
                </button>
            </div>

            {activeTab === 'search' && (
                <>
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10 flex gap-4">
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar película..." 
                            className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition">
                            Buscar
                        </button>
                    </form>

                    {loading && <div className="text-center text-blue-500 py-10">Cargando...</div>}
                    {error && !loading && <div className="text-center text-red-500 py-10">⚠️ {error}</div>}

                    {!loading && !error && movies.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {movies.map((movie) => (
        <div 
            key={movie.id} 
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col border border-gray-700 hover:border-blue-500 transition-colors duration-300"
        >
            <div className="relative aspect-[2/3] w-full bg-gray-900 flex-shrink-0">
                {movie.poster_path ? (
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-500 flex-col">
                        <span className="text-4xl mb-2"></span>
                        <span>Sin imagen</span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                <div>
                    <h2 className="font-bold text-lg text-white line-clamp-2" title={movie.title}>
                        {movie.title}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'Fecha desconocida'}
                    </p>
                </div>

                <button 
                    onClick={() => handleSaveFavorite(movie)}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                >
                     Guardar Favorito
                </button>
            </div>
        </div>
    ))}
</div>
                    )}
                </>
            )}

            {activeTab === 'favorites' && (
                <>
                    <h2 className="text-2xl font-bold text-center mb-6">Tu Colección Personal</h2>
                    
                    {loadingFavs && <div className="text-center text-green-500 py-10">Cargando favoritos...</div>}
                    {errorFavs && !loadingFavs && <div className="text-center text-red-500 py-10">⚠️ {errorFavs}</div>}
                    
                    {!loadingFavs && !errorFavs && favorites.length === 0 && (
                        <div className="text-center text-gray-400 py-10">Aún no tienes películas favoritas.</div>
                    )}

                    {!loadingFavs && !errorFavs && favorites.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {favorites.map((movie) => (
                                <div key={movie.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-green-500/30">
                                    {movie.poster_path ? (
                                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-80 object-cover" />
                                    ) : (
                                        <div className="w-full h-80 bg-gray-700 flex items-center justify-center text-gray-400">Sin imagen</div>
                                    )}
                                    <div className="p-4 bg-gray-800 text-center">
                                        <h2 className="font-bold text-lg truncate">{movie.title}</h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </main>
    );
}