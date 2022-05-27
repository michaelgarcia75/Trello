<script>
import CommentView from "@/components/CommentView.vue";

export default {
  name: "DetailModale",
  components: { CommentView },
  props: [
    "showDetailModale",
    "toggleDetailModale",
    "post_id",
    "title",
    "content",
    "card_name",
  ],
  data() {
    return {
      tempTitle: this.title,
      tempContent: this.content,
      comments: [],
      showComments: false,
      tempComment_content: "",
    };
  },
  emit: ["updateposttitleparent"],
  methods: {
    toggleComments() {
      this.showComments = !this.showComments;
    },
    updatePostTitle() {
      const WPAPI = require("wpapi");
      console.log(this.post_id);

      const wp = new WPAPI({
        endpoint: "http://localhost/wordpress/index.php/wp-json/",
        username: "fdizes",
        password: "azerty",
      });
      wp.posts()
        .id(this.post_id)
        .update({
          title: this.tempTitle,
        })
        .then((response) => {
          console.log(response);
          this.$emit("updateposttitleparent", this.tempTitle);
        });
    },
    updatePostContent() {
      const WPAPI = require("wpapi");
      console.log(this.post_id);

      const wp = new WPAPI({
        endpoint: "http://localhost/wordpress/index.php/wp-json/",
        username: "fdizes",
        password: "azerty",
      });
      wp.posts()
        .id(this.post_id)
        .update({
          content: this.tempContent,
        })
        .then(function (response) {
          console.log(response);
        });
    },
    createComment() {
      if (this.tempComment_content !== "") {
        const WPAPI = require("wpapi");
        const wp = new WPAPI({
          endpoint: "http://localhost/wordpress/index.php/wp-json/",
          username: "fdizes",
          password: "azerty",
        });

        wp.comments()
          .create({
            content: this.tempComment_content,
            post: this.post_id,
          })
          .then((response) => {
            console.log(response);
            let comment = {
              id: response.id,
              author_name: "fdizes",
              content: this.tempComment_content,
              date: new Date().toLocaleString("en-US", {
                timeZone: "Europe/Paris",
              }),
            };
            this.comments.unshift(comment);
            console.log(
              new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" })
            );
            this.tempComment_content = "";
          });
      }
    },
    deleteCommentPost(comment_id) {
      this.comments = this.comments.filter(
        (comment) => comment.id != comment_id
      );
    },
  },
  mounted() {
    const WPAPI = require("wpapi");
    console.log(this.post_id);

    const wp = new WPAPI({
      endpoint: "http://localhost/wordpress/index.php/wp-json/",
      username: "fdizes",
      password: "azerty",
    });

    let comments = [];
    wp.comments()
      .post(this.post_id)
      .perPage(100)
      .get()
      .then((data) => {
        console.log(data);
        data.forEach((d) => {
          comments.push({
            id: d.id,
            author_name: d.author_name,
            content: d.content.rendered.replace(/(<([^>]+)>)/gi, ""),
            date: d.date,
          });
        });
        this.comments = comments;
      });
  },
};
</script>

<template>
  <div class="bloc-modale" v-if="showDetailModale">
    <div class="overlay" @click="toggleDetailModale"></div>

    <div class="modale-card">
      <svg
        class="btn-x-modale"
        @click="toggleDetailModale"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M215.1 272h-136c-12.94 0-24.63 7.797-29.56 19.75C45.47 303.7 48.22 317.5 57.37 326.6l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.75-.0012 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.26 .0013l78.06-78.07l30.06 30.06c6.125 6.125 14.31 9.367 22.63 9.367c4.125 0 8.279-.7891 12.25-2.43c11.97-4.953 19.75-16.62 19.75-29.56V296C239.1 282.7 229.3 272 215.1 272zM296 240h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.5 12.5-32.76 .0002-45.26l-22.62-22.62c-12.5-12.5-32.76-12.5-45.26-.0003l-78.06 78.07l-30.06-30.06c-9.156-9.141-22.87-11.84-34.87-6.937c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C272 229.3 282.7 240 296 240z"
        />
      </svg>

      <textarea
        class="title"
        spellcheck="false"
        v-model="tempTitle"
        @blur="updatePostTitle"
      />
      <p class="card_name">
        In card
        <strong
          ><u>{{ this.card_name }}</u></strong
        >
      </p>
      <p class="description">Description</p>
      <textarea
        class="content"
        spellcheck="false"
        v-model="tempContent"
        placeholder="Enter detailed content"
        @blur="updatePostContent"
      />
      <button class="btn_show" v-if="!showComments" @click="toggleComments">
        Show Comments
      </button>
      <button class="btn_show" v-else @click="toggleComments">
        Hide Comments
      </button>
      <div class="comment_section" v-if="showComments">
        <textarea
          class="new_comment"
          spellcheck="false"
          v-model="tempComment_content"
          placeholder="Enter new comment"
          @keyup.enter="createComment()"
        />

        <CommentView
          v-for="comment in comments"
          :key="comment.id"
          :comment_id="comment.id"
          :comment_author_name="comment.author_name"
          :comment_content="comment.content"
          :comment_date="comment.date"
          @deleteCommentPost="deleteCommentPost"
        />
      </div>
      <button
        @click="toggleDetailModale"
        class="btn-ok-modale btn-outline-dark"
      >
        OK
      </button>
    </div>
  </div>
</template>




<style scoped>
.bloc-modale {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modale-card {
  min-height: 450px;
  height: auto;
  width: 500px;
  background-color: #ffffff;
  position: fixed;
  top: 5%;
  border-radius: 2px;
  padding: 10px 25px 10px;
  max-height: 100%;
  overflow-y: auto;
}

.title {
  box-sizing: border-box;
  height: 35px;
  width: 90%;
  padding-left: 10px;
  font-weight: 600;
  justify-content: left;
  font-size: 20px;
  background: none;
  outline: none;
  border-style: none;
  resize: none;
  overflow: hidden;
}

.title:hover {
  background-color: rgb(220, 236, 247);
}

.card_name {
  font-size: 13px;
  padding-left: 10px;
}

.description {
  margin-top: 30px;
  font-weight: 600;
}

.content {
  box-sizing: border-box;
  height: 100px;
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgb(220, 236, 247);
  border-style: none;
  resize: none;
  overflow: hidden;
  font-size: 13px;
  border-radius: 3px;
}

.new_comment {
  width: 100%;
  height: 30px;
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 5px;
  background-color: rgb(220, 236, 247);
  resize: none;
  font-size: 13px;
  border-radius: 2px;
}

.btn-x-modale {
  position: absolute;
  width: 20px;
  top: 15px;
  right: 15px;
  cursor: pointer;
}

.btn-ok-modale {
  margin: 20px auto 50px;
}

.btn_show {
  float: right;
  font-size: 14px;
  border-radius: 3px;
  padding: 5px;
  border: none;
  background-color: lightgrey;
}
.btn_show:active {
  background-color: rgb(45, 46, 158);
}
</style>