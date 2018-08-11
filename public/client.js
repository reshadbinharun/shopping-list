//client-side javascript
//documentation on fetch
console.log("Client-side script is running");
window.onload = function(){ ///to ensure that the function is not called before all of DOM loads
	const button = document.getElementById("testButton");
	const div_to_edit = document.getElementById("db");
	const perish = document.getElementById("perish");
	const nonperish = document.getElementById("nonperish");
	const shopForm = document.getElementById("shop");
	const formSubmitRes = document.getElementById("formRes");

	button.addEventListener("click", function(e){
		console.log("button was clicked");

		fetch('/testDB', {
		method: 'GET',
		  headers: {
		    Accept: 'application/json',
		  },
		},
		).then(response => {
		  if (response.ok) {
		    response.json().then(json => {
		      console.log(json);
		      //loop through json, and add all perishables to perish array, and nonperishables to non-perish array
		      div_to_edit.innerHTML = JSON.stringify(json);
		    });
		  }
		});
		/*
		did not return a response object
		fetch('/testDB', {method: 'GET', headers: { Accept : 'application/json'}})
		.then(function(response){
			console.log(response);
			
		});
	    */
	});
	//POST ROUTE NOT HIT!
	const testPost = document.getElementById('testPost');
	    //testing post request via needFood
	    testPost.addEventListener('click', function(e){
	    	console.log("post button!");
	    		var url = '/needFood', data = {item: 'banana', quantity: 1}
	    		fetch(url, {
				  method: 'POST', // or 'PUT'
				  body: JSON.stringify(data), // data can be `string` or {object}!
				  headers:{
				    'Content-Type': 'application/json'
				  }
				});
	    });

	//parsing form input: WORK ON THIS
	shopForm.addEventListener('submit', function(e){
		e.preventDefault(); //prevents the entire page from reloading
		// var formEntries = new FormData().entries();
		// console.log(formEntries);
		// return false;
		var item = document.getElementById("input1").value, quant = document.getElementById("input2").value, perish = document.getElementById("input3").value;
		item = item.replace(/[^A-Za-z ]/g, ''); //leaving only alphanumeric characters in user input
		//console.log("values are ", item, quant, perish);
		var url = '/addFood', data = {item: item, quantity: quant, perish: perish}; //to add perish
		console.log(data);
	    		fetch(url, {
				  method: 'POST', // or 'PUT'
				  body: JSON.stringify(data), // data can be `string` or {object}!
				  headers:{
				    'Content-Type': 'application/json'
				  }
				}).then(response => {; // parses response to JSON
									//console.log(response);
									renderList(); //call render list once response received
				}).catch(error => console.error(`Fetch Error =\n`, error));  
	})

	 //function to update list display
	 function renderList(){
	 	//make fetch request to get data
	 	fetch('/testDB', {
		method: 'GET',
		  headers: {
		    Accept: 'application/json',
		  },
		},
		).then(response => {
		  if (response.ok) {
		    response.json().then(json => {
		      //console.log(json);
		      //loop through json, and add all perishables to perish array, and nonperishables to non-perish array
		      var perishables = [];
		      var nonperishables = [];
		      console.log(json.length);
		      for (var i = 0; i < json.length; i++){
		      	//console.log(json[i]);
		      	console.log(json[i].perishable);
		      	if (json[i].perishable) perishables.push(json[i]);
		      	else nonperishables.push(json[i]);
		      }
		      console.log(perishables);
		      perish.innerHTML = populateList(perishables, "p");
		      nonperish.innerHTML = populateList(nonperishables), "np";
		    });
		    //populate perish and nonperish html
		  }
		});
	 }

	 function populateList(list, type){
	 	let list_html = "";
	 	for (var i = 0; i < list.length; i++){
	 		list_html += "<li> ";
	 		list_html += list[i].item;
	 		list_html += " : ";
	 		list_html += list[i].quantity;
	 		list_html += " units </li> <button id = \"del_item\" "+ "name=to_delete value="+list[i].item+"> X </button>";
	 	}
	 	return list_html;
	 }

}
