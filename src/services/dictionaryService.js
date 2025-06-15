const API_BASE_URL = 'https://api.datamuse.com/words';

export const getDictionaryWords = async (category) => {
    try {
        // Use different query parameters based on category
        const queryParams = {
            programming: 'rel_trg=computer+programming&max=100',
            animals: 'rel_trg=animal+mammal+bird&max=100',
            foods: 'rel_trg=food+cuisine&max=100',
            sports: 'rel_trg=sport+game&max=100',
            movies: 'rel_trg=movie+film&max=100',
            music: 'rel_trg=music+instrument&max=100',
            space: 'rel_trg=space+astronomy&max=100',
            nature: 'rel_trg=nature+environment&max=100',
            colors: 'rel_trg=color+shade&max=100',
            cars: 'rel_trg=car+automobile&max=100'
        };

        const query = queryParams[category] || 'rel_trg=word&max=100';
        const response = await fetch(`${API_BASE_URL}?${query}&md=f`);
        const words = await response.json();
        
        // Filter words that are exactly 5 letters long and convert to uppercase
        const fiveLetterWords = words
            .filter(word => word.word.length === 5)
            .map(word => word.word.toUpperCase());

        // Remove duplicates
        return [...new Set(fiveLetterWords)];
    } catch (error) {
        console.error('Error fetching dictionary words:', error);
        // Return some default words as fallback
        return ['HELLO', 'WORLD', 'REACT', 'QUICK', 'JUMPS'];
    }
};

// Cache for storing fetched words
const wordCache = new Map();

export const getRandomWord = async (category, excludeWords = []) => {
    try {
        // Try to get words from cache first
        let words = wordCache.get(category);
        
        // If not in cache or running low on words, fetch new ones
        if (!words || words.length < 10) {
            words = await getDictionaryWords(category);
            wordCache.set(category, words);
        }

        // Filter out excluded words
        const availableWords = words.filter(word => !excludeWords.includes(word));

        // If we're running out of words, fetch new ones
        if (availableWords.length < 5) {
            words = await getDictionaryWords(category);
            wordCache.set(category, words);
            return getRandomWord(category, excludeWords);
        }

        // Get a random word from the available words
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const selectedWord = availableWords[randomIndex];

        // Remove the selected word from the cache to avoid repetition
        wordCache.set(category, words.filter(w => w !== selectedWord));

        return selectedWord;
    } catch (error) {
        console.error('Error getting random word:', error);
        return 'ERROR';
    }
};
