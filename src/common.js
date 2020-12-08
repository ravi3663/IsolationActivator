import RNFetchBlob from 'rn-fetch-blob';

export const storeProfileImage = (imageUrl) => {
  console.log('storeProfileImage called')
  RNFetchBlob
    .config({ path: `${RNFetchBlob.fs.dirs.DocumentDir}/userdp.png` })
    .fetch('GET', `https:${imageUrl}`, { 'Cache-Control': 'no-store' })
    .then((res) => {
      res.path(); // where the file is
    })
    .catch((error) => {
      // error handling
    });
};