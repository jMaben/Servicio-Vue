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
              <i class="fas fa-asterisk"></i>
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
            <td>{{ post.createdData }}</td>
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      post: []
    };
  },
  mounted() {
    axios.get("http://localhost:8191/listar").then(response => {
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
      console.log(number);
      const connec = await axios.get(
        "http://localhost:8191/verConnections/" + number
      );

      console.log(connec.data);

      if (confirm("¿Seguro que desea desactivar la conexion?")) {
        var con = connec.data;
        con.active = false;

        axios
          .put("http://localhost:8191/editarConnections/" + number, con)
          .catch(err => {
            console.log(err);
            return null;
          });
        alert("Se ha desactivado");
        location.reload(true);
      }
    },

    CheckConnections: async function(number) {
      console.log(number);
      const connec = await axios.get(
        "http://localhost:8191/verConnections/" + number
      );

      const connection = connec.data;
      console.log(connection);

      var config = {
        headers: { "Access-Control-Allow-Origin": "*" }
      };

      const checkTest = await axios.get(
        "http://localhost:8888/sql/tables/" +
          connection.host +
          "/" +
          connection.port +
          "/" +
          connection.user +
          "/" +
          connection.pass +
          "/" +
          connection.alias,
        config
      );
      console.log(checkTest);

      if (checkTest.data instanceof Array) {
        if (checkTest.data.length < 1) {
          alert(
            "Error al conectarse, compruebe que estan todos los datos correctos."
          );
        } else {
          var text =
            "Se ha conectado con exito, aqui estan sus tablas: " +
            checkTest.data;
          alert(text);
        }
      }
    }
  }
};
</script>