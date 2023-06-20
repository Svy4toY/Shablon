import { MongoClient, Binary } from 'mongodb';
import __dirname from './__dirname.js';
import fs from 'fs';
import path from 'path';

const url = 'mongodb://127.0.0.1/:27017';
const dbName = 'examen';
const collectionName = 'shablon';

(async () => {
  try {
    const client = new MongoClient(url);

    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const objectToSave = {
      name: 'Перец',
      text: 'Обьект манипуляций',
    };

    const result = await collection.insertOne(objectToSave);
    console.log('Объект успешно сохранен');

    client.close();
  } catch (error) {
    console.error('Ошибка при сохранении объекта:', error);
  }
})();