const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(a => a.likes)
              .reduce((a, b) => a + b)
}

const favoriteBlog = (blogs) => {
  const likesArr = blogs.map(a => a.likes)
  const max = Math.max(...likesArr)
  const index = likesArr.indexOf(max)
  return {
    title: blogs[index].title,
    author: blogs[index].author,
    likes: blogs[index].likes
  }
}

const mostBlogs = (blogs) => {
  const authorArr = blogs.map(a => a.author)
  const sortedArr = authorArr.sort()
  const uniques = []
  for (let i = 0; i < sortedArr.length; i++) {
    if (sortedArr[i + 1] !== sortedArr[i]) {
      uniques.push(sortedArr[i])
    }
  }
  const amounts = uniques.map(x => authorArr.filter(a => a === x).length)
  const max = Math.max(...amounts)
  const index = amounts.indexOf(max)
  return {
    author: uniques[index],
    blogs: amounts[index]
  }

}

const mostLikes = (blogs) => {
  const authorArr = blogs.map(a => a.author)
  const uniques = []
  for (let i = 0; i < authorArr.length; i++) {
    if (authorArr[i + 1] !== authorArr[i]) {
      uniques.push(authorArr[i])
    }
  }
  const likeAmounts = uniques
                        .map(x => blogs.filter(a => a.author === x)) //Separates authors in their own arrays
                        .map(a => a.map(b => b.likes)) //Reduces the arrays just to their likes
                        .map(a => a.reduce((c, d) => c + d)) //Calculates the total likes for each author
  const max = Math.max(...likeAmounts)
  const index = likeAmounts.indexOf(max)
  return {
    author: uniques[index],
    likes: likeAmounts[index]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
