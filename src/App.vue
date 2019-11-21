<template>
  <v-app>
    <FrontPage></FrontPage>
  </v-app>
</template>

<script>
// default instance of Vue

// loads component FrontPage
import FrontPage from './components/FrontPage';

export default {
  name: 'App',
  components: {
    FrontPage,
  },
};
</script>
