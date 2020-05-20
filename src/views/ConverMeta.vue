<template>
  <div class="ConverMeta">
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossorigin="anonymous"
    />
    <div class="container mt-4">
      <div class="col-sm-6">
        <form @submit.prevent="insert" style="margin: 0 auto;">
          <div class="card">
            <div class="card-header">
              <h3>Convertir Metadatos</h3>
            </div>
            <div class="card-body">
              <div class="form-group">
                <div v-for="metaOrigen in metaOrigen" v-bind:key="metaOrigen.meta">
                  {{metaOrigen.meta}}
                  <select
                    class="form-control"
                    @change="saveChosenOne($event, metaOrigen.meta)"
                  >
                    <option value selected disabled>Metadatos</option>
                    <option
                      v-for="metaDestino in metaDestino"
                      :key="metaDestino.id"
                      :value="metaDestino.meta"
                    >{{metaDestino.meta}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <input type="submit" value="Insertar" class="btn btn-success" />
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
import Swal from "sweetalert2";

Vue.use(VueSweetalert2);

import axios from "axios";
var insertText;
var conDestino;
var resetMetadates;
var insertMetadates = [];
export default {
  props: ["idOrigen", "idDestino", "nameOrigen", "nameDestino"],
  data() {
    return {
      metaOrigen: [],
      metaDestino: []
    };
  },
  created() {
    var response = [];
    var config = {
      headers: { "Access-Control-Allow-Origin": "*" }
    };
    //Metadates
    axios
      .get(
        "http://localhost:8090/api/connections/findAllMetadatesOfATable/" +
          this.idOrigen +
          "/" +
          this.nameOrigen,
        config
      )
      .then(response => {
        this.metaOrigen = response.data;
      });
    console.log(this.metaOrigen);

    axios
      .get(
        "http://localhost:8090/api/connections/findAllMetadatesOfATable/" +
          this.idDestino +
          "/" +
          this.nameDestino,
        config
      )
      .then(response => {
        this.metaDestino = response.data;
      });
    this.LoadInsert();
  },
  methods: {
    LoadInsert: async function() {
      var config = {
        headers: { "Access-Control-Allow-Origin": "*" }
      };

      const connecOrigen = await axios.get(
        "http://localhost:8090/api/connections/findConnectionById/" +
          this.idOrigen,
        config
      );

      const connecDestino = await axios.get(
        "http://localhost:8090/api/connections/findConnectionById/" +
          this.idDestino,
        config
      );

      const connection = connecOrigen.data;
      const select = await axios.get(
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
          this.nameOrigen,
        config
      );

      const metadatesOrigin = await axios.get(
        "http://localhost:8090/api/connections/findAllMetadatesOfATable/" +
          this.idOrigen +
          "/" +
          this.nameOrigen,
        config
      );

      //Save area
      select.data.name = this.nameDestino;
      insertText = select.data;
      console.log(insertText);
      conDestino = connecDestino.data;
      console.log(conDestino);

      console.log(metadatesOrigin.data);

      //Prueba Datos en array
      resetMetadates = [];
      for (let index = 0; index < metadatesOrigin.data.length; index++) {
        resetMetadates[index] = metadatesOrigin.data[index].meta;
      }
      console.log(resetMetadates);
      var array = resetMetadates;
      for (let index = 0; index < array.length; index++) {
        insertMetadates[index] = array[index];
      }
    },
    saveChosenOne(event, cambio) {
      var pick = event.target.value;
      var indicator = 0;
      for (let index = 0; index < insertMetadates.length; index++) {
        if (resetMetadates[index] == cambio) {
          indicator = index;
        }
      }
      insertMetadates[indicator] = pick;

      console.log("Elegido: " + event.target.value);
      console.log("Cambiar: " + cambio);
      console.log("indicator: " + indicator);
      console.log("Resultado insert: " + insertMetadates);
      console.log("Resultado Reset: " + resetMetadates);
      console.log(insertText);
    },
    insert() {
      var i = 0;
      while (i < resetMetadates.length) {
        for (let inde = 0; inde < insertText.columns.length; inde++) {
          if (insertText.columns[inde].columnName == resetMetadates[i]) {
            insertText.columns[inde].columnName = insertMetadates[i];
          }
        }
        i++;
      }
      console.log(insertText);
      var destiny = this.nameDestino;
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
            var yes = "YES";
            insertData(insertText, conDestino, yes, destiny);
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            var no = "NO";
            insertData(insertText, conDestino, no, destiny);
          }
        });

      function insertData(text, connection, response, destinyData) {
        text.name = destinyData;

        var columns = text.columns;
        var fieldsNames = [];
        var exist = false;
        for (var i = 0; i < columns.length; i++) {
          exist = false;
          for (var j = 0; j < fieldsNames.length; j++) {
            if (fieldsNames[j] == columns[i].columnName) {
              exist = true;
            } else if (response == "NO" && columns[i].columnName == "id") {
              exist = true;
            }
          }
          if (!exist && response == "NO") {
            if (columns[i].columnName != "id") {
              fieldsNames.push(columns[i].columnName);
            }
          } else if (!exist && response == "YES") {
            fieldsNames.push(columns[i].columnName);
          }
        }
        var values = [];
        for (var x = 0; x < columns.length; x++) {
          if (response == "YES") {
            values.push(columns[x].value);
          } else {
            if (columns[x].columnName != "id") {
              values.push(columns[x].value);
            }
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
    }
  }
};
</script>