import { api } from "./api";

export const fetchMovies = async (query = "") => {
  const res = await api.get(
    query
      ? `search/movie?query=${encodeURIComponent(query)}`
      : "discover/movie?sort_by=popularity.desc"
  );
  return res.json();
};
