<template>
  <div>
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn
              icon
              dark
              @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ dialogPicture ? dialogPicture.author : 'Loading...' }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div v-if="dialogPicture">
          <div class="image-info">
            <div class="image-info__img">
              <img :src="dialogPicture.full_picture" v-if="dialogPicture.full_picture" alt=""/>

              <div class="image-info__author" v-if="dialogPicture.author">
                Author: {{ dialogPicture.author }}
              </div>
              <div class="image-info__footer" v-if="dialogPicture.camera || dialogPicture.tags">
                <div class="image-info__camera" v-if="dialogPicture.camera">
                  Camera: {{ dialogPicture.camera }}
                </div>
                <div class="image-info__tags" v-if="dialogPicture.tags">
                  {{ dialogPicture.tags }}
                </div>
              </div>
            </div>
          </div>
          <div class="large-image">
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="6" md="3" sm="4" v-for="picture in data.pictures" :key="picture.id">
        <v-card class="image-card" :style="{backgroundImage: `url('${picture.cropped_picture}')`}"
                @click="loadDialogPicture(picture)">
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-pagination
            v-model="currentPage"
            :length="data.pageCount"
            :total-visible="6"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>
</template>

<script>

export default {
  props: ['data', 'page', 'token'],
  data() {
    return {
      currentPage: this.page,
      dialog: false,
      dialogPicture: false
    }
  },
  methods: {
    async loadDialogPicture(picture) {
      const ip = await this.$axios.$get(`http://interview.agileengine.com/images/${picture.id}`, {
        headers: {'Authorization': this.token},
      });
      if (ip) {
        this.dialogPicture = ip
        this.dialog = true
      }
    }
  },
  watch: {
    currentPage(event) {
      this.$emit('pageChange', this.currentPage)
    }
  }
}
</script>

<style lang="scss">
.image-card {
  display: flex;
  padding: 100% 0 0;
  background-size: calc(100% - 32px);
  background-position: center;
  background-repeat: no-repeat;

  img {
    width: 100%;
  }
}

.image-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;

  &__img {
    display: flex;
    position: relative;

    img {
      max-width: 100%;
    }
  }

  &__author, &__footer {
    position: absolute;
  }

  &__author, &__camera, &__tags {
    background-color: $dark-gray;
    padding: 3px;
  }

  &__footer {
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  &__camera, &__tags {
    font-size: 12px;
    border-radius: 4px;

    &:not(:last-child) {
      margin-right: 16px;
    }
  }

  &__tags {
    text-align: right;
  }

  &__author {
    width: 100%;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 16px;
    border-radius: 0;
    text-align: center;
    @include md-max {
      font-size: 14px;
    }
  }
}

p:last-child {
  margin-bottom: 0;
}
</style>
