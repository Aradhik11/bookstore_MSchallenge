const { ObjectId } = require('bson');
const e = require('express');
const express = require('express');
const { connectToDb, grtDb, getDb } = require('./db');


const app = express();
app.use(express.json());


// db connection
let db

connectToDb((err) => {
    if(!err){
        app.listen(3000, () => {
            console.log('app listening to port 3000');
        });
        db = getDb()
    }
})

// routes
app.get('/books', (req,res) => {
    let books = []
    db.collection('books')
    .find()
    .sort({book_author: 1})
    .forEach(book => books.push(book))
    .then(() => {
        res.status(200).json(books)
    })
    .catch((err) => res.status(500).json({error: 'Could not fetch the documents'}))

});
app.get('/books/author/:ByAuthor', (req,res) => {
       
        db.collection('books')
        .findOne({book_author: req.params.ByAuthor})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })

    
    
});

app.get('/books/publisher/:ByPublisher', (req,res) => {
       
    db.collection('books')
    .findOne({book_publisher: req.params.ByPublisher})
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({error: 'Could not fetch the documents'})
    })

})


app.get('/books/:id', (req,res) => {

    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id:ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
    }else{
        res.status(500).json({error: 'Ooooops invalid id'})
    }
    
});



app.get('/books/Borrowed/:date', (req,res) => {
    
    db.collection('borrowerRecord')
    .findOne({borrowers_dateborrowed: req.params.date})
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => res.status(500).json({error: 'Could not fetch the documents'}))

});
app.delete('/books/:id', (req,res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not delete document'})
        })
    }else{
        res.status(500).json({err: 'Oooops invalid id'})
    }
})

app.put('/books/:id', (req,res) =>{
    const book = req.body;

    db.collection('books')
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not pdate the document'})
        })
    }else{
        res.status(500).json({err: 'Oooops invalid id'})
    }
})

app.post('/books', (req,res) => {
    const book = req.body;

    db.collection('books')
    .insertOne(book)
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500).json({error: 'Could not add document'})
    })
})

//BORROWED
app.get('/borrowed', (req,res) => {
    let booksborrowed = []
    db.collection('borrowersRecordDetails')
    .find()
    .sort({})
    .forEach(book => booksborrowed.push(book))
    .then(() => {
        res.status(200).json(booksborrowed)
    })
    .catch((err) => res.status(500).json({error: 'Could not fetch the documents'}))

});

app.post('/borrowed', (req,res) => {
    const book = req.body;

    db.collection('borrowersRecordDetails')
    .insertOne(book)
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500).json({error: 'Could not add document'})
    })
})



app.get('/borrowed/:id', (req,res) => {

    if(ObjectId.isValid(req.params.id)){
    db.collection('borrowersRecordDetails')
    .findOne({_id: ObjectId(req.params.id)})
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch((err) => res.send(500).json({error: 'Could not fetch the document'}) )
    }else{
        res.status(500).json({err: 'Oooops invalid id'})
    }
})
app.put('/borrowed/:id', (req,res) =>{
    const updates = req.body;

    
    if(ObjectId.isValid(req.params.id)){
        db.collection('borrowersRecordDetails')
        .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not update the document'})
        })
    }else{
        res.status(500).json({err: 'Oooops invalid id'})
    }
})

app.delete('/borrowed/:id', (req,res) => {


    if(ObjectId.isValid(req.params.id)){
        db.collection('borrowersRecordDetails')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not delete document'})
        })
    }else{
        res.status(500).json({err: 'Oooops invalid id'})
    }
})

//BOOKSRETURNED
app.get('/returned', (req,res) => {
    let booksreturned = []
    db.collection('bookReturnRecordDetails')
    .find()
    .sort({})
    .forEach(book => booksreturned.push(book))
    .then(() => {
        res.status(200).json(booksreturned)
    })
    .catch((err) => res.status(500).json({error: 'Could not fetch the documents'}))

});

app.post('/returned', (req,res) => {
    const bookReturn = req.body;

    db.collection('bookReturnRecordDetails')
    .insertOne(bookReturn)
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500).json({error: 'Could not add document'})
    })
})



app.get('/returned/:id', (req,res) => {

    if(ObjectId.isValid(req.params.id)){
    db.collection('bookReturnRecordDetails')
    .findOne({_id: ObjectId(req.params.id)})
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch((err) => res.send(500).json({error: 'Could not fetch the document'}) )
    }else{
        res.status(500).json({err: 'Oooops invalid id'})
    }
})
app.put('/returned/:id', (req,res) =>{
    const updates = req.body;

    
    if(ObjectId.isValid(req.params.id)){
        db.collection('bookReturnRecordDetails')
        .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not update the document'})
        })
    }else{
        res.status(500).json({err: 'Oooops invalid id'})
    }
})

app.delete('/returned/:id', (req,res) => {


    if(ObjectId.isValid(req.params.id)){
        db.collection('bookReturnRecordDetails')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not delete document'})
        })
    }else{
        res.status(500).json({err: 'Oooops invalid id'})
    }
})