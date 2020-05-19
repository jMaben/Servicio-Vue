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
      var pick =  event.target.value;
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
    }
  }
};
</script>