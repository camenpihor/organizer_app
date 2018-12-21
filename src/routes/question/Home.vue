<template>
  <div id="question-home">
    <hello-world msg="Welcome to Questions"/>
    <sui-card-group :items-per-row="1" id="question-list">
      <sui-card v-for="question in questions" :key="question.id">
        <sui-card-content>
          <sui-card-header>
            <router-link :to="'/questions/' + question.id">{{ question.question }}</router-link>
          </sui-card-header>
          <sui-card-meta>{{ question.created_at_utc | moment("dddd, MMMM Do YYYY") }}</sui-card-meta>
          <sui-card-description>{{ question.num_views }} | {{ question.rating }}</sui-card-description>
        </sui-card-content>
        <!-- <sui-card-content extra>
          <sui-container text-align="center">
            <sui-button-group>
              <sui-button>Edit</sui-button>
              <sui-button-or/>
              <sui-button positive>View</sui-button>
            </sui-button-group>
          </sui-container>
        </sui-card-content> -->
      </sui-card>
    </sui-card-group>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import QuestionList from "@/components/QuestionList.vue";
import { coreObjectList, getRandomSubset } from "@/api.js";

export default {
  name: "question-home",
  components: {
    HelloWorld
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

#question-list {
    max-width: 600px;
    margin: auto
}
</style>
