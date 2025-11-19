import MovieCard from './MovieCard';

function MovieRow({ title, movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-4 md:px-16">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide pb-4">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MovieRow;
