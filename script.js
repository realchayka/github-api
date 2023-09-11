class View {
    constructor() {
        this.app = document.getElementById('app');
        this.searchBoxElement = document.getElementById('searchBox')
        this.favoriteWrapper = document.getElementById('favoriteWrapper')

        this.searchInput = document.getElementById('searchInput')
        this.main = this.createElement('div', 'main')

        this.app.append(this.main)
    }
    removeFromFavorites(repository){
        this.favoriteWrapper.removeChild(repository)
    }
    addToFavorites(repoData){
        const favoriteElement = this.createElement('div', 'favorite')
        
        favoriteElement.insertAdjacentHTML('beforeend', `
            <h3>${repoData.name}</h3>
            <p>Name: ${repoData.owner.login}</p>
            <p>Stars:${repoData.stargazers_count}</p>
        `);
        const deleteButton = this.createElement('button', 'delete')

        deleteButton.textContent = 'Delete'
        deleteButton.addEventListener('click', () => this.removeFromFavorites(favoriteElement))
        favoriteElement.appendChild(deleteButton)
        this.favoriteWrapper.appendChild(favoriteElement)
        this.searchInput.value = ''
        this.clearFavorites();
    
    }
    clearFavorites() {
        while (this.searchBoxElement.firstChild) {
          this.searchBoxElement.removeChild(this.searchBoxElement.firstChild);
        }
      }
    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag)
        if (elementClass) {
            element.classList.add(elementClass)
        }
        return element
    }


    searchBox(repoData){
        const repository = this.createElement('li')
      
        repository.textContent = `${repoData.name}`
        repository.addEventListener('click', () =>{
            this.addToFavorites(repoData)
            console.log(this.favoriteWrapper)
        })
       
        
        this.searchBoxElement.append(repository)
    }
}


class Search {
    constructor(view) {
        this.view = view;
        this.debounceTimeout = null;
        this.view.searchInput.addEventListener('keyup', this.debounceSearch.bind(this))
    }
    addToFavorites(repoData){
        this.view.addToFavorites(repoData)
    }

    debounceSearch(){
        clearTimeout(this.debounceTimeout)

        this.debounceTimeout = setTimeout(() => {
            this.searchRepo()
        }, 500)
    }
    
    async fetchRepoData(){
        const response = await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=5`)
        if(!response.ok){
            throw new Error('not ok')
        }
        return response.json()
    }

    async searchRepo() {
        const searchTerm = this.view.searchInput.value
        if (searchTerm.trim() === ''){
            this.clearSearchResults()
            return
        }
        try {
            const data = await this.fetchRepoData(searchTerm)

            this.clearSearchResults()

            data.items.forEach((repo) => {
                this.view.searchBox(repo)
            })
        } catch (error) {
            console.error('Error: ', error)
        }
        
    }
   
    clearSearchResults(){
        this.view.searchBoxElement.textContent = ''
    }



}

new Search(new View);