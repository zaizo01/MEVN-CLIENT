<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link :to="{query: {page: 1}}" class="ml-2">1</router-link>
    <router-link :to="{query: {page: 2}}">2</router-link>
    <router-link :to="{query: {page: 3}}">3</router-link>
  </div>
</template>


<script>
export default {
  data() {
    return {
      
    }
  },
  watch: {
    "$route.query.page": {
      immediate: true,
      handler(page){
        console.log(`seccion ha cambiado ${page}`);
      }
    }
  },
}
</script>
