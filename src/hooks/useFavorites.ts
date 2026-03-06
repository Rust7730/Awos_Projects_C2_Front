import { useState, useCallback } from 'react';
import { Movie } from '../types/movies';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [loadingFavs, setLoadingFavs] = useState(false);
    const [errorFavs, setErrorFavs] = useState<string | null>(null);

    const loadFavorites = useCallback(async () => {
        setLoadingFavs(true);
        setErrorFavs(null);

        try {
const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
const response = await fetch('https://moviehub-omega-lilac.vercel.app/api/favorites');
            if (!response.ok) throw new Error('Error de red con el Proxy');
            
            const result = await response.json();
            
            if (result.success) {
                setFavorites(result.data); 
            } else {
                throw new Error(result.error);
            }
        } catch (err: any) {
            setErrorFavs(err.message || 'No se pudieron cargar los favoritos.'); 
        } finally {
            setLoadingFavs(false); 
        }
    }, []);

    return { favorites, loadingFavs, errorFavs, loadFavorites };
};