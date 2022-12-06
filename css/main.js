/*
1. Render song
2. Scoll top
3. Play/ pause/ seek
4. cd Rorate
5. Next/ Prev
6. Random
7. Next/ repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
*/ 
var cd = document.querySelector('.cd');
var songName = document.querySelector('.header h2');
var cdthumb = document.querySelector('.cd__thumb');
var audio = document.querySelector('#audio');
var playAgain = document.querySelector('.play-back');
var backWard = document.querySelector('.play-backward');
var playBtn = document.querySelector('.play');
var shuffle = document.querySelector('.shuffle');
var played = document.querySelector('.player');
var progress = document.querySelector('#progress');
var nextBtn = document.querySelector('.play-foward');
var prevBtn = document.querySelector('.play-backward');
var song = document.querySelector('.song');
var PLAYER_STORAGE = 'MUSIC_PLAYER';
var app = {
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {

    },
    setconfig: function(key, value) {
        this.config[key] = value;
        //localStorage chỉ lưu Object dạng chuỗi
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config));
    },
    currentIndex:0,
    isPlaying:false,
    isRandom: false,
    isAgain: false,
    songs: [
        {
            name: "Bật Nhạc Lên",
            singer: "Hiếu Thứ 2",
            image: "./image/bat_nhac_len.jpg",
            path: "./music/BatNhacLen1-HIEUTHUHAIHarmonie-6351919.mp3",
        },
        {
            name: "Chuyện Rằng",
            singer: "Thịnh Suy",
            image: "./image/chuyen_rang.jpg",
            path: "./music/ChuyenRang1-ThinhSuy-6465355.mp3",
        },
        {
            name: "Giữa Đại Lộ Đông Tây",
            singer: "Uyên Linh",
            image: "./image/giua_dai_lo_dong_tay.jpg",
            path: "./music/GiuaDaiLoDongTaySoloVersion-UyenLinh-6999584.mp3",
        },
        {
            name: "Hãy Trao Cho Anh",
            singer: "Sơn Tùng MTP",
            image: "./image/hay_trao_cho_anh.jpg",
            path: "./music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
        },
        {
            name: "Love You 3000",
            singer: "Stephanie Poetri",
            image: "./image/love_you_3000.jpg",
            path: "./music/ILoveYou3000-StephaniePoetri-6009786.mp3",
        },
        {
            name: "Mặt Mộc",
            singer: "Phạm Nguyên Ngọc",
            image: "./image/mat_moc.jpg",
            path: "./music/Mat-Moc-Phạm-Nguyen-Ngọc-x-VAnh-x-An-Nhi.mp3",
        },
        {
            name: "Thói Quen",
            singer: "Hoàng Dũng",
            image: "./image/Thoi_quen.jpg",
            path: "./music/ThoiQuen-HoangDungTheVoice-6884273.mp3",
        },
        {
            name: "Until I Found You",
            singer: "Stephen Sanchez",
            image: "./image/until_i_found_you.jpg",
            path: "./music/Until I Found You - Stephen Sanchez.mp3",
        },
        {
            name: "Vệ Tinh",
            singer: "Hiếu Thứ 2",
            image: "./image/ve_tinh.jpg",
            path: "./music/VeTinh-HIEUTHUHAIHoangTonKewtiie-7730914.mp3",
        },
        {
            name: "Until I Found You",
            singer: "Stephen Sanchez",
            image: "./image/until_i_found_you.jpg",
            path: "./music/Until I Found You - Stephen Sanchez.mp3",
        }
    ],
    render: function() {
        var htmls = app.songs.map((song,index) => {
            return `
                <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div style="background-image: url('${song.image}');" class="thumb"></div>
                    <div class="name-song">
                        <h4>${song.name}</h4>
                        <p>${song.singer}</p>
                    </div>
                    <div class="ellipsis">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        document.querySelector('.playsit').innerHTML = htmls.join('');
    },
    defindProperties: function()
    {
        Object.defineProperty(this , 'currentsong', {
            get: function()
            {
                return this.songs[this.currentIndex];
                /*
                    name: 'Bật Nhạc Lên', 
                    singer: 'Hiếu Thứ 2', 
                    path: './music/BatNhacLen1-HIEUTHUHAIHarmonie-6351919.mp3',
                    image: './image/bat_nhac_len.jpg'
                */
            }
        })
    },
    handleEvents: function() {
        //Document đại diện cho trang web
        var cdwidth = cd.offsetWidth;
        // xử lí CD rotate/ dừng
        var cdThumbRotate = cdthumb.animate(
        [
            {
                transform: 'rotate(360deg)'
            }
        ],
            {
                // time
                duration: 10000,
                //loop
                iterations: Infinity
            }
        )
        cdThumbRotate.pause();

        document.onscroll = function() 
        {
            var scrollTop = document.documentElement.scrollTop || window.scrollY;
            var newcdwidth = cdwidth - scrollTop;
            cd.style.width = newcdwidth > 0 ? newcdwidth + 'px' : 0;
            cd.style.opacity = newcdwidth / cdwidth;
        }
        playBtn.onclick = function()
        { 
            //click vào nó sẽ là true
            if (app.isPlaying == true) {
                audio.pause();
                cdThumbRotate.pause();
            }
            else {
                audio.play();
                cdThumbRotate.play();
            }
            audio.onplay = function()
            {
                app.isPlaying = true;
                played.classList.add('playing');
            }
            audio.onpause = function()
            {
                app.isPlaying =false;
                played.classList.remove('playing');
            }
            //Khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function()
            {
                if (audio.duration)
                {
                    var duration =Math.floor(audio.currentTime / audio.duration * 100);
                    // Có value = 0, khi thêm % vào nó sẽ tự nhảy
                    progress.value = duration;
                }
            }
            //Tua bài hát
            progress.onchange = function(e)
            {
                var seekTime = e.target.value * audio.duration / 100;
                audio.currentTime = seekTime;
            }
        }
        nextBtn.onclick = function()
        {
            if (app.isRandom){
                app.RandomSong();
            }
            else {
                app.NextSong();
            }
            audio.play();
            app.render();
            app.ScroolToView();
        }
        prevBtn.onclick = function()
        {
            if (app.isRandom)
            {
                app.RandomSong();
            }
            else 
            {
                app.PrevSong();
            }
            audio.play();
            app.render();
        }
        shuffle.onclick = function()
        {
            app.isRandom = !app.isRandom;
            app.setconfig('isRandom',app.isRandom);
            shuffle.classList.toggle('active', app.isRandom);
            app.render();
        }
        playAgain.onclick = function() {
            app.isAgain = !app.isAgain;
            app.setconfig('isAgain',app.isAgain);
            playAgain.classList.toggle('active', app.isAgain);
        }
        audio.onended = function() {
            if (app.isAgain == true)
            {
                audio.play();
            }
            else
            {
                nextBtn.click();
            }
        }
        played.onclick = function(e) {
            if (e.target.closest('.song:not(.active)') || e.target.closest('.ellipsis'))
            {
                if (e.target.closest('.song:not(.active)'))
                {
                    app.currentIndex =Number(e.target.closest('.song:not(.active)').getAttribute('data-index'));
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }
        }
    },
    ScroolToView: function() {
        setTimeout(() => {
            document.querySelector('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: "center",
                inline: 'nearest'
            })
        },300)
    },
    loadCurrentSong: function() {
        songName.textContent = this.currentsong.name;
        cdthumb.style.backgroundImage = `url('${this.currentsong.image}')`;
        audio.src = this.currentsong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isAgain = this.config.isAgain;
    },
    NextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length)
        {
            this.currentIndex = 0;
        }
        played.classList.add('playing');
        this.loadCurrentSong();
    },
    PrevSong: function() {
        this.currentIndex--;
        if (this.currentIndex <0)
        {
            this.currentIndex = this.songs.length -1 ;
        }
        played.classList.add('playing');
        this.loadCurrentSong();
    },
    RandomSong: function()
    {
        var newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while (newIndex === this.songs.length)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        this.loadConfig();

        this.defindProperties();

        this.handleEvents();

        this.loadCurrentSong();

        this.render();
    },
}
app.start();