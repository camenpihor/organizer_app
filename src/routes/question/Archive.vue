<template>
  <div id="question-archive">
    <hello-world msg="Welcome to Question Archive"/>
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
import { coreObjectList } from "@/api.js";

export default {
  name: "question-archive",
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
          this.questions = response.data;
        })
        .catch(() => {
          this.errored = true;
        })
    }
  },
  mounted() {
    this.getQuestions();
  }
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
