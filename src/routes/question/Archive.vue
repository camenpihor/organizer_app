<template>
  <div id="question-archive">
    <HelloWorld msg="Welcome to Question Archive"/>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "question-archive",
  components: {
    HelloWorld
  },
};
</script>

<style>
#question-archive {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
