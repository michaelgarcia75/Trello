<template>
  <div class="card">
    <textarea
      class="name"
      spellcheck="false"
      v-model="tempName"
      @blur="updateCardName"
    />
    <PostView
      v-for="post in postList"
      :key="post.id"
      :post_id="post.id"
      :title="post.title"
      :content="post.content"
      :card_name="name"
      @updateposttitleparent="updateposttitleparent"
    />
    <input
      class="input-post"
      type="text"
      placeholder="Create a Post / Press enter"
      v-model="postName"
      @keyup.enter="createPost"
    />
    <svg
      class="delbtn"
      @click="deleteCategory"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
      <path
        d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"
      />
    </svg>
  </div>
</template>

<script>
// @ is an alias to /src
import PostView from "@/components/PostView.vue";

export default {
  name: "CardView",
  data() {
    return {
      postName: "",
      tempName: this.name,
    };
  },
  components: {
    PostView,
  },
  props: {
    card_id: Number,
    name: String,
  },
  emit: ["updateposttitleparent"],
  computed: {
    postList() {
      return this.$store.getters.getPostsByCardId(this.card_id);
    },
  },
  methods: {
    updateCardName() {
      const WPAPI = require("wpapi");

      const wp = new WPAPI({
        endpoint: "http://localhost/wordpress/index.php/wp-json/",
        username: "fdizes",
        password: "azerty",
      });
      wp.categories()
        .id(this.card_id)
        .update({
          name: this.tempName,
        })
        .then(function (response) {
          console.log(response);
        });
    },
    createPost() {
      if (this.postName !== "") {
        const WPAPI = require("wpapi");

        const wp = new WPAPI({
          endpoint: "http://localhost/wordpress/index.php/wp-json/",
          username: "fdizes",
          password: "azerty",
        });
        wp.posts()
          .create({
            title: this.postName,
            content: "",
            categories: this.card_id,
            status: "publish",
          })
          .then((data) => {
            console.log(data);
            window.location.reload();
          });
        this.postName = "";
      }
    },
    updateposttitleparent(newTitle, id) {
      console.log("coucou2");
      this.$forceUpdate();
      this.$emit("updateposttitleparent", newTitle, id);
    },
    deleteCategory() {
      const WPAPI = require("wpapi");

      const wp = new WPAPI({
        endpoint: "http://localhost/wordpress/index.php/wp-json/",
        username: "fdizes",
        password: "azerty",
      });
      this.postList.forEach((post) => {
        wp.posts()
          .id(post.id)
          .param("force", true)
          .delete()
          .then((data) => {
            console.log(data);
            window.location.reload();
          });
      });
      wp.categories()
        .id(this.card_id)
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
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: 300px;
  min-height: 100px;
  height: fit-content;
  background-color: rgb(131, 201, 245, 0.5);
  margin: 10px 10px;
  text-align: left;
  padding: 10px;
  border-radius: 5px;
  border: solid 1px black;
}
.name {
  box-sizing: border-box;
  height: 70px;
  width: 100%;
  font-weight: 600;
  justify-content: left;
  font-size: 25px;
  background: none;
  outline: none;
  border-style: none;
  resize: none;
  overflow: hidden;
}
.card p {
  font-weight: 750;
  padding: 5px;
}

.delbtn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 20px;
  cursor: pointer;
  border-radius: 100%;
}

.input-post {
  margin-top: 5px;
  border-radius: 5px;
  padding: 5px;
}
</style>
