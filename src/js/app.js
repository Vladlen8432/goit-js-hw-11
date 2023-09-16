import { getPhotos } from "./pixabay-api";

const formEl = document.querySelector("#search-form")
let page = null

formEl.addEventListener("submit", onSubmit)

async function onSubmit(e) {
    e.preventDefault()
    page = 1

    const searchQuery = e.currentTarget.elements.searchQuery.value.trim()

    if(!searchQuery) {
        return alert("Empty query")
    }

    try {
        const res = await getPhotos(page, searchQuery)
        console.log(res)
    }catch{
        
    }
}