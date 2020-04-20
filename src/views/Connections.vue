<template>
  <div class="connections">
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

    <h1>Connections</h1>
    <a href="/formConnections" class="btn btn-success">
      <i class="fas fa-plus-circle"></i> Nuevo
    </a>
    <p></p>
    <div class="post">
      <table class="table" style="margin: 0 auto;">
        <thead>
          <tr>
            <th>ID</th>
            <th>HOST</th>
            <th>PORT</th>
            <th>USER</th>
            <th>PASS</th>
            <th>ALIAS</th>
            <th>ACTIVE</th>
            <th>TYPE</th>
            <th>DATE</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in post" v-bind:key="post.id">
            <td>{{ post.id }}</td>
            <td>
              <strong>{{ post.host }}</strong>
            </td>
            <td>{{ post.port }}</td>
            <td>
              <strong>{{ post.user }}</strong>
            </td>
            <td>
              <button title="Mostrar contraseña" @click="showAlert(post.pass)" class="btn btn-dark">
                <i class="fas fa-asterisk"></i>
              </button>
            </td>
            <td>
              <strong>{{ post.alias }}</strong>
            </td>
            <td v-if="post.active">
              <i class="fas fa-circle"></i>
            </td>
            <td v-else>
              <i class="far fa-circle"></i>
            </td>
            <td>{{ post.types.type }}</td>
            <td>{{ post.createDate }}</td>
            <td class="text-centre">
              <button
                title="Comprobar conexion"
                @click="CheckConnections(post.id)"
                class="btn btn-success"
              >
                <i class="fas fa-check-square"></i>
              </button>
              <button
                title="Editar"
                @click="EditarConnections(post.id)"
                class="btn btn-warning btn-edit"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button title="Eliminar" @click="EliminarConnections(post.id)" class="btn btn-danger">
                <i class="fas fa-trash-alt"></i>
              </button>
              <button title="select" @click="SelectConnection(post.id)" class="btn btn-info">Select</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

<script>
import Vue from "vue";
import VueSweetalert2 from "vue-sweetalert2";

Vue.use(VueSweetalert2);

import axios from "axios";

export default {
  name: "app",
  data() {
    return {
      post: [],
      p1: true
    };
  },
  mounted() {
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
    EditarConnections(number) {
      console.log(number);
      var route = "editConnections/" + number;
      this.$router.push(route);
    },

    EliminarConnections: async function(number) {
      //console.log(number);
      const connec = await axios.get(
        "http://localhost:8090/api/connections/findConnectionById/" + number
      );
      var con = connec.data;
      var title = "¿Seguro que desea desactivar " + con.alias + " ?";
      //console.log(connec.data);

      this.$swal
        .fire({
          title: title,
          text: "Se desactivara la conexón!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Desactivar"
        })
        .then(result => {
          if (result.value) {
            con.active = false;
            axios
              .put(
                "http://localhost:8090/api/connections/updateConnection/"+number+"/type/" +
                  con.types.id,
                con
              )
              .catch(err => {
                console.log(err);
                return null;
              });
            location.reload(true);
            this.$swal.fire(
              "Se ha desactivado",
              "Su conexión esta desactivada",
              "success"
            );
          }
        });
    },

    CheckConnections: async function(number) {
      console.log(number);
      const connec = await axios.get(
        "http://localhost:8090/api/connections/findConnectionById/" + number
      );

      const connection = connec.data;
      console.log(connection);

      var config = {
        headers: { "Access-Control-Allow-Origin": "*" }
      };

      const checkTest = await axios
        .get(
          "http://localhost:8090/api/dbsql/dbsql/findAllTables/" +
            connection.host +
            "/" +
            connection.alias +
            "/" +
            connection.user +
            "/" +
            connection.pass +
            "/" +
            connection.port,
          config
        )
        .then(response => {
          if (response.status == 200) {
            var text = "Se ha establecido conexión con " + connection.alias;

            this.$swal.fire({
              position: "top-end",
              icon: "success",
              title: text,
              showConfirmButton: false,
              timer: 2100
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$swal.fire({
            position: "top-end",
            icon: "error",
            title: "Oops... No se ha podido conectar",
            text: "Algo ha salido mal!",
            showConfirmButton: false,
            timer: 2000
          });
        });
      console.log(checkTest);
    },
SelectConnection: async function(number) {
      var config = {
        headers: { "Access-Control-Allow-Origin": "*" }
      };
      const connec = await axios.get(
        "http://localhost:8090/api/connections/findConnectionById/" + number,
        config
      );
      const connection = connec.data;
      const tempConnMeta = await axios.get('http://localhost:8090/api/connections/findAllConnectionsMetadates');
      const checkConnMeta = tempConnMeta.data;
      const metadates = [];
      console.log(checkConnMeta[0].connection);
      for(var i = 0; i < checkConnMeta.length; i++){
        if(JSON.stringify(checkConnMeta[i].connection) === JSON.stringify(connection)){
          metadates.push(checkConnMeta[i].metadates);
        }
      }
      var options = [];
      for (var j = 0; j < metadates.length; j++) {
        if(metadates[j].level == 1){
          options.push(metadates[j].meta);
        }
      }
      var option;
      this.$swal
        .fire({
          title: "Consulta la tabla",
          input: "select",
          inputOptions: options,
          inputPlaceholder: "Seleccione una opcion",
          showCancelButton: true,
          inputValidator: function(value) {
            console.log(value);
            option = value;
          }
        })
        .then(function() {
          select(options, option, number);
        });
      async function select(array, number) {
        var config = {
          headers: { "Access-Control-Allow-Origin": "*" }
        };
        console.log(array);
        console.log(number);
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
              array[number],
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
          alert(text);
          insertData(select.data, connection);
        } else {
          alert("No se ha podido cargar los datos");
        }
      }
      function insertData(text, connection){
        var columns = text.columns;
        var fieldsNames = [];
        var exist = false;
        for(var i = 0; i < columns.length; i++){
          exist = false;
          for(var j = 0; j < fieldsNames.length; j++){
            if(fieldsNames[j] == columns[i].columnName || columns[i].columnName == "id"){
              exist = true;
            }
          }
          if(!exist && columns[i].columnName != "id"){
            fieldsNames.push(columns[i].columnName);
          }
        }
        var values = [];
        for(var x = 0; x < columns.length; x++){
          if(columns[x].columnName != "id"){
            values.push(columns[x].value);
          }
        }
        var indexName = 0;
        var firstTime = true;
        var tables = '';
        var newTable = false;
        for(var y = 0; y < values.length; y++){
          if(firstTime){
            firstTime = false;
            tables = tables + '{ "name": "' + text.name + '", "fields": [';
          }
          if(newTable){
            newTable=false;
            tables = tables + ']},{ "name": "' + text.name + '", "fields": [';
          }
          if(indexName < fieldsNames.length){
            if(indexName == 0){
              tables = tables + '{"name": "' + fieldsNames[indexName] + '", "value": "' + values[y] + '"}'
            }else{
              tables = tables + ',{"name": "' + fieldsNames[indexName] + '", "value": "' + values[y] + '"}'
            }
          }
          indexName++;
          if(indexName == fieldsNames.length && y != values.length){
            newTable = true;
            indexName = 0;
          }
        }
        tables = tables + ']}';
        var send = {
          'host': connection.host,
          'alias': connection.alias,
          'user': connection.user,
          'pass': connection.pass,
          'port': parseInt(connection.port),
          'tables': JSON.parse('['+tables+']')
        };
        console.log(send)
        axios.post('http://localhost:8090/api/dbsql/dbsql/insertElements',send);
      }
    },
    
    showAlert(passWord) {
      // Use sweetalret2
      this.$swal.fire("Password", passWord, "info");
    }
  }
};
</script>