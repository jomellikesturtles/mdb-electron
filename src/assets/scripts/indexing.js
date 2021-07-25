

var categories = [
    'country', 'studio', 'awardees', 'upcoming', 'decades'
]

// let decadeCategory=[
//     startYear =
// ]

/**
 * Generates decade
 * @returns range of years
 */
function generateDecade() {

    const minYear = 1900
    const currentYear = new Date().getFullYear()
    const currentYearStr = currentYear.toString()
    const currentDecadeStart = currentYearStr.slice(0, 3) + 0
    const generatedYear = Math.floor(Math.random() * (currentDecadeStart - minYear + 1)) + minYear
    const genereatedYearStr = generatedYear.toString()
    const decadeStart = genereatedYearStr.slice(0, 3) + 0;
    const decadeEnd = genereatedYearStr.slice(0, 3) + 9;
    console.log(decadeStart)
    console.log(decadeEnd)
    return [decadeStart, decadeEnd]

}

const GENRES = [
    { id: 1, code: 'ACT', description: 'Action', isChecked: true },
    { id: 2, code: 'ADV', description: 'Adventure', isChecked: false },
    { id: 3, code: 'DOC', description: 'Documentary', isChecked: false },
    { id: 4, code: 'DRA', description: 'Drama', isChecked: false },
    { id: 5, code: 'HOR', description: 'Horror', isChecked: false },
    { id: 6, code: 'SCI', description: 'Sci-Fi', isChecked: true },
    { id: 7, code: 'THR', description: 'Thriller', isChecked: false },
    { id: 10752, name: 'War' },
    {id: 37, name: 'Western' }]

    // id: 16,
    //     name: 'Animation'
    // },
    // {
    //     id: 35,
    //     name: 'Comedy'
    // },
    // {
    //     id: 80,
    //     name: 'Crime'
    // },
    // {
    //     id: 99,
    //     name: 'Documentary'
    // },
    // {
    //     id: 18,
    //     name: 'Drama'
    // },
    // {
    //     id: 10751,
    //     name: 'Family'
    // },
    // {
    //     id: 14,
    //     name: 'Fantasy'
    // },
    // {
    //     id: 36,
    //     name: 'History'
    // },
    // {
    //     id: 27,
    //     name: 'Horror'
    // },
    // {
    //     id: 10402,
    //     name: 'Music'
    // },
    // {
    //     id: 9648,
    //     name: 'Mystery'
    // },
    // {
    //     id: 10749,
    //     name: 'Romance'
    // },
    // {
    //     id: 878,
    //     name: 'Science Fiction'
    // },
    // {
    //     id: 10770,
    //     name: 'TV Movie'
    // },
    // {
    //     id: 53,
    //     name: 'Thriller'
