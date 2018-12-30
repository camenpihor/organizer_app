<template>
  <div id="question-archive">
    <h1>Archive</h1>
    <sui-card-group :items-per-row="1" id="question-list">
      <sui-card v-for="question in questions" :key="question.id">
        <sui-card-content>
          <sui-card-header>
            <router-link :to="'/questions/' + question.id">{{ question.question }}</router-link>
          </sui-card-header>
          <sui-card-meta>{{ question.created_at_utc | moment("dddd, MMMM Do YYYY") }}</sui-card-meta>
          <sui-card-description>{{ question.num_views }} | {{ question.rating }}</sui-card-description>
        </sui-card-content>
      </sui-card>
    </sui-card-group>
  </div>
</template>

<script>
import { coreObjectList } from "@/api.js";

export default {
  name: "question-archive",
  components: {},
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
        });
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

#question-list {
  max-width: 600px;
  margin: auto;
}
</style>
