import SearchBar from '../SearchBar/SearchBar'
import toast, { Toaster } from 'react-hot-toast'
import type { Movie } from '../../types/movie';
import { useEffect, useState } from 'react';
import MovieGrid from '../MovieGrid/MovieGrid';
import css from "./App.module.css";
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';



function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [query, setQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies({ query, page: currentPage }),
    enabled: query !== "",
    placeholderData: keepPreviousData,

  });

  const totalPages = data?.total_pages || 0;
  const movies = data?.results || [];

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
  if (isSuccess && movies.length === 0) {
    toast("Opps...No movies found");
  }
}, [isSuccess, movies]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  }

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isSuccess && movies.length > 0 && (<MovieGrid movies={movies} onSelect={openModal} />)}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && selectedMovie && ( <MovieModal onClose={closeModal} movie={selectedMovie} />)}
    </div>
  )
}

export default App
