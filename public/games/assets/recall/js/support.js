

documentWidth = window.innerWidth;
documentHeight = window.innerHeight;

$(document).ready(function () {
    setBgPic();
});


function setBgPic() {
    $("body").css('background', 'url("'+ './img/bg_sunny.png' +'")');
    if (documentWidth > 700){
        $("body").css('background-size', 'auto '+documentHeight+'px');
        $("body").css('background-repeat', 'repeat');
    }else {
        $("body").css('background-size', documentWidth+'px '+documentHeight+'px');
        $("body").css('background-repeat', 'repeat-y');
    }
}


function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null){
        return decodeURI(r[2]);
    }
    return null;
}
