import { useState } from 'react';
import { Movie } from '@/types/movies';

export const useMovies = () => {
    // Definición de los 3 estados exigidos en la rúbrica
    const [movies, setMovies] = useState<Movie[]>([]); // Success
    const [loading, setLoading] = useState(false);     // Loading
    const [error, setError] = useState<string | null>(null); // Error

    const searchMovies = async (query: string) => {
        if (!query.trim()) return;
        
        setLoading(true);
        setError(null);

        try {
            // ⚠️ ATENCIÓN: Apuntamos al Proxy (Puerto 4000), NUNCA a TMDB
            const response = await fetch(`http://localhost:4000/api/movies?query=${query}`);
            
            if (!response.ok) {
                throw new Error('No se pudo conectar con el servidor Proxy');
            }
            
            const result = await response.json();
            
            if (result.success) {
                setMovies(result.data);
            } else {
                throw new Error(result.error || 'Error al buscar películas');
            }
        } catch (err: any) {
            // Capturamos el error para no romper la aplicación
            setError(err.message || 'Ocurrió un error inesperado. Intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return { movies, loading, error, searchMovies };
};