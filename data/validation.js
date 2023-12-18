let alphaCodes = ["AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BH", 
"BS", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", 
"BG", "BF", "BI", "KH", "CM", "CA", "CV", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", 
"CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ",
 "ER", "EE", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", 
 "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", 
 "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", 
 "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", 
 "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", 
 "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MP", "NO", "OM", "PK", "PW", "PS", 
 "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN",
  "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", 
  "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", 
  "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", 
  "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"]

function checkMarket (market) {
    if(!(alphaCodes.includes(market))) return "Market must be an ISO 3166-1 alpha-2 country code.";
    else return false;
}

let availableGenres = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal",
 "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children",
  "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno",
   "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", 
   "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", 
   "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial",
    "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", 
    "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", 
    "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk",
    "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", 
    "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks",
    "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]

function checkGenres (genre) {
    if (!genre) return "Genre must be provided";
    let genres = genre.split(",");
    console.log(genres);
    for(let g in genres){
        let newG = genres[g].toLowerCase();
        console.log(newG);
        if(!(availableGenres.includes(newG))) return "Genre must be on of the available genres on Spotify.";
    }
    return false;
    
    
}


function checkArtists (artists) {
    if (!artists) return "Artists must be provided";   
    else{return false}
}

function checkSongs (songs) {
    if (!songs) return "Songs must be provided";   
    else{return false}
}

function checkLimit (limit){
    if(Number.isNaN(limit) || limit == "") return "Limit must be a number";
    if(limit < 0 || limit > 100) return "limit must between 0 and 100";
    else{
        return false;
    }
}

function checkAcousticness (value){
    if(Number.isNaN(value) || value == "") return "Acousticness must be a number";
    if(value < 0 || value > 1) return " Acousticness must be between 0 and 1";
    else return false;
}

function checkDancability (value){
    if(Number.isNaN(value) || value == "") return "Dancability must be a number";
    if(value < 0 || value > 1) return " Dancability must be between 0 and 1";
    else{
        return false;
    }
}

function checkLiveliness (value){
    if(value < 0 || value > 1) return " Liveliness must be between 0 and 1";
}

function checkSpeechiness (value){
    if(value < 0 || value > 1) return " Speechiness must be between 0 and 1";
}

function checkPopularity (value){

   if(value < 0 || value > 100) return "popularity must be between 0 and 100";
   else{return false;}
}

function checkTempo(value){

    if(value < 0 || value > 1000) return "Tempo must be between 0 and 1000";
    else{return false;}
 }

function checkLoudness (value){
    if(value < -60 || value > 0) return "Loudness must be between -60 and 0";
    else{return false;}
}

function checkLoudCross (min, max){
    console.log("ghghg");
    console.log(min)
    if(Number.isNaN(min) || min == "") return "Min loudness must be a number"
    if(Number.isNaN(min) || min == "") return "Max loudness must be a number"
    if(parseFloat(min) > parseFloat(max)) return "Min loudness cannot be greater than max loudness"
    else{return false;}
}

function checkPopCross (min, max){
    if(Number.isNaN(min) || min == "") return "Min popularity must be a number"
    if(Number.isNaN(min) || min == "") return "Max popularity must be a number"
    console.log(min - max)
    if(parseFloat(min) > parseFloat(max)) return "Min popularity cannot be greater than max popularity"
    else{return false;}
}

function checkTempoCross (min, max){
    if(Number.isNaN(min) || min == "") return "Min tempo must be a number"
    if(Number.isNaN(min) || min == "") return "Max tempo must be a number"
    console.log(min - max)
    if(parseFloat(min) > parseFloat(max)) return "Min tempo cannot be greater than max tempo"
    else{return false;}
}


export {
    checkMarket,
    checkGenres,
    checkLimit,
    checkAcousticness,
    checkDancability,
    checkLiveliness,
    checkSpeechiness,
    checkPopularity,
    checkLoudness,
    checkTempo,
    checkLoudCross,
    checkPopCross,
    checkTempoCross,
    checkArtists,
    checkSongs


  };







