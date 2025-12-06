interface CommentTypes {
    id : number,
    postingId : number,
    userId : number,
    userName : string,
    comment : string
}

const listName : string[] = ["Hamdan","DeanKT","Pak Sutirjo","Reja Arap"]
const randomComment : string[] = [
    "Barangnya hilang dimana cuyy",
    "Kayaknya tadi disana dah saya liat",
    "Mantapp cuyy"
]

const listComment = () : Array<CommentTypes> => {
    return Array.from({length : 4}).map((_,i) => {
        return {
            id : i,
            postingId : 1,
            userId : Math.ceil(Math.random()*5),
            userName : listName[Math.floor(Math.random()*listName.length)],
            comment : randomComment[Math.floor(Math.random()*randomComment.length)]
        }
    })
}

export type {CommentTypes}
export {listComment}