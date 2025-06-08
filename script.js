console.log("hello world")
let songs;
let currentfolder;
let playLogo = document.getElementById("playlogo")
let playImg = playLogo.querySelector("img");
let currentSong = new Audio();
let next = document.getElementById("next");
let prev = document.getElementById("prev");
let volMode = document.querySelector(".volumebar").querySelector("img");


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function main(folder) {
    currentfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();


    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songss = [];
    for (i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songss.push(element.href.split(`/${folder}/`)[1])
        }
    }
    console.log(songss);
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = "";
    for (const song of songss) {
        songUl.innerHTML = songUl.innerHTML + ` <li>
                            <svg xmlns="http://www.w3.org/2000/svg" class="invert" height="24px"
                                viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                                <path
                                    d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z" />
                            </svg>

                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}
                                    </div>
                                
                            </div>
                            <div class="playsymbol flex ">
                                <span>Play</span>
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" class="invert" viewBox="0 -960 960 960"
                                    width="30px" fill="#1f1f1f">
                                    <path
                                        d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                                </svg>
                            </div>


                        </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim(), false);
        })

    });
    return songss;


}
const playMusic = (track, pause = "false") => {
    // let audio = new Audio("/songs/"+track);
    currentSong.src = `/${currentfolder}/` + track;
    if (!pause) {
        currentSong.play();
        playImg.src = "svg/pause.svg";
    }
    document.querySelector(".songtitle").innerHTML = decodeURI(track);


}

async function play() {


    songs = await main("songs/high");
    playMusic(songs[0], true);
    const searchInput = document.getElementById('searchInput');
    const listItems = document.querySelectorAll('#list li');

    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      listItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
      });
    });




    playLogo.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playImg.src = "svg/pause.svg";

        }
        else {
            currentSong.pause();
            playImg.src = "svg/play.svg";
        }
    })
    prev.addEventListener("click", () => {
        console.log("prev pressed")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index) > 0) {
            playMusic(songs[index - 1], false);
        }

    })
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1], false);
            }
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index) > 0) {
                playMusic(songs[index - 1], false);
            }
        }
    });

    next.addEventListener("click", () => {
        console.log("next pressed")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1], false);
        }

    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".ball").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".ball").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;

    })
    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space' || event.key === ' ') {
            if (currentSong.paused) {
                currentSong.play();
                playImg.src = "svg/pause.svg";

            }
            else {
                currentSong.pause();
                playImg.src = "svg/play.svg";
            }

        }
    });
    let value1;

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100;
        let value1 = parseInt(e.target.value);
        console.log(value1);
        if (value1 == 0) {
            volMode.src = "voloff.svg";

        }
        else if (value1 > 0 && value1 < 12) {
            volMode.src = "volumelow.svg";

        }
        else if (value1 > 11 && value1 < 59) {
            volMode.src = "volmed.svg";
        }
        else {
            volMode.src = "volhigh.svg"

        }


    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await main(`songs/${item.currentTarget.dataset.folder}`)
            const searchInput = document.getElementById('searchInput');
            const listItems = document.querySelectorAll('#list li');

            searchInput.addEventListener('input', function () {
                const query = this.value.toLowerCase();
                listItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(query) ? '' : 'none';
                });
            });
        })
    })

    Array.from(document.getElementsByClassName("card1")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("card clicked");
            songs = await main(`songs/${item.currentTarget.dataset.folder}`)
            const searchInput = document.getElementById('searchInput');
            const listItems = document.querySelectorAll('#list li');

            searchInput.addEventListener('input', function () {
                const query = this.value.toLowerCase();
                listItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(query) ? '' : 'none';
                });
            });
        })
    })

    document.querySelector(".loginbtn").addEventListener("click", () => {

        window.open('https://www.spotify.com/in-en/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F', '_blank');
    });
    document.querySelector(".signbtn").addEventListener("click", () => {
        window.open('https://accounts.spotify.com/en/login?continue=https%3A%2F%2Fopen.spotify.com%2F', '_blank');
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        console.log("btn click")
        document.querySelector(".left").style.left = "0px"
    });

    document.querySelector(".exit").addEventListener("click", () => {
        console.log("btn click")
        document.querySelector(".left").style.left = "-100vw"
    });










}


play();

