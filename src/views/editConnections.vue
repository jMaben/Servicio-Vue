<template>
  <div class="editConnections">
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
                <input type="text" class="form-control" v-model="connec.host" />
              </div>
              <div class="form-group">
                <label>PORT</label>
                <input type="number" class="form-control" min="0" max="65535" v-model="connec.port" />
              </div>
              <div class="form-group">
                <label>USER</label>
                <input type="text" class="form-control" v-model="connec.user" />
              </div>
              <div class="form-group">
                <label>PASS</label>
                <input type="password" class="form-control" v-model="connec.pass" />
              </div>
              <div class="form-group">
                <label>ALIAS</label>
                <input type="text" class="form-control" v-model="connec.alias" />
              </div>
              <div class="form-group">
                <label>ACTIVE</label>
                <input type="checkbox" class="form-control" v-model="connec.active" />
              </div>
              <div class="form-group">
                <label>TYPE</label>
                <select class="form-control" @change="Type($event)">
                  <option value selected disabled>TYPE</option>
                  <option v-for="types in types" :key="types.id" :value="types.id">{{types.type}}</option>
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
  props: ["idvalor"],
  data() {
    return {
      connec: [],
      types: [],
      host: "",
      port: null,
      user: "",
      pass: "",
      alias: "",
      active: false,
      idType: null,
      id: null,
      connectionsMetadates: []
    };
  },
  created() {
    axios.get("http://localhost:8090/api/connections/findAllTypes").then(response => {
      this.types = response.data;
    });

    axios
      .get("http://localhost:8090/api/connections/findConnectionById/" + parseInt(this.idvalor))
      .then(response => {
        this.connec = response.data;
      });
  },
  methods: {
    formSubmit() {
      const prueba = {
        id: parseInt(this.id)
      };

      const ob = {
        host: this.connec.host,
        port: this.connec.port,
        user: this.connec.user,
        pass: this.connec.pass,
        alias: this.connec.alias,
        active: this.connec.active,
        types: prueba
      };

      Object.setPrototypeOf(prueba, null);
      Object.setPrototypeOf(ob, null);

var errorText = "";
      var fields = true;

      if (comp == false) {
        errorText = errorText + "\n El type es obligatorio";
        fields = false;
      }
      console.log(ob.types.id);
      console.log(ob);
      if (fields == true) {
        axios
          .put("http://localhost:8090/api/connections/updateConnection/"+this.idvalor+"/type/"+ob.types.id, ob)
          .catch(err => {
            console.log(err);
            return null;
          });
        var textWell = "Se ha actualizado la conexión " + ob.alias;
        this.$swal.fire(
          textWell,
          "",
          "success"
        );
        this.$router.push("/connections");
        setTimeout(function(){
            location.reload(true);
          }, 3000);
      } else {
        this.$swal.fire("Introduce bien los datos", errorText, "error");
      }
    },

    Type(event) {
      comp = true;
      this.id = event.target.value;
      console.log(this.id);
    },
        showAlert() {
      // Use sweetalret2
      this.$swal.fire("MyModal");
    }
  }
};
</script>