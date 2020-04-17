<template>
  <div class="Types">

   <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

    <h1>Types</h1>
      <a href="/" class="btn btn-success"><i class="fas fa-plus-circle"></i> Nuevo</a>
      <p></p>
    <div class="post">
      <table class="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>TYPE</th>
					<th>DESCRIPTION</th>
					<th>DRIVER</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="post in post" v-bind:key="post.id">
					<td>{{ post.id }}</td>
          <td>{{ post.type }}</td>
          <td>{{ post.description }}</td>
          <td>{{ post.driver }}</td>
					<td>
					<a class="btn btn-warning"><i class="fas fa-edit"></i></a>
					<a class="btn btn-danger"><i class="fas fa-trash-alt"></i></a>
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
 name: 'app',
 data() {
    return{
      post: []
    }
  },
mounted() {
  axios.get('http://localhost:8888/api/connections/findAllTypes')
  .then(response =>{
    this.post = response.data;
  })
}
  
}
</script>