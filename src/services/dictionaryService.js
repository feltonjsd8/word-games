const DATAMUSE_API_URL = 'https://api.datamuse.com/words';
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

export const getWordDefinition = async (word) => {
    try {
        const response = await fetch(`${DICTIONARY_API_URL}${word.toLowerCase()}`);
        if (!response.ok) {
            throw new Error('Definition not found');
        }
        const data = await response.json();
        
        // Extract the most relevant information
        const definitions = data[0]?.meanings?.map(meaning => ({
            partOfSpeech: meaning.partOfSpeech,
            definition: meaning.definitions[0].definition,
            example: meaning.definitions[0].example
        })) || [];

        return {
            word: data[0].word,
            phonetic: data[0].phonetic || '',
            definitions
        };
    } catch (error) {
        console.error('Error fetching definition:', error);
        return {
            word: word,
            phonetic: '',
            definitions: [{
                partOfSpeech: '',
                definition: 'Definition not available',
                example: ''
            }]
        };
    }
};

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
        };        const query = queryParams[category] || 'rel_trg=word&max=100';
        const response = await fetch(`${DATAMUSE_API_URL}?${query}&md=f`);
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
