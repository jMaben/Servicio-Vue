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
                <br />
                <h5>{{tittleOrigen}}</h5>
                <div
                  v-for="tablenamesOrigen in tablenamesOrigen"
                  v-bind:key="tablenamesOrigen"
                  @click="saveTablenameOrigen($event)"
                >
                  {{tablenamesOrigen}}
                  <input type="checkbox" :value="tablenamesOrigen" />
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="form-group">
                <label>Destino</label>
                <select class="form-control" @change="saveDestino($event)">
                  <option value selected disabled>Conexión</option>
                  <option v-for="post in post" v-bind:key="post.id" :value="post.id">{{post.alias}}</option>
                </select>

                <br />
                <h5>{{tittleDestino}}</h5>
                <div
                  v-for="tablenamesDestino in tablenamesDestino"
                  v-bind:key="tablenamesDestino"
                  @click="saveTablenameDestino($event)"
                >
                  {{tablenamesDestino}}
                  <input type="checkbox" :value="tablenamesDestino" />
                </div>
              </div>
            </div>
          </div>
        </form>
        <button title="Guardar" @click="Submit()" class="btn btn-success">Insertar</button>
        <br />
        <br />
        <div class="ex3">
          <h5>
            <strong>{{infotittle}}</strong>
          </h5>
          <br />
          <p>{{infoorigen}}</p>
          <p>{{infodestino}}</p>
          <h5>{{infodatos}}</h5>
          <p>{{infotext}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueSweetalert2 from "vue-sweetalert2";
import Swal from "sweetalert2";

Vue.use(VueSweetalert2);

import axios from "axios";
import http from "http";
var nameOrigen = {};
var nameDestino = {};
var idOrigen = 0;
var idDestino = 0;
export default {
  name: "Data",
  data() {
    return {
      post: [],
      tablenamesOrigen: [],
      tablenamesDestino: [],
      tittleOrigen: null,
      tittleDestino: null,
      infotittle: null,
      infoorigen: null,
      infodestino: null,
      infotext: null,
      infodatos: null
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
          this.infotittle = "Informacion de inserción";
          this.infoorigen = "Origen de los datos: " + nameOrigen;
          this.infodestino = "Destino de los datos: " + nameDestino;
          this.infodatos = "Texto de inserción:";
          this.infotext = text;
          //Insert swal
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });

          swalWithBootstrapButtons
            .fire({
              title: '¿Desea insertar los "ID"?',
              text:
                "Solo se recomienda en una base de datos vacio y sin Autoincrement",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Si",
              cancelButtonText: "No",
              reverseButtons: true
            })
            .then(result => {
              if (result.value) {
                //Metodo para hacer con id
                alert("con id");
              } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
              ) {
                //Metodo sin id
                insertData(select.data, connecDestino.data);
              }
            });
          // insertData(select.data, connecDestino.data);
        } else {
          Swal.fire(
            "Error al cargar",
            "No se ha podido cargar los datos",
            "warning"
          );
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
          .then(response => {
            if (response.status == 201) {
              Swal.fire(
                "Inserción correcta",
                "Se han cargado con exito los datos",
                "success"
              );
              //alert("Se ha ejecutado la inserción correctamente");
            }
          })
          .catch(err => {
            Swal.fire(
              "Error al cargar",
              "No se ha podido cargar los datos",
              "warning"
            );
            //alert("Ha ocurrido un error fatal");
          });
      }
    },
    saveTablenameOrigen(event) {
      if (event.target.checked != false) {
        nameOrigen = event.target.value;
        console.log(nameOrigen);
      }
      //nameOrigen = event.target.value;
    },
    saveTablenameDestino(event) {
      if (event.target.checked != false) {
        nameDestino = event.target.value;
        console.log(nameDestino);
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
      this.tittleOrigen = "Seleccione alguna tabla";
      this.tablenamesOrigen = options;
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

      this.tittleDestino = "Seleccione alguna tabla";
      this.tablenamesDestino = options;
    },
    showAlert() {
      // Use sweetalret2
      this.$swal.fire("MyModal");
    }
  }
};
</script>

<style>
div.ex3 {
  background-color: rgb(255, 255, 255);
  width: 550px;
  height: 600px;
  overflow: auto;
}
</style>