// stores/userStore.js

import { defineStore } from "pinia";
import { endpoint } from "../constant/endpointurl";
import { fetchData } from "../Composable/useApi";

export const useUserStore = defineStore("users", {

  state: () => ({
    users: []
  }),

  actions: {

    async getUsers() {
        console.log(endpoint.users.getUsers.url)

      const result = await fetchData(endpoint.users.getUsers.url);

      if (result.error) {

        console.log(result.error);

      } else {

        this.users = result.data;

      }

    }

  }

});