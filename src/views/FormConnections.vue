<template>
  <div class="formConnections">
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossorigin="anonymous"
    />

    <div class="container mt-4">
      <div class="col-sm-6">
        <form @submit.prevent="formSubmit" style="margin: 0 auto;">
          <div class="card">
            <div class="card-header">
              <h3>Connections</h3>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label>HOST</label>
                <input type="text" class="form-control" v-model="host" />
              </div>
              <div class="form-group">
                <label>PORT</label>
                <input type="number" class="form-control" min="0" max="65535" v-model="port" />
              </div>
              <div class="form-group">
                <label>USER</label>
                <input type="text" class="form-control" v-model="user" />
              </div>
              <div class="form-group">
                <label>PASS</label>
                <input type="password" class="form-control" v-model="pass" />
              </div>
              <div class="form-group">
                <label>ALIAS</label>
                <input type="text" class="form-control" v-model="alias" />
              </div>
              <div class="form-group">
                <label>ACTIVE</label>
                <input type="checkbox" class="form-control" v-model="active" />
              </div>
              <div class="form-group">
                <label>TYPE</label>
                <select class="form-control" @change="Type($event)">
                  <option value selected disabled>TYPE</option>
                  <option v-for="type in ltypes" :key="type.id" :value="type.id">{{type.type}}</option>
                </select>
              </div>
            </div>
            <div class="card-footer">
              <input type="submit" value="Guardar" id="Guardar" class="btn btn-success" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import http from "http";
var comp = false;
export default {
  name: "Home",
  data() {
    return {
      ltypes: [],
      host: "",
      port: null,
      user: "",
      pass: "",
      alias: "",
      active: false,
      types: null,
      id: null,
      connectionsMetadates: []
    };
  },
  created() {
    axios.get("http://localhost:8191/listarTypes").then(response => {
      this.ltypes = response.data;
    });
  },
  methods: {
    formSubmit() {
      const prueba = {
        id: this.types
      };

      const connec = {
        host: this.host,
        port: this.port,
        user: this.user,
        pass: this.pass,
        alias: this.alias,
        active: this.active,
        types: prueba
      };

      Object.setPrototypeOf(connec, null);

      console.log(connec);

      if (comp == true) {
        axios
          .post("http://localhost:8191/crearConnections", connec)
          .catch(err => {
            console.log(err);
            return null;
          })
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });

        alert("Se ha registrado una nueva conexión");
        this.$router.push("/connections");
      } else {
        alert("Introduce un Tipo");
      }
    },

    Type(event) {
      this.comp = true;
      this.types = event.target.value;
      console.log(this.types);
    }
  }
};
</script>