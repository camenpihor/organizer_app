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
        <a
          is="sui-menu-item"
          v-for="item in items"
          :active="isActive(item)"
          :key="item"
          :content="item"
          @click="select(item)"
        />
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
  name: "TopNavigation",
  data() {
    return {
      active: "Home",
      items: ["Home", "Archive", "Stats"]
    };
  },
  methods: {
    isActive(name) {
      return this.active === name;
    },
    select(name) {
      this.active = name;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
