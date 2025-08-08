import { Readable } from 'stream';
import { FileDto } from '../dto/file.dto';
export const createMulterFile = (file: FileDto): Express.Multer.File => {
  return {
    fieldname: file.fieldname || 'file',
    originalname: file.originalname,
    encoding: file.encoding || '7bit',
    mimetype: file.mimetype,
    size: file.size,
    destination: '',
    filename: '',
    path: '',
    stream: null as unknown as Readable,
    buffer: Buffer.isBuffer(file.buffer)
      ? file.buffer
      : Buffer.from(file.buffer),
  };
};
