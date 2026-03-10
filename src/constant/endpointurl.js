const baseurl="http://127.0.0.1:8000/api"

export const  endpoint={

  users: {
    getUsers: {
      url: `${baseurl}/people/Person/`,
      method: "GET"
    },}}