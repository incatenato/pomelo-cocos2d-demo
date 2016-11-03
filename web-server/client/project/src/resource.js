
var res_gaming = {
    game_ccb:"res/ccb/GameCCB.ccbi",
    balloon_ccb:"res/ccb/Balloon.ccbi",
    img_1_png:"res/img/plistImg.png",
    img_1_plist:"res/img/plistImg.plist",
    diamond_png:"res/img/diamond.png",
    diamond_plist:"res/img/diamond.plist",
    miniMap_png:"res/img/miniMap.png",
    miniMap_plist:"res/img/miniMap.plist",

    arrow_ccb :"res/ccb/Arrow.ccbi",
    cloud_ccb:"res/ccb/Cloud.ccbi",

    // tmx
    map_1:"res/tmx/map_1.tmx",
    // mapblock :"res/tmx/mapblock.png",
    // mapshadow : "res/tmx/mapshadow.png",
    // map_2:"res/tmx/map_12.tmx",

    tmpRole : "res/img/testRole.png",

    //font
    font : "res/font/font.fnt",
    fontImg : "res/font/font.png",

    //batchNode
    ball : "res/img/batchNode/ball.png",
    endline_1 : "res/img/batchNode/endline_1.png",
    board_1 : "res/img/batchNode/board_1.png",
    board_2 : "res/img/batchNode/board_2.png",
    fire : "res/img/fire_2.png",
    floor : "res/img/floor.png"
};

var res_loading = {
    loading_bg :"res/img/over/bg.png",
    loading_vs : "res/img/over/vs.png",
    loading_plist:"res/img/loading.plist",
    loading_png:"res/img/loading.png",
    loading_ccb:"res/ccb/LoadingCCB.ccbi"
};

var res_music = {
    //sound mp3
    music_bg : "res/music/bgm.mp3",
    music_blast : "res/music/blast.mp3",
    music_inflame : "res/music/inflame.mp3",
    music_Lose : "res/music/Lose.mp3",
    music_score : "res/music/score.mp3",
    music_toxophily : "res/music/toxophily.mp3",
    music_victory : "res/music/victory.mp3",
    music_draw : "res/music/draw.mp3",
    music_call : "res/music/call.mp3",
    music_cutdown : "res/music/cutdown.mp3",
    music_readygo : "res/music/readygo.mp3"

};

var res_music_array = [];
for (var m in res_music)
{
    res_music_array.push(res_music[m]);
}


var g_resources_gaming= [];

for(var i in res_gaming){
    g_resources_gaming.push(res_gaming[i]);
}

var g_resources_loading =[];
for(var j in res_loading){
    g_resources_loading.push(res_loading[j]);
}