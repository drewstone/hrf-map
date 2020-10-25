import SetupRegimes from './regimes';
import SetupSpeakers from './speakers';

export default (map, countries, speakers) => {
	SetupRegimes(map, countries)
	SetupSpeakers(map, speakers)
}
