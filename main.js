new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      restaurants: [],
      name: "",
      description: "",
      apiURL: "https://powerful-dusk-72165.herokuapp.com/graphql",
      email: "",
      password: "",
      token: ""
    };
  },
  mounted() {
    this.getRestaurants()
  },
  methods: {
    async createUser(){
      axios
      .post('https://powerful-dusk-72165.herokuapp.com/auth/local/register', {
        username: 'momoko1',
        email: 'momoko1@strapi.com',
        password: 'password',
      })
      .then(response => {
        console.log('Well done!');
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
      })
      .catch(error => {
        console.log('An error occurred:', error);
      });
    },
    async login(){
      axios
      .post('https://powerful-dusk-72165.herokuapp.com/auth/local', {
        identifier: this.email,
        password: this.password,
      })
      .then(response => {
        this.token = response.data.jwt
        this.getRestaurants()
      })
      .catch(error => {
        console.log('An error occurred:', error);
      });
    },
    async createRestaurant(){
      try {
        await axios({
          method: "POST",
          url: this.apiURL,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          data: {
            query: `
              mutation {
                createRestaurant(input: {
                  data: {
                    name: "${this.name}",
                    description: "${this.description}"
                  }
                }) {
                  restaurant {
                    name
                    description
                  }
                }
              }
            `
          }
        });
      this.name = ""
      this.description = ""
      this.getRestaurants()
      } catch (error) {
        console.error(error);
      }
    }, 
    async deleteRestaurant(id){
      console.log(id)
      try {
        await axios({
        method: "POST",
        url: this.apiURL,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        data: {
          query: `
            mutation {
              deleteRestaurant(input: {
                where: {
                  id: ${id}
                }
              }) {
                restaurant {
                  name
                  description
                }
              }
            }
          `
          }
        });
        this.getRestaurants()
      } catch (error) {
        console.error(error);
      }
    },
    async getRestaurants(){
      try {
        var result = await axios({
          method: "POST",
          url: this.apiURL,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          data: {
            query: `
              query getRestaurants {
                restaurants {
                  id
                  name
                  description
                }
              }
            `
              }
          });
          this.restaurants = result.data.data.restaurants;
      } catch (error) {
        console.error(error);
      }
    }      
  }
})


