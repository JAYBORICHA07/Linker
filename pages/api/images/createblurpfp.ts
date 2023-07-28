import { NextApiRequest, NextApiResponse } from 'next'
import jimp from 'jimp'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const imageURL = req.body.imageurl as string
  // console.log("\nblurpfp imageurl :- \n" + imageURL + "\n");;

  const image = await jimp.read(imageURL)
  // console.log("\nfirst\n")
  // console.log("\nblurpfp imageurl :- \n" + image + "\n");

  image.resize(5, jimp.AUTO)

  const resizedImageBuffer = await image.getBufferAsync(jimp.MIME_JPEG)
  const imageBase64 = resizedImageBuffer.toString('base64')
  res.status(200).json({ blurpfp: imageBase64, success: true })
}
