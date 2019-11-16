<template>
  <v-app>
    <FrontPage></FrontPage>
  </v-app>
</template>

<script>
import FrontPage from './components/FrontPage';

export default {
  name: 'App',

  components: {
    FrontPage,
  },

  data: () => ({
    //
  }),
};
</script>
