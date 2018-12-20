// TODO
// questions/Archive does not match questions/archive for highlighting must is able to be routed
<template>
  <div class="top-navigation">
    <sui-menu attached="top">
      <sui-dropdown item icon="bars" simple>
        <sui-dropdown-menu>
          <router-link is="sui-dropdown-item" to="/books">Books</router-link>
          <router-link is="sui-dropdown-item" to="/facts">Facts</router-link>
          <router-link is="sui-dropdown-item" to="/questions">Questions</router-link>
          <router-link is="sui-dropdown-item" to="/topics">Topics</router-link>
          <router-link is="sui-dropdown-item" to="/words">Words</router-link>
        </sui-dropdown-menu>
      </sui-dropdown>
      <sui-menu-menu>
        <router-link is="sui-menu-item" :to="'/' + coreObject" exact>Home</router-link>
        <router-link is="sui-menu-item" :to="'/' + coreObject + '/archive'" exact>Archive</router-link>
        <router-link is="sui-menu-item" :to="'/' + coreObject + '/stats'" exact>Stats</router-link>
      </sui-menu-menu>
      <sui-menu-menu position="right">
        <sui-menu-item right>
          <sui-input transparent icon="search" placeholder="Search..."/>
        </sui-menu-item>
      </sui-menu-menu>
    </sui-menu>
  </div>
</template>

<script>
export default {
  name: "top-navigation",
  data () {
      return {
          coreObject: this.$store.getters.currentCoreObject
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
