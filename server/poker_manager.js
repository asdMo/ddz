'use strict';

let ColourType = {
    heitao: 'heitao',
    hongxin: 'hongxin',
    meihua: 'meihua',
    fangzhuan: 'fangzhuan',
    dawang: 'dawang',
    xiaowang: 'xiaowang'
};

class Poker {
    constructor(type, num) {
        this.colourType = type;
        this.num = num;
        this.name = type + '_' + num;
        let value = 0;
        if (num >= 3 && num <= 13) {
            value = num;
        } else if (num === 0) {//
            value = type === ColourType.dawang ? 17 : 16;
        } else if (num === 1) {
            value = 14;
        } else if (num === 2) {
            value = 15;
        }
        this.value = value;
    }
}

// 洗牌
function shuffle() {
    let list = [];
    list.push(new Poker(ColourType.dawang, 0));
    list.push(new Poker(ColourType.xiaowang, 0));
    let colourTypeList = [ColourType.heitao, ColourType.hongxin, ColourType.meihua, ColourType.fangzhuan];
    for (let i = 0; i < 4; i++) {
        let type = colourTypeList[i];
        for (let j = 1; j <= 13; j++) {
            list.push(new Poker(type, j));
        }
    }
    list.sort(function () { return 0.5 - Math.random(); });
    // console.log(list);
    return list;
}

// 获得一副牌
exports.getAllPokers = function () {
    let pokerList = shuffle();
};