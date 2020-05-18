<template>
  <div class="ConverMeta">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
      integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
      crossorigin="anonymous"
    />

    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossorigin="anonymous"
    />
    <div class="container mt-4">
      <div class="col-sm-6">
        <form>
          <div class="card">
            <div class="card-header">
              <h3>Convertir Metadatos</h3>
            </div>
            <div class="card-body">
              <div class="form-group">
                <div v-for="metaOrigen in metaOrigen" v-bind:key="metaOrigen.id">
                  {{metaOrigen.meta}}
                  <select class="form-control">
                    <option value selected disabled>Metadatos</option>
                    <option
                      v-for="metaDestino in metaDestino"
                      v-bind:key="metaDestino.id"
                      :value="metaDestino.meta"
                    >{{metaDestino.meta}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <input type="submit" value="Guardar" class="btn btn-success" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
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
  }
};
</script>