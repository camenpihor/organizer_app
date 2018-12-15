<template>
  <div id="app">
    <top-navigation/>
    <router-view/>
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
