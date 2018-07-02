import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MovieRent from '@/components/Movie/MovieRent'
import MovieManager from '@/components/MovieManager/MovieManager'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/movies',
      name: 'Movies',
      component: MovieRent
    },
    {
      path: '/movieAdmin',
      name: 'MovieManager',
      component: MovieManager
    }
  ]
})
