const aws = require("aws-sdk")

const endpoint = new aws.Endpoint(process.env.AWS_Endpoint)

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.AWS_keyID,
        secretAccessKey: process.env.AWS_applicationKey
    }
})

const uploadImagem = async (path, buffer, mimetupe) => {
    const produto_imagem = await s3.upload({
        Bucket: process.env.AWS_keyName,
        Key: path,
        Body: buffer,
        ContentType: mimetupe
    }).promise()


    return {
        path: produto_imagem.Key,
        url: `https://${process.env.AWS_keyName}.${process.env.AWS_Endpoint}/${produto_imagem.Key}`
    }


}

const excluirImagem = async (path) => {
    await s3.deleteObject({
        Bucket: process.env.AWS_keyName,
        Key: path
    }).promise();
}





module.exports = {
    uploadImagem,
    excluirImagem
}