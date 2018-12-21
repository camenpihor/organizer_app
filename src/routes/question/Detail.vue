<template>
  <div id="question-detail">
    <HelloWorld msg="Welcome to Question Detail"/>
    <div :key="question_id">{{ question }}</div>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import { coreObjectDetail } from "@/api.js";

export default {
  name: "question-detail",
  components: {
    HelloWorld
  },
  data() {
    return {
      question: null,
      question_id: this.$route.params.id
    };
  },
  methods: {
    getQuestionDetail() {
      coreObjectDetail("question", this.question_id)
        .get()
        .then(response => {
          this.question = response.data;
        })
    }
  },
  mounted() {
    this.getQuestionDetail();
  }
};
</script>

<style>
#question-detail {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
