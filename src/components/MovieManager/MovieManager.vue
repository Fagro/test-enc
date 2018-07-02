<template>
   <b-container>
      <div class="col-md-12">
         <b-row class="mb-4">
            <h2 class="card-title">Movie Management</h2>
         </b-row>
         <b-row>
            <b-col md="3" class="my-1">
               <b-button variant="primary" @click="showModalMovie">
                  Add Movie
               </b-button>
            </b-col>
            <b-col md="4" class="my-1">
               <b-form-group horizontal label="Filter" class="mb-0">
                  <b-input-group>
                     <b-form-input v-model="filter" placeholder="Type to Search" />
                     <b-input-group-append>
                        <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                     </b-input-group-append>
                  </b-input-group>
               </b-form-group>
            </b-col>
            <b-col md="5" class="my-1">
               <b-form-group horizontal label="Sort direction" class="mb-0">
                  <b-input-group>
                     <b-form-select v-model="sortDirection" slot="append">
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                        <option value="last">Last</option>
                     </b-form-select>
                  </b-input-group>
               </b-form-group>
            </b-col>
         </b-row>
         <b-row class="mt-4">
            <b-table show-empty
               stacked="md"
               :items="items"
               :fields="fields"
               :current-page="currentPage"
               :per-page="perPage"
               :filter="filter"
               :sort-direction="sortDirection"
               :sort-by.sync="sortBy"
               :sort-desc.sync="sortDesc"
               @filtered="onFiltered"
               >
               <template slot="isRent" slot-scope="row">{{row.value?'Yes :)':'No :('}}</template>
               <template slot="actions" slot-scope="row">
                  <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                  <b-button size="sm" @click.stop="showModalMovieEdit(row.item, row.index, $event.target)" class="mr-1">
                     Edit
                  </b-button>
                  <b-button size="sm" @click.stop="removeMovie(row.item.id, row.index, $event.target)" class="mr-1">
                     Remove
                  </b-button>
                  <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
                     Details
                  </b-button>
               </template>
            </b-table>
         </b-row>
         <div class="d-flex justify-content-center">
            <b-row>
               <b-col md="12" class="my-1">
                  <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
               </b-col>
            </b-row>
         </div>
      </div>
      <b-modal ref="myModalRef" hide-footer :title="modalInfo.title">
         <b-card class="mb-4">
            <b-form-row>
               <b-col cols="12">
                  <b-form-group id="movieNameS"
                     label="Name"
                     label-for="movieName">
                     <b-form-input id="movieName" type="text" v-model.trim="movie.name">
                     </b-form-input>
                  </b-form-group>
               </b-col>
            </b-form-row>
            <b-form-row>
               <b-col cols="12">
                  <b-form-group id="rentPriceS"
                     label="Rent price"
                     label-for="rentPrice">
                     <b-form-input id="rentPrice" type="number" v-model.number="movie.rentPrice">
                     </b-form-input>
                  </b-form-group>
               </b-col>
            </b-form-row>
            <b-form-row>
               <b-col cols="6">
                  <b-form-group id="rentDateS"
                     label="Rent date"
                     label-for="rentDate">
                     <datepicker 
                        v-model="movie.rentDate"
                        class="form-group" 
                        name="rentDate">
                     </datepicker>
                  </b-form-group>
               </b-col>
               <b-col cols="6">
                  <b-form-group id="returnDateS"
                     label="Return date"
                     label-for="returnDate">
                     <datepicker 
                        v-model="movie.returnDate" 
                        name="returnDate">
                     </datepicker>
                  </b-form-group>
               </b-col>
            </b-form-row>
            <b-form-row>
               <b-col cols="12">
                  <b-form-group id="imageUrlS"
                     label="Image Url:"
                     label-for="imageUrl">
                     <b-form-input id="imageUrl" type="text" v-model.trim="movie.imageUrl">
                     </b-form-input>
                  </b-form-group>
                  <input id="prodId" name="prodId" type="hidden" v-model="movie.id">
               </b-col>
            </b-form-row>
         </b-card>
         
         <b-btn class="mt-3" variant="outline-primary" block @click="upsertMovie" v-if="!isInfo">Save</b-btn>
      </b-modal>
   </b-container>
</template>
<script>
import bContainer from "bootstrap-vue/es/components/layout/container";
import bRow from "bootstrap-vue/es/components/layout/row";
import bCol from "bootstrap-vue/es/components/layout/col";
import bTable from "bootstrap-vue/es/components/table/table";
import bButton from "bootstrap-vue/es/components/button/button";
import Datepicker from "vuejs-datepicker";
import { movie, movieData } from "../Model";
import swal from "sweetalert2";


export default {
  data() {
    return {
      fields: [
        {
          key: "name",
          label: "Movie",
          sortable: true,
          sortDirection: "dec",
          class: "text-left"
        },
        {
          key: "rentPrice",
          label: "Rent Price",
          sortable: true,
          class: "text-right"
        },
        { key: "isRent", label: "Is Rented" },
        { key: "rentDate", label: "Rent Date" },
        { key: "returnDate", label: "Return Date" },
        { key: "actions", label: "Actions" }
      ],
      items: [...movieData],
      currentPage: 1,
      perPage: 5,
      totalRows: movieData.length,
      pageOptions: [5, 10, 15],
      sortBy: null,
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      modalInfo: { title: "", content: "" },
      movie: { ...movie },
      isInfo: false
    };
  },

  methods: {
    showModalMovie() {
      this.modalInfo.title = "Add a movie";
      this.movie = {};
      this.isInfo = false;
      this.$refs.myModalRef.show();
    },

    info(item) {
      this.isInfo = true;
      this.modalInfo.title = "Detail a movie";
      this.movie = item;
      this.$refs.myModalRef.show();
    },

    showModalMovieEdit(item) {
      this.isInfo = false;
      this.modalInfo.title = "Edit a movie";
      let movie = this.items.find(i => i.id === item.id);
      if (movie) {
        this.movie = movie;
        this.$refs.myModalRef.show();
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    upsertMovie() {
      if (this.movie.id > 0) {
        var element = this.items.find(e => e.id == this.movie.id);
        this.items = this.items.filter(e => e.id !== element.id);
        if (this.movie.rentDate) {
          this.movie.isRent = true;
        }
        this.items.push(this.movie);
      } else {
        var id = this.items.length + 1;
        this.movie.id = id;
        if (this.movie.rentDate) {
          this.movie.isRent = true;
        }
        this.items.push(this.movie);
      }
      this.persistInDb();
      swal({
        position: "top-end",
        type: "success",
        title: "Movie saved!!!",
        showConfirmButton: false,
        timer: 2500
      });
      this.$refs.myModalRef.hide();
    },

    removeMovie(id) {
      swal({
        title: "Are you sure?",
        text: "You're about to delete a movie",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: false
      }).then(isConfirm => {
        if (isConfirm.value) {
          this.items = this.items.filter(e => e.id !== id);
          this.persistInDb();
        } else {
          swal("Cancel", "Movie not deleted", "success");
        }
      });
    },

    persistInDb() {
      localStorage.removeItem("movies");
      localStorage.setItem("movies", JSON.stringify(this.items));
    }
  },

  created() {
    var movies = localStorage.getItem("movies") || [];
    if (movies.length > 1) {
      var items = JSON.parse(movies);
      this.items = [...items];
    }
  },

  components: {
    bContainer,
    bRow,
    bCol,
    bTable,
    bButton,
    Datepicker
  }
};
</script>
