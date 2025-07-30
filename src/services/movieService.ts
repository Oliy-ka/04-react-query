import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Movie } from '../types/movie';

interface FetchMoviesParams {
  query: string;
  language?: string;
  page?: number;
  includeAdult?: boolean;
}

interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const apiKey = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies({query, language = 'en-US', page = 1, includeAdult = false}: FetchMoviesParams): Promise<FetchMoviesResponse> {
  const options = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/search/movie',
    params: {
      query,
      include_adult: includeAdult,
      language,
      page,
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const response: AxiosResponse<FetchMoviesResponse> = await axios.request(options);
  return response.data;
}
