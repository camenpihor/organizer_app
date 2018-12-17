<template>
  <div id="question-home">
    <HelloWorld msg="Welcome to Question"/>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "question-home",
  components: {
    HelloWorld
  },
  data () {
      return {
        activeParent: "hai"
      }
  }
};
</script>

<style>
#question-home {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
