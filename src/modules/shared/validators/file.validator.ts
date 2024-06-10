// import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

// // export class ImageFileValidationPipe implements PipeTransform {
// //   transform(file: Express.Multer.File): Express.Multer.File {
// //     if (!file) return null;

// //     if (!file.mimetype.includes('image')) {
// //       throw new BadRequestException('Invalid file type, just allow images');
// //     }

// //     return file;
// //   }
// // }
// @Injectable()
// export class ImageFileValidationPipe implements PipeTransform {
//   transform(files: Express.Multer.File[]): Express.Multer.File[] {
//     if (!files || !Array.isArray(files) || files.length === 0) {
//       throw new BadRequestException('Validation failed: No files uploaded.');
//     }

//     files.forEach((file) => {
//       if (!file.mimetype.includes('image')) {
//         throw new BadRequestException('Validation failed: Uploaded files must be images.');
//       }
//     });

//     return files;
//   }
// }
import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
//import { Express } from 'express';

@Injectable()
export class SingleImageFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Validation failed: No file uploaded.');
    }

    if (!file.mimetype.includes('image')) {
      throw new BadRequestException('Validation failed: Uploaded file must be an image.');
    }

    return file;
  }
}

@Injectable()
export class MultipleImageFilesValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[]): Express.Multer.File[] {
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new BadRequestException('Validation failed: No files uploaded.');
    }

    files.forEach((file) => {
      if (!file.mimetype.includes('image')) {
        throw new BadRequestException('Validation failed: Uploaded files must be images.');
      }
    });

    return files;
  }
}
