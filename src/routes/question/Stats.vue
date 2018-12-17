<template>
  <div id="question-stats">
    <HelloWorld msg="Welcome to Question Stats"/>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "question-stats",
  components: {
    HelloWorld
  }
};
</script>

<style>
#question-stats {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
