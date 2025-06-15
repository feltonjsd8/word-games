import { getDictionaryWords } from './dictionaryService';

async function testCountries() {
    console.log('Testing countries category...');
    try {
        const words = await getDictionaryWords('countries');
        console.log('Found countries:', words);
        console.log('Total number of countries:', words.length);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testCountries();
