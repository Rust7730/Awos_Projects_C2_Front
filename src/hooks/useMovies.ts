import { useState } from 'react';
import { Movie } from '@/types/movies';

export const useMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); 

    const searchMovies = async (query: string) => {
        if (!query.trim()) return;
        
        setLoading(true);
        setError(null);

        try {
           const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
const response = await fetch(`https://moviehub-omega-lilac.vercel.app/api/movies?query=${query}`);            if (!response.ok) {
                throw new Error('No se pudo conectar con el servidor Proxy');
            }
            
            const result = await response.json();
            
            if (result.success) {
                setMovies(result.data);
            } else {
                throw new Error(result.error || 'Error al buscar películas');
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado. Intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return { movies, loading, error, searchMovies };
};