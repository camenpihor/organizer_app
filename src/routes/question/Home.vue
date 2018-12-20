<template>
  <div id="question-home">
    <hello-world msg="Welcome to Question"/>

    <section v-if="errored">
      <p>Error</p>
    </section>

    <section v-else>
      <question-list v-bind:questions="questions"/>
    </section>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import QuestionList from "@/components/QuestionList.vue";
import { coreObjectList, getRandomSubset } from "@/api.js";

export default {
  name: "question-home",
  components: {
    HelloWorld,
    QuestionList
  },
  data() {
    return {
      questions: null,
      errored: false
    };
  },
  methods: {
    getQuestions() {
      coreObjectList("question")
        .get()
        .then(response => {
          this.questions = getRandomSubset(response.data, 5);
        })
        .catch(() => {
          this.errored = true;
        });
    }
  },
  mounted() {
    this.getQuestions();
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
