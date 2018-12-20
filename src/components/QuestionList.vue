<template>
  <div class="question-list">
    <div v-for="question in questions" :key="question.id">
      <router-link :to="'/questions/' + question.id">Question: {{ question.id }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "question-list",
    props: {
      questions: Array
    }
};
</script>

<style scoped>
</style>
