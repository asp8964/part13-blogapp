const router = require('express').Router()
const { fn, col, literal } = require('sequelize')
const { Blog } = require('../models')

router.get('/', async (_, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [fn('COUNT', col('title')), 'articles'],
            [fn('SUM', col('likes')), 'likes'],
        ],
        group: 'author',
        order: [[literal('likes'), 'DESC']]
    })
    res.json(authors)
})

module.exports = router