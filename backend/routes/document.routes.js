const express = require('express');
const router = express.Router();
const multer = require('multer');
const mammoth = require('mammoth');
const { Document, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs').promises;
const path = require('path');
const watsonService = require('../services/watson.service');
const cloudantService = require('../services/cloudant.service');

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only .docx files
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only .docx files are allowed'));
        }
    }
});

/**
 * POST /api/document/upload
 * Upload a Word document, analyze it, add comments, and return downloadable result
 */
router.post('/upload', upload.single('document'), async (req, res) => {
    let uploadedFilePath = null;
    let outputFilePath = null;

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Please upload a .docx file.'
            });
        }

        uploadedFilePath = req.file.path;
        const originalName = req.file.originalname;

        console.log(`Processing document: ${originalName}`);

        // Step 1: Extract text from Word document
        const buffer = await fs.readFile(uploadedFilePath);
        const result = await mammoth.extractRawText({ buffer });
        const documentText = result.value;

        if (!documentText || documentText.trim().length === 0) {
            throw new Error('Document is empty or could not be read');
        }

        console.log(`Extracted ${documentText.length} characters from document`);

        // Step 2: Analyze with Watson NLU
        const analysis = await watsonService.analyzeText(documentText);
        console.log(`Analysis complete. Risk score: ${analysis.risk.score}`);

        // Step 3: Save analysis to Cloudant
        const savedAnalysis = await cloudantService.saveAnalysis({
            ...analysis,
            fileName: originalName,
            uploadDate: new Date().toISOString()
        });

        // Step 4: Create new Word document with comments
        const outputDoc = await createAnnotatedDocument(
            documentText,
            analysis,
            originalName
        );

        // Step 5: Save output document
        const outputFileName = `analyzed_${Date.now()}_${originalName}`;
        outputFilePath = path.join('uploads', outputFileName);
        
        await fs.writeFile(outputFilePath, outputDoc);

        console.log(`Output document created: ${outputFileName}`);

        // Step 6: Send response with download link
        res.json({
            success: true,
            message: 'Document analyzed successfully',
            analysis: {
                riskScore: analysis.risk.score,
                riskLevel: analysis.risk.level,
                entitiesCount: analysis.analysis.entities?.length || 0,
                keywordsCount: analysis.keywords?.length || 0,
                riskFactors: analysis.risk.factors
            },
            downloadUrl: `/api/document/download/${outputFileName}`,
            analysisId: savedAnalysis._id
        });

        // Clean up uploaded file after 1 minute
        setTimeout(async () => {
            try {
                await fs.unlink(uploadedFilePath);
                console.log(`Cleaned up uploaded file: ${uploadedFilePath}`);
            } catch (err) {
                console.error('Error cleaning up uploaded file:', err);
            }
        }, 60000);

    } catch (error) {
        console.error('Error processing document:', error);

        // Clean up files on error
        if (uploadedFilePath) {
            try {
                await fs.unlink(uploadedFilePath);
            } catch (err) {
                console.error('Error cleaning up on error:', err);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Error processing document',
            error: error.message
        });
    }
});

/**
 * GET /api/document/download/:filename
 * Download the analyzed document
 */
router.get('/download/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join('uploads', filename);

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).json({
                success: false,
                message: 'File not found or has expired'
            });
        }

        // Set headers for download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Stream file to response
        const fileBuffer = await fs.readFile(filePath);
        res.send(fileBuffer);

        // Clean up file after download (after 5 seconds)
        setTimeout(async () => {
            try {
                await fs.unlink(filePath);
                console.log(`Cleaned up downloaded file: ${filePath}`);
            } catch (err) {
                console.error('Error cleaning up downloaded file:', err);
            }
        }, 5000);

    } catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading document',
            error: error.message
        });
    }
});

/**
 * Create annotated Word document with analysis results
 */
async function createAnnotatedDocument(originalText, analysis, originalFileName) {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Title
                new Paragraph({
                    text: 'PRAETOR LEGAL ANALYSIS REPORT',
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),

                // Document info
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Original Document: ${originalFileName}`,
                            bold: true
                        })
                    ],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Analysis Date: ${new Date().toLocaleString()}`,
                            bold: true
                        })
                    ],
                    spacing: { after: 400 }
                }),

                // Risk Assessment Section
                new Paragraph({
                    text: 'RISK ASSESSMENT',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Risk Score: ${(analysis.risk.score / 10).toFixed(1)}/10`,
                            bold: true,
                            size: 28
                        })
                    ],
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Risk Level: ${analysis.risk.level.toUpperCase()}`,
                            bold: true,
                            color: getRiskColor(analysis.risk.level),
                            size: 28
                        })
                    ],
                    spacing: { after: 300 }
                }),

                // Risk Factors
                ...(analysis.risk.factors && analysis.risk.factors.length > 0 ? [
                    new Paragraph({
                        text: 'Risk Factors Identified:',
                        bold: true,
                        spacing: { after: 100 }
                    }),
                    ...analysis.risk.factors.map(factor => 
                        new Paragraph({
                            text: `• ${factor}`,
                            bullet: { level: 0 },
                            spacing: { after: 100 }
                        })
                    ),
                    new Paragraph({ text: '', spacing: { after: 300 } })
                ] : []),

                // Entities Section
                new Paragraph({
                    text: 'KEY ENTITIES',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 200 }
                }),
                ...(analysis.analysis.entities && analysis.analysis.entities.length > 0 ?
                    analysis.analysis.entities.map(entity =>
                        new Paragraph({
                            text: `• ${entity.type}: ${entity.text}`,
                            bullet: { level: 0 },
                            spacing: { after: 100 }
                        })
                    ) : [
                        new Paragraph({
                            text: 'No entities identified',
                            italics: true,
                            spacing: { after: 100 }
                        })
                    ]
                ),

                // Keywords Section
                new Paragraph({
                    text: 'IMPORTANT KEYWORDS',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 200 }
                }),
                ...(analysis.keywords && analysis.keywords.length > 0 ?
                    analysis.keywords.slice(0, 10).map(keyword =>
                        new Paragraph({
                            text: `• ${keyword.text} (relevance: ${(keyword.relevance * 100).toFixed(0)}%)`,
                            bullet: { level: 0 },
                            spacing: { after: 100 }
                        })
                    ) : [
                        new Paragraph({
                            text: 'No keywords identified',
                            italics: true,
                            spacing: { after: 100 }
                        })
                    ]
                ),

                // Original Document Section
                new Paragraph({
                    text: 'ORIGINAL DOCUMENT TEXT',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    text: originalText,
                    spacing: { after: 200 }
                }),

                // Footer
                new Paragraph({
                    text: '─'.repeat(80),
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Powered by Praetor Legal Intelligence | IBM Watson NLU',
                            italics: true,
                            size: 20
                        })
                    ],
                    alignment: AlignmentType.CENTER
                })
            ]
        }]
    });

    // Generate document buffer
    const Packer = require('docx').Packer;
    return await Packer.toBuffer(doc);
}

/**
 * Get color code for risk level
 */
function getRiskColor(level) {
    switch (level.toLowerCase()) {
        case 'low':
            return '008000'; // Green
        case 'medium':
            return 'FFA500'; // Orange
        case 'high':
            return 'FF0000'; // Red
        default:
            return '000000'; // Black
    }
}

module.exports = router;

// Made with Bob
