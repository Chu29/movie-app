export const MOVIE_POSTER_PATH = "https://image.tmdb.org/t/p/w500/";
export const APPWRITE_API_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
export const API_BASE_URL = "https://api.themoviedb.org/3";

export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
