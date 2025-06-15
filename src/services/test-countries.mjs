import { getDictionaryWords } from './dictionaryService.js';

async function testCountries() {
    console.log('Testing countries category...');
    try {
        const words = await getDictionaryWords('countries');
        console.log('Found countries:', words);
        console.log('Total number of countries:', words.length);
        
        // Verify all words are valid countries
        console.log('\nValidating results:');
        words.forEach(word => {
            console.log(`${word}: ${word.length} letters`);
            if (word.length !== 5) {
                console.error(`Warning: ${word} is not 5 letters long!`);
            }
        });
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testCountries();
