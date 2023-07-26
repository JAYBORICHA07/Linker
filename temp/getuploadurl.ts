import { NextApiRequest, NextApiResponse } from 'next';
// import { NextRequest } from 'next/server';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
// import formidable from "formidable";
import {IncomingForm} from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const response = await fetch(
  //   `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/images/v2/direct_upload`,
  //   {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}` },
  //   }
  // )

  const containerName = process.env.CONTAINER_NAME;
  const blobName = new Date().getTime();
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {

    // const formData = await req.formData();

    const file: any = files.file?.[0]; //formData.get('file');
    console.log("file data", Array.isArray(files.file), {file});

    if (!file) {
        res.json({status: 'error', message: 'Invalid File'});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

  const s3Client = new S3Client({
    endpoint: `https://${process.env.SPACES_ENDPOINT}`,
    region: 'blr1', // Replace this with the appropriate region for your Space
    credentials: {
      // @ts-ignore
      accessKeyId: process.env.SPACES_ACCESS_KEY,
      // @ts-ignore
      secretAccessKey: process.env.SPACES_SECRET_KEY,
    },
  });

  const params = {
    Bucket: process.env.SPACES_BUCKET_NAME, // The path to the directory you want to upload the object to, starting with your Space name.
    Key: `${containerName}/${blobName}`, // Object key, referenced whenever you want to access this file later.
    Body: buffer, // The object's contents as a buffer.
    ACL: 'public-read', // Defines ACL permissions, such as private or public.
    ContentType: file.type || file.mimetype, // Content type of the file.
    ContentLength: file.size, // Content length of the file.
  };

  // Use S3Client to upload the object
  const data = await s3Client.send(new PutObjectCommand(params));
  // Get the public URL of the uploaded file
  const url = `https://${process.env.SPACES_BUCKET_NAME}.${process.env.SPACES_ENDPOINT}/${containerName}/${blobName}`;

  console.log('Successfully uploaded object:', url);
  res
    .status(200)
    .json({ status: 'success', payload: { url: url } });

  });
  

}
