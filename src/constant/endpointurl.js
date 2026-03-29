const baseurl="api/"

export const  endpoint={

  users: {
    getUsers: {
      url: `${baseurl}people/Person/`,
      method: "GET"
    },},
    programs: {
    regester: {
      url: `../components/json/programs.json`,
      method: "GET"
    },},
     Auth: {
    Login: {
      url: `${baseurl}accounts/auth/login/`,
      method: "POST"
    },
    Verify2FA: {
      url: `${baseurl}accounts/auth/login/verify-2fa/`,
      method: "POST"
    // accounts/me/
    
  
  },
   setPreferedRole: {
      url: `${baseurl}/accounts/preferred-roles/`,
      method: "POST"
    // accounts/me/
    
  
  },
  logout:{
     url: `${baseurl}accounts/auth/logout/`,
      method: "POST" 
  },
   getCurrentUser:{
     url: `${baseurl}accounts/me/`,
      method: "GET" 
  }
},


 pepole: {
    getpersonInfo: {
      url: `${baseurl}people/persons/`,
      method: "GET"
    },},

}