import type { VideoAndThumbnailUrlType } from "./env";

const searchResponseQuery = (searchText,searchTags) => {
    const resolve = ()=>{
        const result:VideoAndThumbnailUrlType[] =  [{
            videoKey: 'MainVideos/contrate_a_esta_sirvienta_ella_vino_con_estos_shorts_para_provocarme_360p.mp4',
            videoUrl: 'https://d1a9sy9txb1eh6.cloudfront.net/MainVideos/contrate_a_esta_sirvienta_ella_vino_con_estos_shorts_para_provocarme_360p.mp4',
            thumbnailUrl: 'https://d1a9sy9txb1eh6.cloudfront.net/Thumbnails/contrate_a_esta_sirvienta_ella_vino_con_estos_shorts_para_provocarme_360p.jpg',
            previewUrl: 'https://d1a9sy9txb1eh6.cloudfront.net/PreviewVideos/contrate_a_esta_sirvienta_ella_vino_con_estos_shorts_para_provocarme_360p_preview.mp4',     
            tags: [ 'big ass', 'maid', 'shorts' ]
          }];
        setTimeout(() => {
            console.log('searchText',searchText)
            console.log('searchTags',searchTags)
        return result;
        }, 2000);
    }
    // const reject = (e)=>{
    //     return new Error('err');
    // }
    const result = new Promise(resolve/* ,reject */);
    return result;
}