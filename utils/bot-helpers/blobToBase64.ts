const blobToBase64 = (blob: Blob, callback: (base64data: string) => void) => {
  const reader = new FileReader()
  reader.onload = function () {
    const result = reader.result
    if (typeof result === 'string') {
      const base64data = result.split(',')[1]
      callback(base64data)
    } else {
      console.error('Error: reader.result is not a string')
    }
  }
  reader.readAsDataURL(blob)
}

export { blobToBase64 }
