export const createImageURL = (file): string => {
    const serverAddress: string = process.env.SERVER_ADDRESS
    
    // 파일이 저장되는 경로: 서버주소/public 폴더
    // 위의 조건에 따라 파일의 경로를 생성해줍니다.
    return `${serverAddress}/public/${file.filename}`;
  }