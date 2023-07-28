import { NextApiRequest, NextApiResponse } from 'next';
import {S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
    try {

      const {fileType} = JSON.parse(req.body);

      const blobName = new Date().getTime();

      if (!process.env.SPACES_ACCESS_KEY || !process.env.SPACES_SECRET_KEY || !process.env.SPACES_BUCKET_NAME) throw new Error("Config error. Pls contact admin.");

      const s3Client = new S3Client({
        endpoint: `https://${process.env.SPACES_ENDPOINT}`,
        region: 'blr1', 
        credentials: {
          accessKeyId: process.env.SPACES_ACCESS_KEY,
          secretAccessKey: process.env.SPACES_SECRET_KEY,
        },
      });

      const imageURL = `https://${process.env.SPACES_BUCKET_NAME}.${process.env.CDN_ENDPOINT}/${process.env.CONTAINER_NAME}/${blobName}`;

      const { url, fields } = await createPresignedPost(s3Client, {
          Bucket: process.env.SPACES_BUCKET_NAME, 
          Conditions: [["starts-with", "$Content-Type", fileType]],
          Fields: {
            acl: "public-read",
            "Content-Type": fileType
          },
          Key: `${process.env.CONTAINER_NAME}/${blobName}`, 
          Expires: 1 * 60
        });

      console.log({imageURL, url, fields});
      res.json({imageURL, url, fields});

      
    }
    catch (error) {
      console.error(error);
      res.status(500).send("Error uploading file.")
    }
};
