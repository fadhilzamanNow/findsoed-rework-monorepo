interface myItem {
    id : number,
    title : string,
    likeNum : number,
    commentNum : number,
    image : any,
    status : string,
    category : string
}


const randomTitle : string[] = ["Ipad 12 Pro", "Dompet XSS", "Laptop Macbook", "Redmi Note 12 Pro"];
const randomStatus : string[] = ["Ditemukan", "Hilang"];
const randomCateogry : string[] = ["Handphone","Laptop","Dompet","Dan Lain Lain"];


const myLostItem : myItem[] = Array.from({length : 23}, (_,i) => {
    return {
        key : i +1,
        id : i + 1,
        title : randomTitle[Math.floor(Math.random()*randomTitle.length)],
        likeNum : Math.ceil(Math.random()*50),
        commentNum : Math.ceil(Math.random()*50),
        image : "",
        status : randomStatus[Math.floor(Math.random()*randomStatus.length)],
        category : randomCateogry[Math.floor(Math.random()*randomCateogry.length)]
    }
})
export type {myItem};
export {myLostItem}