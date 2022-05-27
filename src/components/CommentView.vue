<template>
  <div class="comment_card">
    <p>
      {{ comment_author_name }}
      <span> {{ moment(comment_date + "Z").fromNow() }}</span>
    </p>

    <textarea
      class="comment_content"
      spellcheck="false"
      v-model="tempComment_content"
      @blur="updateComment"
    />
    <button class="delete_comment" @click="deleteComment" type="button">
      Delete
    </button>
  </div>
</template>
<script>
var moment = require("moment");
export default {
  name: "commentView",
  props: [
    "comment_id",
    "comment_author_name",
    "comment_content",
    "comment_date",
  ],
  emit: ["deleteCommentPost"],
  data() {
    return {
      tempComment_content: this.comment_content,
      moment: moment,
    };
  },
  methods: {
    deleteComment() {
      const WPAPI = require("wpapi");

      const wp = new WPAPI({
        endpoint: "http://localhost/wordpress/index.php/wp-json/",
        username: "fdizes",
        password: "azerty",
      });

      wp.comments()
        .id(this.comment_id)
        .param("force", true)
        .delete()
        .then((data) => {
          console.log(data);
          this.$emit("deleteCommentPost", this.comment_id);
        });
    },
    updateComment() {
      const WPAPI = require("wpapi");

      const wp = new WPAPI({
        endpoint: "http://localhost/wordpress/index.php/wp-json/",
        username: "fdizes",
        password: "azerty",
      });
      wp.comments()
        .id(this.comment_id)
        .update({
          content: this.tempComment_content,
        })
        .then(function (response) {
          console.log(response);
        });
    },
  },
};
</script>
<style scoped>
.comment_card {
  margin-top: 20px;
}

p {
  font-weight: 600;
}
.comment_content {
  font-size: 12px;
  padding: 5px;
  width: 100%;
  resize: none;
  background-color: rgb(220, 236, 247);
}

.delete_comment {
  font-size: 12px;
  border: none;
  float: right;
}

.delete_comment:hover {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
span {
  font-size: 10px;
  font-weight: 500;
  margin-left: 5px;
}
</style>


