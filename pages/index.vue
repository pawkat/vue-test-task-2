<template>
  <v-row justify="center" align="center">
    <v-col cols="12" id="content">
      <ImageGallery :data="DATA" :page="CURRENT_PAGE" :token="token" v-if="hasData" @pageChange="pageChange"/>
    </v-col>
  </v-row>
</template>

<script>
import VueScrollTo from 'vue-scrollto'
import {mapActions, mapGetters} from 'vuex'

export default {
  data() {
    return {
      auth: false,
      token: '',
      responseData: false,
    }
  },
  computed: {
    ...mapGetters([
      'DATA',
      'CURRENT_PAGE'
    ])
  },
  methods: {
    ...mapActions([
      'GET_IMAGES_FROM_API',
      'CHANGE_PAGE',
    ]),
    hasData() {
      return DATA?.pictures;
    },
    pageChange($event) {
      this.CHANGE_PAGE($event)
      VueScrollTo.scrollTo('#content', 300, {offset: this.getHeaderHeight() * -1});
    },
    getHeaderHeight() {
      const header = document.querySelector('.v-app-bar');
      return header.offsetHeight;
    }
  },
  mounted() {
    this.GET_IMAGES_FROM_API()
  }
}
</script>
