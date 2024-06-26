import { useEffect, useState } from 'react';
import axios from 'axios';
import Movie from '../Movie/Movie.jsx'
//import './UsersTable.css';
import './MoviesTable.css';

const apiKey = 'a0a7e40dc8162ed7e37aa2fc97db5654';
const baseUrl = ' https://api.themoviedb.org/3/';
let sort = "primary_release_date.desc";



function MoviesTable(props) {

  const [movies, setMovies] = useState([]);
  

  async function getPopularMovies(basepage) {
    try {
      var demande = "movie/popular?api_key="+apiKey;
      if (props.search != "") {
        demande = "search/movie?api_key="+apiKey+"&query="+props.search;
      }
      if (props.sort_type != "Pas de tri" || props.genres != "")
      {
        demande = "discover/movie?api_key="+apiKey;
        if (props.sort_type == "film recent"){demande+= "&sort_by=primary_release_date.desc";}
        if (props.sort_type == "film ancien"){demande+= "&sort_by=primary_release_date.asc";}
        if (props.genres != ""){demande+= "&with_genres="+props.genres;}
        
      } 
      
      //&page=${props.page}
      const response = await axios.get(`${baseUrl}${demande}&page=${basepage}`);
      //console.log(response.data.results);
      const movies = response.data.results.map(movie => {
        if(movie.vote_average>=props.note_min){
          return{
            title: movie.title,
            original_title: movie.title,
            release_date: movie.release_date,
            imgurl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            image: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            id: movie.id, // on prends l'id pour avoir identificateur unique
            review:movie.vote_average,
          };
        }return null;
        
      }).filter(movie => movie != null).filter((movie, index) => index >= 0 && index < 10)
    
      //tri review
      
      

      return movies;
    } catch (error) {
      console.error('Erreur lors de la récupération des films populaires :', error);
      return [];
    }
  }
  useEffect(() => {
    async function fetchPopularMovies() {
      let popmovies = await getPopularMovies(1);
      let i=2;
      while(popmovies.length<(props.page*10) || i<20){
        let addmovies = await getPopularMovies(i);
        popmovies = popmovies.concat(addmovies)
        i=i+1;
      }
      
      setMovies(popmovies.filter((movie, index) => index >= 0+(props.page-1)*10 && index < 10+(props.page-1)*10));
    }
    fetchPopularMovies();
  }, [props.page, props.search,props.note_min]);
  //open https://www.themoviedb.org/movie/${props.id} pour mettre un lien vers la page de detail d'imbd
  return (
    <ul class="movies-container">
      {movies.map((movie, index) => <Movie key={index} movie={movie}/>)}
    </ul>
  );
}

export default MoviesTable;
