const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../utils/logger');

class QRCodeService {
    async generateQRCode(data, filename) {
        try {
            const qrPath = path.join(process.env.QR_CODE_PATH || './uploads/qrcodes', filename);
            const size = parseInt(process.env.QR_CODE_SIZE) || 200;

            await QRCode.toFile(qrPath, data, {
                width: size,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            logger.info(`QR code generated: ${filename}`);
            return `/qrcodes/${filename}`;
        } catch (error) {
            logger.error('QR code generation error:', error);
            throw error;
        }
    }

    async generateLessonQRCode(lessonId, qrUrl) {
        // Admin'den gelen URL'i kullanarak QR oluştur
        const data = qrUrl || `https://yourgym.com/lesson/${lessonId}`;
        const filename = `lesson-${lessonId}.png`;
        return await this.generateQRCode(data, filename);
    }

    async deleteQRCode(filename) {
        try {
            const qrPath = path.join(process.env.QR_CODE_PATH || './uploads/qrcodes', filename);
            await fs.unlink(qrPath);
            logger.info(`QR code deleted: ${filename}`);
        } catch (error) {
            logger.error('QR code deletion error:', error);
        }
    }
}

module.exports = new QRCodeService();
