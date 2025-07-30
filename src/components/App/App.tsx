import SearchBar from '../SearchBar/SearchBar'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { useState } from 'react';
import MovieGrid from '../MovieGrid/MovieGrid';
import css from "./App.module.css";
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';


function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);


  const handleSearch = (newQuery: string) => {
    console.log("handleSearch", newQuery)

    setMovies([]);
    setIsLoading(true);
    setIsError(false);
    fetchMovies({ query: newQuery })
      .then(data => {
        setIsLoading(false);
        setMovies(data.results);
        if (data.results.length === 0) {
          toast.error('No movies found for your request.');
        }
      })
      .catch(err => {
        setIsError(true);
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      <MovieGrid 
        movies={movies} 
        onSelect={openModal} 
      />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && selectedMovie && ( <MovieModal onClose={closeModal} movie={selectedMovie} />)}
    </div>
  )
}

export default App
