<template>
  <v-row justify="center" align="center">
    <v-col cols="12" id="content">
      <ImageGallery :data="responseData" :page="page" :token="token" v-if="hasData" @pageChange="pageChange"/>
    </v-col>
  </v-row>
</template>

<script>
import VueScrollTo from 'vue-scrollto';

export default {
  data() {
    return {
      auth: false,
      token: '',
      responseData: false,
      page: 1
    }
  },
  methods: {
    async asyncAuth({$axios}) {
      const ip = await $axios.$post('http://interview.agileengine.com/auth', {
        apiKey: process.env.API_KEY,
      });
      if (ip.auth && ip.token) {
        const {auth, token} = ip;
        this.auth = auth;
        this.token = token;
        this.getData(this);
      } else {
        alert('Something went wrong.');
      }
    },
    async getData({$axios}) {
      const url = this.page > 1 ? `http://interview.agileengine.com/images?page=${this.page}` : 'http://interview.agileengine.com/images';
      const ip = await $axios.$get(url, {
        headers: {'Authorization': this.token},
      });
      if (ip.pictures) {
        ip.pictures.map((picture) => {
          picture.dialog = false
          return picture;
        })
        this.responseData = ip;
      } else {
        alert('Something went wrong.');
      }
    },
    hasData() {
      return this.responseData?.pictures;
    },
    pageChange($event) {
      this.page = $event;
      VueScrollTo.scrollTo('#content', 300, {offset: this.getHeaderHeight() * -1});
      this.getData(this);
    },
    getHeaderHeight() {
      const header = document.querySelector('.v-app-bar');
      return header.offsetHeight;
    }
  },
  mounted() {
    this.asyncAuth(this);
  }
}
</script>
