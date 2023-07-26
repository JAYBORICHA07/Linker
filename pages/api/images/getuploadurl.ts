import { NextApiRequest, NextApiResponse } from 'next';
// import { NextRequest } from 'next/server';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import formidable from "formidable";
import {IncomingForm} from 'formidable';

// export const config = {
//   api: {
//     bodyParser: false
//   }
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const response = await fetch(
  //   `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/images/v2/direct_upload`,
  //   {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}` },
  //   }
  // )

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

  // Get the public URL of the uploaded file
  // const url = `https://${process.env.SPACES_BUCKET_NAME}.${process.env.SPACES_ENDPOINT}/${containerName}/${blobName}`;

  const uploadURL = await getSignedUrl(s3Client, new PutObjectCommand(params), {expiresIn: 1 * 60});
  console.log('Successfully uploaded object:', uploadURL);
  console.log(fileName);
  console.log(req.body);
  res
    .status(200)
    .json({ 
      status: 'success', 
      payload: { 
        uploadURL,
        blobName: fileName
      } 
    });

  // });
  

}
