
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

  const response = await getuploadurl.json();
  console.log({response});
  
  const formData = new FormData();

  Object.entries(response.fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  })
  formData.append('file', file);
  // console.log({formData});

  const uploadResponse = await fetch(response.url, { 
    method: 'POST', 
    body: formData,
    headers: {
      'x-amz-acl': 'pulic-read',
    }
  })
  // .then(async res => {
  //   if (res.status === 200) return await res.json()
  //   else throw res;
  // })
  // .catch(err => console.error(err));

  console.log({uploadResponse});
  if (uploadResponse.status !== 204) return { error: JSON.stringify(uploadResponse) }

  if (!isPfp) return { imageURL: response.imageURL }

  const createblurpfp = await fetch('/api/images/createblurpfp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageurl: response.imageURL }),
  })

  const { blurpfp } = await createblurpfp.json()
  return { imageURL: response.imageURL, blurpfp: blurpfp }
}