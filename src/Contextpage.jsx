import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthState } from "react-firebase-hooks/auth"
import { toast } from 'react-toastify';

const Contextpage = createContext();

export function MovieProvider({ children }) {

  const [header, setHeader] = useState("Trending");
  const [totalPage, setTotalPage] = useState(null)
  const [movies, setMovies] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [page, setPage] = useState(1);
  const [activegenre, setActiveGenre] = useState(28);
  const [genres, setGenres] = useState([])
  const [loader, setLoader] = useState(true);
  const [backgenre, setBackGenre] = useState(false);
  const [user, setUser] = useAuthState(auth)
  const navigate = useNavigate();

  const APIKEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (page < 1) {
      setPage(1)
    }
  }, [page]);


  const filteredGenre = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${activegenre}&api_key=${APIKEY}&with_origin_country=US&page=${page}`
    );
    const filteredGenre = await data.json();
    setMovies(movies.concat(filteredGenre.results));
    setTotalPage(filteredGenre.total_pages);
    setLoader(false);
    setHeader("Gêneros");
  };

  const fetchSearch = async (query) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&with_origin_country=BR&language=pt-BRS&query=${query}&page=1&include_adult=false`
    );
    const searchmovies = await data.json();
    setSearchedMovies(searchmovies.results);
    setLoader(false);
    setHeader(`Resultados para "${query}"`);
  }

  const fetchGenre = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}&with_origin_country=BR&language=pt-BR`
    );
    const gen = await data.json();
    setGenres(gen.genres);
  }

  const fetchTrending = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}&with_origin_country=BR&page=${page}`
    );
    const trend = await data.json();
    setTrending(trending.concat(trend.results));
    setTotalPage(trend.total_pages);
    setLoader(false);
    setHeader("Populares");
  }

  const fetchUpcoming = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKEY}&with_origin_country=BR&language=pt-BR&page=${page}`
    );
    const upc = await data.json();
    setUpcoming(upcoming.concat(upc.results));
    setTotalPage(upc.total_pages);
    setLoader(false);
    setHeader("Lançamentos");
  }

  const GetFavorite = () => {
    setLoader(false);
    setHeader("Favoritos");
  }

  const googleProvider = new GoogleAuthProvider();

  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate("/")
      toast.success("Logado com sucesso");
    } catch (err) {
      console.log(err)
      navigate("/")
    }
  }

  return (
    <Contextpage.Provider
      value={{
        fetchGenre,
        genres,
        setGenres,
        filteredGenre,
        header,
        setHeader,
        movies,
        setMovies,
        page,
        setPage,
        activegenre,
        setActiveGenre,
        fetchSearch,
        loader,
        setBackGenre,
        backgenre,
        setLoader,
        fetchTrending,
        trending,
        fetchUpcoming,
        upcoming,
        GetFavorite,
        totalPage,
        searchedMovies,
        GoogleLogin,
        user
      }}
    >
      {children}
    </Contextpage.Provider>
  );

}

export default Contextpage
