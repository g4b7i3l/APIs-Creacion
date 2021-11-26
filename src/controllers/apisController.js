const db = require('../database/models')
const getURL = req => `${req.protocol}://${req.get('host')}${req.originalUrl}`;

const throwError = (res, error) => {
    return res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message
    })
}
module.exports = {
    list: async (req, res) => {
        let offset = +req.query.limit * (+req.query.current - 1)
        try {
            const total = await db.Movie.findAll()
            const products = await db.Movie.findAll({
                limit: +req.query.limit || 10,
                offset: offset || 0,
                include: [
                    { association: 'Genre' }]
            })
            let response = {
                status: 200,
                meta: {
                    total: total.length,
                    url: getURL(req)
                },
                data: movies
            }
            return res.status(200).json(response)
        } catch (error) {
            throwError(res, error)
        }
    },
    detail: async (req, res) => {

        if (req.params.id % 1 != 0) {
            return res.status(422).json({
                status: 422,
                message: 'ID incorrecto'
            })
        }

        try {
            const movie = await db.Movie.findByPk(req.params.id, {
                include: [
                    { association: 'genre' }
                ]
            })
            if (movie) {
                let response = {
                    status: 200,
                    meta: {
                        url: getURL(req)
                    },
                    data: movie
                }
                return res.status(200).json(response)
            } else {
                const error = new Error('Pelicula inexistente')
                error.status = 400
                throw error
            }

        } catch (error) {
            throwError(res, error)
        }
    },
    create : async (req,res) => {
        console.log(req.body)
        try {
            const movie = await db.Movie.create({
                ...req.body,

            })
            let response = {
                status : 201,
                meta : {
                    url : getURLBase(req) + '/apis' + movie.id
                },
                message : 'Pelicula agregado con éxito'
            }
            return res.status(201).json(response)
        } catch (error) {
            return res.status(400).json({
                status : 400,
                messages : error.errors.map(error => error.message)
            })
        }
    },
    
}