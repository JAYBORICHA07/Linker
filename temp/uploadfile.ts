import axios from "axios"

type UploadFileResponse = {
  error?: string
  imageURL?: string
  blurpfp?: string
}

export async function uploadFile(file: File, isPfp?: boolean): Promise<UploadFileResponse> {

  const formData = new FormData()
  formData.append('file', file);
  formData.append('blobName', file.name);

  // console.log({formData}, file);

  const upload = await fetch(
    '/api/images/getuploadurl', {
      method: 'POST', 
      body: formData
    });
  const uploadResponse = await upload.data;
  if (uploadResponse.status !== 'success') return { error: JSON.stringify(uploadResponse) }

  const imageURL = uploadResponse.payload.url;

  if (!isPfp) return { imageURL: imageURL }

  const createblurpfp = await fetch('/api/images/createblurpfp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageurl: imageURL }),
  })

  const { blurpfp } = await createblurpfp.json()

  return { imageURL: imageURL, blurpfp: blurpfp }
}
