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
import Vue from "vue";
import VueSweetalert2 from "vue-sweetalert2";

Vue.use(VueSweetalert2);

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
    axios.get("http://localhost:8888/api/connections/listarTypes/").then(response => {
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

      var errorText = "";
      var fields = true;

      if (this.host == "") {
        errorText = errorText + "\n El host es obligatorio,";
        fields = false;
      }
      if (!this.port) {
        errorText = errorText + "\n El puerto es obligatorio,";
        fields = false;
      }
      if (this.user == "") {
        errorText = errorText + "\n El usuario es obligatorio,";
        fields = false;
      }
      if (this.pass == "") {
        errorText = errorText + "\n La contraseña es obligatoria,";
        fields = false;
      }
      if (this.alias == "") {
        errorText = errorText + "\n El alias es obligatorio,";
        fields = false;
      }

      if (comp == false) {
        errorText = errorText + "\n El type es obligatorio";
        fields = false;
      }

      if (fields == true) {
        axios
          .post("http://localhost:8888/api/connections/crearConnections/", connec)
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
        var textWell = "Se ha registrado la conexión " + this.alias;
        this.$swal.fire(
          "Se ha registrado una nueva conexión",
          textWell,
          "success"
        );
        this.$router.push("/connections");
      } else {
        this.$swal.fire("Introduce bien los datos", errorText, "error");
      }
    },

    Type(event) {
      comp = true;
      this.types = event.target.value;
      console.log(this.types);
    },
    showAlert() {
      // Use sweetalret2
      this.$swal.fire("MyModal");
    }
  }
};
</script>