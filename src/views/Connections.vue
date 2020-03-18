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
      <table class="table">
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
            <td>{{ post.host }}</td>
            <td>{{ post.port }}</td>
            <td>{{ post.user }}</td>
            <td>{{ post.pass }}</td>
            <td>{{ post.alias }}</td>
            <td>{{ post.active }}</td>
            <td>{{ post.types.type }}</td>
            <td>{{ post.createdData }}</td>
            <td class="text-centre">
              <button @click="EditarConnections(post.id)" class="btn btn-warning btn-edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="EliminarConnections(post.id)" class="btn btn-danger">
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

    EliminarConnections(number) {
      console.log(number);
      //var connec;
      const connec =
      axios
        .get("http://localhost:8191/verConnections/" + number);



      if (confirm("¿Seguro que desea desactivar la conexion?")) {
        var con = connec.data;
        console.log(con);
        con.active = false;

        axios
          .put("http://localhost:8191/editarConnections/" + number, con)
          .catch(err => {
            console.log(err);
            return null;
          });
        alert("Se ha desactivado");
        //location.reload(true);
      }
    }
  }
};
</script>