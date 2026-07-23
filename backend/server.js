const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

dotenv.config();

const app = require('./src/app');

// ============================================
// 1. ENSURE UPLOAD DIRECTORY EXISTS
// ============================================
const uploadDir = path.join(__dirname, 'uploads/resumes');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Created uploads directory:', uploadDir);
}

console.log('📁 Upload directory:', uploadDir);

// ============================================
// 2. CONFIGURE MULTER FOR FILE UPLOADS
// ============================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = 'resume-' + uniqueSuffix + ext;
        console.log('📄 Saving file:', filename);
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
    }
});

// ============================================
// 3. CORS CONFIGURATION
// ============================================
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// 4. API ROUTES FOR RESUME MANAGEMENT
// ============================================

// Upload resume
app.post('/api/upload', upload.single('resume'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'No file uploaded' 
            });
        }

        console.log('✅ File uploaded successfully:', req.file.filename);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            filename: req.file.filename,
            downloadUrl: `/api/download/${req.file.filename}`,
            staticUrl: `/api/uploads/resumes/${req.file.filename}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// ✅ FIXED: Serve static files from uploads directory
app.use('/api/uploads', express.static(uploadDir));
app.use('/api/uploads/resumes', express.static(uploadDir));

console.log('✅ Static files served from:', uploadDir);

// ✅ FIXED: Download endpoint
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    console.log('📥 Download requested:', filename);
    console.log('📂 File path:', filepath);

    // Check if file exists
    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('❌ File not found:', filepath);
            return res.status(404).json({
                success: false,
                error: 'File not found',
                message: `The file "${filename}" does not exist`
            });
        }

        // Get file stats
        fs.stat(filepath, (err, stats) => {
            if (err) {
                console.error('❌ Error getting file stats:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Error reading file' 
                });
            }

            console.log('✅ File found, size:', stats.size, 'bytes');

            // Set headers for download
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Length', stats.size);
            
            // Stream the file
            const readStream = fs.createReadStream(filepath);
            readStream.pipe(res);

            readStream.on('error', (error) => {
                console.error('❌ Stream error:', error);
                res.status(500).json({ 
                    success: false,
                    error: 'Error reading file' 
                });
            });

            readStream.on('end', () => {
                console.log('✅ File download completed:', filename);
            });
        });
    });
});

// Get all uploaded files
app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        console.log('📋 Listing files, count:', files.length);
        
        const fileDetails = files.map(filename => {
            const filepath = path.join(uploadDir, filename);
            const stats = fs.statSync(filepath);
            return {
                filename: filename,
                size: stats.size,
                uploadDate: stats.birthtime,
                downloadUrl: `/api/download/${filename}`,
                staticUrl: `/api/uploads/resumes/${filename}`
            };
        });
        
        res.json({
            success: true,
            count: fileDetails.length,
            files: fileDetails
        });
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Check if a specific file exists (Debug route)
app.get('/api/check-file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);
    
    console.log('🔍 Checking file:', filepath);
    
    if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath);
        res.json({
            success: true,
            exists: true,
            filename: filename,
            path: filepath,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
        });
    } else {
        // List all files in directory
        const files = fs.readdirSync(uploadDir);
        res.json({
            success: false,
            exists: false,
            filename: filename,
            path: filepath,
            error: 'File not found',
            availableFiles: files,
            directory: uploadDir
        });
    }
});

// Delete a file
app.delete('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    console.log('🗑️ Deleting file:', filename);

    fs.unlink(filepath, (err) => {
        if (err) {
            console.error('❌ Delete error:', err);
            return res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }

        console.log('✅ File deleted:', filename);
        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    });
});

// ============================================
// 5. START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 URL: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`📁 Upload directory: ${uploadDir}`);
    console.log('=================================');
    console.log('✅ Resume endpoints:');
    console.log(`   POST   /api/upload - Upload resume`);
    console.log(`   GET    /api/files - List all resumes`);
    console.log(`   GET    /api/download/:filename - Download resume`);
    console.log(`   GET    /api/uploads/resumes/:filename - View resume`);
    console.log(`   DELETE /api/files/:filename - Delete resume`);
    console.log(`   GET    /api/check-file/:filename - Check if file exists`);
    console.log('=================================');
});