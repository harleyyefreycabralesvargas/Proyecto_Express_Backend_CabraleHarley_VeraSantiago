import swaggerAutogen from "swagger-autogen"

const autputFile='./swagger.json'
const endPointsFiles=['./index.js']

const doc={
    info: {
        title:'Api de campus',
        description:'Esta api sirve para manejar el sistema de informacion de campus atraves de endpoints' 
    },
    host:'localhost:3000',
    schemes:['http']
}
swaggerAutogen()(autputFile,endPointsFiles,doc)