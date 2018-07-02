<template>
<div>
     <div class="row" v-for="i in Math.ceil(movies.length / 5)" :key="i.id">
        <movie v-for="(i) in movies" :key="i.id" :movie="i">
        </movie>
    </div>
</div>
   
</template>

<script>
import Movie from "./Movie";
import { movieData } from "../Model";
export default {
  data() {
    return {
        movies: []
    };
  },
  methods: {
      
  },

  created () {
      var movies = localStorage.getItem("movies") || [];
      if (movies.length > 0) {
          this.movies = JSON.parse(movies)
      }else{
          localStorage.setItem('movies', JSON.stringify(movieData))
          this.movies = [...movieData]
      }
  },
  
  components: {
      Movie
  }
};
</script>
