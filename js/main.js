new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      restaurants: [],
      name: "",
      description: ""
    };
  },
  mounted() {
    this.getRestaurants()
  },
  methods: {
    async createRestaurant(){
      try {
        await axios({
          method: "POST",
          url: "https://dry-citadel-76623.herokuapp.com/graphql",
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
        url: "https://dry-citadel-76623.herokuapp.com/graphql",
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
          url: "https://dry-citadel-76623.herokuapp.com/graphql",
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
          console.log(result)
          this.restaurants = result.data.data.restaurants;
      } catch (error) {
        console.error(error);
      }
    }      
  }
})
