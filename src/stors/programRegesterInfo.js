// stores/userStore.js

import { defineStore } from "pinia";
import { endpoint } from "../constant/endpointurl";
import { fetchData } from "../Composable/useApi";

export const useProgramRegestrStore = defineStore("ProgramRegestr", {

  state: () => ({
    programsRegster: [],
    isLoading:false,
    error:{}
  }),

  actions: {

    async getPrograms() {
        this.isLoading=true;
        console.log(  endpoint.programs.regester.url
)

      const result = await fetchData( endpoint.programs.regester.url
);
        this.isLoading=true;


      if (result.error) {
          this.error=result.error;
        console.log(result.error);

      } else {

        this.users = result.data;

      }

    }

  }

});