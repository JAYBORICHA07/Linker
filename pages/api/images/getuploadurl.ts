import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { DeleteObjectCommand, PutObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import formidable, {IncomingForm} from 'formidable';
// import firstValues from 'formidable/src/helpers/firstValues'
import { createReadStream, fstat } from 'fs';
import FormData from 'form-data';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';


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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const form = new IncomingForm();
  
    try {

      const {fileName, fileType} = JSON.parse(req.body);

      const blobName = new Date().getTime();

      const imageURL = `https://${process.env.SPACES_BUCKET_NAME}.${process.env.CDN_ENDPOINT}/${process.env.CONTAINER_NAME}/${blobName}`;

      const { url, fields } = await createPresignedPost(s3Client, {
          Bucket: process.env.SPACES_BUCKET_NAME, // The path to the directory you want to upload the object to, starting with your Space name.
          Conditions: [["starts-with", "$Content-Type", fileType]],
          Fields: {
            acl: "public-read",
            "Content-Type": fileType
          },
          Key: `${process.env.CONTAINER_NAME}/${blobName}`, // Object key, referenced whenever you want to access this file later.
          // Key: fileName, // Object key, referenced whenever you want to access this file later.
          Expires: 1 * 60
        });

      console.log({imageURL, url, fields});
      res.json({imageURL, url, fields});

      
    }
    catch (error) {
      console.error(error);
      res.status(500).send("Error uploading file.")
    }
  // })
};

// export default async function handler(req: NextRequest, res: NextApiResponse) {
//   // const form = new IncomingForm();
//   console.log(req, req.file);
//   const formData = await req.formData();

//   let file = formData.get('file') as Blob | null;
//   // form.parse(req, async(err, fields, files) => {
//     if(!file) {
//       res.status(400).send("No file uploaded");
//       return;
//     };

//     try {

//       const blobName = new Date().getTime();

//       const imageURL = `https://${process.env.SPACES_BUCKET_NAME}.${process.env.CDN_ENDPOINT}/${process.env.CONTAINER_NAME}/${blobName}`;

//       const buffer = Buffer.from(await file.arrayBuffer());

//       return s3Client.putObject({
//           Bucket: process.env.SPACES_BUCKET_NAME, // The path to the directory you want to upload the object to, starting with your Space name.
//           Key: `${process.env.CONTAINER_NAME}/${blobName}`, // Object key, referenced whenever you want to access this file later.
//           // Key: fileName, // Object key, referenced whenever you want to access this file later.
//           ACL: 'public-read', // Defines ACL permissions, such as private or public.
//           Body: buffer,
//           // ContentType: fileType, // Content type of the file. // Content length of the file.
//         }, 
//         async () => res.status(201).json(imageURL)
//       )

      
//     }
//     catch (error) {
//       console.error(error);
//       res.status(500).send("Error uploading file.")
//     }
//   // })
// };