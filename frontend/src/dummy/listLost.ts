interface LostItem {
    id : number,
    title : string,
    username : string,
    likeNum : number,
    commentNum : number,
    image : any,
    status : string
}

const randomTitle : string[] = ["Ipad 12 Pro", "Dompet XSS", "Laptop Macbook", "Redmi Note 12 Pro"];
const randomName : string[] = ["Rahmat Sobirin", "Ucok Ramdhani","Acep Sutarjo","Rizki Mubarok"];
const randomStatus : string[] = ["Ditemukan", "Hilang"];
const randomCateogry : string[] = ["Handphone","Laptop","Dompet","Dan Lain Lain"];

const listLostItem : Array<LostItem> = Array.from({length : 50}, (_,n) => {
    return {
        id : n + 1,
        title : randomTitle[Math.floor(Math.random()*randomTitle.length)],
        username : randomName[Math.floor(Math.random()*randomName.length)],
        status : randomStatus[Math.floor(Math.random()*randomStatus.length)],
        likeNum : Math.ceil(Math.random()*50),
        commentNum : Math.ceil(Math.random()*50),
        image : "any",
        category : randomCateogry[Math.floor(Math.random()*randomCateogry.length)]
    }
})

export {listLostItem};
export type {LostItem};