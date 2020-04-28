<template>
  <div class="ConnectionsData">
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
              <h3>Inserción de datos</h3>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label>Origen</label>
                <select class="form-control" @change="saveOrigen($event)">
                  <option value selected disabled>Conexión</option>
                  <option v-for="post in post" v-bind:key="post.id" :value="post.id">{{post.alias}}</option>
                </select>
              </div>
            </div>
            <div class="card-footer">
              <div class="form-group">
                <label>Destino</label>
                <select class="form-control" @change="saveDestino($event)">
                  <option value selected disabled>Conexión</option>
                  <option v-for="post in post" v-bind:key="post.id" :value="post.id">{{post.alias}}</option>
                </select>
              </div>
            </div>
          </div>
        </form>
        <button title="Guardar" @click="Submit()" class="btn btn-success">Insertar</button>
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
var origenComp = false;
var destinoComp = false;
var nameOrigen = {};
var nameDestino = {};
var idOrigen = 0;
var idDestino = 0;
export default {
  name: "Data",
  data() {
    return {
      post: []
    };
  },
  created() {
    var response = [];
    var config = {
      headers: { "Access-Control-Allow-Origin": "*" }
    };
    axios
      .get("http://localhost:8090/api/connections/findAllConnections", config)
      .then(response => {
        this.post = response.data;
      });
  },
  methods: {
    Submit: async function() {
      if (idOrigen != 0 && idDestino != 0) {
        var config = {
          headers: { "Access-Control-Allow-Origin": "*" }
        };

        const connecOrigen = await axios.get(
          "http://localhost:8090/api/connections/findConnectionById/" +
            idOrigen,
          config
        );

        const connecDestino = await axios.get(
          "http://localhost:8090/api/connections/findConnectionById/" +
            idDestino,
          config
        );

        const connection = connecOrigen.data;
        const select = await axios
          .get(
            "http://localhost:8090/api/dbsql/dbsql/allOfTable/" +
              connection.host +
              "/" +
              connection.port +
              "/" +
              connection.user +
              "/" +
              connection.pass +
              "/" +
              connection.alias +
              "/" +
              nameOrigen,
            config
          )
          .catch(err => {
            console.log(err);
            Swal.fire(
              "Error al cargar",
              "No se ha podido cargar los datos",
              "warning"
            );
          });
        if (
          typeof select.data.columns != "undefined" &&
          select.data.columns != null &&
          select.data.columns.length != null &&
          select.data.columns.length > 0
        ) {
          //Alert
          const text = JSON.stringify(select.data);
          //alert(text);
          insertData(select.data, connecDestino.data);
        } else {
          alert("No se ha podido cargar los datos");
        }
      } else {
        this.$swal.fire({
          position: "top-end",
          icon: "error",
          title: "Faltan datos",
          text: "Debes seleccionar todos los campos",
          showConfirmButton: false,
          timer: 2000
        });
      }

      function insertData(text, connection) {
        text.name = nameDestino;
        console.log(text);
        var columns = text.columns;
        var fieldsNames = [];
        var exist = false;
        for (var i = 0; i < columns.length; i++) {
          exist = false;
          for (var j = 0; j < fieldsNames.length; j++) {
            if (
              fieldsNames[j] == columns[i].columnName ||
              columns[i].columnName == "id"
            ) {
              exist = true;
            }
          }
          if (!exist && columns[i].columnName != "id") {
            fieldsNames.push(columns[i].columnName);
          }
        }
        var values = [];
        for (var x = 0; x < columns.length; x++) {
          if (columns[x].columnName != "id") {
            values.push(columns[x].value);
          }
        }
        var indexName = 0;
        var firstTime = true;
        var tables = "";
        var newTable = false;
        for (var y = 0; y < values.length; y++) {
          if (firstTime) {
            firstTime = false;
            tables = tables + '{ "name": "' + text.name + '", "fields": [';
          }
          if (newTable) {
            newTable = false;
            tables = tables + ']},{ "name": "' + text.name + '", "fields": [';
          }
          if (indexName < fieldsNames.length) {
            if (indexName == 0) {
              tables =
                tables +
                '{"name": "' +
                fieldsNames[indexName] +
                '", "value": "' +
                values[y] +
                '"}';
            } else {
              tables =
                tables +
                ',{"name": "' +
                fieldsNames[indexName] +
                '", "value": "' +
                values[y] +
                '"}';
            }
          }
          indexName++;
          if (indexName == fieldsNames.length && y != values.length) {
            newTable = true;
            indexName = 0;
          }
        }
        tables = tables + "]}";
        var send = {
          host: connection.host,
          alias: connection.alias,
          user: connection.user,
          pass: connection.pass,
          port: parseInt(connection.port),
          tables: JSON.parse("[" + tables + "]")
        };
        console.log(send);
        axios
          .post("http://localhost:8090/api/dbsql/dbsql/insertElements", send)
          .catch(err => {
            var r = confirm(
              "Se ha insertado correctamente, desea ver lo insertado?"
            );
            if (r == true) {
              alert(JSON.stringify(text));
            }
          });
      }
    },
    saveOrigen: async function(event) {
      //origenComp = true;
      idOrigen = event.target.value;
      console.log(idOrigen);

      var config = {
        headers: { "Access-Control-Allow-Origin": "*" }
      };
      const connec = await axios.get(
        "http://localhost:8090/api/connections/findConnectionById/" + idOrigen,
        config
      );

      const connection = connec.data;
      console.log(connection);
      const tempConnMeta = await axios.get(
        "http://localhost:8090/api/connections/findAllConnectionsMetadates"
      );
      const checkConnMeta = tempConnMeta.data;
      const metadates = [];
      console.log(checkConnMeta[0].connection);
      for (var i = 0; i < checkConnMeta.length; i++) {
        if (
          JSON.stringify(checkConnMeta[i].connection) ===
          JSON.stringify(connection)
        ) {
          metadates.push(checkConnMeta[i].metadates);
        }
      }
      var options = [];
      for (var j = 0; j < metadates.length; j++) {
        if (metadates[j].level == 1) {
          options.push(metadates[j].meta);
        }
      }

      var option;
      this.$swal.fire({
        title: "Eliga una tabla",
        input: "select",
        inputOptions: options,
        inputPlaceholder: "Seleccione una opcion",
        showCancelButton: true,
        inputValidator: function(value) {
          option = value;
          nameOrigen = options[option];
          console.log(options[option]);
        }
      });
    },
    saveDestino: async function(event) {
      //origenComp = true;
      idDestino = event.target.value;
      console.log(idOrigen);

      var config = {
        headers: { "Access-Control-Allow-Origin": "*" }
      };
      const connec = await axios.get(
        "http://localhost:8090/api/connections/findConnectionById/" + idDestino,
        config
      );

      const connection = connec.data;
      console.log(connection);
      const tempConnMeta = await axios.get(
        "http://localhost:8090/api/connections/findAllConnectionsMetadates"
      );
      const checkConnMeta = tempConnMeta.data;
      const metadates = [];
      console.log(checkConnMeta[0].connection);
      for (var i = 0; i < checkConnMeta.length; i++) {
        if (
          JSON.stringify(checkConnMeta[i].connection) ===
          JSON.stringify(connection)
        ) {
          metadates.push(checkConnMeta[i].metadates);
        }
      }
      var options = [];
      for (var j = 0; j < metadates.length; j++) {
        if (metadates[j].level == 1) {
          options.push(metadates[j].meta);
        }
      }

      var option;
      this.$swal.fire({
        title: "Eliga una tabla",
        input: "select",
        inputOptions: options,
        inputPlaceholder: "Seleccione una opcion",
        showCancelButton: true,
        inputValidator: function(value) {
          option = value;
          nameDestino = options[option];
          console.log(options[option]);
        }
      });
    },
    showAlert() {
      // Use sweetalret2
      this.$swal.fire("MyModal");
    }
  }
};
</script>