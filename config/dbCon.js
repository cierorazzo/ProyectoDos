const { default: mongoose } = require( "mongoose" );

const dbCon = () => {
  try {
    const conn = mongoose.connect( process.env.MONGODB_URL);//info enviada a .env
    console.log( 'Mongoose conectado exitosamente' );
  } catch ( error ) {
    console.log( "Error Database" )
  };
};

module.exports = dbCon;