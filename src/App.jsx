import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import Spinner from "./components/Spinner";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import { API_BASE_URL, API_OPTIONS } from "./utils/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "./services/movies.service";
import { useParams } from "react-router";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const { query } = useParams();

  console.log("Params", query)

  const { data, isLoading, isError, error, isPending } = useQuery({
    queryKey: ["movie", query],
    queryFn: () => fetchMovies(query),
  });
  console.log(data);

  // useEffect(() => {
  //   if (query && data.results.length > 0) {
  //     updateSearchCount(query, data.results[0]);
  //   }
  // }, [data.results, query]);

  // const fetchMovies = async (query = "") => {
  //   try {
  //     const endpoint = query
  //       ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
  //       : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

  //     const response = await fetch(endpoint, API_OPTIONS);

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch movies");
  //     }
  //     const data = await response.json();

  //     if (data.Response === "False") {
  //       setErrorMessage(data.Error || "Failed to fetch movies");
  //       setMovies([]);
  //       return;
  //     }

  //     setMovies(data.results || []);

  //     if (query && data.results.length > 0) {
  //       await updateSearchCount(query, data.results[0]);
  //     }
  //   } catch (error) {
  //     console.log(`Error fetching movies: ${error}`);
  //     setErrorMessage("Error fetching movies. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isPending ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{error.message}</p>
          ) : (
            <ul>
              {data.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
