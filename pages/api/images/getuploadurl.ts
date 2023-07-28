import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {IncomingForm} from 'formidable';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fileType, fileName } = JSON.parse(req.body);
  console.log("incoming request", req.body, {fileType, fileName});
  const containerName = process.env.CONTAINER_NAME;
  const blobName = new Date().getTime();
  const s3Client = new S3Client({
    // forcePathStyle: false, // Configures to use subdomain/virtual calling format.
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
    Key: `${containerName}/${fileName}`, // Object key, referenced whenever you want to access this file later.
    ACL: 'public-read', // Defines ACL permissions, such as private or public.
    ContentType: fileType, // Content type of the file. // Content length of the file.
  };

  let uploadURL;
  try {
     uploadURL = await getSignedUrl(s3Client, new PutObjectCommand(params), {expiresIn: 15 * 60});
    // console.log('Successfully uploaded object:', uploadURL ,"\n Upload Sucessfull");
    console.log(fileName);
  } catch (error) {
    console.log(error)
  }
  // console.log(fileName);
  // console.log(req.body);
  res
    .status(200)
    .json({ 
      status: 'success', 
      payload: { 
        uploadURL,
        blobName: fileName
      } 
    });
}
