import express from 'express';
import __dirname from './__dirname.js';
import mongodb, {ObjectId} from 'mongodb';
import { json } from 'stream/consumers';
import multer from 'multer';
import fs from 'fs';

var picName = ''

const storage = multer.diskStorage({
    destination: 'raw/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const originalName = file.originalname;
      const extension = originalName.substring(originalName.lastIndexOf('.'));
      const newName = uniqueSuffix + extension;

      picName = newName
      console.log(picName);

      cb(null, newName);
    }
  });

  const upload = multer({ storage });

let app = express();
app.use(express.json()) 
app.use(express.static(__dirname + '/raw/'))

async function connection(){
    try{
        const mongoClient = new mongodb.MongoClient("mongodb://127.0.0.1/:27017");
        await mongoClient.connect();

        console.log('Connection succesful');

        let db = mongoClient.db('examen').collection('shablon');
        let db_user = mongoClient.db('examen').collection('user');
        var obj = await db.find().project().toArray();

        app.get('/', function(req, res) {
            res.sendFile(__dirname + '/dir/index.html');
        });
        app.use(express.static(__dirname + '/dir/'))
        
        app.get('/api/get/objects/', async function(req, res) {     
            let object = await db.find().toArray();
            res.json(object);
        });

        
        app.post('/api/add/pic', upload.single('image'), (req, res) => {
            var file = req.file;
            res.json({ message: picName });
          });

        app.post('/api/add/object/', async function(req,res){
            let object = req.body;
            console.log(object);
            await db.insertOne(object);
            res.json(object)
        })

        app.post('/api/objDelete/', async function(req, res){
            let delete_obj_req = req.body;

            console.log(delete_obj_req.pic);

            fs.unlink(__dirname+`/raw/${delete_obj_req.pic}`, (err) => {
                if (err) {
                  console.error('Ошибка при удалении файла:', err);
                } else {
                  console.log('Файл успешно удален');
                }
              });

            console.log({id_: new ObjectId(delete_obj_req._id)})
            await db.deleteOne({_id: new ObjectId(delete_obj_req._id)});
            
        });

        app.post('/api/user/', async function(req,res){
            let user = req.body;
            console.log(user);
            await db_user.insertOne(user);

            res.json(user)
        });
        
        let login_req;
        app.post('/api/find/User/', async function(req, res){
            login_req = req.body;

            let login_find = await db_user.find(login_req).toArray();
            console.log(login_find);
            res.json(login_find)
        });

        app.post('/api/Edit/', async function(req, res){
            let edit_obj_req = req.body;

            console.log(edit_obj_req.text)
            console.log({_id: new ObjectId(edit_obj_req._id)});

            await db.updateOne({_id: new ObjectId(edit_obj_req._id)}, {$set: {text:edit_obj_req.text}}); 
            await db.updateOne({_id: new ObjectId(edit_obj_req._id)}, {$set: {name:edit_obj_req.name}});
            
        });

        app.listen(3000, function() {
            console.log('running');
        });
    }catch(error){
        console.log('Error! '+ error);
    }
}
connection();