<template>
  <div class="formConnections">
 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

      <h3>Connections</h3>
<div class="container mt-4">
		<div class="col-sm-6">
			<form @submit.prevent="formSubmit">
				<div class="card">
					<div class="card-header">
						<h3>Connections</h3>
					</div>
					<div class="card-body">
						<div class="form-group">
							<label>HOST</label> 
							<input type="text" class="form-control" v-model="host"/>
						</div>
						<div class="form-group">
							<label>PORT</label> 
							<input type="number" class="form-control" v-model="port"/>
						</div>
						<div class="form-group">
							<label>USER</label> 
							<input type="text" class="form-control" v-model="user"/>
						</div>
						<div class="form-group">
							<label>PASS</label> 
							<input type="password" class="form-control" v-model="pass"/>
						</div>
						<div class="form-group">
							<label>ALIAS</label> 
							<input type="text" class="form-control" v-model="alias"/>
						</div>
						<div class="form-group">
							<label>ACTIVE</label> 
							<input type="checkbox" class="form-control" v-model="active"/>
						</div>
						<div class="form-group">
							<label>ID TYPE</label> 
       					<select class="form-control" @change="Type($event)">
           					 <option value="" selected disabled>TYPE</option>
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
import axios from "axios";
import http from "http";
 var today = new Date();
 var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
export default {
	name: 'Home',
  data(){
    return{
	  types: [],
      host: '',
      port: null,
      user: '',
      pass: '',
      alias: '',
	  active: false,
	  idType: null,
      createdData: null,
      id: null,
      connectionsMetadates:[]
    };
  },
    created(){
    axios.get('http://localhost:8191/listarTypes').then(response => {
      this.types = response.data
    })
  },
        methods: {
            formSubmit() {

				     const connec = {
        			 host: this.host,
         			 port: this.port,
        			 user: this.user,
        			 pass: this.pass,
        			 alias: this.alias,
					 active: this.active,
					 idType: this.types.id,
        			 createDate: date,
      				 }
				
					 Object.setPrototypeOf(connec, null);
				
					   console.log(connec);
					   
      				axios.post('http://localhost:8191//crearConnections', connec).catch(err => {
               			console.log(err);
               			return null;
					   })
					   .then(function (response) {
                		console.log(response);
                		})
                		.catch(function (error) {
                   	 	console.log(error);
                		});
			},

	  Type(event) {
      this.id = event.target.value;
      console.log(this.id);
      }
	} 	       
}
</script>