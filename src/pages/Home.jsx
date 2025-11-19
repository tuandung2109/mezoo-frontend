import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import { genreService } from '../services/genreService';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import Footer from '../components/Footer';
import Loading from '../components/Loading';

function Home() {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesData, genresData] = await Promise.all([
        movieService.getMovies({ limit: 50, sort: 'rating' }),
        genreService.getGenres()
      ]);
      
      // movieService.getMovies returns { movies, total, page, totalPages }
      const allMovies = moviesData.movies || [];
      const allGenres = genresData.data || [];
      
      setMovies(allMovies);
      setGenres(allGenres);
      
      // Chọn phim có backdrop đẹp và rating cao
      const movieWithBackdrop = allMovies.find(m => m.backdrop && m.rating >= 7);
      setFeaturedMovie(movieWithBackdrop || allMovies[0]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app">
      <Navbar />
      <HeroBanner movie={featuredMovie} />
      
      <div className="relative -mt-32 z-10 space-y-8 md:space-y-12 pb-20">
        {/* Trending - Latest movies */}
        <MovieRow 
          title="Xu hướng hiện nay" 
          movies={[...movies].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 10)} 
        />
        
        {/* Top Rated - Highest rating */}
        <MovieRow 
          title="Xếp hạng cao nhất" 
          movies={[...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10)} 
        />
        
        {/* Popular - Most views */}
        <MovieRow 
          title="Phổ biến" 
          movies={[...movies].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10)} 
        />
        
        {/* Genre rows */}
        {genres.slice(0, 5).map(genre => {
          const genreMovies = movies.filter(m => 
            m.genres && (
              m.genres.includes(genre.name) || 
              m.genres.some(g => g._id === genre._id || g === genre._id)
            )
          );
          if (genreMovies.length === 0) return null;
          return (
            <MovieRow 
              key={genre._id} 
              title={genre.name} 
              movies={genreMovies.slice(0, 10)} 
            />
          );
        })}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
