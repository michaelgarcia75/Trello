<template>
  <draggable :options="{ group: 'cards' }" group="cards" ghostClass="ghost">
    <span
      class="element-card"
      v-for="(card, index) in cards"
      :key="index"
      @click="togglePopup(card)"
    >
      {{ card.name }}
    </span>
  </draggable>
  <draggable
    :options="{ group: 'card' }"
    group="card"
    ghostClass="ghost"
    class="card-draggable"
  >
    <div class="post">
      <p @click="toggleDetailModale">{{ title }}</p>
      <svg
        class="delbtn"
        @click="deletePost"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"
        />
      </svg>
    </div>
    <DetailModale
      :showDetailModale="showDetailModale"
      :toggleDetailModale="toggleDetailModale"
      :post_id="post_id"
      :title="tempTitle"
      :content="content"
      :card_name="card_name"
      @updateposttitleparent="updateposttitleparent"
    />
  </draggable>
</template>

<script>
// @ is an alias to /src
import DetailModale from "@/components/DetailModale.vue";
import { VueDraggableNext } from "vue-draggable-next";

export default {
  name: "PostView",
  components: {
    DetailModale,
    draggable: VueDraggableNext,
  },
  data() {
    return {
      showDetailModale: false,
      tempTitle: this.title,
    };
  },
  props: {
    post_id: Number,
    title: String,
    content: String,
    card_name: String,
  },
  emit: ["updateposttitleparent"],
  methods: {
    toggleDetailModale() {
      this.showDetailModale = !this.showDetailModale;
      if (!this.showDetailModale) {
        // window.location.reload();
      }
    },
    updateposttitleparent(newTitle) {
      this.tempTitle = newTitle;
      console.log("coucou");
      this.$forceUpdate();
      this.$emit("updateposttitleparent", this.tempTitle, this.post_id);
    },
    deletePost() {
      const WPAPI = require("wpapi");

      const wp = new WPAPI({
        endpoint: "http://localhost/wordpress/index.php/wp-json/",
        username: "fdizes",
        password: "azerty",
      });

      wp.posts()
        .id(this.post_id)
        .param("force", true)
        .delete()
        .then((data) => {
          console.log(data);
          window.location.reload();
        });
    },
  },
};
</script>

<style scoped>
.post {
  background-color: white;
  padding: 5px;
  /* margin: 5px 0; */
  margin-bottom: 5px;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.post:hover {
  background-color: rgb(255, 167, 167);
}

.post:hover .delbtn {
  visibility: visible;
}

.post p {
  margin: 5px auto;
  font-weight: 650;
  font-size: 15px;
}

.delbtn {
  position: absolute;
  top: 13px;
  right: 15px;
  width: 17px;
  cursor: pointer;
  border-radius: 100%;
  visibility: hidden;
}
</style>