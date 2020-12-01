const form = document.getElementById('form');
const search =document.getElementById('search');
const result =document.getElementById('result');
const more =document.getElementById('more');
var arraySongs = [];

//create a constant url which is like a root url
const apiURL = 'https://api.lyrics.ovh';

// Search by Song or artist
async function searchSongs(term) {
   const res = await fetch(`${apiURL}/suggest/${term}`);
   const data = await res.json();

   console.log(data);

   showData(data);
}

// Show song and artist in DOM
function showData(data) {
     let output = '';
     data.data.forEach(function(song) {
        output +=`<li>
                <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                <div class="btn-container"><button class="btn" data-artist="${song.artist.name}"
                data-songtitle="${song.title}">Get Lyrics</button>
                <button class="play-btn"data-songpreview="${song.preview}">Play</button><div>
            <li>`;
    });

    result.innerHTML = `
        <ul class="songs">
        ${output}
        </ul>
    `;

   

    if (data.prev || data.next) {
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
            ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ``}
         `;
    } else {
        more.innerHTML = ''; 
    }
}




// Get prev and next songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/` + url);
    const data = await res.json();

    showData(data);
}
 
//Play song preview
function playSongPreview(previews) {

    
    //if(previews.length === 1) {
        var audio = new Audio(previews);
        audio.play();   

     //} else {  
        //audio.stop();
     //}

    
}


//Get lyrics for songs
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>`;

    more.innerHTML = ``;
    
}

// Event listeners
form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value.trim();
    

    if (!searchTerm) {
        alert ('Please type in a search term');
    } else {
    searchSongs(searchTerm);
    }
});

//Get lyrics and song preview button click
result.addEventListener('click', function (e) {
    e.preventDefault();
    
    const clickedEl = e.target;
    
    
    if (clickedEl.className === 'btn') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');
        getLyrics(artist, songTitle);
    }

    if (clickedEl.className === 'play-btn') {
        const songPreview = clickedEl.getAttribute('data-songpreview');

        // arraySongs was ana array created in the beginnning of the project.
        arraySongs.shift();
        arraySongs.push(songPreview);
        playSongPreview(arraySongs);
    }
});