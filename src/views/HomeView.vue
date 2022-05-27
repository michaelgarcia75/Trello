<template>
  <div class="home">
    <CardView
      v-for="card in cards"
      :key="card.id"
      :card_id="card.id"
      :name="card.name"
      @updateposttitleparent="updateposttitleparent"
    />
    <div class="newCard">
      <input
        type="text"
        placeholder="Add new card / Press Enter"
        v-model="categoryName"
        @keyup.enter="createCategory"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CardView from "@/components/CardView.vue";

export default {
  name: "HomeView",
  components: {
    CardView,
  },
  data() {
    return {
      cards: [],
      posts: [],
      categoryName: "",
    };
  },
  methods: {
    createCategory() {
      if (this.categoryName !== "") {
        const WPAPI = require("wpapi");

        const wp = new WPAPI({
          endpoint: "http://localhost/wordpress/index.php/wp-json/",
          username: "fdizes",
          password: "azerty",
        });
        wp.categories()
          .create({
            name: this.categoryName,
          })
          .then((response) => {
            console.log(response);
            window.location.reload();
          });
        this.categoryName = "";
      }
    },
    updateposttitleparent(newTitle, id) {
      console.log("coucou3");
      this.$forceUpdate();
      let index = this.posts.findIndex((post) => post.id == id);
      this.posts[index].title = newTitle;
    },
  },
  mounted() {
    const WPAPI = require("wpapi");

    const wp = new WPAPI({
      endpoint: "http://localhost/wordpress/index.php/wp-json/",
      username: "fdizes",
      password: "azerty",
    });

    let cards = [];
    wp.categories()
      .get()
      .then((data) => {
        console.log(data);
        data.forEach((d) => {
          cards.push({ id: d.id, name: d.name });
        });
        this.cards = cards;
        this.$store.commit("getCards", this.cards);
      })
      .catch((err) => {
        console.log(err);
      });

    let posts = [];
    wp.posts()
      .perPage(100)
      .get()
      .then((data) => {
        console.log(data);
        data.forEach((d) => {
          posts.push({
            id: d.id,
            title: d.title.rendered,
            content: d.content.rendered.replace(/(<([^>]+)>)/gi, ""),
            category_id: d.categories[0],
          });
        });
        this.posts = posts;
        console.log(posts);
        this.$store.commit("getPosts", this.posts);
      })
      .catch((err) => {
        console.log(err);
      });

    // let comments = [];

    wp.comments()
      .perPage(100)
      .get()
      .then((data) => {
        console.log(data);
        // data.forEach((d) => {
        //   posts.push({
        //     id: d.id,
        //     title: d.title.rendered,
        //     content: d.content.rendered.replace(/(<([^>]+)>)/gi, ""),
        //     category_id: d.categories[0],
        //   });
        // });
        // this.posts = posts;
        // console.log(posts);
        // this.$store.commit("getPosts", this.posts);
      });
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}
.newCard input {
  width: 300px;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 10px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.226);
  transition: transform 0.7s ease-in-out;
}
</style>
