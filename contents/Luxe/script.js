const hotels = [
	// ASIA (10)
	{
		id: "capella-bkk",
		title: "Capella Bangkok",
		subtitle: "Bangkok, Thailand",
		lat: 13.721,
		lng: 100.514,
		state: "TH",
		city: "Bangkok",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/capella-bkk/800/560.webp",
		href: "https://www.capellahotels.com/en/capella-bangkok",
		map: "https://maps.google.com/?q=Capella+Bangkok"
	},
	{
		id: "rosewood-hk",
		title: "Rosewood Hong Kong",
		subtitle: "Hong Kong, China",
		lat: 22.294,
		lng: 114.172,
		state: "HK",
		city: "Hong Kong",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/rosewood-hk/800/560.webp",
		href: "https://www.rosewoodhotels.com/en/hong-kong",
		map: "https://maps.google.com/?q=Rosewood+Hong+Kong"
	},
	{
		id: "upper-house",
		title: "The Upper House",
		subtitle: "Hong Kong, China",
		lat: 22.277,
		lng: 114.165,
		state: "HK",
		city: "Hong Kong",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/upper-house/800/560.webp",
		href: "https://www.thehousecollective.com/en/the-upper-house",
		map: "https://maps.google.com/?q=The+Upper+House+Hong+Kong"
	},
	{
		id: "raffles-sg",
		title: "Raffles Singapore",
		subtitle: "Singapore",
		lat: 1.294,
		lng: 103.853,
		state: "SG",
		city: "Singapore",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/raffles-sg/800/560.webp",
		href: "https://www.rafflessingapore.com.sg",
		map: "https://maps.google.com/?q=Raffles+Singapore"
	},
	{
		id: "mo-bkk",
		title: "Mandarin Oriental, Bangkok",
		subtitle: "Bangkok, Thailand",
		lat: 13.723,
		lng: 100.514,
		state: "TH",
		city: "Bangkok",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/mo-bkk/800/560.webp",
		href: "https://www.mandarinoriental.com/en/bangkok",
		map: "https://maps.google.com/?q=Mandarin+Oriental+Bangkok"
	},
	{
		id: "fs-bkk",
		title: "Four Seasons Bangkok at Chao Phraya River",
		subtitle: "Bangkok, Thailand",
		lat: 13.718,
		lng: 100.515,
		state: "TH",
		city: "Bangkok",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/fs-bkk/800/560.webp",
		href: "https://www.fourseasons.com/bangkok",
		map: "https://maps.google.com/?q=Four+Seasons+Bangkok"
	},
	{
		id: "siam-bkk",
		title: "The Siam",
		subtitle: "Bangkok, Thailand",
		lat: 13.774,
		lng: 100.508,
		state: "TH",
		city: "Bangkok",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/siam-bkk/800/560.webp",
		href: "https://www.thesiamhotel.com",
		map: "https://maps.google.com/?q=The+Siam+Bangkok"
	},
	{
		id: "aman-tokyo",
		title: "Aman Tokyo",
		subtitle: "Tokyo, Japan",
		lat: 35.687,
		lng: 139.769,
		state: "JP",
		city: "Tokyo",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/aman-tokyo/800/560.webp",
		href: "https://www.aman.com/resorts/aman-tokyo",
		map: "https://maps.google.com/?q=Aman+Tokyo"
	},
	{
		id: "bulgari-tokyo",
		title: "Bulgari Hotel Tokyo",
		subtitle: "Tokyo, Japan",
		lat: 35.681,
		lng: 139.767,
		state: "JP",
		city: "Tokyo",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/bulgari-tokyo/800/560.webp",
		href: "https://www.bulgarihotels.com/en_US/tokyo",
		map: "https://maps.google.com/?q=Bulgari+Hotel+Tokyo"
	},
	{
		id: "ph-kyoto",
		title: "Park Hyatt Kyoto",
		subtitle: "Kyoto, Japan",
		lat: 35.002,
		lng: 135.778,
		state: "JP",
		city: "Kyoto",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/ph-kyoto/800/560.webp",
		href: "https://www.hyatt.com/en-US/hotel/japan/park-hyatt-kyoto",
		map: "https://maps.google.com/?q=Park+Hyatt+Kyoto"
	},

	// EUROPE (10)
	{
		id: "passalacqua",
		title: "Passalacqua",
		subtitle: "Lake Como, Italy",
		lat: 45.973,
		lng: 9.169,
		state: "IT",
		city: "Como",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/passalacqua/800/560.webp",
		href: "https://www.passalacqua.it",
		map: "https://maps.google.com/?q=Passalacqua+Lake+Como"
	},
	{
		id: "cheval-paris",
		title: "Cheval Blanc Paris",
		subtitle: "Paris, France",
		lat: 48.857,
		lng: 2.342,
		state: "FR",
		city: "Paris",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/cheval-paris/800/560.webp",
		href: "https://www.chevalblanc.com/en/maison/paris",
		map: "https://maps.google.com/?q=Cheval+Blanc+Paris"
	},
	{
		id: "crillon",
		title: "Hôtel de Crillon, A Rosewood Hotel",
		subtitle: "Paris, France",
		lat: 48.868,
		lng: 2.321,
		state: "FR",
		city: "Paris",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/crillon/800/560.webp",
		href: "https://www.rosewoodhotels.com/en/hotel-de-crillon",
		map: "https://maps.google.com/?q=Hotel+de+Crillon+Paris"
	},
	{
		id: "claridges",
		title: "Claridge’s",
		subtitle: "London, United Kingdom",
		lat: 51.512,
		lng: -0.148,
		state: "GB",
		city: "London",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/claridges/800/560.webp",
		href: "https://www.claridges.co.uk",
		map: "https://maps.google.com/?q=Claridge%27s+London"
	},
	{
		id: "raffles-owo",
		title: "Raffles London at The OWO",
		subtitle: "London, United Kingdom",
		lat: 51.503,
		lng: -0.128,
		state: "GB",
		city: "London",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/raffles-owo/800/560.webp",
		href: "https://www.raffles.com/london",
		map: "https://maps.google.com/?q=Raffles+London+OWO"
	},
	{
		id: "fs-firenze",
		title: "Four Seasons Hotel Firenze",
		subtitle: "Florence, Italy",
		lat: 43.776,
		lng: 11.264,
		state: "IT",
		city: "Florence",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/fs-firenze/800/560.webp",
		href: "https://www.fourseasons.com/florence",
		map: "https://maps.google.com/?q=Four+Seasons+Florence"
	},
	{
		id: "fs-madrid",
		title: "Four Seasons Hotel Madrid",
		subtitle: "Madrid, Spain",
		lat: 40.417,
		lng: -3.703,
		state: "ES",
		city: "Madrid",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/fs-madrid/800/560.webp",
		href: "https://www.fourseasons.com/madrid",
		map: "https://maps.google.com/?q=Four+Seasons+Madrid"
	},
	{
		id: "eden-roc",
		title: "Hôtel du Cap-Eden-Roc",
		subtitle: "Antibes, France",
		lat: 43.549,
		lng: 7.123,
		state: "FR",
		city: "Antibes",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/eden-roc/800/560.webp",
		href: "https://www.oetkercollection.com/hotels/hotel-du-cap-eden-roc",
		map: "https://maps.google.com/?q=Hotel+du+Cap+Eden+Roc"
	},
	{
		id: "connaught",
		title: "The Connaught",
		subtitle: "London, United Kingdom",
		lat: 51.509,
		lng: -0.149,
		state: "GB",
		city: "London",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/connaught/800/560.webp",
		href: "https://www.the-connaught.co.uk",
		map: "https://maps.google.com/?q=The+Connaught+London"
	},
	{
		id: "aman-venice",
		title: "Aman Venice",
		subtitle: "Venice, Italy",
		lat: 45.434,
		lng: 12.333,
		state: "IT",
		city: "Venice",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/aman-venice/800/560.webp",
		href: "https://www.aman.com/hotels/aman-venice",
		map: "https://maps.google.com/?q=Aman+Venice"
	},

	// NORTH AMERICA (10)
	{
		id: "carlyle-ny",
		title: "The Carlyle, A Rosewood Hotel",
		subtitle: "New York, USA",
		lat: 40.774,
		lng: -73.963,
		state: "US",
		city: "New York",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/carlyle-ny/800/560.webp",
		href: "https://www.rosewoodhotels.com/en/the-carlyle-new-york",
		map: "https://maps.google.com/?q=The+Carlyle+New+York"
	},
	{
		id: "fs-surfclub",
		title: "Four Seasons Hotel at The Surf Club",
		subtitle: "Surfside, USA",
		lat: 25.878,
		lng: -80.122,
		state: "US",
		city: "Surfside",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/fs-surfclub/800/560.webp",
		href: "https://www.fourseasons.com/surfside",
		map: "https://maps.google.com/?q=Four+Seasons+Surfside"
	},
	{
		id: "aman-ny",
		title: "Aman New York",
		subtitle: "New York, USA",
		lat: 40.761,
		lng: -73.976,
		state: "US",
		city: "New York",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/aman-ny/800/560.webp",
		href: "https://www.aman.com/hotels/aman-new-york",
		map: "https://maps.google.com/?q=Aman+New+York"
	},
	{
		id: "peninsula-chi",
		title: "The Peninsula Chicago",
		subtitle: "Chicago, USA",
		lat: 41.896,
		lng: -87.624,
		state: "US",
		city: "Chicago",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/peninsula-chi/800/560.webp",
		href: "https://www.peninsula.com/en/chicago/5-star-luxury-hotel-downtown",
		map: "https://maps.google.com/?q=Peninsula+Chicago"
	},
	{
		id: "bel-air",
		title: "Hotel Bel-Air",
		subtitle: "Los Angeles, USA",
		lat: 34.088,
		lng: -118.448,
		state: "US",
		city: "Los Angeles",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/bel-air/800/560.webp",
		href: "https://www.dorchestercollection.com/en/los-angeles/hotel-bel-air",
		map: "https://maps.google.com/?q=Hotel+Bel-Air"
	},
	{
		id: "beverly-hills",
		title: "The Beverly Hills Hotel",
		subtitle: "Los Angeles, USA",
		lat: 34.081,
		lng: -118.413,
		state: "US",
		city: "Los Angeles",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/beverly-hills/800/560.webp",
		href:
			"https://www.dorchestercollection.com/en/los-angeles/the-beverly-hills-hotel",
		map: "https://maps.google.com/?q=The+Beverly+Hills+Hotel"
	},
	{
		id: "lil-dix",
		title: "Rosewood Little Dix Bay",
		subtitle: "Virgin Gorda, BVI",
		lat: 18.486,
		lng: -64.395,
		state: "VG",
		city: "Virgin Gorda",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/little-dix/800/560.webp",
		href: "https://www.rosewoodhotels.com/en/little-dix-bay-virgin-gorda",
		map: "https://maps.google.com/?q=Rosewood+Little+Dix+Bay"
	},
	{
		id: "edenrock-sb",
		title: "Eden Rock – St Barths",
		subtitle: "St. Jean, St. Barthélemy",
		lat: 17.903,
		lng: -62.844,
		state: "BL",
		city: "St. Jean",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/edenrock-sb/800/560.webp",
		href: "https://www.edenrockhotel.com",
		map: "https://maps.google.com/?q=Eden+Rock+St+Barths"
	},
	{
		id: "banff-springs",
		title: "Fairmont Banff Springs",
		subtitle: "Banff, Canada",
		lat: 51.167,
		lng: -115.565,
		state: "CA",
		city: "Banff",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/banff/800/560.webp",
		href: "https://www.fairmont.com/banff-springs",
		map: "https://maps.google.com/?q=Fairmont+Banff+Springs"
	},
	{
		id: "palmilla",
		title: "One&Only Palmilla",
		subtitle: "Los Cabos, Mexico",
		lat: 23.017,
		lng: -109.731,
		state: "MX",
		city: "San José del Cabo",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/palmilla/800/560.webp",
		href: "https://www.oneandonlyresorts.com/palmilla",
		map: "https://maps.google.com/?q=One%26Only+Palmilla"
	},

	// SOUTH AMERICA (10)
	{
		id: "rosewood-sp",
		title: "Rosewood São Paulo",
		subtitle: "São Paulo, Brazil",
		lat: -23.561,
		lng: -46.647,
		state: "BR",
		city: "São Paulo",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/rosewood-sp/800/560.webp",
		href: "https://www.rosewoodhotels.com/en/sao-paulo",
		map: "https://maps.google.com/?q=Rosewood+Sao+Paulo"
	},
	{
		id: "copacabana",
		title: "Belmond Copacabana Palace",
		subtitle: "Rio de Janeiro, Brazil",
		lat: -22.971,
		lng: -43.182,
		state: "BR",
		city: "Rio de Janeiro",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/copacabana/800/560.webp",
		href:
			"https://www.belmond.com/hotels/south-america/brazil/rio-de-janeiro/belmond-copacabana-palace",
		map: "https://maps.google.com/?q=Copacabana+Palace"
	},
	{
		id: "cataratas",
		title: "Belmond Hotel das Cataratas",
		subtitle: "Iguaçu, Brazil",
		lat: -25.695,
		lng: -54.437,
		state: "BR",
		city: "Foz do Iguaçu",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/cataratas/800/560.webp",
		href:
			"https://www.belmond.com/hotels/south-america/brazil/iguassu-falls/belmond-hotel-das-cataratas",
		map: "https://maps.google.com/?q=Belmond+Hotel+das+Cataratas"
	},
	{
		id: "faena-ba",
		title: "Faena Hotel Buenos Aires",
		subtitle: "Buenos Aires, Argentina",
		lat: -34.616,
		lng: -58.362,
		state: "AR",
		city: "Buenos Aires",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/faena-ba/800/560.webp",
		href: "https://www.faena.com/buenos-aires",
		map: "https://maps.google.com/?q=Faena+Hotel+Buenos+Aires"
	},
	{
		id: "alvear",
		title: "Alvear Palace Hotel",
		subtitle: "Buenos Aires, Argentina",
		lat: -34.589,
		lng: -58.391,
		state: "AR",
		city: "Buenos Aires",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/alvear/800/560.webp",
		href: "https://www.alvearpalace.com",
		map: "https://maps.google.com/?q=Alvear+Palace+Hotel"
	},
	{
		id: "explora-sv",
		title: "Explora Valle Sagrado",
		subtitle: "Urubamba, Peru",
		lat: -13.332,
		lng: -72.053,
		state: "PE",
		city: "Urubamba",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/explora-sv/800/560.webp",
		href: "https://www.explora.com/lodges/sacred-valley",
		map: "https://maps.google.com/?q=Explora+Valle+Sagrado"
	},
	{
		id: "tambo-inka",
		title: "Tambo del Inka, a Luxury Collection Resort & Spa",
		subtitle: "Urubamba, Peru",
		lat: -13.304,
		lng: -72.115,
		state: "PE",
		city: "Urubamba",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/tambo-inka/800/560.webp",
		href:
			"https://www.marriott.com/en-us/hotels/cuzlc-tambo-del-inka-a-luxury-collection-resort-and-spa-valle-sagrado",
		map: "https://maps.google.com/?q=Tambo+del+Inka"
	},
	{
		id: "del-parque",
		title: "Hotel del Parque",
		subtitle: "Guayaquil, Ecuador",
		lat: -2.164,
		lng: -79.886,
		state: "EC",
		city: "Guayaquil",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/del-parque/800/560.webp",
		href: "https://www.hoteldelparquehistorico.com",
		map: "https://maps.google.com/?q=Hotel+del+Parque+Guayaquil"
	},
	{
		id: "singular-stgo",
		title: "The Singular Santiago",
		subtitle: "Santiago, Chile",
		lat: -33.436,
		lng: -70.641,
		state: "CL",
		city: "Santiago",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/singular-stgo/800/560.webp",
		href: "https://www.thesingular.com/santiago",
		map: "https://maps.google.com/?q=The+Singular+Santiago"
	},
	{
		id: "casa-agustin",
		title: "Hotel Casa San Agustín",
		subtitle: "Cartagena, Colombia",
		lat: 10.425,
		lng: -75.548,
		state: "CO",
		city: "Cartagena",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/casa-agustin/800/560.webp",
		href: "https://www.hotelcasasanagustin.com",
		map: "https://maps.google.com/?q=Hotel+Casa+San+Agustin"
	},

	// AFRICA (10)
	{
		id: "mamounia",
		title: "La Mamounia",
		subtitle: "Marrakech, Morocco",
		lat: 31.624,
		lng: -7.989,
		state: "MA",
		city: "Marrakech",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/mamounia/800/560.webp",
		href: "https://www.mamounia.com",
		map: "https://maps.google.com/?q=La+Mamounia+Marrakech"
	},
	{
		id: "royal-mansour",
		title: "Royal Mansour Marrakech",
		subtitle: "Marrakech, Morocco",
		lat: 31.627,
		lng: -7.999,
		state: "MA",
		city: "Marrakech",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/royal-mansour/800/560.webp",
		href: "https://www.royalmansour.com",
		map: "https://maps.google.com/?q=Royal+Mansour+Marrakech"
	},
	{
		id: "silo",
		title: "The Silo Hotel",
		subtitle: "Cape Town, South Africa",
		lat: -33.907,
		lng: 18.423,
		state: "ZA",
		city: "Cape Town",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/silo/800/560.webp",
		href: "https://www.themagicevents.com/thesilohotel",
		map: "https://maps.google.com/?q=The+Silo+Hotel+Cape+Town"
	},
	{
		id: "singita-lebombo",
		title: "Singita Lebombo Lodge",
		subtitle: "Kruger National Park, South Africa",
		lat: -24.361,
		lng: 31.936,
		state: "ZA",
		city: "Kruger",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/singita-lebombo/800/560.webp",
		href: "https://singita.com/lodge/singita-lebombo-lodge",
		map: "https://maps.google.com/?q=Singita+Lebombo+Lodge"
	},
	{
		id: "oocpt",
		title: "One&Only Cape Town",
		subtitle: "Cape Town, South Africa",
		lat: -33.909,
		lng: 18.415,
		state: "ZA",
		city: "Cape Town",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/oocpt/800/560.webp",
		href: "https://www.oneandonlyresorts.com/cape-town",
		map: "https://maps.google.com/?q=One%26Only+Cape+Town"
	},
	{
		id: "mena-house",
		title: "Marriott Mena House, Cairo",
		subtitle: "Giza, Egypt",
		lat: 29.989,
		lng: 31.135,
		state: "EG",
		city: "Giza",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/mena-house/800/560.webp",
		href: "https://www.marriott.com/en-us/hotels/caimn-marriott-mena-house-cairo",
		map: "https://maps.google.com/?q=Marriott+Mena+House+Cairo"
	},
	{
		id: "andbeyond-ngorongoro",
		title: "&Beyond Ngorongoro Crater Lodge",
		subtitle: "Ngorongoro, Tanzania",
		lat: -3.163,
		lng: 35.587,
		state: "TZ",
		city: "Ngorongoro",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/ngorongoro/800/560.webp",
		href:
			"https://www.andbeyond.com/our-lodges/africa/tanzania/ngorongoro-conservation-area/andbeyond-ngorongoro-crater-lodge",
		map: "https://maps.google.com/?q=Ngorongoro+Crater+Lodge"
	},
	{
		id: "gorillas-nest",
		title: "One&Only Gorilla’s Nest",
		subtitle: "Volcanoes National Park, Rwanda",
		lat: -1.462,
		lng: 29.605,
		state: "RW",
		city: "Kinigi",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/gorillas-nest/800/560.webp",
		href: "https://www.oneandonlyresorts.com/gorillas-nest",
		map: "https://maps.google.com/?q=One%26Only+Gorilla%27s+Nest"
	},
	{
		id: "saxon",
		title: "Saxon Hotel, Villas & Spa",
		subtitle: "Johannesburg, South Africa",
		lat: -26.112,
		lng: 28.036,
		state: "ZA",
		city: "Johannesburg",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/saxon/800/560.webp",
		href: "https://www.saxon.co.za",
		map: "https://maps.google.com/?q=Saxon+Hotel+Johannesburg"
	},
	{
		id: "mount-kenya",
		title: "Fairmont Mount Kenya Safari Club",
		subtitle: "Nanyuki, Kenya",
		lat: 0.015,
		lng: 37.073,
		state: "KE",
		city: "Nanyuki",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/mount-kenya/800/560.webp",
		href: "https://www.fairmont.com/mount-kenya",
		map: "https://maps.google.com/?q=Fairmont+Mount+Kenya+Safari+Club"
	},

	// OCEANIA (10)
	{
		id: "calile",
		title: "The Calile Hotel",
		subtitle: "Brisbane, Australia",
		lat: -27.458,
		lng: 153.035,
		state: "AU",
		city: "Brisbane",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/calile/800/560.webp",
		href: "https://thecalilehotel.com",
		map: "https://maps.google.com/?q=The+Calile+Hotel"
	},
	{
		id: "qualia",
		title: "qualia",
		subtitle: "Hamilton Island, Australia",
		lat: -20.066,
		lng: 148.885,
		state: "AU",
		city: "Hamilton Island",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/qualia/800/560.webp",
		href: "https://www.qualia.com.au",
		map: "https://maps.google.com/?q=qualia+Hamilton+Island"
	},
	{
		id: "saffire",
		title: "Saffire Freycinet",
		subtitle: "Tasmania, Australia",
		lat: -42.121,
		lng: 148.293,
		state: "AU",
		city: "Coles Bay",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/saffire/800/560.webp",
		href: "https://www.saffire-freycinet.com.au",
		map: "https://maps.google.com/?q=Saffire+Freycinet"
	},
	{
		id: "tasman",
		title: "The Tasman, a Luxury Collection Hotel",
		subtitle: "Hobart, Australia",
		lat: -42.884,
		lng: 147.332,
		state: "AU",
		city: "Hobart",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/tasman/800/560.webp",
		href: "https://www.thetasmanhobart.com",
		map: "https://maps.google.com/?q=The+Tasman+Hobart"
	},
	{
		id: "ph-sydney",
		title: "Park Hyatt Sydney",
		subtitle: "Sydney, Australia",
		lat: -33.855,
		lng: 151.21,
		state: "AU",
		city: "Sydney",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/ph-sydney/800/560.webp",
		href: "https://www.hyatt.com/en-US/hotel/australia/park-hyatt-sydney",
		map: "https://maps.google.com/?q=Park+Hyatt+Sydney"
	},
	{
		id: "langham-melb",
		title: "The Langham, Melbourne",
		subtitle: "Melbourne, Australia",
		lat: -37.821,
		lng: 144.967,
		state: "AU",
		city: "Melbourne",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/langham-melb/800/560.webp",
		href: "https://www.langhamhotels.com/en/the-langham/melbourne",
		map: "https://maps.google.com/?q=The+Langham+Melbourne"
	},
	{
		id: "huka",
		title: "Huka Lodge",
		subtitle: "Taupō, New Zealand",
		lat: -38.64,
		lng: 176.089,
		state: "NZ",
		city: "Taupō",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/huka/800/560.webp",
		href: "https://www.robertsonlodges.com/the-lodges/huka-lodge",
		map: "https://maps.google.com/?q=Huka+Lodge"
	},
	{
		id: "kauri-cliffs",
		title: "The Lodge at Kauri Cliffs",
		subtitle: "Matauri Bay, New Zealand",
		lat: -35.029,
		lng: 173.906,
		state: "NZ",
		city: "Matauri Bay",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/kauri-cliffs/800/560.webp",
		href: "https://www.robertsonlodges.com/the-lodges/kauri-cliffs",
		map: "https://maps.google.com/?q=Kauri+Cliffs+Lodge"
	},
	{
		id: "brando",
		title: "The Brando",
		subtitle: "Tetiaroa, French Polynesia",
		lat: -17.017,
		lng: -149.583,
		state: "PF",
		city: "Tetiaroa",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/brando/800/560.webp",
		href: "https://thebrando.com",
		map: "https://maps.google.com/?q=The+Brando+Tetiaroa"
	},
	{
		id: "kokomo",
		title: "Kokomo Private Island Fiji",
		subtitle: "Kadavu, Fiji",
		lat: -18.78,
		lng: 178.466,
		state: "FJ",
		city: "Kadavu",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/kokomo/800/560.webp",
		href: "https://www.kokomoislandfiji.com",
		map: "https://maps.google.com/?q=Kokomo+Private+Island+Fiji"
	},
	{
		id: "four-seasons-moscow",
		title: "Four Seasons Hotel Moscow",
		subtitle: "Moscow, Russia",
		lat: 55.7558,
		lng: 37.6173,
		state: "RU",
		city: "Moscow",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/fs-moscow/800/560.webp",
		href: "https://www.fourseasons.com/moscow",
		map: "https://maps.google.com/?q=Four+Seasons+Moscow"
	},

	{
		id: "ritz-moscow",
		title: "The Ritz-Carlton, Moscow",
		subtitle: "Moscow, Russia",
		lat: 55.759,
		lng: 37.621,
		state: "RU",
		city: "Moscow",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/ritz-moscow/800/560.webp",
		href: "https://www.ritzcarlton.com/en/hotels/moscow",
		map: "https://maps.google.com/?q=Ritz-Carlton+Moscow"
	},

	{
		id: "belmond-stpetersburg",
		title: "Belmond Grand Hotel Europe",
		subtitle: "St. Petersburg, Russia",
		lat: 59.935,
		lng: 30.327,
		state: "RU",
		city: "St. Petersburg",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/belmond-stpetersburg/800/560.webp",
		href:
			"https://www.belmond.com/hotels/europe/russia/st-petersburg/belmond-grand-hotel-europe",
		map: "https://maps.google.com/?q=Belmond+Grand+Hotel+Europe+St+Petersburg"
	}, // RUSSIA (add under Europe)
	{
		id: "four-seasons-moscow",
		title: "Four Seasons Hotel Moscow",
		subtitle: "Moscow, Russia",
		lat: 55.7558,
		lng: 37.6173,
		state: "RU",
		city: "Moscow",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/fs-moscow/800/560.webp",
		href: "https://www.fourseasons.com/moscow",
		map: "https://maps.google.com/?q=Four+Seasons+Hotel+Moscow"
	},

	{
		id: "ritz-moscow",
		title: "The Ritz-Carlton, Moscow",
		subtitle: "Moscow, Russia",
		lat: 55.759,
		lng: 37.621,
		state: "RU",
		city: "Moscow",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/ritz-moscow/800/560.webp",
		href: "https://www.ritzcarlton.com/en/hotels/moscow",
		map: "https://maps.google.com/?q=Ritz-Carlton+Moscow"
	},

	{
		id: "belmond-stpetersburg",
		title: "Belmond Grand Hotel Europe",
		subtitle: "St. Petersburg, Russia",
		lat: 59.935,
		lng: 30.327,
		state: "RU",
		city: "St. Petersburg",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/belmond-stpetersburg/800/560.webp",
		href:
			"https://www.belmond.com/hotels/europe/russia/st-petersburg/belmond-grand-hotel-europe",
		map: "https://maps.google.com/?q=Belmond+Grand+Hotel+Europe+St+Petersburg"
	}, // CHINA
	{
		id: "peninsula-shanghai",
		title: "The Peninsula Shanghai",
		subtitle: "Shanghai, China",
		lat: 31.24,
		lng: 121.49,
		state: "CN",
		city: "Shanghai",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/peninsula-sh/800/560.webp",
		href: "https://www.peninsula.com/en/shanghai/5-star-luxury-hotel-bund",
		map: "https://maps.google.com/?q=Peninsula+Shanghai"
	},

	{
		id: "parkhyatt-beijing",
		title: "Park Hyatt Beijing",
		subtitle: "Beijing, China",
		lat: 39.909,
		lng: 116.456,
		state: "CN",
		city: "Beijing",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/ph-beijing/800/560.webp",
		href: "https://www.hyatt.com/en-US/hotel/china/park-hyatt-beijing",
		map: "https://maps.google.com/?q=Park+Hyatt+Beijing"
	},

	// MONGOLIA
	{
		id: "shangri-la-ulaanbaatar",
		title: "Shangri-La Ulaanbaatar",
		subtitle: "Ulaanbaatar, Mongolia",
		lat: 47.919,
		lng: 106.917,
		state: "MN",
		city: "Ulaanbaatar",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/shangrila-mn/800/560.webp",
		href: "https://www.shangri-la.com/ulaanbaatar/shangrila",
		map: "https://maps.google.com/?q=Shangri-La+Ulaanbaatar"
	},

	{
		id: "blue-sky-hotel",
		title: "Blue Sky Hotel & Tower",
		subtitle: "Ulaanbaatar, Mongolia",
		lat: 47.918,
		lng: 106.918,
		state: "MN",
		city: "Ulaanbaatar",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/bluesky-mn/800/560.webp",
		href: "https://blueskyhotel.mn",
		map: "https://maps.google.com/?q=Blue+Sky+Hotel+Ulaanbaatar"
	},

	// IRAQ
	{
		id: "babylon-rotana",
		title: "Babylon Rotana Baghdad",
		subtitle: "Baghdad, Iraq",
		lat: 33.293,
		lng: 44.381,
		state: "IQ",
		city: "Baghdad",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/babylon-iq/800/560.webp",
		href:
			"https://www.rotana.com/rotanahotelandresorts/iraq/baghdad/babylonrotana",
		map: "https://maps.google.com/?q=Babylon+Rotana+Baghdad"
	},

	{
		id: "erbil-rota",
		title: "Erbil Rotana",
		subtitle: "Erbil, Iraq (Kurdistan Region)",
		lat: 36.205,
		lng: 44.019,
		state: "IQ",
		city: "Erbil",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/erbil-iq/800/560.webp",
		href: "https://www.rotana.com/rotanahotelandresorts/iraq/erbil/erbilrotana",
		map: "https://maps.google.com/?q=Erbil+Rotana"
	},

	// ===== ASIA (10) =====
	{
		id: "capella-bkk",
		title: "Capella Bangkok",
		subtitle: "Bangkok, Thailand",
		lat: 13.721,
		lng: 100.514,
		state: "TH",
		city: "Bangkok",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/capella-bkk/800/560.webp",
		href: "https%3A%2F%2Fwww.capellahotels.com%2Fen%2Fcapella-bangkok",
		map: "https://maps.google.com/?q=Capella+Bangkok"
	},
	{
		id: "peninsula-shanghai",
		title: "The Peninsula Shanghai",
		subtitle: "Shanghai, China",
		lat: 31.24,
		lng: 121.49,
		state: "CN",
		city: "Shanghai",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/peninsula-sh/800/560.webp",
		href:
			"https%3A%2F%2Fwww.peninsula.com%2Fen%2Fshanghai%2F5-star-luxury-hotel-bund",
		map: "https://maps.google.com/?q=Peninsula+Shanghai"
	},
	{
		id: "aman-tokyo",
		title: "Aman Tokyo",
		subtitle: "Tokyo, Japan",
		lat: 35.687,
		lng: 139.769,
		state: "JP",
		city: "Tokyo",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/amantokyo/800/560.webp",
		href: "https%3A%2F%2Fwww.aman.com%2Fresorts%2Faman-tokyo",
		map: "https://maps.google.com/?q=Aman+Tokyo"
	},
	{
		id: "shangrila-ulaanbaatar",
		title: "Shangri-La Ulaanbaatar",
		subtitle: "Ulaanbaatar, Mongolia",
		lat: 47.919,
		lng: 106.917,
		state: "MN",
		city: "Ulaanbaatar",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/shangrila-mn/800/560.webp",
		href: "https%3A%2F%2Fwww.shangri-la.com%2Fulaanbaatar%2Fshangrila",
		map: "https://maps.google.com/?q=Shangri-La+Ulaanbaatar"
	},
	{
		id: "babylon-rotana",
		title: "Babylon Rotana Baghdad",
		subtitle: "Baghdad, Iraq",
		lat: 33.293,
		lng: 44.381,
		state: "IQ",
		city: "Baghdad",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/babylon-iq/800/560.webp",
		href:
			"https%3A%2F%2Fwww.rotana.com%2Frotanahotelandresorts%2Firaq%2Fbaghdad%2Fbabylonrotana",
		map: "https://maps.google.com/?q=Babylon+Rotana+Baghdad"
	},
	{
		id: "espinas-tehran",
		title: "Espinas Palace Hotel",
		subtitle: "Tehran, Iran",
		lat: 35.784,
		lng: 51.352,
		state: "IR",
		city: "Tehran",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/espinas/800/560.webp",
		href: "https%3A%2F%2Fwww.espinashotels.com%2Fespinas-palace-hotel",
		map: "https://maps.google.com/?q=Espinas+Palace+Tehran"
	},
	{
		id: "four-seasons-damascus",
		title: "Four Seasons Hotel Damascus",
		subtitle: "Damascus, Syria",
		lat: 33.515,
		lng: 36.291,
		state: "SY",
		city: "Damascus",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/fs-damascus/800/560.webp",
		href: "https%3A%2F%2Fwww.fourseasons.com%2Fdamascus",
		map: "https://maps.google.com/?q=Four+Seasons+Hotel+Damascus"
	},
	{
		id: "burj-alarab",
		title: "Burj Al Arab Jumeirah",
		subtitle: "Dubai, UAE",
		lat: 25.141,
		lng: 55.185,
		state: "AE",
		city: "Dubai",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/burjalarab/800/560.webp",
		href:
			"https%3A%2F%2Fwww.jumeirah.com%2Fen%2Fstay%2Fdubai%2Fburj-al-arab-jumeirah",
		map: "https://maps.google.com/?q=Burj+Al+Arab"
	},
	{
		id: "taj-mumbai",
		title: "The Taj Mahal Palace",
		subtitle: "Mumbai, India",
		lat: 18.922,
		lng: 72.833,
		state: "IN",
		city: "Mumbai",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/tajmumbai/800/560.webp",
		href:
			"https%3A%2F%2Fwww.tajhotels.com%2Fen-in%2Ftaj%2Ftaj-mahal-palace-mumbai",
		map: "https://maps.google.com/?q=Taj+Mahal+Palace+Mumbai"
	},
	{
		id: "raffles-sg",
		title: "Raffles Singapore",
		subtitle: "Singapore",
		lat: 1.294,
		lng: 103.853,
		state: "SG",
		city: "Singapore",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/raffles/800/560.webp",
		href: "https%3A%2F%2Fwww.rafflessingapore.com.sg",
		map: "https://maps.google.com/?q=Raffles+Singapore"
	},

	// ===== EUROPE (10) =====
	{
		id: "passalacqua",
		title: "Passalacqua",
		subtitle: "Lake Como, Italy",
		lat: 45.973,
		lng: 9.169,
		state: "IT",
		city: "Como",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/passalacqua/800/560.webp",
		href: "https%3A%2F%2Fwww.passalacqua.it",
		map: "https://maps.google.com/?q=Passalacqua+Lake+Como"
	},
	{
		id: "cheval-paris",
		title: "Cheval Blanc Paris",
		subtitle: "Paris, France",
		lat: 48.857,
		lng: 2.342,
		state: "FR",
		city: "Paris",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/chevalparis/800/560.webp",
		href: "https%3A%2F%2Fwww.chevalblanc.com%2Fen%2Fmaison%2Fparis",
		map: "https://maps.google.com/?q=Cheval+Blanc+Paris"
	},
	{
		id: "claridges",
		title: "Claridge’s",
		subtitle: "London, United Kingdom",
		lat: 51.512,
		lng: -0.148,
		state: "GB",
		city: "London",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/claridges/800/560.webp",
		href: "https%3A%2F%2Fwww.claridges.co.uk",
		map: "https://maps.google.com/?q=Claridge%27s+London"
	},
	{
		id: "aman-venice",
		title: "Aman Venice",
		subtitle: "Venice, Italy",
		lat: 45.434,
		lng: 12.333,
		state: "IT",
		city: "Venice",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/amanvenice/800/560.webp",
		href: "https%3A%2F%2Fwww.aman.com%2Fhotels%2Faman-venice",
		map: "https://maps.google.com/?q=Aman+Venice"
	},
	{
		id: "fs-moscow",
		title: "Four Seasons Hotel Moscow",
		subtitle: "Moscow, Russia",
		lat: 55.7558,
		lng: 37.6173,
		state: "RU",
		city: "Moscow",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/fs-moscow/800/560.webp",
		href: "https%3A%2F%2Fwww.fourseasons.com%2Fmoscow",
		map: "https://maps.google.com/?q=Four+Seasons+Hotel+Moscow"
	},
	{
		id: "belmond-europe-spb",
		title: "Belmond Grand Hotel Europe",
		subtitle: "St. Petersburg, Russia",
		lat: 59.935,
		lng: 30.327,
		state: "RU",
		city: "St. Petersburg",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/grandhoteleurope/800/560.webp",
		href:
			"https%3A%2F%2Fwww.belmond.com%2Fhotels%2Feurope%2Frussia%2Fst-petersburg%2Fbelmond-grand-hotel-europe",
		map: "https://maps.google.com/?q=Grand+Hotel+Europe+St+Petersburg"
	},
	{
		id: "crillon",
		title: "Hôtel de Crillon, A Rosewood Hotel",
		subtitle: "Paris, France",
		lat: 48.868,
		lng: 2.321,
		state: "FR",
		city: "Paris",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/crillon/800/560.webp",
		href: "https%3A%2F%2Fwww.rosewoodhotels.com%2Fen%2Fhotel-de-crillon",
		map: "https://maps.google.com/?q=Hotel+de+Crillon+Paris"
	},
	{
		id: "raffles-owo",
		title: "Raffles London at The OWO",
		subtitle: "London, United Kingdom",
		lat: 51.503,
		lng: -0.128,
		state: "GB",
		city: "London",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/raffles-owo/800/560.webp",
		href: "https%3A%2F%2Fwww.raffles.com%2Flondon",
		map: "https://maps.google.com/?q=Raffles+London+OWO"
	},
	{
		id: "sacher-vienna",
		title: "Hotel Sacher Wien",
		subtitle: "Vienna, Austria",
		lat: 48.204,
		lng: 16.37,
		state: "AT",
		city: "Vienna",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/sacher/800/560.webp",
		href: "https%3A%2F%2Fwww.sacher.com%2Fen%2Fhotel-sacher-vienna",
		map: "https://maps.google.com/?q=Hotel+Sacher+Vienna"
	},
	{
		id: "badrutts",
		title: "Badrutt’s Palace Hotel",
		subtitle: "St. Moritz, Switzerland",
		lat: 46.498,
		lng: 9.843,
		state: "CH",
		city: "St. Moritz",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/badrutts/800/560.webp",
		href: "https%3A%2F%2Fbadruttspalace.com",
		map: "https://maps.google.com/?q=Badrutt%27s+Palace+Hotel"
	},

	// ===== NORTH AMERICA (10) =====
	{
		id: "carlyle-ny",
		title: "The Carlyle, A Rosewood Hotel",
		subtitle: "New York, USA",
		lat: 40.774,
		lng: -73.963,
		state: "US",
		city: "New York",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/carlyle/800/560.webp",
		href: "https%3A%2F%2Fwww.rosewoodhotels.com%2Fen%2Fthe-carlyle-new-york",
		map: "https://maps.google.com/?q=The+Carlyle+New+York"
	},
	{
		id: "aman-ny",
		title: "Aman New York",
		subtitle: "New York, USA",
		lat: 40.761,
		lng: -73.976,
		state: "US",
		city: "New York",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/amanny/800/560.webp",
		href: "https%3A%2F%2Fwww.aman.com%2Fhotels%2Faman-new-york",
		map: "https://maps.google.com/?q=Aman+New+York"
	},
	{
		id: "fs-surfclub",
		title: "Four Seasons Hotel at The Surf Club",
		subtitle: "Surfside, USA",
		lat: 25.878,
		lng: -80.122,
		state: "US",
		city: "Surfside",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/surfclub/800/560.webp",
		href: "https%3A%2F%2Fwww.fourseasons.com%2Fsurfside",
		map: "https://maps.google.com/?q=Four+Seasons+Surfside"
	},
	{
		id: "bel-air",
		title: "Hotel Bel-Air",
		subtitle: "Los Angeles, USA",
		lat: 34.088,
		lng: -118.448,
		state: "US",
		city: "Los Angeles",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/belair/800/560.webp",
		href:
			"https%3A%2F%2Fwww.dorchestercollection.com%2Fen%2Flos-angeles%2Fhotel-bel-air",
		map: "https://maps.google.com/?q=Hotel+Bel-Air"
	},
	{
		id: "beverly-hills",
		title: "The Beverly Hills Hotel",
		subtitle: "Los Angeles, USA",
		lat: 34.081,
		lng: -118.413,
		state: "US",
		city: "Los Angeles",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/bhh/800/560.webp",
		href:
			"https%3A%2F%2Fwww.dorchestercollection.com%2Fen%2Flos-angeles%2Fthe-beverly-hills-hotel",
		map: "https://maps.google.com/?q=The+Beverly+Hills+Hotel"
	},
	{
		id: "banff-springs",
		title: "Fairmont Banff Springs",
		subtitle: "Banff, Canada",
		lat: 51.167,
		lng: -115.565,
		state: "CA",
		city: "Banff",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/banff/800/560.webp",
		href: "https%3A%2F%2Fwww.fairmont.com%2Fbanff-springs",
		map: "https://maps.google.com/?q=Fairmont+Banff+Springs"
	},
	{
		id: "nacional-cuba",
		title: "Hotel Nacional de Cuba",
		subtitle: "Havana, Cuba",
		lat: 23.142,
		lng: -82.38,
		state: "CU",
		city: "Havana",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/nacionalcuba/800/560.webp",
		href: "https%3A%2F%2Fwww.hotelnacionaldecuba.com",
		map: "https://maps.google.com/?q=Hotel+Nacional+de+Cuba"
	},
	{
		id: "edenrock-stbarths",
		title: "Eden Rock – St Barths",
		subtitle: "St. Jean, St. Barthélemy",
		lat: 17.903,
		lng: -62.844,
		state: "BL",
		city: "St. Jean",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/edenrock/800/560.webp",
		href: "https%3A%2F%2Fwww.edenrockhotel.com",
		map: "https://maps.google.com/?q=Eden+Rock+St+Barths"
	},
	{
		id: "little-dix",
		title: "Rosewood Little Dix Bay",
		subtitle: "Virgin Gorda, BVI",
		lat: 18.486,
		lng: -64.395,
		state: "VG",
		city: "Virgin Gorda",
		category: "Resort",
		status: "Open",
		img: "https://picsum.photos/seed/littledix/800/560.webp",
		href:
			"https%3A%2F%2Fwww.rosewoodhotels.com%2Fen%2Flittle-dix-bay-virgin-gorda",
		map: "https://maps.google.com/?q=Rosewood+Little+Dix+Bay"
	},
	{
		id: "palmilla",
		title: "One&Only Palmilla",
		subtitle: "Los Cabos, Mexico",
		lat: 23.017,
		lng: -109.731,
		state: "MX",
		city: "San José del Cabo",
		category: "Resort",
		status: "Open",
		img: "https://picsum.photos/seed/palmilla/800/560.webp",
		href: "https%3A%2F%2Fwww.oneandonlyresorts.com%2Fpalmilla",
		map: "https://maps.google.com/?q=One%26Only+Palmilla"
	},

	// ===== SOUTH AMERICA (10) =====
	{
		id: "rosewood-sp",
		title: "Rosewood São Paulo",
		subtitle: "São Paulo, Brazil",
		lat: -23.561,
		lng: -46.647,
		state: "BR",
		city: "São Paulo",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/rosewoodsp/800/560.webp",
		href: "https%3A%2F%2Fwww.rosewoodhotels.com%2Fen%2Fsao-paulo",
		map: "https://maps.google.com/?q=Rosewood+Sao+Paulo"
	},
	{
		id: "copacabana",
		title: "Belmond Copacabana Palace",
		subtitle: "Rio de Janeiro, Brazil",
		lat: -22.971,
		lng: -43.182,
		state: "BR",
		city: "Rio de Janeiro",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/copacabana/800/560.webp",
		href:
			"https%3A%2F%2Fwww.belmond.com%2Fhotels%2Fsouth-america%2Fbrazil%2Frio-de-janeiro%2Fbelmond-copacabana-palace",
		map: "https://maps.google.com/?q=Copacabana+Palace"
	},
	{
		id: "cataratas",
		title: "Belmond Hotel das Cataratas",
		subtitle: "Foz do Iguaçu, Brazil",
		lat: -25.695,
		lng: -54.437,
		state: "BR",
		city: "Foz do Iguaçu",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/cataratas/800/560.webp",
		href:
			"https%3A%2F%2Fwww.belmond.com%2Fhotels%2Fsouth-america%2Fbrazil%2Figuassu-falls%2Fbelmond-hotel-das-cataratas",
		map: "https://maps.google.com/?q=Belmond+Hotel+das+Cataratas"
	},
	{
		id: "faena-ba",
		title: "Faena Hotel Buenos Aires",
		subtitle: "Buenos Aires, Argentina",
		lat: -34.616,
		lng: -58.362,
		state: "AR",
		city: "Buenos Aires",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/faenaba/800/560.webp",
		href: "https%3A%2F%2Fwww.faena.com%2Fbuenos-aires",
		map: "https://maps.google.com/?q=Faena+Hotel+Buenos+Aires"
	},
	{
		id: "alvear",
		title: "Alvear Palace Hotel",
		subtitle: "Buenos Aires, Argentina",
		lat: -34.589,
		lng: -58.391,
		state: "AR",
		city: "Buenos Aires",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/alvear/800/560.webp",
		href: "https%3A%2F%2Fwww.alvearpalace.com",
		map: "https://maps.google.com/?q=Alvear+Palace+Hotel"
	},
	{
		id: "explora-sv",
		title: "Explora Valle Sagrado",
		subtitle: "Urubamba, Peru",
		lat: -13.332,
		lng: -72.053,
		state: "PE",
		city: "Urubamba",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/explorasv/800/560.webp",
		href: "https%3A%2F%2Fwww.explora.com%2Flodges%2Fsacred-valley",
		map: "https://maps.google.com/?q=Explora+Valle+Sagrado"
	},
	{
		id: "tambo-inka",
		title: "Tambo del Inka, a Luxury Collection Resort & Spa",
		subtitle: "Urubamba, Peru",
		lat: -13.304,
		lng: -72.115,
		state: "PE",
		city: "Urubamba",
		category: "Resort",
		status: "Open",
		img: "https://picsum.photos/seed/tamboinka/800/560.webp",
		href:
			"https%3A%2F%2Fwww.marriott.com%2Fen-us%2Fhotels%2Fcuzlc-tambo-del-inka-a-luxury-collection-resort-and-spa-valle-sagrado",
		map: "https://maps.google.com/?q=Tambo+del+Inka"
	},
	{
		id: "del-parque",
		title: "Hotel del Parque",
		subtitle: "Guayaquil, Ecuador",
		lat: -2.164,
		lng: -79.886,
		state: "EC",
		city: "Guayaquil",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/delparque/800/560.webp",
		href: "https%3A%2F%2Fwww.hoteldelparquehistorico.com",
		map: "https://maps.google.com/?q=Hotel+del+Parque+Guayaquil"
	},
	{
		id: "singular-stgo",
		title: "The Singular Santiago",
		subtitle: "Santiago, Chile",
		lat: -33.436,
		lng: -70.641,
		state: "CL",
		city: "Santiago",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/singularsantiago/800/560.webp",
		href: "https%3A%2F%2Fwww.thesingular.com%2Fsantiago",
		map: "https://maps.google.com/?q=The+Singular+Santiago"
	},
	{
		id: "casa-agustin",
		title: "Hotel Casa San Agustín",
		subtitle: "Cartagena, Colombia",
		lat: 10.425,
		lng: -75.548,
		state: "CO",
		city: "Cartagena",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/casasanagustin/800/560.webp",
		href: "https%3A%2F%2Fwww.hotelcasasanagustin.com",
		map: "https://maps.google.com/?q=Hotel+Casa+San+Agustin"
	},

	// ===== AFRICA (10) =====
	{
		id: "mamounia",
		title: "La Mamounia",
		subtitle: "Marrakech, Morocco",
		lat: 31.624,
		lng: -7.989,
		state: "MA",
		city: "Marrakech",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/mamounia/800/560.webp",
		href: "https%3A%2F%2Fwww.mamounia.com",
		map: "https://maps.google.com/?q=La+Mamounia+Marrakech"
	},
	{
		id: "royal-mansour",
		title: "Royal Mansour Marrakech",
		subtitle: "Marrakech, Morocco",
		lat: 31.627,
		lng: -7.999,
		state: "MA",
		city: "Marrakech",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/royalmansour/800/560.webp",
		href: "https%3A%2F%2Fwww.royalmansour.com",
		map: "https://maps.google.com/?q=Royal+Mansour+Marrakech"
	},
	{
		id: "silo",
		title: "The Silo Hotel",
		subtitle: "Cape Town, South Africa",
		lat: -33.907,
		lng: 18.423,
		state: "ZA",
		city: "Cape Town",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/silo/800/560.webp",
		href: "https%3A%2F%2Fwww.theroyalportfolio.com%2Fthe-silo",
		map: "https://maps.google.com/?q=The+Silo+Hotel+Cape+Town"
	},
	{
		id: "singita-lebombo",
		title: "Singita Lebombo Lodge",
		subtitle: "Kruger National Park, South Africa",
		lat: -24.361,
		lng: 31.936,
		state: "ZA",
		city: "Kruger",
		category: "Lodge",
		status: "Open",
		img: "https://picsum.photos/seed/lebombo/800/560.webp",
		href: "https%3A%2F%2Fsingita.com%2Flodge%2Fsingita-lebombo-lodge",
		map: "https://maps.google.com/?q=Singita+Lebombo+Lodge"
	},
	{
		id: "oo-gorillas",
		title: "One&Only Gorilla’s Nest",
		subtitle: "Volcanoes NP, Rwanda",
		lat: -1.462,
		lng: 29.605,
		state: "RW",
		city: "Kinigi",
		category: "Resort",
		status: "Open",
		img: "https://picsum.photos/seed/gorillasnest/800/560.webp",
		href: "https%3A%2F%2Fwww.oneandonlyresorts.com%2Fgorillas-nest",
		map: "https://maps.google.com/?q=One%26Only+Gorilla%27s+Nest"
	},
	{
		id: "mena-house",
		title: "Marriott Mena House, Cairo",
		subtitle: "Giza, Egypt",
		lat: 29.989,
		lng: 31.135,
		state: "EG",
		city: "Giza",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/menahouse/800/560.webp",
		href:
			"https%3A%2F%2Fwww.marriott.com%2Fen-us%2Fhotels%2Fcaimn-marriott-mena-house-cairo",
		map: "https://maps.google.com/?q=Marriott+Mena+House+Cairo"
	},
	{
		id: "royal-livingstone",
		title: "Royal Livingstone Victoria Falls",
		subtitle: "Livingstone, Zambia",
		lat: -17.925,
		lng: 25.857,
		state: "ZM",
		city: "Livingstone",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/royallivingstone/800/560.webp",
		href: "https%3A%2F%2Fwww.anantara.com%2Fen%2Froms-royal-livingstone",
		map: "https://maps.google.com/?q=Royal+Livingstone+Hotel"
	},
	{
		id: "sossusvlei",
		title: "&Beyond Sossusvlei Desert Lodge",
		subtitle: "NamibRand, Namibia",
		lat: -24.732,
		lng: 15.776,
		state: "NA",
		city: "NamibRand",
		category: "Lodge",
		status: "Open",
		img: "https://picsum.photos/seed/sossusvlei/800/560.webp",
		href:
			"https%3A%2F%2Fwww.andbeyond.com%2Four-lodges%2Fafrica%2Fnamibia%2Fnamib-desert%2Fandbeyond-sossusvlei-desert-lodge",
		map: "https://maps.google.com/?q=Sossusvlei+Desert+Lodge"
	},
	{
		id: "benguerra",
		title: "&Beyond Benguerra Island",
		subtitle: "Bazaruto Archipelago, Mozambique",
		lat: -21.852,
		lng: 35.438,
		state: "MZ",
		city: "Benguerra",
		category: "Lodge",
		status: "Open",
		img: "https://picsum.photos/seed/benguerra/800/560.webp",
		href:
			"https%3A%2F%2Fwww.andbeyond.com%2Four-lodges%2Fafrica%2Fmozambique%2Fbazaruto-archipelago%2Fandbeyond-benguerra-island",
		map: "https://maps.google.com/?q=Benguerra+Island"
	},
	{
		id: "saxon",
		title: "Saxon Hotel, Villas & Spa",
		subtitle: "Johannesburg, South Africa",
		lat: -26.112,
		lng: 28.036,
		state: "ZA",
		city: "Johannesburg",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/saxon/800/560.webp",
		href: "https%3A%2F%2Fwww.saxon.co.za",
		map: "https://maps.google.com/?q=Saxon+Hotel+Johannesburg"
	},

	// ===== OCEANIA (10) =====
	{
		id: "calile",
		title: "The Calile Hotel",
		subtitle: "Brisbane, Australia",
		lat: -27.458,
		lng: 153.035,
		state: "AU",
		city: "Brisbane",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/calile/800/560.webp",
		href: "https%3A%2F%2Fthecalilehotel.com",
		map: "https://maps.google.com/?q=The+Calile+Hotel"
	},
	{
		id: "qualia",
		title: "qualia",
		subtitle: "Hamilton Island, Australia",
		lat: -20.066,
		lng: 148.885,
		state: "AU",
		city: "Hamilton Island",
		category: "Resort",
		status: "Open",
		img: "https://picsum.photos/seed/qualia/800/560.webp",
		href: "https%3A%2F%2Fwww.qualia.com.au",
		map: "https://maps.google.com/?q=qualia+Hamilton+Island"
	},
	{
		id: "saffire",
		title: "Saffire Freycinet",
		subtitle: "Coles Bay, Tasmania",
		lat: -42.121,
		lng: 148.293,
		state: "AU",
		city: "Coles Bay",
		category: "Resort",
		status: "Open",
		img: "https://picsum.photos/seed/saffire/800/560.webp",
		href: "https%3A%2F%2Fwww.saffire-freycinet.com.au",
		map: "https://maps.google.com/?q=Saffire+Freycinet"
	},
	{
		id: "tasman",
		title: "The Tasman, a Luxury Collection Hotel",
		subtitle: "Hobart, Australia",
		lat: -42.884,
		lng: 147.332,
		state: "AU",
		city: "Hobart",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/tasman/800/560.webp",
		href: "https%3A%2F%2Fwww.thetasmanhobart.com",
		map: "https://maps.google.com/?q=The+Tasman+Hobart"
	},
	{
		id: "ph-sydney",
		title: "Park Hyatt Sydney",
		subtitle: "Sydney, Australia",
		lat: -33.855,
		lng: 151.21,
		state: "AU",
		city: "Sydney",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/parkhyattsyd/800/560.webp",
		href:
			"https%3A%2F%2Fwww.hyatt.com%2Fen-US%2Fhotel%2Faustralia%2Fpark-hyatt-sydney",
		map: "https://maps.google.com/?q=Park+Hyatt+Sydney"
	},
	{
		id: "langham-melb",
		title: "The Langham, Melbourne",
		subtitle: "Melbourne, Australia",
		lat: -37.821,
		lng: 144.967,
		state: "AU",
		city: "Melbourne",
		category: "Hotel",
		status: "Open",
		img: "https://picsum.photos/seed/langhammelb/800/560.webp",
		href: "https%3A%2F%2Fwww.langhamhotels.com%2Fen%2Fthe-langham%2Fmelbourne",
		map: "https://maps.google.com/?q=The+Langham+Melbourne"
	},
	{
		id: "huka",
		title: "Huka Lodge",
		subtitle: "Taupō, New Zealand",
		lat: -38.64,
		lng: 176.089,
		state: "NZ",
		city: "Taupō",
		category: "Lodge",
		status: "Open",
		img: "https://picsum.photos/seed/huka/800/560.webp",
		href: "https%3A%2F%2Fwww.robertsonlodges.com%2Fthe-lodges%2Fhuka-lodge",
		map: "https://maps.google.com/?q=Huka+Lodge"
	},
	{
		id: "kauri-cliffs",
		title: "The Lodge at Kauri Cliffs",
		subtitle: "Matauri Bay, New Zealand",
		lat: -35.029,
		lng: 173.906,
		state: "NZ",
		city: "Matauri Bay",
		category: "Lodge",
		status: "Open",
		img: "https://picsum.photos/seed/kauricliffs/800/560.webp",
		href: "https%3A%2F%2Fwww.robertsonlodges.com%2Fthe-lodges%2Fkauri-cliffs",
		map: "https://maps.google.com/?q=Kauri+Cliffs+Lodge"
	},
	{
		id: "brando",
		title: "The Brando",
		subtitle: "Tetiaroa, French Polynesia",
		lat: -17.017,
		lng: -149.583,
		state: "PF",
		city: "Tetiaroa",
		category: "Resort",
		status: "Open",
		img: "https://picsum.photos/seed/brando/800/560.webp",
		href: "https%3A%2F%2Fthebrando.com",
		map: "https://maps.google.com/?q=The+Brando+Tetiaroa"
	},
	{
		id: "kokomo",
		title: "Kokomo Private Island Fiji",
		subtitle: "Kadavu, Fiji",
		lat: -18.78,
		lng: 178.466,
		state: "FJ",
		city: "Kadavu",
		category: "Resort",
		status: "Open",
		img: "https://picsum.photos/seed/kokomo/800/560.webp",
		href: "https%3A%2F%2Fwww.kokomoislandfiji.com",
		map: "https://maps.google.com/?q=Kokomo+Private+Island+Fiji"
	}
];

let map, info;
const markers = new Map();
function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 35.8, lng: -96.9 },
		zoom: 5,
		mapTypeControl: false
	});
	info = new google.maps.InfoWindow();
	const bounds = new google.maps.LatLngBounds();
	hotels.forEach((p) => {
		const marker = new google.maps.Marker({
			position: { lat: p.lat, lng: p.lng },
			map,
			title: p.title
		});
		marker.addListener("click", () => focusHotel(p.id, true));
		markers.set(p.id, marker);
		bounds.extend(marker.getPosition());
	});
	map.fitBounds(bounds);
	buildFilters();
	renderList(hotels);
	wireSearchAndFilters();
}

const listEl = document.getElementById("list");
function renderList(rows) {
	listEl.innerHTML = "";
	document.getElementById("results-title").textContent = rows.length
		? `Showing ${rows.length} Hotel${rows.length > 1 ? "s" : ""}`
		: "No results";
	rows.forEach((p) => {
		const li = document.createElement("li");
		li.className = "item";
		li.dataset.id = p.id;
		li.innerHTML = `
          <img class="thumb" src="${p.img}" alt="${p.title}">
          <div class="meta">
            <div class="title">${p.title}</div>
            <div class="sub">${p.subtitle}</div>
            <div class="badges"><span class="badge">${p.category}</span><span class="badge open">${p.status}</span></div>
            <div class="links"><a href="${p.href}" target="_blank" rel="noopener">View</a> · <a href="${p.map}" target="_blank" rel="noopener">Map</a></div>
          </div>
          <div class="sub">›</div>`;
		li.addEventListener("click", () => focusHotel(p.id, false));
		listEl.appendChild(li);
	});
}

function focusHotel(id, fromMarker) {
	const p = hotels.find((x) => x.id === id);
	const m = markers.get(id);
	if (!p || !m) return;
	document
		.querySelectorAll(".item")
		.forEach((el) => el.classList.toggle("selected", el.dataset.id === id));
	map.panTo({ lat: p.lat, lng: p.lng });
	map.setZoom(8);
	const html = `<div style='display:flex;gap:10px;align-items:flex-start'>
        <img src='${p.img}' alt='${p.title}' style='width:100px;height:70px;object-fit:cover;border-radius:6px'>
        <div style='max-width:220px'>
          <strong>${p.title}</strong><br>${p.subtitle}<br>
          <a href='${p.href}' target='_blank' rel='noopener'>View</a> · <a href='${p.map}' target='_blank' rel='noopener'>Map</a>
        </div>
      </div>`;
	info.setContent(html);
	info.open({ map, anchor: m });
	if (!fromMarker) {
		m.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(() => m.setAnimation(null), 700);
	}
}

function buildFilters() {
	const locSelect = document.getElementById("filter-location");
	const catSelect = document.getElementById("filter-category");
	[...new Set(hotels.map((p) => p.state))].sort().forEach((s) => {
		const o = document.createElement("option");
		o.value = s;
		o.textContent = s;
		locSelect.appendChild(o);
	});
	[...new Set(hotels.map((p) => p.category))].sort().forEach((c) => {
		const o = document.createElement("option");
		o.value = c;
		o.textContent = c;
		catSelect.appendChild(o);
	});
}

function wireSearchAndFilters() {
	const q = document.getElementById("search");
	const loc = document.getElementById("filter-location");
	const cat = document.getElementById("filter-category");
	const apply = () => {
		const term = q.value.trim().toLowerCase();
		const state = loc.value;
		const category = cat.value;
		const result = hotels.filter((p) => {
			const passQ =
				!term || `${p.title} ${p.city} ${p.state}`.toLowerCase().includes(term);
			const passL = !state || p.state === state;
			const passC = !category || p.category === category;
			return passQ && passL && passC;
		});
		hotels.forEach((p) => markers.get(p.id).setVisible(result.includes(p)));
		renderList(result);
	};
	q.addEventListener("input", apply);
	loc.addEventListener("change", apply);
	cat.addEventListener("change", apply);
}

window.initMap = initMap;
