const DATAMUSE_API_URL = 'https://api.datamuse.com/words';
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const isCommonWord = (word) => {
    const commonWords = new Set([
        'WORDS', 'THING', 'STUFF', 'ITEMS', 'TYPES',
        'ABOUT', 'OTHER', 'THESE', 'THOSE', 'THEIR',
        'THERE', 'WHERE', 'WHEN', 'WHAT', 'THIS',
        'WHICH', 'EVERY', 'MANY', 'SOME', 'MORE',
        'MOST', 'THAN', 'WITH', 'THAT', 'HAVE'
    ]);
    return commonWords.has(word);
};

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
    // Static word lists as fallback
    const staticWords = {
        games: ['MARIO', 'SONIC', 'ZELDA', 'CHESS', 'POKER'],
        dance: ['SALSA', 'TWIST', 'WALTZ', 'TANGO', 'SWING'],
        ocean: ['CORAL', 'WAVES', 'WHALE', 'CRAB', 'SHELL'],
        cities: ['PARIS', 'TOKYO', 'DUBAI', 'MIAMI', 'DELHI'],
        jobs: ['NURSE', 'PILOT', 'ACTOR', 'JUDGE', 'BAKER'],
        fashion: ['DRESS', 'SKIRT', 'SCARF', 'BOOTS', 'JEANS'],
        books: ['NOVEL', 'STORY', 'PROSE', 'BIBLE', 'MANGA'],
        weather: ['RAINY', 'SUNNY', 'WINDY', 'FOGGY', 'STORM'],
        tools: ['DRILL', 'PLIER', 'CHISEL', 'LEVEL', 'RAZOR'],
        herbs: ['BASIL', 'THYME', 'CUMIN', 'ANISE', 'CHIVE'],
        drinks: ['WATER', 'CIDER', 'JUICE', 'LAGER', 'BRANDY'],
        fruits: ['APPLE', 'MANGO', 'PEACH', 'GRAPE', 'MELON'],
        gems: ['PEARL', 'JEWEL', 'ONYX', 'AMBER', 'TOPAZ']
    };

    try {
        const categoryConfig = {
            programming: {
                queries: ['rel_trg=programming', 'topics=computing'],
                exclude: ['words', 'print', 'input', 'files', 'types']
            },
            animals: {
                queries: ['rel_trg=animal', 'topics=animals'],
                exclude: ['breed', 'group', 'class', 'foods', 'young']
            },
            foods: {
                queries: ['rel_trg=food', 'topics=cuisine'],
                exclude: ['plate', 'drink', 'sweet', 'serve', 'tasty'
                ]
            },
            sports: {
                queries: ['rel_trg=sport', 'topics=sports'],
                exclude: ['score', 'point', 'match', 'games', 'plays']
            },
            movies: {
                queries: ['rel_trg=movie', 'topics=cinema'],
                exclude: ['scene', 'stage', 'sound', 'video', 'watch']
            },
            music: {
                queries: ['rel_trg=music', 'topics=music'],
                exclude: ['sound', 'noise', 'track', 'audio', 'notes']
            },
            space: {
                queries: ['rel_trg=space', 'topics=astronomy'],
                exclude: ['light', 'shine', 'orbit', 'float', 'space']
            },
            nature: {
                queries: ['rel_trg=nature', 'topics=nature'],
                exclude: ['green', 'grow', 'plant', 'water', 'earth']
            },
            colors: {
                queries: ['rel_trg=color', 'topics=colors'],
                exclude: ['light', 'dark', 'toned', 'shade', 'tints']
            },
            cars: {
                queries: ['rel_trg=car', 'topics=automotive'],
                exclude: ['wheel', 'speed', 'drive', 'parts', 'rides']
            },
            games: {
                queries: ['rel_trg=game', 'topics=gaming'],
                exclude: ['plays', 'start', 'level', 'stage', 'score']
            },
            dance: {
                queries: ['rel_trg=dance', 'topics=dance'],
                exclude: ['moves', 'music', 'style', 'steps', 'floor']
            },
            ocean: {
                queries: ['rel_trg=ocean', 'topics=ocean'],
                exclude: ['water', 'depth', 'float', 'drops', 'units']
            },
            cities: {
                queries: ['rel_trg=city', 'topics=geography'],
                exclude: ['urban', 'metro', 'areas', 'zones', 'rural']
            },
            jobs: {
                queries: ['rel_trg=job', 'topics=employment'],
                exclude: ['works', 'tasks', 'roles', 'skill', 'needs']
            },
            fashion: {
                queries: ['rel_trg=fashion', 'topics=fashion'],
                exclude: ['trend', 'style', 'cloth', 'wear', 'looks']
            },
            books: {
                queries: ['rel_trg=book', 'topics=literature'],
                exclude: ['pages', 'print', 'reads', 'words', 'texts']
            },
            weather: {
                queries: ['rel_trg=weather', 'topics=meteorology'],
                exclude: ['cloud', 'storm', 'winds', 'rains', 'skies']
            },
            tools: {
                queries: ['rel_trg=tool', 'topics=tools'],
                exclude: ['works', 'build', 'makes', 'fixes', 'parts']
            },
            herbs: {
                queries: ['rel_trg=herb', 'topics=botany'],
                exclude: ['plant', 'dried', 'grows', 'leafy', 'green']
            },
            drinks: {
                queries: ['rel_trg=drink', 'topics=beverages'],
                exclude: ['water', 'thirst', 'glass', 'fluid', 'sips']
            },
            fruits: {
                queries: ['rel_trg=fruit', 'topics=fruits'],
                exclude: ['sweet', 'juice', 'fresh', 'plant', 'seed']
            },
            gems: {
                queries: ['rel_trg=gem', 'topics=mineralogy'],
                exclude: ['rock', 'stone', 'shine', 'glow', 'cuts']
            },
            countries: {
                queries: ['rel_jja=national', 'topics=nations'],
                exclude: ['world', 'peace', 'state', 'union', 'north', 'south']
            }
        };

        if (!categoryConfig[category]) {
            console.warn(`No configuration found for category: ${category}`);
            return staticWords[category] || [];
        }

        const config = categoryConfig[category];
        const apiWords = new Set();

        // Try each query in sequence
        for (const query of config.queries) {
            try {
                console.log(`Fetching words for ${category} with query: ${query}`);
                const response = await fetch(`${DATAMUSE_API_URL}?${query}&max=100&md=f`);
                
                if (!response.ok) {
                    console.warn(`Failed to fetch words for query: ${query}`);
                    continue;
                }

                const words = await response.json();
                console.log(`Received ${words.length} words from API for ${category}`);
                
                // Filter and add valid words to the set
                words
                    .filter(word => {
                        const wordStr = word.word.toUpperCase();
                        return word.word.length === 5 && 
                               !isCommonWord(wordStr) && 
                               !config.exclude.includes(word.word.toLowerCase());
                    })
                    .forEach(word => apiWords.add(word.word.toUpperCase()));
            } catch (error) {
                console.warn(`Error fetching words for query: ${query}`, error);
            }
        }

        const allWords = [...apiWords];
        console.log(`Found ${allWords.length} valid words for category ${category}`);

        // If no API words found, use static words as fallback
        if (allWords.length === 0) {
            console.log(`Using static words for category ${category}`);
            return staticWords[category] || [];
        }

        return allWords;
    } catch (error) {
        console.error('Error in getDictionaryWords:', error);
        // Return static words as fallback
        return staticWords[category] || [];
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
