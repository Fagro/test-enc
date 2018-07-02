<template>
<b-card :title="movie.name"
          :img-src="movie.imageUrl"
          img-alt="Image"
          img-top
          tag="article"
          style="width:300; height:400; max-width: 20rem;"
          class="mb-4 mr-3">
        <b-card-body>
            <p class="card-text">
                <span>Price <strong>${{movie.rentPrice}}</strong> </span><br>
                <span>Rented : {{movie.isRent ? 'Yes :)': 'No :('}}</span>
            </p>
        </b-card-body>
    <b-button href="#" variant="primary" v-if="!movie.isRent" @click="rentMovie">Rent</b-button>
  </b-card>
</template>

<script>
import bCard from "bootstrap-vue/es/components/card/card";
import bButton from "bootstrap-vue/es/components/button/button";

export default {
  props: {
    movie: {
      type: Object,
      default: null
    }
  },
  data() {
    return {};
  },
  components: {
    bCard,
    bButton
  }
};
</script>
