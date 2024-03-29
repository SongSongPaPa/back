import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
class ImageService {
  private readonly s3 = new AWS.S3();

  constructor(private readonly configService: ConfigService) {
    this.s3.config.update({
      credentials: {
        accessKeyId: this.configService.get('awsConfig.uid'),
        secretAccessKey: this.configService.get('awsConfig.secret'),
      },
      region: this.configService.get('awsConfig.region'),
    });
  }

  async uploadImage(filename: string, b64Image: string) {
    const [mimeType, base64] = b64Image.split(';base64,');
    const image = Buffer.from(base64, 'base64');

    const result = await this.s3
      .upload({
        Bucket: this.configService.get('awsConfig.bucket'),
        Key: filename,
        Body: image,
        ACL: 'public-read',
        ContentType: mimeType.split(':')[1],
        ContentDisposition: 'inline',
      })
      .promise();
    return result.Location;
  }

  async deleteImage(filename: string) {
    await this.s3
      .deleteObject({
        Bucket: this.configService.get('awsConfig.bucket'),
        Key: filename,
      })
      .promise();
  }
}

export default ImageService;
