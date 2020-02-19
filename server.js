//config o servidor
const express = require( 'express' )
require( 'dotenv' ).config()
const app = express()
const PORT = process.env.PORT || 3345
//config database
const Pool = require( 'pg' ).Pool
const db = new Pool( {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
} )

//config template engine
const nunjucks = require( 'nunjucks' )

nunjucks.configure( "./frontend/", {
    express: app,
    noCache: true
} )

//configurar serve static files
app.use( express.static( 'public' ) )

// hability body form

app.use( express.urlencoded( { extended: true } ) )



//config page
app.get( '/', function ( req, res ) {
    db.query( " SELECT * FROM donors", function ( err, result ) {
        if ( err ) return res.send( 'Erro no Select do banco de dados' )

        const donors = result.rows
        return res.render( "index.html", { donors } )
    } )

} )

app.post( '/', function ( req, res ) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if ( name == "" || email == "" || blood == "" ) {
        return res.send( "Todos os campos são obrigatórios." )
    }

    const query = `INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query( query, values, function ( err ) {
        if ( err ) return res.send( "Erro no bancod de dados: ", err )

        return res.redirect( '/' )
    } )


} )

//liga o servidor
app.listen( PORT, () => {
    console.log( `Server running on port: ${PORT}` );

} )
