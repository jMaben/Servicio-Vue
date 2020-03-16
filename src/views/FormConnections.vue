<template>
  <div class="formConnections">
 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

      <h3>Connections</h3>
<div class="container mt-4">
		<div class="col-sm-6">
			<form>
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
							<input type="text" class="form-control" v-model="port"/>
						</div>
						<div class="form-group">
							<label>USER</label> 
							<input type="text" class="form-control" v-model="user"/>
						</div>
						<div class="form-group">
							<label>PASS</label> 
							<input type="text" class="form-control" v-model="pass"/>
						</div>
						<div class="form-group">
							<label>ALIAS</label> 
							<input type="text" class="form-control" v-model="alias"/>
						</div>
						<div class="form-group">
							<label>ACTIVE</label> 
							<input type="text" class="form-control" v-model="active"/>
						</div>
						<div class="form-group">
							<label>ID TYPE</label> 
							<input type="text" class="form-control" v-model="idType"/>
						</div>
					</div>
					<div class="card-footer">
						<button type="submit" id="Guardar" class="btn btn-success" onclick="formSubmit()"> Guardar</button>
					</div>
				</div>
			</form>
		</div>
	</div>
  </div>
</template>


<script>
import axios from "axios";
 var today = new Date();
 var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
export default {
        methods: {
            formSubmit() {
                this.axios.post('http://localhost:8191/crearConnections', {
					host: this.host,
					port: this.port,
					user: this.user,
					pass: this.pass,
					alias: this.alias,
					active: this.active,
					idType: this.idType,
					createdData: date

                })
                .then(function (response) {
                	console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
			}
	} 	       
}
</script>