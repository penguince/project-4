import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

const router = express.Router();

/**
 * GET /api/books - Get all books
 */
router.get('/', async (req, res) => {
    try {
        await db.read();
        const books = db.data.books;

        return res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Error in GET /api/books:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving books',
            error: error.message
        });
    }
});

/**
 * GET /api/books/:id - Get a single book by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await db.read();
        const book = db.data.books.find((b) => b.id === id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Error in GET /api/books/:id:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving book',
            error: error.message
        });
    }
});

/**
 * POST /api/books - Create a new book
 * Required fields: title, author
 */
router.post('/', async (req, res) => {
    try {
        const { title, author } = req.body;

        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: title is required'
            });
        }

        if (!author || typeof author !== 'string' || !author.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: author is required'
            });
        }

        const newBook = {
            id: uuidv4(),
            title: title.trim(),
            author: author.trim(),
            createdAt: new Date().toISOString()
        };

        await db.update(({ books }) => books.push(newBook));

        return res.status(201).json({
            success: true,
            data: newBook
        });
    } catch (error) {
        console.error('Error in POST /api/books:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating book',
            error: error.message
        });
    }
});

/**
 * PUT /api/books/:id - Update a book
 * Allows updating title and/or author
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author } = req.body;

        if (title === undefined && author === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: provide title and/or author to update'
            });
        }

        if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: title must be a non-empty string'
            });
        }

        if (author !== undefined && (typeof author !== 'string' || !author.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: author must be a non-empty string'
            });
        }

        await db.read();
        const index = db.data.books.findIndex((b) => b.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        const existing = db.data.books[index];

        db.data.books[index] = {
            ...existing,
            ...(title !== undefined ? { title: title.trim() } : {}),
            ...(author !== undefined ? { author: author.trim() } : {}),
            updatedAt: new Date().toISOString()
        };

        await db.write();

        return res.status(200).json({
            success: true,
            data: db.data.books[index]
        });
    } catch (error) {
        console.error('Error in PUT /api/books/:id:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating book',
            error: error.message
        });
    }
});

/**
 * DELETE /api/books/:id - Delete a book
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await db.read();
        const index = db.data.books.findIndex((b) => b.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        let deletedBook;
        await db.update(({ books }) => {
            deletedBook = books.splice(index, 1)[0];
        });

        return res.status(200).json({
            success: true,
            data: deletedBook
        });
    } catch (error) {
        console.error('Error in DELETE /api/books/:id:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting book',
            error: error.message
        });
    }
});

export default router;