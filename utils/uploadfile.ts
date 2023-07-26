type UploadFileResponse = {
  error?: string
  imageURL?: string
  blurpfp?: string
}

export async function uploadFile(file: File, isPfp?: boolean): Promise<UploadFileResponse> {
  const getuploadurl = await fetch('/api/images/getuploadurl', {
    method: 'POST',
    body: JSON.stringify({ 
      fileName: file.name,
      fileType: file.type
    })
  });
  const response = await getuploadurl.json()
  const uploadURL = response.payload.uploadURL

  // const formData = new FormData()
  // formData.append('file', file)

  
  // const newFile = {
  //   ...file,
  //   name: response.payload.blobName
  // }
  
  console.log({file}, response.payload, response.payload.blobName);

  const upload = await fetch(uploadURL, { 
    method: 'POST', 
    body: file,
    headers: {
      "Content-Type": file.type,
      'x-amz-acl': 'pulic-read',
    }
  });

  // const xhr = new XMLHttpRequest();
  // xhr.open('PUT, uploadUR)
  console.log({upload});
  const uploadResponse = await upload.json()
  if (!uploadResponse.success) return { error: JSON.stringify(uploadResponse) }

  const imageURL = uploadResponse.result.variants[0]

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