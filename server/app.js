const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

//***************************************************************************************************//
//***************************************************************************************************//

app.post('/api/books', (req, res) => {
var obj = {
  'books': []
};

var file_obj = {
  'books': []
};

obj.books.push(req.body);

var fs = require('fs');

var data = null;

try {
  data = fs.readFileSync('library.json', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}

if (data !== null && data !== "") 
	{
	data_lib = JSON.parse(data);
//Add check for duplicates here
var dup_flag = 'NO';
var dup_id = 0;
	for (let i = 0; i < data_lib['books'].length; i++) 
		{
     		if (data_lib['books'][i]['title'] == obj['books'][0]['title']) 
			{
			   dup_flag = 'YES';
			   dup_id = i;
				}
		}

if (dup_flag == 'NO') 
 {
	data_lib['books'][data_lib['books'].length] = obj['books'][0]
 }

	for (let i = 0; i < data_lib['books'].length; i++) 
		{
     		obj['books'][i] = data_lib['books'][i]
		}

	}

for (let i = 0; i < obj['books'].length; i++) {
file_obj.books.push({'id': i + 1,
		     'author':obj['books'][i]['author'],
		     'title' :obj['books'][i]['title'],
		     'yearPublished':obj['books'][i]['yearPublished']});
}

var content = JSON.stringify(file_obj)

try {
  fs.writeFileSync('library.json', content)
} catch (err) {
  console.error(err)
}

res.setHeader('Content-Type', 'application/json');

if (dup_flag == 'NO') {
res.send(JSON.stringify(file_obj['books'][file_obj['books'].length-1]))
}

if (dup_flag == 'YES') {
res.send(JSON.stringify(file_obj['books'][dup_id]))
}

})

//***************************************************************************************************//
//***************************************************************************************************//

app.get('/api/books', (req, res) => {

var fs = require('fs');

var data = null;

var data_lib = null;

try {
  data = fs.readFileSync('library.json', 'utf8')
  console.log(data)
} catch (err) {
  res.status(204).send(null);
}

if (data !== null && data !== "") {
data_lib = JSON.parse(data);    
length = data_lib['books'].length;

for(var k=1; k < length; k++){
     for(var i=k; i > 0 && data_lib['books'][i]['title'] < data_lib['books'][i-1]['title']; i--){
 
       var tmpBook =  data_lib['books'][i];
         data_lib['books'][i] = data_lib['books'][i-1];
        data_lib['books'][i - 1] = tmpBook;

     }
  }

}

if (data_lib !== null) {
res.setHeader('Content-Type', 'application/json');
res.send(JSON.parse(JSON.stringify(data_lib)))
}

})

//***************************************************************************************************//
//***************************************************************************************************//

app.delete('/api/books', (req, res) => {

var fs = require('fs');

var content = ''

try {
  fs.writeFileSync('library.json', content)
} catch (err) {
  console.error(err)
}

res.status(204).send(null);

})

//***************************************************************************************************//
//***************************************************************************************************//


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
