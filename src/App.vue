<template>
  <div id="app">
    <top-navigation/>
    <v-content>
      <router-view/>
    </v-content>
  </div>
</template>

<script>
import TopNavigation from "./components/TopNavigation.vue";

export default {
  name: "app",
  components: {
    TopNavigation
  }
};
</script>

<style>
/* add any unviersal styling */
</style>
