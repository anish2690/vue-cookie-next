<template>
  <div>
    <p>
      Please enter your Username :
      <input type="text" v-model="usernameValue" />
      <button @click="saveUser">✅ Save Cookie</button>
    </p>
    <p>
      Welcome again : {{ usernameValue }}
      <button @click="deleteUser">🗑{{ deleteUserText }}</button>
      {{ deleteUserState }}
    </p>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  setup() {
    const usernameValue = ref("");
    const deleteUserText = ref("Delete Cookie");
    const deleteUserState = ref(null);
    return {
      usernameValue,
      deleteUserText,
      deleteUserState,
    };
  },
  mounted() {
    this.usernameValue = this.$cookie.getCookie("username");
  },
  methods: {
    saveUser() {
      this.$cookie.setCookie("username", this.usernameValue);
    },
    deleteUser: function () {
      this.$cookie.removeCookie("username");
      this.deleteUserState = "√";

      setTimeout(function () {
        location.reload();
      }, 0.5 * 1000);
    },
  },
};
</script>
