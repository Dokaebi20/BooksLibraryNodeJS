const Hapi = require("@hapi/hapi");
const fs = require("fs");
const {nanoid} = require("nanoid");
const findSpec = require("./control.js");
const _ = require("lodash");
const init = async ()=>{
    const server = Hapi.server({
        port: 5000,
        host: "localhost"
    })

    await server.start();

    const isDataFileAvail = './data.json';

    if (!fs.existsSync(isDataFileAvail)){
        fs.writeFileSync(isDataFileAvail, '[]', 'utf-8');
    }

    await console.log(`Server Running at  ${server.info.uri}`);

    
    

    await server.route({
        method: 'POST',
        path: '/books',
        handler: async (request, reply) => {
            const {name, year, author, summary, publisher, pageCount, readPage, reading }  =  request.payload;
            try{

            let jsonRaw = fs.readFileSync(isDataFileAvail);
            let dataJson = JSON.parse(jsonRaw);

            var willPushed = {};

            
            if (typeof(name) ===  "undefined") {
                return reply.response({
                    "status": "fail",
                    "message": "Gagal menambahkan buku. Mohon isi nama buku"
                }).code(400);
            }
            else if (readPage > pageCount) {
                return reply.response({
                    "status": "fail",
                    "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
                }).code(400);
            }
            else if (typeof(year) === "number" && typeof(pageCount) === "number" && typeof(readPage) === "number" && typeof(reading) === "boolean") {
                const rndmId = nanoid();
                willPushed = {
                    "id": rndmId,
                    "name": name,
                    "year": year,
                    "author": author,
                    "summary": summary,
                    "publisher": publisher,
                    "pageCount": pageCount,
                    "readPage": readPage,
                    "finished": (pageCount == readPage ? true : false),
                    "reading": reading,
                    "insertedAt": new Date().toISOString(),
                    "updatedAt": new Date().toISOString()
                };
                dataJson.push(willPushed);

                fs.writeFileSync(isDataFileAvail, JSON.stringify(dataJson));

                return reply.response({
                    
                    "status": "success",
                    "message": "Buku berhasil ditambahkan",
                    "data": {
                        "bookId": rndmId
                    }
                }).code(201);
            }
            else{
                throw false;
            }
        }
    catch(err){
        return reply.response({
            "status": "error",
            "message": "Buku gagal ditambahkan"
        }).code(500);
    }
    }
    }
    );


    await server.route({
        method: 'GET',
        path: '/books',
        handler: async (request, reply) => {

            let jsonRaw = fs.readFileSync(isDataFileAvail);
            let dataJson = JSON.parse(jsonRaw);
            
                return reply.response({
                    "status": "success",
                    "data": {
                        "books":  findSpec(dataJson, [request.query.name, request.query.reading, request.query.finished])
                        
                    }
                }).code(200);
            }
            
    }
    );

    await server.route({
        method: 'GET',
        path: '/books/{bookId}',
        handler: async (request, reply) => {

            const {bookId} = request.params;

            let jsonRaw = fs.readFileSync(isDataFileAvail);
            let dataJson = JSON.parse(jsonRaw);

            
            try
            {
                return reply.response(
                    {
                        "status": "success",
                        "data": {
                            "book": dataJson.find((element, i)=> { 
                                if(bookId == element.id){
                                    return dataJson[i];
                                }
                                else{
                                    throw false;
                                }
                            })
                        }
                    }
                ).code(200);
            }
            catch(err){
                return reply.response({
                    "status": "fail",
                    "message": "Buku tidak ditemukan",
                }).code(404);
            }
        }
    }
    );

    await server.route({
        method: 'PUT',
        path: '/books/{bookId}',
        handler: async (request, reply) => {
            
            let jsonRaw = fs.readFileSync(isDataFileAvail);
            let dataJson = JSON.parse(jsonRaw);
            
            const {name, year, author, summary, publisher, pageCount, readPage, reading}  =  request.payload;
            
            const{bookId} = request.params;
            
            const choosenBookFind = dataJson.indexOf(dataJson.find((e) => e.id == bookId));

            try{
    
    

                if(typeof(choosenBookFind) != "undefined" && typeof(year) == "number" && typeof(pageCount) == "number" && typeof(readPage) == "number" && typeof(reading) === "boolean"){

                    if(typeof(name) === "undefined"){
                        return reply.response({
                                "status": "fail",
                                "message": "Gagal memperbarui buku. Mohon isi nama buku"
                        }).code(400);

                    }
                    else if (readPage > pageCount){
                        return reply.response({
                            "status": "fail",
                            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
                        }).code(400);

                    }
                    else{
                        dataJson[choosenBookFind].name = name;
                        dataJson[choosenBookFind].year = year;
                        dataJson[choosenBookFind].author = author;
                        dataJson[choosenBookFind].summary = summary;
                        dataJson[choosenBookFind].publisher= publisher;
                        dataJson[choosenBookFind].pageCount = pageCount;
                        dataJson[choosenBookFind].readPage= readPage;
                        dataJson[choosenBookFind].reading= reading;
                        dataJson[choosenBookFind].updatedAt= new Date().toISOString();
                        dataJson[choosenBookFind].finished = readPage === pageCount? true : false;

                        fs.writeFileSync(isDataFileAvail, JSON.stringify(dataJson));

                        return reply.response({
                            "status": "success",
                            "message": "Buku berhasil diperbarui"
                    }).code(200);
                    }

                
            }}
            catch(err){
                return reply.response({
                    "status": "fail",
                    "message": "Gagal memperbarui buku. Id tidak ditemukan"
            }).code(404);
            }


            

           
        }
    }
    );

    await server.route({
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: async (request, reply) => {
            let jsonRaw = fs.readFileSync(isDataFileAvail);
            let dataJson = JSON.parse(jsonRaw);

            const {bookId} = request.params;

            
            try{
                const choosenBookFind = dataJson.indexOf(dataJson.find(element => bookId === element.id));
                if (choosenBookFind != -1){

                dataJson.splice(choosenBookFind,choosenBookFind+1);


                fs.writeFileSync(isDataFileAvail, JSON.stringify(dataJson));

                return reply.response({
                    "status": "success",
                    "message": "Buku berhasil dihapus"
                }).code(200);
            }
        else{
            throw false;
        }}
            catch(err) {
                return reply.response({
                    "status": "fail",
                    "message": "Buku gagal dihapus. Id tidak ditemukan"
                }).code(404);
            }
            
        }
    }
    );

}

init()