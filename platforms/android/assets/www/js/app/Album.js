CQ.Album = {
    Category: {
        Film: { id: 1, name: '映画' },
        Series: { id: 2, name: 'ドラマ' },
        Cartoon: { id: 3, name: '漫画' },
        Entertainer: { id: 4, name: '芸能人' },
        Brand: { id: 5, name: 'ブランド' },
        Celebrity: { id: 6, name: '有名人' }
    },

    getPicture: function (id) {
        var levelAndIndex = this.getPictureLevelAndIndex(id);
        return this[levelAndIndex.level][levelAndIndex.index];
    },

    getPictureId: function (level, index) {
        return parseInt(level.toString() + (index >= 10 ? index : '0' + index));
    },

    getPicturePath: function (id) {
        return '{0}{1}.jpg'.format(this.path, id);
    },

    getPictureLevelAndIndex: function (id) {
        var idString = id.toString();
        return {
            level: 'level' + idString.charAt(0),
            index: parseInt(idString.substring(1, 3), 10)
        }
    },

    getAlbum: function (id) {
        switch (id) {
            case CQ.Album.Default.id:
                return CQ.Album.Default;
            default:
                throw 'Album not found for id: {0}'.format(id);
        }
    },

    getFirstPicture: function (level) {
        return this['level' + level][0];
    },

    getNextPicture: function (id) {
        var levelAndIndex = this.getPictureLevelAndIndex(id);
        return levelAndIndex.index >= this[levelAndIndex.level].length ? null : this[levelAndIndex.level][levelAndIndex.index + 1];
    },

    getAlternativeAnswerChars: function (pictureId, length) {
        var picture = this.getPicture(pictureId),
            chars = picture.name.split(''),
            answerIds = picture.answers,
            remainingChars = length - picture.name.length,
            alternativeAnswers = [pictureId];

        if (answerIds.length > 0) {
            // has alternative answers defined
            for (var i = 0; (remainingChars > 0) && (answerIds.length > i); i++) {
                var alternativePictureId = answerIds[i],
                    alternativeChars = this.getPicture(alternativePictureId).name;

                if (remainingChars > alternativeChars.length) {
                    chars = chars.concat(alternativeChars.split(''));
                    alternativeAnswers.push(alternativePictureId);
                    remainingChars -= alternativeChars.length;
                } else if (remainingChars == alternativeChars.length) {
                    chars = chars.concat(alternativeChars.split(''));
                    alternativeAnswers.push(alternativePictureId);
                    break;
                } else {
                    chars = chars.concat(alternativeChars.split('').slice(0, remainingChars));
                    break;
                }
            }
        } else {
            // no alternative answers, generate random chars
            while (remainingChars > 0) {
                // generate random picture id which does not been used
                var randomLevel = Math.floor(Math.random() * 6) + 1;
                var randomIndex = Math.floor(Math.random() * this['level' + randomLevel].length);
                var randomId = this.getPictureId(randomLevel, randomIndex);

                if ($.inArray(randomId, alternativeAnswers) == -1) {
                    var randomName = this.getPicture(randomId).name;

                    // get characters from random picture name
                    if (remainingChars > randomName.length) {
                        chars = chars.concat(randomName.split(''));
                        alternativeAnswers.push(randomId);
                        remainingChars -= randomName.length;
                    } else if (remainingChars == randomName.length) {
                        chars = chars.concat(randomName.split(''));
                        alternativeAnswers.push(randomId);
                        break;
                    } else {
                        chars = chars.concat(randomName.split('').slice(0, remainingChars));
                        break;
                    }
                }
            }
        }

        console.log('Generated random chars from pictures: ' + alternativeAnswers.join(', '));

        return {
            chars: CQ.Album.shuffle(chars),
            alternativeAnswers: alternativeAnswers
        };
    },

    shuffle: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
};

CQ.Album.Default = {
    id: 1,
    name: 'Default',
    path: 'img/album/default/',
    active: true,

    level1: [
        { id: 100, name: 'エイリアン', category: CQ.Album.Category.Film, answers: [105, 202, 208, 306] },
        { id: 101, name: '羊たちの沈黙', category: CQ.Album.Category.Film, answers: [107, 201, 300] },
        { id: 102, name: 'ビッグバンセオリー', category: CQ.Album.Category.Series, answers: [104, 108, 203] },
        { id: 103, name: 'ブレイブハート', category: CQ.Album.Category.Film, answers: [108, 204, 209] },
        { id: 104, name: 'ダヴィンチコード', category: CQ.Album.Category.Film, answers: [109, 201, 209] },
        { id: 105, name: 'ドラゴンボール', category: CQ.Album.Category.Cartoon, answers: [] },
        { id: 106, name: 'モダン石器時代', category: CQ.Album.Category.Film, answers: [] },
        { id: 107, name: 'グラディエーター', category: CQ.Album.Category.Film, answers: [] },
        { id: 108, name: 'ゴシップガール', category: CQ.Album.Category.Series, answers: [] },
        { id: 109, name: '機動戦士ガンダム', category: CQ.Album.Category.Cartoon, answers: [] }
    ],

    level2: [
        { id: 200, name: 'ヒックとドラゴン', category: CQ.Album.Category.Film, answers: [] },
        { id: 201, name: 'アイスエイジ', category: CQ.Album.Category.Film, answers: [] },
        { id: 202, name: 'インセプション', category: CQ.Album.Category.Film, answers: [] },
        { id: 203, name: 'インデペンデンスデイ', category: CQ.Album.Category.Film, answers: [] },
        { id: 204, name: 'ベストキッド', category: CQ.Album.Category.Film, answers: [] },
        { id: 205, name: 'キングコング', category: CQ.Album.Category.Film, answers: [] },
        { id: 206, name: 'カンフーパンダ', category: CQ.Album.Category.Film, answers: [] },
        { id: 207, name: 'ライオンキング', category: CQ.Album.Category.Film, answers: [] },
        { id: 208, name: 'ロードオブザリング', category: CQ.Album.Category.Film, answers: [] },
        { id: 209, name: 'フェラーリ', category: CQ.Album.Category.Brand, answers: [] }
    ],

    level3: [
        { id: 300, name: 'マダガスカル', category: CQ.Album.Category.Film, answers: [] },
        { id: 301, name: 'ジュラシックパーク', category: CQ.Album.Category.Film, answers: [] },
        { id: 302, name: 'ジョーズ', category: CQ.Album.Category.Film, answers: [] },
        { id: 303, name: 'ワーナーブラザーズ', category: CQ.Album.Category.Brand, answers: [] },
        { id: 304, name: '鉄腕アトム', category: CQ.Album.Category.Cartoon, answers: [] },
        { id: 305, name: 'フレンズ', category: CQ.Album.Category.Series, answers: [] },
        { id: 306, name: 'アカデミー賞', category: CQ.Album.Category.Brand, answers: [] },
        { id: 307, name: '金正恩', category: CQ.Album.Category.Celebrity, answers: [] },
        { id: 308, name: '毛沢東', category: CQ.Album.Category.Celebrity, answers: [] },
        { id: 309, name: 'ブルー初めての空へ', category: CQ.Album.Category.Film, answers: [] }
    ],

    level4: [
        { id: 400, name: 'アインシュタイン', category: CQ.Album.Category.Celebrity, answers: [] }
    ],

    level5: [
        { id: 500, name: 'スマーフ', category: CQ.Album.Category.Cartoon, answers: [] }
    ],

    level6: [
        { id: 600, name: 'ベッカム', category: CQ.Album.Category.Celebrity, answers: [] }
    ]
};